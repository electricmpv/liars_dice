import { _decorator, Component, Node, Label, Button, Color, director, Prefab, instantiate, ScrollView, Layout } from 'cc';
import { NetworkManager, NetworkError, NetworkErrorCode } from '../core/network'; // 导入 NetworkManager 而不是 network
import { NetworkErrorHandler } from '../core/error-handler'; // Use relative path without .ts
import { PlayerItem } from '../prefabs/player-item'; // Import from relative path without .ts
// 修正导入路径并移除 .ts 后缀
import { LiarDiceRoomState } from '../../shared/schemas/liar-dice-room-state-client'; // 导入客户端专用房间状态
import { PlayerState } from '../../shared/schemas/player-state-client'; // 导入客户端专用玩家状态
// 导入 MapSchema
// 不再需要导入 MapSchema，改用原生 Map 类型
// import { LoginManager } from '../core/login-manager'; // Likely not needed directly anymore

import { UIUpdater } from './ui-updater'; // Import from relative path without .ts
import { EventHandler } from './event-handler'; // Import from relative path without .ts
// 移除 networkManager 导入，直接使用 NetworkManager

const { ccclass, property } = _decorator;

/**image.png
 * 房间内等待场景 UI 组件 (适配 Colyseus)
 */
@ccclass('RoomUI')
export class RoomUI extends Component {

    @property(Label)
    private roomIdLabel: Label | null = null;

    @property(Node)
    private playerListContent: Node = null!;

    @property(Prefab)
    private playerItemPrefab: Prefab = null!;

    @property(Button)
    private readyButton: Button = null!;

    @property(Label)
    private readyButtonLabel: Label | null = null;

    @property(Button)
    private startGameButton: Button = null!;

    @property(Button)
    private leaveRoomButton: Button = null!;

    @property(Label)
    private statusLabel: Label | null = null;

    @property(Label)
    private playerCountLabel: Label | null = null;

    @property(Button)
    private inviteAIButton: Button | null = null;

    // Internal state
    private _roomId: string = '';
    private _sessionId: string = ''; // Use Colyseus Session ID
    private _isReady: boolean = false;
    private _isHost: boolean = false;
    private _colyseusState: LiarDiceRoomState | null = null; // Store full Colyseus state
    private maxClients: number = 6; // 最大玩家数量

    // Singletons - Initialize directly at declaration
    private uiUpdater: UIUpdater = UIUpdater.getInstance();
    private eventHandler: EventHandler = EventHandler.getInstance();
    // networkManager is used directly via import

    // Component Lifecycle Methods
    onLoad() {
        console.log("[RoomUI] onLoad method started.");
        // Initialization moved to declaration

        console.log("[RoomUI] onLoad: Before setupEventListeners");
        if (this.statusLabel) {
            NetworkErrorHandler.initStatusLabel(this.statusLabel);
        }

        // Get roomId and sessionId from network manager singleton
        this._roomId = NetworkManager.getInstance().roomId;
        this._sessionId = NetworkManager.getInstance().sessionId;

        if (!this._roomId || !this._sessionId) {
             console.error("[RoomUI] Missing roomId or sessionId from network module!");
             // Use UIUpdater for showing error, pass 'this' (Component) for scheduling
             this.uiUpdater.showError(this.statusLabel, "无法获取玩家或房间信息", true, this);
             // Consider returning to lobby after delay
             this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
             return;
        }

        if (this.roomIdLabel) {
            this.roomIdLabel.string = `房间号: ${this._roomId}`;
            this.roomIdLabel.string = `房间号: ${this._roomId}`;
        }

        // 使用事件处理单例统一注册事件，并传入 RoomUI 实例作为上下文
        this.eventHandler.setupEventListeners(this); // Pass 'this'
        console.log("[RoomUI] onLoad: After setupEventListeners");
        this.uiUpdater.updateReadyButtonLabel(this.readyButtonLabel, this._isReady); // Update initial button label
        // Start game button update requires state, will be handled in handleStateChange
        // this.updateStartGameButtonInternal(); // Remove this initial call

        // Bind AI button click
        if (this.inviteAIButton) {
            this.inviteAIButton.node.on(Button.EventType.CLICK, this.onQuickInviteAI, this);
            this.inviteAIButton.interactable = false; // Disable until state loaded and confirmed host
        }

        // Initial state will come via the 'stateUpdate' event listener
        this.uiUpdater.showInfo(this.statusLabel, "等待房间状态...", true, this); // Show loading state
        // Check if state is already available from NetworkManager cache
        const initialState = NetworkManager.getInstance().roomState;
        if (initialState) {
            console.log("[RoomUI] Initial state found in network cache.");
            this.handleStateChange(initialState); // Process initial state if available
        }
    }

