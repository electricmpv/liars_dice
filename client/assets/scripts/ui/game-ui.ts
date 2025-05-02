import { _decorator, Component, Node, Label, Color, Button, director, isValid } from 'cc';
import { NetworkManager, NetworkError, NetworkErrorCode } from '../core/network'; // Import Colyseus-based network
import { LoginManager } from '../core/login-manager';
import { PlayerDisplayController } from './player-display-controller';
import { BidController } from './bid-controller';
import { DiceDisplayController } from './dice-display-controller';
import { GameHistoryPanel } from './game-history-panel';
import { GameResultPanel } from './game-result-panel';
import { BidValidator } from '../utils/bid-validator';
// Import new client-side interfaces
import type { LiarDiceRoomStateClient } from '../shared/schemas/liar-dice-room-state-client';
import type { PlayerStateClient } from '../shared/schemas/player-state-client';
import { Face, Bid } from '../../shared/types/game-types'; // Import shared types
// Import PlayerData type expected by PlayerDisplayController
import type { PlayerData } from './player-display-controller'; // Assuming PlayerData is exported or defined here

const { ccclass, property } = _decorator;

/**
 * 游戏UI主控制器 (适配 Colyseus)
 * 负责协调各个UI组件和处理网络事件/状态更新
 */
@ccclass('GameUI')
export class GameUI extends Component {
    // --- UI 元素引用 ---
    @property(Label)
    private gameStatusLabel: Label | null = null;

    @property(Label)
    private roundLabel: Label | null = null;

    // --- 控制器引用 ---
    @property(PlayerDisplayController)
    private playerDisplayController: PlayerDisplayController | null = null;

    @property(BidController)
    private bidController: BidController | null = null;

    @property(DiceDisplayController)
    private diceDisplayController: DiceDisplayController | null = null;

    @property(GameHistoryPanel)
    private gameHistoryPanel: GameHistoryPanel | null = null;

    @property(GameResultPanel)
    private gameResultPanel: GameResultPanel | null = null;

    // --- 游戏状态 ---
    private _roomId: string = '';
    private _sessionId: string = ''; // Use Colyseus session ID
    private _myDices: Face[] = []; // Store own dices received via message
    private _currentBid: Bid | [0, 0] = [0, 0]; // Store current bid from state
    private _isMyTurn: boolean = false;
    private _totalDiceInGame: number = 0;

    // --- Network Listener Callbacks ---
    // Type the state parameter as 'any' to avoid importing the original Schema file at runtime
    // Cast to the client interface inside the handler
    private _onStateUpdateCallback = (state: any) => this.handleStateChange(state as LiarDiceRoomStateClient);
    private _onYourDicesCallback = (data: { dices: number[] }) => this.handleYourDices(data); // Type adjusted
    private _onNewRoundCallback = (data: any) => this.handleNewRound(data);
    private _onNextTurnCallback = (data: { currentPlayerSessionId: string }) => this.handleNextTurn(data);
    private _onPlayerBidCallback = (data: { sessionId: string, value: Face, count: number }) => this.handlePlayerBidUpdate(data);
    private _onChallengeRevealCallback = (data: any) => this.handleChallengeReveal(data);
    private _onGameFinishedCallback = (data: { winnerSessionId?: string, winnerName?: string }) => this.handleGameFinished(data);
    private _onDisconnectCallback = (code: number) => this.handleDisconnect(code);
    private _onErrorCallback = (error: NetworkError) => this.handleNetworkError(error);
    // Listener for generic messages (e.g., chat) - can be handled directly or via NetworkManager specific events
    // private _onMessageCallback = (data: { type: string, message: any }) => this.handleServerMessage(data);


    onLoad() {
        console.log("[GameUI] onLoad called.");
        this.listenToNetworkEvents();
        this.listenToBidControllerEvents();
        this.listenToResultPanelEvents();
    }

