import { _decorator, Component, Node, Label, Button, Color, director, Prefab, instantiate, ScrollView, Layout } from 'cc'; // 导入 Layout
import { network } from '../core/network';
import { NetworkErrorHandler } from '../core/error-handler';
import { PlayerItem } from '../prefabs/player-item'; // 引入 PlayerItem
// 引入 Room 和 Player 类型
import type { Room, Player } from '../../../../shared/protocols/room-protocol';

const { ccclass, property } = _decorator;

/**
 * 房间内等待场景 UI 组件
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
    private playerCountLabel: Label | null = null; // 新增：用于显示房间人数

    @property(Button)
    private inviteAIButton: Button | null = null; // 新增：邀请 AI 按钮

    // 内部状态
    private _roomId: string = '';
    private _playerId: string = '';
    private _isReady: boolean = false;
    private _isHost: boolean = false;
    private _room: Room | null = null;
    // _playerDataMap 仍然可以用来快速查找 PlayerItem 节点或其他本地数据，但房间状态以 _room 为准
    private _playerDataMap: Map<string, Player> = new Map();

    // 存储绑定的事件处理函数引用
    private _boundHandleRoomUpdate = this.handleRoomUpdate.bind(this);
    private _boundHandlePlayerReadyStateChanged = this.handlePlayerReadyStateChanged.bind(this);
    private _boundHandlePlayerJoined = this.handlePlayerJoined.bind(this);
    private _boundHandlePlayerLeft = this.handlePlayerLeft.bind(this);
    private _boundHandleKicked = this.handleKicked.bind(this);
    private _boundHandleGameStarted = this.handleGameStarted.bind(this); // Still using gameStarted here in the restored version
    private _boundHandleDisconnect = this.handleDisconnect.bind(this);
    private _boundHandleNetworkError = this.handleNetworkError.bind(this);
    // private _boundHandleHostChanged = this.handleHostChanged.bind(this); // 如果需要

    onLoad() {
        if (this.statusLabel) {
            NetworkErrorHandler.initStatusLabel(this.statusLabel);
        }

        // 从 network 单例获取房间和玩家 ID
        this._roomId = network.roomId;
        this._playerId = network.playerId;
        if (!this._roomId || !this._playerId) {
             console.error("[RoomUI] Missing roomId or playerId from network module!");
             this.showError("无法获取玩家或房间信息", true);
             // 考虑返回大厅
             // setTimeout(() => director.loadScene('LobbyScene'), 3000);
             return;
        }

        if (this.roomIdLabel) {
            this.roomIdLabel.string = `房间号: ${this._roomId}`;
        }

        this.setupEventListeners();
        this.updateReadyButton(); // 更新准备按钮初始状态
        this.updateStartGameButton(); // 更新开始按钮初始状态

        // 绑定邀请 AI 按钮事件
        if (this.inviteAIButton) {
            this.inviteAIButton.node.on(Button.EventType.CLICK, this.onQuickInviteAI, this);
            // Initially disable invite AI button until room state is loaded? Or based on host status?
            // Let's enable it by default for now, can refine later.
            this.inviteAIButton.interactable = true;
        }

        // 主动获取一次当前房间状态
        this.fetchInitialRoomState();
    }

    onDestroy() {
        this.removeEventListeners();
    }

    private setupEventListeners(): void {
        // 使用存储的绑定函数引用
        network.on('roomUpdate', this._boundHandleRoomUpdate);
        network.on('playerReadyStateChanged', this._boundHandlePlayerReadyStateChanged);
        // network.on('hostChanged', this._boundHandleHostChanged);
        network.on('playerJoined', this._boundHandlePlayerJoined);
        network.on('playerLeft', this._boundHandlePlayerLeft);
        network.on('kicked', this._boundHandleKicked);
        network.on('gameStarted', this._boundHandleGameStarted); // Still using gameStarted here
        network.on('disconnected', this._boundHandleDisconnect);
        network.on('error', this._boundHandleNetworkError);
    }

    private removeEventListeners(): void {
        // 使用存储的绑定函数引用
        network.off('roomUpdate', this._boundHandleRoomUpdate);
        network.off('playerReadyStateChanged', this._boundHandlePlayerReadyStateChanged);
        // network.off('hostChanged', this._boundHandleHostChanged);
        network.off('playerJoined', this._boundHandlePlayerJoined);
        network.off('playerLeft', this._boundHandlePlayerLeft);
        network.off('kicked', this._boundHandleKicked);
        network.off('gameStarted', this._boundHandleGameStarted); // Still using gameStarted here
        network.off('disconnected', this._boundHandleDisconnect);
        network.off('error', this._boundHandleNetworkError);
    }

    private async fetchInitialRoomState(): Promise<void> {
        console.log(`[RoomUI] Starting fetchInitialRoomState for room: ${this._roomId}`);
        try {
            console.log(`[RoomUI] Sending getRoomInfo request...`);
            const response = await network.request('getRoomInfo', { roomId: this._roomId });
            console.log(`[RoomUI] Received getRoomInfo response:`, response); // Log the full response

            if (response.success && response.room) {
                console.log(`[RoomUI] getRoomInfo successful. Calling handleRoomUpdate.`);
                this.handleRoomUpdate(response.room);
                console.log(`[RoomUI] handleRoomUpdate completed.`);
            } else {
                console.error(`[RoomUI] getRoomInfo failed:`, response.error);
                this.showError(response.error || "获取房间信息失败");
                // 获取失败可能需要返回大厅
                // setTimeout(() => director.loadScene('LobbyScene'), 3000);
            }
        } catch (error) {
            console.error("[RoomUI] Exception during fetchInitialRoomState:", error);
            this.showError(`获取房间信息出错: ${error instanceof Error ? error.message : '未知网络错误'}`);
        } finally {
            console.log(`[RoomUI] Finished fetchInitialRoomState.`);
        }
    }

    // --- 事件处理 ---

    private handleRoomUpdate(room: Room): void {
        console.log(`[RoomUI] handleRoomUpdate triggered for room ${room?.id}. Current room ID: ${this._roomId}`); // 添加日志
        if (!room || room.id !== this._roomId) {
            console.warn(`[RoomUI] handleRoomUpdate ignored: Invalid room data or room ID mismatch.`);
            return;
        }

        console.log('[RoomUI] Processing roomUpdate:', room); // 确认进入处理逻辑
        this._room = room; // 缓存最新的房间信息

        // 更新玩家列表 UI
        this.updatePlayerList(room.players);

        // 更新当前玩家是否是房主的状态
        this._isHost = (this._playerId === room.hostId);

        // 更新房间人数显示
        if (this.playerCountLabel) {
            this.playerCountLabel.string = `房间人数: ${room.playerCount}/${room.maxPlayers}`;
        }

        // 更新按钮状态
        this.updateStartGameButton();
        this.updateReadyButton(); // 确保准备按钮状态也基于最新信息更新
    }

    // 如果服务器单独推送玩家加入事件
    private handlePlayerJoined(playerData: Player): void {
        console.log('[RoomUI] Received playerJoined:', playerData);
        // 通常 roomUpdate 已经包含了新玩家，这个事件可能不需要单独处理UI更新
        // 但可以用来更新 _playerDataMap (如果还需要它)
        if (!this._playerDataMap.has(playerData.id)) {
            this._playerDataMap.set(playerData.id, playerData);
            // UI 更新由 handleRoomUpdate 统一处理
        }
        // this.updateStartGameButton(); // roomUpdate 会调用
    }

    private handlePlayerReadyStateChanged(data: { playerId: string, isReady: boolean }): void {
        console.log('[RoomUI] Received playerReadyStateChanged:', data);
        // 更新缓存的房间信息中的玩家状态
        if (this._room) {
            const player = this._room.players.find(p => p.id === data.playerId);
            if (player) {
                player.isReady = data.isReady;
                // 如果是自己，更新 _isReady 状态
                if (player.id === this._playerId) {
                    this._isReady = data.isReady;
                }
            }
        }
         // 更新本地缓存（如果还在使用）
         const localPlayerData = this._playerDataMap.get(data.playerId);
         if (localPlayerData) {
             localPlayerData.isReady = data.isReady;
         }

        // 更新对应的 PlayerItem UI
        const playerNode = this.findPlayerNodeById(data.playerId);
        playerNode?.getComponent(PlayerItem)?.setIsReady(data.isReady);

        // 更新按钮状态
        this.updateReadyButton(); // 更新自己的准备按钮
        this.updateStartGameButton(); // 准备状态变化影响开始按钮
    }

    // 如果服务器单独推送房主变更事件
    // private handleHostChanged(data: { newHostId: string }): void {
    //     console.log('[RoomUI] Received hostChanged:', data);
    //     this._isHost = (this._playerId === data.newHostId);
    //     // UI 更新由 handleRoomUpdate 统一处理
    //     this.updateStartGameButton();
    // }

    // 如果服务器单独推送玩家离开事件
    private handlePlayerLeft(data: { playerId: string }): void {
        console.log('[RoomUI] Received playerLeft:', data);
        // 通常 roomUpdate 会反映玩家离开，这个事件可能不需要单独处理UI更新
        this._playerDataMap.delete(data.playerId);
        // UI 更新由 handleRoomUpdate 统一处理
        // this.updateStartGameButton(); // roomUpdate 会调用
    }

    private handleKicked(data: { reason: string }): void {
        console.warn('[RoomUI] Kicked from room:', data.reason);
        this.showError(`您已被踢出房间: ${data.reason || '无原因'}`, true);
        setTimeout(() => director.loadScene('LobbyScene'), 3000);
    }

    private handleDisconnect(): void {
        console.error('[RoomUI] Network disconnected.');
        this.showError("网络连接已断开", true);
        setTimeout(() => director.loadScene('LobbyScene'), 3000);
    }

    private handleNetworkError(error: any): void {
        console.error('[RoomUI] Network error:', error);
        // 避免显示重复的超时错误，可以检查错误类型或消息
        if (error && typeof error.message === 'string' && error.message.includes('超时')) {
             console.warn('[RoomUI] Network timeout error suppressed in status label.');
        } else {
            this.showError(`网络错误: ${error?.message || '未知错误'}`);
        }
    }

    private handleGameStarted(data: { gameId: string }): void { // Still using gameStarted here
        console.log(`[RoomUI] Game starting with ID: ${data.gameId}`);
        // 临时跨场景传递 gameId，后续可用单例或持久节点优化
        (window as any).__CURRENT_GAME_ID = data.gameId;
        director.loadScene('GameScene');
    }

    // --- UI 更新 ---

    private updatePlayerList(players: Player[]): void {
        console.log(`[RoomUI] Updating player list with ${players.length} players.`);
        if (!this.playerListContent || !this.playerItemPrefab) {
            console.error("[RoomUI] Player list content or prefab missing!");
            return;
        }

        // 严格按照传入的 players 数组渲染，先清空
        this.playerListContent.removeAllChildren();
        this._playerDataMap.clear(); // 清空缓存，确保与传入数据一致

        if (!Array.isArray(players)) {
            console.error("[RoomUI] Invalid players data received in updatePlayerList:", players);
            return; // 防止因数据格式错误导致后续异常
        }

        players.forEach(playerData => {
            // 检查 playerData 是否有效
            if (!playerData || typeof playerData.id !== 'string') {
                console.error("[RoomUI] Invalid player data item:", playerData);
                return; // 跳过无效数据项
            }

            this._playerDataMap.set(playerData.id, playerData); // 更新缓存

            console.log(`[RoomUI] Creating list item for player: ${playerData.id} (${playerData.name})`);
            const playerNode = instantiate(this.playerItemPrefab);
            const playerComp = playerNode.getComponent(PlayerItem);
            if (playerComp) {
                playerComp.setPlayerId(playerData.id);
                playerComp.setPlayerName(playerData.name || `玩家...`); // 显示名字
                playerComp.setIsReady(playerData.isReady); // 显示准备状态
                playerComp.setIsAI(playerData.isAI); // 新增：显示 AI 标识
                // playerComp.setIsHost(this._room?.hostId === playerData.id); // 可选：显示房主标识
            }
            this.playerListContent.addChild(playerNode);
        });

        // Force layout update after adding children
        const layout = this.playerListContent.getComponent(Layout); // 直接使用导入的 Layout
        if (layout) {
            layout.updateLayout(); // 调用 Layout 组件实例的方法
            console.log("[RoomUI] Forced layout update.");
        }
        // Also update ScrollView content size if necessary (might not be needed if Layout handles it)
        // const scrollView = this.playerListContent.parent?.getComponent(ScrollView);
        // if (scrollView) {
        //     scrollView.calculateBoundary();
        // }
    }

    private updateReadyButton(): void {
        if (this.readyButtonLabel) {
            this.readyButtonLabel.string = this._isReady ? '取消准备' : '准备';
        }
        // 可以根据游戏状态禁用准备按钮，例如游戏已开始
        // this.readyButton.interactable = this._room?.status === 'waiting';
    }

    private updateStartGameButton(): void {
        if (!this.startGameButton) return;

        // 按钮仅对房主可见
        this.startGameButton.node.active = this._isHost;

        if (this._isHost) {
            // 检查是否满足开始条件
            const canStart = this.checkIfCanStartGame();
            this.startGameButton.interactable = canStart;
        } else {
            this.startGameButton.interactable = false; // 非房主不可交互
        }
    }

    private checkIfCanStartGame(): boolean {
        // 必须是房主 (已在 updateStartGameButton 中检查可见性，这里再确认一次)
        if (!this._isHost) {
            return false;
        }
        // 必须有房间数据
        if (!this._room) {
            return false;
        }
        // 必须至少有2名玩家
        if (this._room.playerCount < 2) {
            return false;
        }
        // 检查所有玩家是否都已准备
        for (const player of this._room.players) {
            if (!player.isReady) {
                return false; // 有玩家未准备
            }
        }
        // 所有条件满足
        return true;
    }

    private findPlayerNodeById(playerId: string): Node | null {
        if (!this.playerListContent) return null;
        for (const node of this.playerListContent.children) {
            const comp = node.getComponent(PlayerItem);
            if (comp && comp.getPlayerId() === playerId) {
                return node;
            }
        }
        return null;
    }

    // --- 按钮点击处理 ---

    public onReadyClick(): void {
        const newState = !this._isReady;
        console.log(`[RoomUI] Ready button clicked. Current state: ${this._isReady}, attempting to set: ${newState}`);

        this.readyButton.interactable = false; // 防止重复点击

        network.request('setReady', { ready: newState })
            .then((response) => {
                 if (response.success) {
                    // 成功后服务器会通过 roomUpdate 或 playerReadyStateChanged 更新状态
                    // 不再需要手动更新 _isReady 或 UI，等待服务器事件
                    console.log("[RoomUI] Set ready request successful. Waiting for server update.");
                 } else {
                    this.showError(response.error || "设置准备状态失败");
                 }
            })
            .catch(error => {
                console.error("[RoomUI] Failed to send ready state:", error);
                this.showError(`设置准备状态失败: ${error.message}`);
            })
            .finally(() => {
                 // 无论成功失败，恢复按钮交互性
                 this.readyButton.interactable = true;
            });
    }

    public onStartGameClick(): void {
        console.log('[RoomUI] Start Game button clicked.');
        if (!this._isHost) {
            this.showError("只有房主才能开始游戏");
            return;
        }
        // 再次检查是否可开始
        if (!this.checkIfCanStartGame()) {
             if (this._room && this._room.playerCount < 2) {
                 this.showError("至少需要2名玩家才能开始游戏");
             } else {
                 this.showError("有玩家未准备好");
             }
             return;
        }

        this.startGameButton.interactable = false; // 防止重复点击

        network.startGame() // network 模块需要有 startGame 方法
            .then(() => {
                console.log("[RoomUI] Start game request sent successfully.");
                // 等待服务器 'gameStarted' 事件进行场景跳转
            })
            .catch(error => {
                this.showError(`开始游戏请求失败: ${error.message}`);
                // 只有在请求失败时才恢复按钮交互性，成功则等待跳转
                this.startGameButton.interactable = this.checkIfCanStartGame();
            });
    }

    public onLeaveRoomClick(): void {
        console.log('[RoomUI] Leave Room button clicked.');
        this.leaveRoomButton.interactable = false; // 防止重复点击
        network.leaveRoom()
            .then(() => {
                director.loadScene('LobbyScene');
            })
            .catch(error => {
                this.showError(`离开房间失败: ${error.message}`);
                this.leaveRoomButton.interactable = true; // 离开失败恢复按钮
                // 离开失败也尝试返回大厅？可以根据产品需求决定
                // director.loadScene('LobbyScene');
            });
    }

    // --- 状态显示 ---

    private showError(message: string, persistent: boolean = false) {
        if (this.statusLabel) {
            this.statusLabel.string = message;
            this.statusLabel.color = Color.RED;
            this.statusLabel.node.active = true;
            const timerKey = 'statusLabelHideTimer';
            const nodeWithTimer = this.statusLabel.node as any;
            if (nodeWithTimer[timerKey]) {
                clearTimeout(nodeWithTimer[timerKey]);
            }
            if (!persistent) {
                nodeWithTimer[timerKey] = setTimeout(() => {
                    if (this.statusLabel) this.statusLabel.node.active = false;
                }, 3000);
            }
        }
        console.error(`[RoomUI] Error: ${message}`);
    }

    private showInfo(message: string, persistent: boolean = false) {
        if (this.statusLabel) {
            this.statusLabel.string = message;
            this.statusLabel.color = Color.WHITE;
            this.statusLabel.node.active = true;
            const timerKey = 'statusLabelHideTimer';
            const nodeWithTimer = this.statusLabel.node as any;
            if (nodeWithTimer[timerKey]) {
                clearTimeout(nodeWithTimer[timerKey]);
            }
            if (!persistent) {
                nodeWithTimer[timerKey] = setTimeout(() => {
                    if (this.statusLabel) this.statusLabel.node.active = false;
                }, 3000);
            }
        }
        console.log(`[RoomUI] Info: ${message}`);
    }

    // 新增：处理邀请 AI 按钮点击
    public async onQuickInviteAI(): Promise<void> {
        if (!this._roomId) {
            this.showError("无法获取房间信息");
            return;
        }
        if (!this.inviteAIButton) return;

        console.log(`[RoomUI] Quick Invite AI button clicked for room ${this._roomId}`);
        this.inviteAIButton.interactable = false; // 防止重复点击
        this.showInfo("正在邀请 AI 加入...");

        try {
            const response = await network.request('quickInviteAI', { roomId: this._roomId });
            if (response.success) {
                this.showInfo(`AI 玩家 ${response.aiPlayerId || ''} 已邀请`);
                // 房间状态将通过 roomUpdate 事件更新，无需在此手动刷新
            } else {
                this.showError(response.error || "邀请 AI 失败");
            }
        } catch (error: any) {
            console.error("[RoomUI] Failed to send quickInviteAI request:", error);
            this.showError(`邀请 AI 失败: ${error.message || '网络错误'}`);
        } finally {
            // 无论成功失败，稍后恢复按钮交互性 (或者根据房间人数等条件判断)
            // For now, re-enable after a short delay
            setTimeout(() => {
                if (this.inviteAIButton) {
                    // Re-enable only if the room is not full
                    const canInvite = this._room ? this._room.playerCount < this._room.maxPlayers : true;
                    this.inviteAIButton.interactable = canInvite;
                }
            }, 1000); // 1 second delay
        }
    }
}