    // 添加 start 方法用于测试
    start() {
        console.log("[RoomUI] start method called.");
    }

    onDestroy() {
        console.log("[RoomUI] onDestroy method called.");
        console.log("[RoomUI] onDestroy: Before removeEventListeners");
        // Use the initialized EventHandler instance to remove listeners
        // No need for fallback as it's initialized at declaration
        this.eventHandler.removeEventListeners();
        console.log("[RoomUI] onDestroy: After removeEventListeners");
    }

    // Removed setupEventListeners and removeEventListeners methods

    // --- Event Handling Methods (called by EventHandler) ---
    // Make them public so EventHandler can call them

    public handleStateChange(state: LiarDiceRoomState): void {
        console.log(`[RoomUI] handleStateChange ENTERED. Current Scene: ${director.getScene()?.name}`);
        
        // 检查状态是否为空
        if (!state) {
             console.warn("[RoomUI] handleStateChange received null state. Aborting.");
             return;
        }
        
        // 存储最新状态
        this._colyseusState = state;
        console.log("[RoomUI] State stored locally.");

        // 确保 sessionId 设置正确（可能在加入后稍有延迟）
        if (!this._sessionId && NetworkManager.getInstance().sessionId) {
             this._sessionId = NetworkManager.getInstance().sessionId;
             console.log(`[RoomUI] Session ID updated internally: ${this._sessionId}`);
        }
        if (!this._sessionId) {
             console.error("[RoomUI] Cannot process state update without a session ID! Network Session ID:", NetworkManager.getInstance().sessionId, ". Aborting.");
             return; // Cannot identify self without sessionId
        }
        console.log(`[RoomUI] Processing state for sessionId: ${this._sessionId}`);

        // 安全处理 players 对象
        let playerCount = 0;
        let playersList: PlayerState[] = [];
        
        // 检查 players 对象是否存在
        if (state.players) {
            try {
                // 记录 players 对象的类型信息，用于调试
                console.log(`[RoomUI] players 类型: ${typeof state.players}, 构造函数: ${state.players.constructor?.name || '未知'}`);
                
                // 尝试不同的方法获取玩家列表
                if (typeof state.players.forEach === 'function') {
                    // 如果 players 是 MapSchema 或类似对象，使用 forEach 方法
                    console.log('[RoomUI] 使用 forEach 方法处理 players');
                    state.players.forEach((player: any, key: string) => {
                        // 安全地处理玩家数据，同时支持 id 和 sessionId
                        playersList.push(player);
                        const playerId = player.id || '';
                        const playerSessionId = player.sessionId || key;
                        console.log(`[RoomUI] 玩家: ID=${playerId}, SessionID=${playerSessionId}, 名称: ${player.name}, 准备: ${player.isReady}, 主机: ${playerSessionId === state.hostId || key === state.hostId}`);
                    });
                    playerCount = playersList.length;
                } else if (typeof state.players === 'object') {
                    // 如果 players 是普通对象，使用 Object.values
                    console.log('[RoomUI] 使用 Object.values 方法处理 players');
                    playersList = Object.values(state.players);
                    playerCount = playersList.length;
                    
                    playersList.forEach((player: any) => {
                        // 安全地处理玩家数据，同时支持 id 和 sessionId
                        const playerId = player.id || '';
                        const playerSessionId = player.sessionId || '';
                        console.log(`[RoomUI] 玩家: ID=${playerId}, SessionID=${playerSessionId}, 名称: ${player.name}, 准备: ${player.isReady}, 主机: ${playerSessionId === state.hostId}`);
                    });
                }
                
                console.log(`[RoomUI] 共找到 ${playerCount} 名玩家`);
            } catch (error) {
                console.error('[RoomUI] 处理 players 对象时出错:', error);
            }
        } else {
            console.warn('[RoomUI] state.players 不存在或为空');
        }


        // Update internal flags
        // console.log("[RoomUI] Updating internal flags (isHost, isReady)...", state.hostId, this._sessionId);
        this._isHost = (this._sessionId === state.hostId);
        // 使用 MapSchema 的 get 方法访问玩家状态
        const myPlayerState = state.players ? state.players.get(this._sessionId) : undefined;
        this._isReady = myPlayerState?.isReady || false;
        console.log(`[RoomUI] State processed: isHost=${this._isHost}, isReady=${this._isReady}, myPlayerState found: ${!!myPlayerState}`);

        // Update UI elements using UIUpdater and internal methods
        if (this.roomIdLabel && this._roomId !== NetworkManager.getInstance().roomId) { // 使用 NetworkManager.getInstance()
            this._roomId = NetworkManager.getInstance().roomId;
            this.uiUpdater.updateRoomIdLabel(this.roomIdLabel, this._roomId);
            console.log(`[RoomUI] Room ID label updated to: ${this._roomId}`);
        }

        // Update Player List using UIUpdater (provide all required args)
        console.log("[RoomUI] Calling uiUpdater.updatePlayerList...");
        this.uiUpdater.updatePlayerList(
            this.playerListContent,
            this.playerItemPrefab,
            state.players,
            this._sessionId,
            state.hostId
        );

        // Update Ready Button (Label via UIUpdater, interactability handled internally)
        // console.log("[RoomUI] Calling updateReadyButtonInternal...");
        this.updateReadyButtonInternal(); // Use internal method

        // Update Start Game Button (via UIUpdater, conditions calculated internally)
        // console.log("[RoomUI] Calling updateStartGameButtonInternal...");
        this.updateStartGameButtonInternal(); // Use internal method

        // Update Player Count Label using Object.keys length
        if (this.playerCountLabel) {
            const currentCount = state.players ? Object.keys(state.players).length : 0;
            this.uiUpdater.updatePlayerCountLabel(this.playerCountLabel, currentCount, this.maxClients);
            // console.log(`[RoomUI] Player count label updated: ${currentCount}/${this.maxClients}`);
        }

        // Update AI Button interactability using Object.keys length
        if (this.inviteAIButton) {
            const currentCount = state.players ? Object.keys(state.players).length : 0;
            const canInviteAI = this._isHost && currentCount < this.maxClients && state.status === 'waiting';
            this.uiUpdater.updateInviteAIButton(this.inviteAIButton, canInviteAI);
            // console.log(`[RoomUI] Invite AI button interactable set to: ${canInviteAI}`);
        }

        // Clear loading/status message once state is received
        if (this.statusLabel && this.statusLabel.node.active && this.statusLabel.string === "等待房间状态...") {
             this.statusLabel.node.active = false; // Directly hide it
             console.log("[RoomUI] Cleared 'Waiting for state...' status label.");
        }

        // Check game status for scene transition (alternative to 'gameStarted' message)
        console.log(`[RoomUI] Checking game status for scene transition. Current status: ${state.status}, Current scene: ${director.getScene()?.name}`);
        if (state.status === 'playing' && director.getScene()?.name === 'RoomScene') {
            console.log("[RoomUI] Game state is 'playing', navigating to GameScene.");
            // 无需显式传递 gameId，GameUI 将通过 NetworkManager.getInstance().roomId 获取
            director.loadScene('GameScene');
        } else if (state.status === 'finished' && director.getScene()?.name === 'RoomScene') {
             // Game finished while waiting? Show message and return to lobby?
             console.log("[RoomUI] Game state is 'finished' while in RoomScene, returning to Lobby.");
             this.uiUpdater.showError(this.statusLabel, "游戏已结束，即将返回大厅...", true, this);
             this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
        }
        console.log("[RoomUI] handleStateChange finished.");
    }