    start() {
        console.log("[GameUI] start called.");
        this.initUI();

        this._roomId = NetworkManager.getInstance().roomId;
        this._sessionId = NetworkManager.getInstance().sessionId; // Get own session ID

        if (!this._roomId || !this._sessionId) {
            console.error("[GameUI] Missing roomId or sessionId from NetworkManager!");
            if (this.gameStatusLabel) this.gameStatusLabel.string = "错误：无法获取游戏信息";
            // Consider returning to lobby
             this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
            return;
        }
        console.log(`[GameUI] Room ID: ${this._roomId}, Player Session ID: ${this._sessionId}`);

        // Initialize PlayerDisplayController
        if (this.playerDisplayController) {
            this.playerDisplayController.initialize(this._sessionId);
        } else {
            console.error("[GameUI] PlayerDisplayController is not assigned!");
        }

        // Initial game state will be received via the 'stateUpdate' event
        if (this.gameStatusLabel) this.gameStatusLabel.string = "等待游戏状态...";

        // Check if state is already cached in NetworkManager
         if (NetworkManager.getInstance().roomState) {
             console.log("[GameUI] Initial state found in network cache.");
             // Cast the cached state before passing to the handler
             this.handleStateChange(NetworkManager.getInstance().roomState as any as LiarDiceRoomStateClient);
         }
    }

    /**
     * 初始化UI元素状态
     */
    private initUI(): void {
        if (this.gameStatusLabel) this.gameStatusLabel.string = "连接中...";
        if (this.roundLabel) this.roundLabel.string = "回合: 0";
        if (this.gameResultPanel) this.gameResultPanel.hidePanel();
        if (this.bidController) this.bidController.node.active = false; // Hide bid controls initially
        if (this.diceDisplayController) this.diceDisplayController.clearDices();
    }

    /**
     * 监听网络事件
     */
    private listenToNetworkEvents(): void {
        console.log("[GameUI] Registering network listeners.");
        NetworkManager.getInstance().on('stateUpdate', this._onStateUpdateCallback);
        NetworkManager.getInstance().on('yourDices', this._onYourDicesCallback);
        NetworkManager.getInstance().on('newRound', this._onNewRoundCallback);
        NetworkManager.getInstance().on('nextTurn', this._onNextTurnCallback);
        NetworkManager.getInstance().on('playerBid', this._onPlayerBidCallback);
        NetworkManager.getInstance().on('challengeReveal', this._onChallengeRevealCallback);
        NetworkManager.getInstance().on('gameFinished', this._onGameFinishedCallback);
        NetworkManager.getInstance().on('disconnected', this._onDisconnectCallback);
        NetworkManager.getInstance().on('error', this._onErrorCallback);
        // network.on('messageReceived', this._onMessageCallback); // For chat etc.
    }

     /**
      * 移除网络事件监听
      */
    private cleanupNetworkListeners(): void {
        console.log("[GameUI] Cleaning up network listeners.");
        NetworkManager.getInstance().off('stateUpdate', this._onStateUpdateCallback);
        NetworkManager.getInstance().off('yourDices', this._onYourDicesCallback);
        NetworkManager.getInstance().off('newRound', this._onNewRoundCallback);
        NetworkManager.getInstance().off('nextTurn', this._onNextTurnCallback);
        NetworkManager.getInstance().off('playerBid', this._onPlayerBidCallback);
        NetworkManager.getInstance().off('challengeReveal', this._onChallengeRevealCallback);
        NetworkManager.getInstance().off('gameFinished', this._onGameFinishedCallback);
        NetworkManager.getInstance().off('disconnected', this._onDisconnectCallback);
        NetworkManager.getInstance().off('error', this._onErrorCallback);
        // network.off('messageReceived', this._onMessageCallback);
    }

    /**
     * 监听来自 BidController 的事件
     */
    private listenToBidControllerEvents(): void {
        if (this.bidController) {
            console.log("[GameUI] Registering BidController listeners.");
            this.bidController.node.on('place-bid', this.handleLocalPlaceBid, this); // Renamed handler
            this.bidController.node.on('challenge', this.handleLocalChallenge, this); // Renamed handler
            // this.bidController.node.on('spot-on', this.handleLocalSpotOn, this); // Add if implemented
        } else {
            console.warn("[GameUI] BidController not available for event listening.");
        }
    }