    // Handle player data message (might be partial update)
    public handlePlayerData(data: any): void {
        console.log(`[RoomUI] Received player data:`, data);

        // 更新当前玩家信息
        if (data.id) {
          this._sessionId = data.id;
          console.log(`[RoomUI] 更新会话ID: ${this._sessionId}`);
        }
        
        // Update host status if provided
        if (data.hasOwnProperty('isHost')) {
          this._isHost = data.isHost;
          console.log(`[RoomUI] Updated host status: ${this._isHost}`);
          this.updateStartGameButtonInternal(); // Update button state
        }

        // 如果包含玩家列表，更新UI
        if (data.playerList && Array.isArray(data.playerList)) {
          console.log(`[RoomUI] 收到玩家列表，包含 ${data.playerList.length} 名玩家`);
          
          // 清空现有玩家列表
          if (this.playerListContent) {
            this.playerListContent.removeAllChildren();
          }
          
          // 创建玩家项 - 这部分逻辑似乎与 handleStateChange 重复，
          // 并且 tempPlayer 未被使用。暂时注释掉以避免错误和冗余。
          // data.playerList.forEach((playerData: any) => {
          //   if (playerData.id && playerData.name) {
          //     // PlayerState is a type, cannot use 'new'
          //     // const tempPlayer: PlayerState = { /* ... */ };
          //     // ... (rest of the logic using tempPlayer)
          //   }
          // });

          // Update player count label if list is provided here
          if (this.playerCountLabel) {
             this.uiUpdater.updatePlayerCountLabel(this.playerCountLabel, data.playerList.length, this.maxClients);
          }
        }

        // Update UI button states based on potentially changed isHost or isReady
        this.updateReadyButtonInternal();
        this.updateStartGameButtonInternal();
    }

    // Handle full room state message (might be initial connection or specific request)
    public handleFullRoomState(data: any): void {
        console.log(`[RoomUI] Received full room state:`, data);

        // 更新房间状态
        if (data.status) {
          // Ensure state object exists before accessing properties
          // Use {} as Type for interfaces/types
          if (!this._colyseusState) this._colyseusState = {} as LiarDiceRoomState;
          // Add null check before assignment
          if (this._colyseusState) {
              this._colyseusState.status = data.status;
          }
        }

        // Update host ID and status
        if (data.hostId) {
          // Ensure state object exists
          // Use {} as Type for interfaces/types
          if (!this._colyseusState) this._colyseusState = {} as LiarDiceRoomState;
           // Add null check before assignment
          if (this._colyseusState) {
              this._colyseusState.hostId = data.hostId;
              this._isHost = data.hostId === this._sessionId;
              console.log(`[RoomUI] Updated host status from full state: ${this._isHost}`);
          } else {
              // Handle case where state is null but hostId is provided
              this._isHost = data.hostId === this._sessionId;
              console.log(`[RoomUI] Updated host status from full state (state was null): ${this._isHost}`);
          }
        }

        // 如果包含玩家列表，更新UI
        if (data.players && Array.isArray(data.players)) {
          console.log(`[RoomUI] 收到玩家列表，包含 ${data.players.length} 名玩家`);
          
          // 清空现有玩家列表
          if (this.playerListContent) {
            this.playerListContent.removeAllChildren();
          }
          
          // Ensure _colyseusState exists before proceeding
          if (!this._colyseusState) this._colyseusState = {} as LiarDiceRoomState; // Initialize as empty object if needed

          // 创建新的 PlayerState 实例并添加到 Map 中
          // 使用原生 Map 替代 MapSchema
          const playersMap = new Map<string, PlayerState>();
          
          data.players.forEach((pData: any) => {
              // 检查 pData.id 是否存在
              if (pData && typeof pData === 'object' && pData.hasOwnProperty('id')) {
                  // 创建新的 PlayerState 实例
                  const playerState = new PlayerState();
                  
                  // 设置属性
                  playerState.id = pData.id || ''; // 设置 id
                  playerState.sessionId = pData.sessionId || pData.id || ''; // 优先使用 sessionId，如果没有则使用 id
                  playerState.name = pData.name || 'Unknown';
                  playerState.isReady = pData.isReady || false;
                  playerState.diceCount = pData.diceCount || 5; // 默认给 5 个骰子
                  playerState.isConnected = pData.isConnected !== undefined ? pData.isConnected : true;
                  playerState.isAI = pData.isAI || false;
                  playerState.aiType = pData.aiType || '';
                  
                  // 将玩家状态添加到 MapSchema 中
                  playersMap.set(pData.id, playerState);

                  // Update current player's ready state
                  if (pData.id === this._sessionId) {
                      this._isReady = playerState.isReady;
                  }
              } else {
                  console.warn("[RoomUI] Invalid player data structure in fullRoomState:", pData);
              }
          });

          // 更新状态的 players 对象
          this._colyseusState.players = playersMap;

          // 使用 MapSchema 调用 updatePlayerList
          this.uiUpdater.updatePlayerList(
              this.playerListContent,
              this.playerItemPrefab,
              playersMap, // 传递 MapSchema
              this._sessionId,
              this._colyseusState.hostId // 使用可能更新的 hostId
          );

          // 更新玩家数量标签
          if (this.playerCountLabel) {
              const currentCount = playersMap.size;
              this.uiUpdater.updatePlayerCountLabel(this.playerCountLabel, currentCount, this.maxClients);
          }

          // 更新按钮状态
          this.updateReadyButtonInternal();
          this.updateStartGameButtonInternal();

          // 检查游戏状态并切换场景
          if (data.status === 'playing' && director.getScene()?.name === 'RoomScene') {
              console.log("[RoomUI] 游戏状态为'playing'，正在切换到GameScene。");
              director.loadScene('GameScene');
          }
        }
    } // This is the correct closing brace for handleFullRoomState