    /**
     * 监听来自 GameResultPanel 的事件
     */
    private listenToResultPanelEvents(): void {
        if (this.gameResultPanel) {
            this.gameResultPanel.node.on('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
        }
    }

    // --- Network Event Handlers ---

     /**
      * 主状态更新处理
      * Accepts the state casted to the client-side interface type
      */
    private handleStateChange(state: LiarDiceRoomStateClient): void { // Use Client Interface type
        // console.log("[GameUI] Handling State Change:", JSON.stringify(state).substring(0, 300));
        if (!this._sessionId) {
             console.error("[GameUI] Cannot handle state change, own sessionId is unknown.");
             return;
        }
        if (!state) {
            console.warn("[GameUI] Received null state in handleStateChange.");
            return;
        }

        // Update players display
        if (this.playerDisplayController && state.players) {
            // CONVERT from Record<string, PlayerStateClient> to PlayerData[]
            const playersDataArray: PlayerData[] = Object.entries(state.players).map(([sessionId, pState]) => ({
                id: sessionId, // Use sessionId as the key which maps to PlayerData's id
                name: pState.name,
                isReady: pState.isReady,
                isAI: pState.isAI,
                diceCount: pState.diceCount,
            }));

            // activePlayerIds is now string[]
            const activePlayerIdsArray = state.activePlayerIds;
            const currentPlayerId = activePlayerIdsArray[state.currentPlayerIndex];
            // Pass the converted PlayerData[]
            this.playerDisplayController.updatePlayerDisplays(playersDataArray, currentPlayerId);
        }

        // Update total dice count using Object.values with Record
        this._totalDiceInGame = 0;
        if (state.players) {
            this._totalDiceInGame = Object.values(state.players).reduce((sum, p) => sum + p.diceCount, 0);
        }

        // Update current bid
        this._currentBid = [state.currentBidValue as Face, state.currentBidCount];

        // Check if it's my turn using standard array indexing
        this._isMyTurn = state.status === 'playing' && state.activePlayerIds[state.currentPlayerIndex] === this._sessionId;

        // Update BidController state
        if (this.bidController) {
            this.bidController.node.active = state.status === 'playing'; // Show/hide based on game status
            if (state.status === 'playing') {
                 // Use 'any' to bypass strict type check for the bid array if casting doesn't work
                 const bidForController: any = this._currentBid[1] === 0 ? [0, 0] : [this._currentBid[0], this._currentBid[1]];
                this.bidController.updateState(this._isMyTurn, bidForController, this._totalDiceInGame);
            }
        }

        // Update round label
        if (this.roundLabel) {
            this.roundLabel.string = `回合: ${state.roundNumber}`;
        }

        // Update status label
        this.updateGameStatusLabel(state);

        // If status is finished, show results (might be redundant with handleGameFinished)
        if (state.status === 'finished' && !this.gameResultPanel?.node.active && state.players) {
            console.log("[GameUI] State indicates game finished, showing results panel.");
             // Find winner using Object.values for Record
             let winner: PlayerStateClient | undefined = undefined;
             for (const p of Object.values(state.players)) { // Iterate over values of Record
                 if (p.diceCount > 0) {
                     winner = p;
                     break; // Assuming only one winner, exit loop once found
                 }
             }
             // Pass winnerSessionId safely (it can be undefined)
             this.handleGameFinished({ winnerSessionId: winner?.sessionId }); // PlayerStateClient has sessionId
        } else if (state.status !== 'finished' && this.gameResultPanel?.node.active) {
             this.gameResultPanel.hidePanel(); // Hide result panel if game restarts or returns to waiting
        }
    }

    /**
     * 处理服务器发送的个人骰子信息
     */
    private handleYourDices(data: { dices: number[] }): void {
        console.log(`[GameUI] Received my dices:`, data.dices);
        this._myDices = data.dices as Face[];
        this.diceDisplayController?.displayDices(this._myDices);

        // Add history item for dice roll - REMOVED (History logging responsibility moved)
        // if (this.gameHistoryPanel) { ... }
    }

    /**
     * 处理新回合开始的消息
     */
    private handleNewRound(data: {
        roundNumber: number,
        activePlayerIds: string[],
        currentPlayerSessionId: string,
        diceCounts: { [sessionId: string]: number }
    }): void {
        console.log(`[GameUI] Handling new round: ${data.roundNumber}`);
        if (this.roundLabel) this.roundLabel.string = `回合: ${data.roundNumber}`;
        this._myDices = []; // Clear previous dices
        this.diceDisplayController?.clearDices(); // Clear display
        if (this.gameResultPanel?.node.active) this.gameResultPanel.hidePanel(); // Hide previous result

        // Add history item - REMOVED (History logging responsibility moved)
        // if (this.gameHistoryPanel) { ... }
        // State update will handle player displays and turn indicator
    }

    /**
     * 处理轮到下一玩家的消息
     */
    private handleNextTurn(data: { currentPlayerSessionId: string }): void {
        console.log(`[GameUI] Handling next turn. Current player: ${data.currentPlayerSessionId}`);
        this._isMyTurn = data.currentPlayerSessionId === this._sessionId;
        // State update should follow shortly, this is just for quicker UI feedback if needed
        // We rely on handleStateChange to update most UI elements
        // Removed call to non-existent updateTurn
        // if (this.bidController) {
        //      this.bidController.updateTurn(this._isMyTurn);
        // }

        // Add history item if turn passed *without* a bid (e.g. after challenge)
        // We need more context here, maybe rely on state change for history?
    }

    /**
     * 处理其他玩家叫价的广播消息
     */
    private handlePlayerBidUpdate(data: { sessionId: string, value: Face, count: number }): void {
        console.log(`[GameUI] Handling player bid update: ${data.sessionId} bids ${data.count}x${data.value}`);
        this._currentBid = [data.value, data.count]; // Update local cache of current bid

        // Add history item - REMOVED (History logging responsibility moved)
        // if (this.gameHistoryPanel) { ... }
         // State update should follow, rely on handleStateChange for BidController update
         // If state update is slow, could update BidController here:
         // if (this.bidController) {
         //    this.bidController.updateCurrentBid(this._currentBid);
         // }
    }

    /**
     * 处理质疑结果揭示的消息
     */
    private handleChallengeReveal(data: {
        challengerId: string, lastBidderId: string,
        bidValue: Face, bidCount: number,
        allDice: { [sessionId: string]: number[] }, // Changed to number[]
        actualCount: number, useWildOnes: boolean,
        bidCorrect: boolean, loserId: string
    }): void {
        console.log("[GameUI] Handling challenge reveal:", data);

        // Display all revealed dice
        if (this.diceDisplayController) {
            // Need a way to show all dice temporarily
            // this.diceDisplayController.showAllDices(data.allDice);
            // For now, just ensure own dice are correct (already handled by yourDices?)
             this.diceDisplayController.displayDices(this._myDices); // Re-display own dice
        }

        // Add detailed history item - REMOVED (History logging responsibility moved)
        // if (this.gameHistoryPanel) { ... }

        // Update status label temporarily
        if (this.gameStatusLabel) {
             this.gameStatusLabel.string = "质疑结果...";
             this.gameStatusLabel.color = Color.YELLOW;
        }

        // Hide bid controls during reveal/pause
        if (this.bidController) {
            this.bidController.node.active = false;
        }

        // Next round/game end will be triggered by state change after server delay
    }

    /**
     * 处理游戏结束的消息
     */
    private handleGameFinished(data: { winnerSessionId?: string, winnerName?: string }): void {
        console.log("[GameUI] Handling game finished:", data);

        // Disable bid controls
        if (this.bidController) {
            this.bidController.node.active = false;
        }

        // Show result panel
        if (this.gameResultPanel) {
            // Adapt data if necessary (e.g., get full player list from last state)
             const finalState: any = NetworkManager.getInstance().roomState; // Treat last known state as 'any'
             // CONVERT finalState players (likely MapSchema-like) to PlayerData[]
             const playersDataForResult: PlayerData[] = [];
             if (finalState && finalState.players) {
                 try {
                      // Attempt MapSchema-like iteration first
                      finalState.players.forEach((pState: any, sessionId: string) => {
                          playersDataForResult.push({
                              id: sessionId,
                              name: pState.name,
                              isReady: pState.isReady,
                              isAI: pState.isAI,
                              diceCount: pState.diceCount,
                          });
                      });
                 } catch (e) {
                      console.warn("[GameUI] Could not iterate finalState.players like MapSchema, trying Object.entries", e);
                      // Fallback to Object.entries if forEach fails
                      try {
                          Object.entries(finalState.players).forEach(([sessionId, pState]: [string, any]) => {
                               playersDataForResult.push({
                                   id: sessionId,
                                   name: pState.name,
                                   isReady: pState.isReady,
                                   isAI: pState.isAI,
                                   diceCount: pState.diceCount,
                               });
                          });
                      } catch (e2) {
                           console.error("[GameUI] Failed to iterate finalState.players", e2);
                      }
                 }
             }
             // Pass winnerSessionId safely as string | undefined
             this.gameResultPanel.showResult({ winner: data.winnerSessionId ?? '', players: playersDataForResult });
        }

        // Update status label
        if (this.gameStatusLabel) {
            const winnerDisplayName = data.winnerName || (data.winnerSessionId ? `玩家 ${data.winnerSessionId.substring(0,4)}` : "无");
            this.gameStatusLabel.string = `游戏结束! ${winnerDisplayName} 获胜!`;
            this.gameStatusLabel.color = new Color(255, 215, 0, 255); // Gold color
        }
    }

    /**
     * 处理网络断开连接
     */
    private handleDisconnect(code: number): void {
        console.error(`[GameUI] Network disconnected. Code: ${code}`);
        if (!isValid(this.node)) return; // Check if component is still valid
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "网络连接已断开";
            this.gameStatusLabel.color = Color.RED;
        }
        // Optionally show result panel with error/disconnect message?
        // For now, just return to lobby after a delay
        this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
    }