    // Handle specific game started message
    public handleGameStarted(data: { gameId: string }): void {
        console.log(`[RoomUI] Received 'gameStarted' message with ID: ${data.gameId} (Current Scene: ${director.getScene()?.name})`);
        // Transition only if still in RoomScene
        if (director.getScene()?.name === 'RoomScene') {
            // Check state status as well to prevent duplicate navigation
            if (this._colyseusState?.status !== 'playing') {
                 console.log("[RoomUI] Navigating to GameScene based on 'gameStarted' message.");
                 director.loadScene('GameScene');
            } else {
                 console.log("[RoomUI] State already 'playing', ignoring redundant 'gameStarted' message.");
            }
        }
    }

    public handleKicked(data: { reason?: string }): void {
        console.warn('[RoomUI] Kicked from room:', data?.reason);
        this.uiUpdater.showError(this.statusLabel, `您已被踢出房间${data?.reason ? ': ' + data.reason : ''}`, true, this);
        this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
    }

    public handleDisconnect(code: number): void {
        console.error(`[RoomUI] Network disconnected. Code: ${code}`);
        // Avoid showing error if it was a graceful leave (code 1000) or already leaving
        if (code !== 1000 /* && !this.isLeaving */) { // Add isLeaving flag if needed
             this.uiUpdater.showError(this.statusLabel, "网络连接已断开", true, this);
        }
        // Always return to lobby on disconnect from room scene
        this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
    }

    public handleNetworkError(error: NetworkError): void {
        console.error('[RoomUI] Network error:', error);
        // Avoid showing redundant timeout errors or normal leave errors
        if (error.code === NetworkErrorCode.CONNECTION_TIMEOUT || error.code === 1000) {
            // console.warn('[RoomUI] Suppressed timeout or normal disconnect error display.');
            return;
        }
        this.uiUpdater.showError(this.statusLabel, `网络错误 (${error.code}): ${error.message}`, false, this);
        // Consider returning to lobby on certain critical errors
    }

    // --- Internal UI Update Methods ---
    // These methods now primarily manage button interactability and call UIUpdater

    private updateReadyButtonInternal(): void {
        // Update label via UIUpdater
        this.uiUpdater.updateReadyButtonLabel(this.readyButtonLabel, this._isReady);

        // Handle interactability based on game state
        if (this.readyButton) {
            const isWaiting = this._colyseusState?.status === 'waiting';
            this.readyButton.interactable = isWaiting; // Can only change ready state while waiting
        }
    }

    private updateStartGameButtonInternal(): void {
        const isWaiting = this._colyseusState?.status === 'waiting';
        // Check if conditions are met using UIUpdater's method
        const canStart = this.uiUpdater.checkIfCanStartGame(this._isHost, this._colyseusState);

        // Update button state (active and interactable) via UIUpdater
        // Ensure _colyseusState is checked before accessing status
        // No need to redeclare isWaiting here, it's declared above in the function scope
        this.uiUpdater.updateStartGameButton(this.startGameButton, this._isHost, canStart, isWaiting);
    }

    // --- Button Click Handlers ---