    /**
     * 处理网络错误
     */
    private handleNetworkError(error: NetworkError): void {
        console.error('[GameUI] Network error:', error);
         if (!isValid(this.node)) return;
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = `网络错误: ${error.message}`;
            this.gameStatusLabel.color = Color.RED;
        }
        // Consider returning to lobby on critical errors
        if (error.code !== NetworkErrorCode.SERVER_ERROR) { // Avoid leaving on temporary server issues?
             this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
        }
    }


    // --- UI Action Handlers ---

    /**
     * 处理本地玩家叫价事件 (from BidController)
     */
    private handleLocalPlaceBid(bid: Bid): void {
        console.log(`[GameUI] handleLocalPlaceBid: Sending bid [${bid[0]}, ${bid[1]}]`);
        NetworkManager.getInstance().send('bid', { value: bid[0], count: bid[1] });
        // Temporarily disable controls, server state update will re-enable if necessary
        // Removed call to non-existent updateTurn
        // if (this.bidController) this.bidController.updateTurn(false);
        if (this.gameStatusLabel) this.gameStatusLabel.string = "等待其他玩家...";
    }

    /**
     * 处理本地玩家质疑事件 (from BidController)
     */
    private handleLocalChallenge(): void {
        console.log("[GameUI] handleLocalChallenge: Sending challenge.");
        NetworkManager.getInstance().send('challenge', {});
        // Temporarily disable controls and update status
        // Removed call to non-existent updateTurn
        // if (this.bidController) this.bidController.updateTurn(false);
        if (this.gameStatusLabel) {
             this.gameStatusLabel.string = "质疑中...";
             this.gameStatusLabel.color = Color.YELLOW;
        }
    }

    /**
     * 处理本地玩家开点事件 (from BidController) - IF IMPLEMENTED
     */
    // private handleLocalSpotOn(): void {
    //     console.log("[GameUI] handleLocalSpotOn: Sending spot_on.");
    //     network.send('spot_on', {});
    //     // Temporarily disable controls and update status
    //     // Removed call to non-existent updateTurn
    //     // if (this.bidController) this.bidController.updateTurn(false);
    //     if (this.gameStatusLabel) this.gameStatusLabel.string = "开点中...";
    // }

    /**
     * 处理点数选择按钮点击 (由编辑器配置调用 - Optional, can be handled within BidController)
     */
    // public onBidValueSelect(event: Event, value: string): void {
    //     this.bidController?.onValueSelect(event, value);
    // }

    /**
     * 处理返回大厅请求 (from GameResultPanel)
     */
    private handleBackToLobbyRequested(): void {
        console.log("[GameUI] Back to lobby requested.");
        // Ensure room is left before changing scene
        NetworkManager.getInstance().leaveRoom().finally(() => {
             director.loadScene('LobbyScene');
        });
    }

    /**
     * 更新游戏状态标签 (根据 client interface state)
     * Accepts the state casted to the client-side interface type
     */
    private updateGameStatusLabel(state: LiarDiceRoomStateClient): void { // Use Client Interface type
        if (!this.gameStatusLabel || !this._sessionId) return;

        // activePlayerIds is now string[]
        const currentPlayerId = state.activePlayerIds[state.currentPlayerIndex];
        const isMyTurn = currentPlayerId === this._sessionId;

        if (state.status === 'playing') {
            if (isMyTurn) {
                this.gameStatusLabel.string = "轮到你行动！";
                this.gameStatusLabel.color = new Color(0, 255, 0, 255); // Green
            } else {
                // Removed duplicate declaration, use the outer scoped variable
                 const currentPlayerName = this.playerDisplayController?.getPlayerNameWithAlias(currentPlayerId) || `玩家 ${currentPlayerId?.substring(0, 4) ?? '??'}`;
                this.gameStatusLabel.string = `等待 ${currentPlayerName} 行动...`;
                this.gameStatusLabel.color = Color.WHITE;
            }
        } else if (state.status === 'challenging') {
             this.gameStatusLabel.string = "质疑中...";
             this.gameStatusLabel.color = Color.YELLOW;
        } else if (state.status === 'roundOver') {
             this.gameStatusLabel.string = "回合结束，等待下一轮...";
             this.gameStatusLabel.color = Color.WHITE;
        } else if (state.status === 'finished') {
            // Winner determination might need refinement based on final state
            // Find winner using Object.values for Record
            let winner: PlayerStateClient | undefined = undefined; // Use client interface
             if (state.players) {
                 for (const p of Object.values(state.players)) { // Iterate over values of Record
                     if (p.diceCount > 0) {
                         winner = p;
                         break; // Assuming only one winner
                     }
                 }
             }
            // Safely get winner name, ensure sessionId is a non-empty string before calling alias lookup
            let winnerDisplayName = "无";
            const winnerSessionId = winner?.sessionId; // PlayerStateClient has sessionId
            if (winner && winnerSessionId) { // Check if winner and sessionId are truthy (non-empty string)
                 // Ensure winnerSessionId is definitely a string before passing
                 winnerDisplayName = this.playerDisplayController?.getPlayerNameWithAlias(winnerSessionId) || winner.name || "无";
            }
            this.gameStatusLabel.string = `游戏结束! ${winnerDisplayName} 获胜!`;
            this.gameStatusLabel.color = new Color(255, 215, 0, 255); // Gold
        } else if (state.status === 'waiting') {
             this.gameStatusLabel.string = "游戏尚未开始";
             this.gameStatusLabel.color = Color.WHITE;
        } else {
            this.gameStatusLabel.string = `状态: ${state.status}`; // Fallback
            this.gameStatusLabel.color = Color.WHITE;
        }
    }

    // --- 清理 ---
    onDestroy() {
        console.log("[GameUI] onDestroy called.");
        this.cleanupNetworkListeners(); // Ensure network listeners are removed first

        // Remove BidController listeners
        if (this.bidController && isValid(this.bidController.node, true)) {
            this.bidController.node.off('place-bid', this.handleLocalPlaceBid, this);
            this.bidController.node.off('challenge', this.handleLocalChallenge, this);
            // this.bidController.node.off('spot-on', this.handleLocalSpotOn, this);
        }

        // Remove ResultPanel listeners
        if (this.gameResultPanel && isValid(this.gameResultPanel.node, true)) {
            this.gameResultPanel.node.off('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
        }
    }
}