    public onReadyClick(): void {
        const newState = !this._isReady;
        console.log(`[RoomUI] Ready button clicked. Current state: ${this._isReady}, attempting to set: ${newState}`);
        // Disable button temporarily to prevent double clicks
        if(this.readyButton) this.readyButton.interactable = false;
        // 通过 NetworkManager 发送消息到服务器
        NetworkManager.getInstance().send('setReady', { ready: newState });
        // Re-enable button after a short delay, state update will handle visual change and final interactability
        this.scheduleOnce(() => {
             // Re-enable only if still in waiting state
             if (this.readyButton && this._colyseusState?.status === 'waiting') {
                 this.readyButton.interactable = true;
             }
         }, 0.5);
    }

    public onStartGameClick(): void {
        console.log('[RoomUI] Start Game button clicked.');
        const currentIsWaiting = this._colyseusState?.status === 'waiting'; // Use correct check
        if (!this._isHost || !currentIsWaiting) {
            this.uiUpdater.showError(this.statusLabel, "只有房主才能在等待时开始游戏", false, this);
            return;
        }
        // Use UIUpdater to check conditions
        if (!this.uiUpdater.checkIfCanStartGame(this._isHost, this._colyseusState)) {
             this.uiUpdater.showError(this.statusLabel, "有玩家未准备好或人数不足", false, this);
             return;
        }

        if (this.startGameButton) this.startGameButton.interactable = false; // Prevent double click
        this.uiUpdater.showInfo(this.statusLabel, "正在开始游戏...", false, this);
        NetworkManager.getInstance().send('startGame', {}); // 使用 NetworkManager.getInstance()
        // Server state update or 'gameStarted' message will trigger scene change
    }

    public onLeaveRoomClick(): void {
        console.log('[RoomUI] Leave Room button clicked.');
        if (this.leaveRoomButton) this.leaveRoomButton.interactable = false;
        this.uiUpdater.showInfo(this.statusLabel, "正在离开房间...", true, this); // Persistent message
        NetworkManager.getInstance().leaveRoom().catch((error: any) => { // 使用 NetworkManager.getInstance()
            // leaveRoom itself shouldn't really reject, errors handled by onError/onLeave
            console.error("Error during leaveRoom call (unexpected):", error);
             // Re-enable button only if leave fails unexpectedly AND we are still in room scene
             if (this.leaveRoomButton && director.getScene()?.name === 'RoomScene') {
                 this.leaveRoomButton.interactable = true;
                 this.uiUpdater.showError(this.statusLabel, "离开房间失败", false, this); // Show error
             }
        });
        // handleDisconnect listener (called via EventHandler) will handle scene change
    }

    public onQuickInviteAI(): void {
        const isWaiting = this._colyseusState?.status === 'waiting';
        if (!this._isHost || !isWaiting) {
             this.uiUpdater.showError(this.statusLabel, "只有房主才能在等待时邀请AI", false, this);
             return;
         }
         // Check player count using Object.keys length
         const currentSize = this._colyseusState?.players ? Object.keys(this._colyseusState.players).length : 0;
        if (currentSize >= this.maxClients) {
             this.uiUpdater.showError(this.statusLabel, "房间已满，无法邀请AI", false, this);
             return;
        }

        if (this.inviteAIButton) this.inviteAIButton.interactable = false; // Prevent double click
        this.uiUpdater.showInfo(this.statusLabel, "正在邀请 AI 加入...", false, this);
        NetworkManager.getInstance().send('addAI', { aiType: 'simple_random' }); // 使用 NetworkManager.getInstance()
         // Re-enable button after a delay, state update will handle list change and final interactability
         this.scheduleOnce(() => {
              const currentIsWaiting = this._colyseusState?.status === 'waiting';
              // Check player count using Object.keys length
              const currentSizeAfterWait = this._colyseusState?.players ? Object.keys(this._colyseusState.players).length : 0;
              if (this.inviteAIButton && this._isHost && currentIsWaiting && currentSizeAfterWait < this.maxClients) {
                  this.inviteAIButton.interactable = true;
              }
          }, 1.0);
    }

    // Removed old UI update methods (updatePlayerList, createPlayerItem, updateReadyButton, updateStartGameButton, checkIfCanStartGame)
    // Removed old status display methods (showError, showInfo)
}
