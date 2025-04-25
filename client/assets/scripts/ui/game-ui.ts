import { _decorator, Component, Node, Label, Color, Event, Button, director, isValid } from 'cc'; // Import director and isValid
import { network } from '../core/network';
import { LoginManager } from '../core/login-manager';
import { PlayerDisplayController } from './player-display-controller';
import { BidController } from './bid-controller';
import { GameStateManager, GameStateData, PlayerData as GameStatePlayerData } from '../core/game-state-manager';
import { Bid, Face } from '../../../../shared/protocols/game-types.d';
import { DiceDisplayController } from './dice-display-controller';
import { GameHistoryPanel } from './game-history-panel';
import { GameResultPanel } from './game-result-panel';
import { BidValidator } from '../utils/bid-validator';

const { ccclass, property } = _decorator;

/**
 * 游戏UI主控制器
 * 负责协调各个UI组件和处理网络事件
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
    private _gameId: string = '';
    private _playerId: string = '';
    private gameStateManager: GameStateManager = GameStateManager.instance;

    // --- Network Listener Callbacks ---
    private _onStateUpdateCallback = (data: any) => this.updateGameState(data);
    private _onDiceRollCallback = (data: any) => this.onDiceRollResult(data);
    private _onGameEndCallback = (data: any) => this.onGameEnd(data);
    private _onChallengeResultCallback = (data: any) => this.onChallengeResult(data); // 新增回调

    // --- GameStateManager Event Handlers ---
    private _onDicesUpdatedCallback = (data: { dices: Face[] }) => this.handleDicesUpdated(data);

    onLoad() {
        console.log("[GameUI] onLoad called.");
        this.listenToGameEvents();
        this.listenToBidControllerEvents();
        this.listenToResultPanelEvents(); // Add listener for result panel
    }

    start() {
        console.log("[GameUI] start called.");
        this.initUI();

        this._playerId = LoginManager.currentPlayerId || '';
        if (!this._playerId) {
            console.error("[GameUI] Failed to get player ID from LoginManager!");
            return;
        }
        console.log(`[GameUI] Current Player ID: ${this._playerId}`);

        // 初始化 GameStateManager
        this.gameStateManager.initialize(this._playerId);

        // 初始化子控制器
        if (this.playerDisplayController) {
            this.playerDisplayController.initialize(this._playerId);
        } else {
            console.error("[GameUI] PlayerDisplayController is not assigned!");
        }

        // 请求初始游戏状态
        const gameId = (window as any).__CURRENT_GAME_ID;
        if (gameId) {
            this._gameId = gameId;
            this.requestInitialGameState();
        } else {
            console.error('[GameUI] 未获取到 gameId，无法请求初始游戏状态');
            if (this.gameStatusLabel) this.gameStatusLabel.string = "错误：无法加入游戏";
        }
    }

    /**
     * 初始化UI元素状态
     */
    private initUI(): void {
        if (this.gameStatusLabel) this.gameStatusLabel.string = "连接中...";
        if (this.roundLabel) this.roundLabel.string = "回合: 0";
        if (this.gameResultPanel) this.gameResultPanel.hidePanel();
    }

    /**
     * 请求初始游戏状态
     */
    private requestInitialGameState(): void {
        if (!this._gameId) return;
        network.request('getInitialGameState', { gameId: this._gameId })
            .then((response) => {
                if (response.success) {
                    console.log('[GameUI] getInitialGameState success:', response);

                    // 使用 getInitialGameState 返回的状态来初始化UI
                    if (response.state) {
                        // this.gameStateManager.updateGameState(response.state as GameStateData); // GameStateManager 仍然可以存储，但UI更新由此触发
                        this.updateGameState(response.state as GameStateData); // 直接调用UI更新
                    }

                    // 显示自己的骰子 (私有信息，需要保留)
                    if (response.dices) {
                        this.gameStateManager.updatePlayerDices(response.dices);
                    }

                    // 不在这里初始化BidController，避免重复初始化
                    // BidController将在updateGameState方法中初始化和更新
                    if (!this.bidController) {
                        console.error("[GameUI] BidController is not assigned!");
                    }
                } else {
                    console.error('[GameUI] getInitialGameState failed:', response.error);
                    if (this.gameStatusLabel) this.gameStatusLabel.string = `错误: ${response.error}`;
                }
            })
            .catch((error) => {
                console.error('[GameUI] getInitialGameState error:', error);
                if (this.gameStatusLabel) this.gameStatusLabel.string = "错误: 无法获取游戏状态";
            });
    }

    /**
     * 监听网络游戏事件
     */
    private listenToGameEvents(): void {
        console.log("[GameUI] listenToGameEvents: Registering network listeners.");
        network.on('game:state_update', this._onStateUpdateCallback);
        network.on('game:dice_roll', this._onDiceRollCallback);
        // network.on('game:game_end', this._onGameEndCallback); // GameUI 监听 NetworkManager 内部事件
        network.on('game:game_end', this._onGameEndCallback); // 确保监听 NetworkManager 内部发出的事件
        network.on('game:challenge_result', this._onChallengeResultCallback); // 新增监听

        // 监听 GameStateManager 的骰子更新事件
        this.gameStateManager.on('dices-updated', this._onDicesUpdatedCallback);
    }

    /**
     * 监听来自 BidController 的事件
     */
    private listenToBidControllerEvents(): void {
        if (this.bidController) {
            console.log("[GameUI] listenToBidControllerEvents: Registering BidController listeners.");
            this.bidController.node.on('place-bid', this.handlePlaceBid, this);
            this.bidController.node.on('challenge', this.handleChallenge, this);
            this.bidController.node.on('spot-on', this.handleSpotOn, this);
        } else {
            console.warn("[GameUI] BidController not available on Load for event listening.");
        }
    }

    /**
     * 监听来自 GameResultPanel 的事件
     */
    private listenToResultPanelEvents(): void {
        if (this.gameResultPanel) {
            console.log("[GameUI] listenToResultPanelEvents: Registering ResultPanel listeners.");
            this.gameResultPanel.node.on('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
        } else {
            // GameResultPanel might not be assigned yet in onLoad, try again in start
            this.scheduleOnce(() => {
                if (this.gameResultPanel) {
                    console.log("[GameUI] listenToResultPanelEvents (delayed): Registering ResultPanel listeners.");
                    this.gameResultPanel.node.on('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
                } else {
                     console.error("[GameUI] GameResultPanel is still not assigned after delay!");
                }
            });
        }
    }


    /**
     * 更新游戏状态
     * @param data 游戏状态数据
     */
    private updateGameState(data: any): void {
        console.log("[GameUI] updateGameState called.");
        console.log(`[GameUI] 游戏状态数据: ${JSON.stringify(data)}`);
        console.log(`[GameUI] 当前玩家ID: ${this._playerId}`);

        // 如果此为首次状态更新，添加游戏开始的历史记录
        const prevState = this.gameStateManager.currentState;
        if (!prevState || (prevState.roundNumber !== data.roundNumber)) {
            // 添加回合开始的历史记录
            this.gameStateManager.addHistoryItem({
                id: `round_start_${data.roundNumber}_${Date.now()}`,
                text: `回合 ${data.roundNumber} 开始`,
                timestamp: Date.now(),
                type: 'system'
            });
        }

        // 1. 更新玩家显示和计算总骰子数
        let totalDiceInGame = 0;
        let currentPlayerName = '';
        if (data.players && Array.isArray(data.players)) {
            totalDiceInGame = data.players.reduce((sum: number, p: GameStatePlayerData) => sum + p.diceCount, 0);
            const currentPlayerId = data.activePlayers ? data.activePlayers[data.currentPlayerIndex] : undefined;
            console.log(`[GameUI] 当前活跃玩家: ${currentPlayerId}, 活跃玩家列表: ${JSON.stringify(data.activePlayers)}, 当前玩家索引: ${data.currentPlayerIndex}`);

            // 获取当前玩家名称，用于历史记录
            if (currentPlayerId) {
                const currentPlayer = data.players.find((p: GameStatePlayerData) => p.id === currentPlayerId);
                if (currentPlayer) {
                    currentPlayerName = currentPlayer.name;
                }
            }

            // 检查是否存在新的出价，如果存在则添加到历史
            // Case 1: Subsequent bid (prevState exists and bid changed)
            if (prevState &&
                (prevState.currentBid[0] !== data.currentBid[0] ||
                 prevState.currentBid[1] !== data.currentBid[1]) &&
                data.currentBid[1] > 0) {
                // 查找上一个出价玩家 (the one whose turn just ended)
                const prevPlayerIndex = (data.currentPlayerIndex - 1 + data.activePlayers.length) % data.activePlayers.length;
                const prevPlayerId = data.activePlayers[prevPlayerIndex];
                const prevPlayer = data.players.find((p: GameStatePlayerData) => p.id === prevPlayerId);

                if (prevPlayer) {
                    // 添加出价历史
                    this.gameStateManager.addBidHistory(prevPlayerId, data.currentBid as Bid, prevPlayer.name);
                }
            }
            // Case 2: Initial bid (prevState is null, but current state has a bid)
            else if (!prevState && data.currentBid && data.currentBid[1] > 0) {
                 // 查找做出这个初始出价的玩家 (通常是 currentPlayerIndex - 1)
                 // 注意：如果 moveNumber 是 1，则出价者是 currentPlayerIndex 为 0 的玩家
                 let bidderPlayerId = '';
                 let bidderPlayer = null;
                 if (data.moveNumber === 1 && data.activePlayers.length > 0) {
                     bidderPlayerId = data.activePlayers[0]; // First player made the first bid
                     bidderPlayer = data.players.find((p: GameStatePlayerData) => p.id === bidderPlayerId);
                 } else if (data.activePlayers.length > 0) {
                     // Fallback for other scenarios, assume previous player made the bid
                     const prevPlayerIndex = (data.currentPlayerIndex - 1 + data.activePlayers.length) % data.activePlayers.length;
                     bidderPlayerId = data.activePlayers[prevPlayerIndex];
                     bidderPlayer = data.players.find((p: GameStatePlayerData) => p.id === bidderPlayerId);
                 }


                 if (bidderPlayer) {
                     console.log(`[GameUI] Adding initial bid history: Player ${bidderPlayer.name} bid ${data.currentBid[1]}x${data.currentBid[0]}`);
                     this.gameStateManager.addBidHistory(bidderPlayerId, data.currentBid as Bid, bidderPlayer.name);
                 } else {
                     console.warn("[GameUI] Could not determine bidder for initial bid history.");
                 }
            }

            this.playerDisplayController?.updatePlayerDisplays(data.players, currentPlayerId);
        }

        // 2. 计算当前是否是玩家回合
        const isMyTurn = data.activePlayers &&
            data.currentPlayerIndex !== undefined &&
            data.activePlayers[data.currentPlayerIndex] === this._playerId;
        console.log(`[GameUI] 是否是玩家回合: ${isMyTurn}`);
        console.log(`[GameUI] 回合判断详情: activePlayers=${JSON.stringify(data.activePlayers)}, currentPlayerIndex=${data.currentPlayerIndex}, 当前玩家ID=${this._playerId}`);
        if (data.activePlayers && data.currentPlayerIndex !== undefined) {
            console.log(`[GameUI] 当前活跃玩家ID: ${data.activePlayers[data.currentPlayerIndex]}`);
        }

        // 强制设置为玩家回合，仅用于测试
        // const isMyTurn = true;

        // 3. 获取当前叫价
        let currentBid: Bid | [0, 0] = [0, 0];
        if (data.currentBid && Array.isArray(data.currentBid) && data.currentBid.length === 2) {
            const rawValue = data.currentBid[0];
            if (BidValidator.validFace(rawValue)) {
                currentBid = [rawValue, data.currentBid[1]];
            }
        }

        // 4. 更新或初始化 BidController 状态
        if (this.bidController) {
            // 确保BidController节点是激活的
            if (!this.bidController.node.active) {
                console.log(`[GameUI] updateGameState: BidController节点不活跃，正在激活`);
                this.bidController.node.active = true;
            }

            // 检查BidController的父节点
            let parent: Node | null = this.bidController.node.parent;
            while (parent) {
                if (!parent.active) {
                    console.log(`[GameUI] updateGameState: BidController的父节点 ${parent.name} 不可见，正在设置为可见`);
                    parent.active = true;
                }
                parent = parent.parent;
            }

            // 判断是否需要初始化BidController
            // 使用BidController内部状态来判断而不是通过emit
            const totalDiceInitialized = this.bidController['_totalDiceInGame'] || 0;
            const isInitialized = totalDiceInitialized > 0;
            console.log(`[GameUI] BidController是否已初始化: ${isInitialized}, 当前总骰子数: ${totalDiceInitialized}`);

            if (!isInitialized) {
                console.log(`[GameUI] 初始化BidController，总骰子数: ${totalDiceInGame}`);
                this.bidController.initialize(totalDiceInGame);
            }

            console.log(`[GameUI] 调用bidController.updateState: isMyTurn=${isMyTurn}, currentBid=${JSON.stringify(currentBid)}, totalDiceInGame=${totalDiceInGame}`);
            this.bidController.updateState(isMyTurn, currentBid, totalDiceInGame);

            // 检查BidController中关键节点的状态
            console.log(`[GameUI] BidController状态检查:`);
            console.log(`- bidController.node.active: ${this.bidController.node.active}`);
            console.log(`- bidController.node.activeInHierarchy: ${this.bidController.node.activeInHierarchy}`);

            // 强制设置点数选择器和数量选择器的可见性
            if (isMyTurn) {
            }

            // 使用scheduleOnce延迟检查，确保updateState内部的状态更新已完成
            // Note: Removed the forceShowUIElements call as the method was removed from BidController
            this.scheduleOnce(() => {
                if (this.bidController) {
                    console.log(`[GameUI] BidController延迟状态检查:`);
                    console.log(`- bidController.node.active: ${this.bidController.node.active}`);
                    console.log(`- bidController.node.activeInHierarchy: ${this.bidController.node.activeInHierarchy}`);
                }
            }, 0.1);
        }

        // 5. 更新回合信息
        if (this.roundLabel && data.roundNumber !== undefined) {
            this.roundLabel.string = `回合: ${data.roundNumber}`;
        }

        // 6. 更新游戏状态标签
        this.updateGameStatusLabel(isMyTurn, data);

        // 7. 更新 GameStateManager 中的状态 (确保 prevState 在下次调用时是正确的)
        this.gameStateManager.updateGameState(data as GameStateData);
    }

    /**
     * 更新游戏状态标签
     * @param isMyTurn 是否是当前玩家的回合
     * @param data 游戏状态数据
     */
    private updateGameStatusLabel(isMyTurn: boolean, data: any): void {
        if (!this.gameStatusLabel) return;

        if (isMyTurn) {
            this.gameStatusLabel.string = "轮到你行动！";
            this.gameStatusLabel.color = new Color(0, 255, 0, 255);
        } else if (data.status === "playing" && data.activePlayers && data.currentPlayerIndex !== undefined) {
            const currentPlayerId = data.activePlayers[data.currentPlayerIndex];
            const currentPlayerName = this.playerDisplayController?.getPlayerNameWithAlias(currentPlayerId) || `玩家 ${currentPlayerId.substring(0, 4)}`;
            this.gameStatusLabel.string = `等待 ${currentPlayerName} 行动...`;
            this.gameStatusLabel.color = Color.WHITE;
        } else if (data.status === "finished" && data.winner) {
            const winnerName = this.playerDisplayController?.getPlayerNameWithAlias(data.winner) || `玩家 ${data.winner.substring(0, 4)}`;
            this.gameStatusLabel.string = `游戏结束! ${winnerName}获胜!`;
            this.gameStatusLabel.color = Color.WHITE;
        } else {
            this.gameStatusLabel.string = "等待中...";
            this.gameStatusLabel.color = Color.WHITE;
        }
    }

    /**
     * 骰子摇动结果处理
     * @param data 骰子结果数据 { playerId: string, dices: Face[] }
     */
    private onDiceRollResult(data: { playerId: string, dices: Face[] }): void {
        console.log("[GameUI] onDiceRollResult called. Data:", JSON.stringify(data));
        if (data.playerId === this._playerId) {
            console.log("[GameUI] onDiceRollResult: Received dice result for myself.");
            this.gameStateManager.updatePlayerDices(data.dices);
        }
    }

    /**
     * 处理 GameStateManager 的骰子更新事件
     * @param data 事件数据 { dices: Face[] }
     */
    private handleDicesUpdated(data: { dices: Face[] }): void {
        console.log("[GameUI] handleDicesUpdated called. Dices:", JSON.stringify(data.dices));
        this.diceDisplayController?.displayDices(data.dices);
    }

    /**
     * 质疑结果处理
     * @param data 质疑结果数据
     */
    private onChallengeResult(data: any): void {
        console.log("[GameUI] onChallengeResult:", data);
        // 收到质疑结果后，状态标签的更新会由后续的 game:state_update 处理
        // 这里可以添加一些额外的处理逻辑，比如播放音效或显示提示
        // 但主要目的是确保不再停留在 "质疑中..."
        // 可以在这里临时更新一下状态，避免在 state_update 到来前一直显示质疑中
        if (this.gameStatusLabel && this.gameStatusLabel.string === "质疑中...") {
             this.gameStatusLabel.string = "等待下一回合...";
             this.gameStatusLabel.color = Color.WHITE;
        }
        // 可以在这里添加质疑结果的历史记录，如果需要更详细的信息
        // 例如：
        // const currentGameState = this.gameStateManager.currentState;
        // if (currentGameState && data.challengerId && data.challengedPlayerId) {
        //     const challenger = currentGameState.players.find(p => p.id === data.challengerId);
        //     const challengedPlayer = currentGameState.players.find(p => p.id === data.challengedPlayerId);
        //     const loser = currentGameState.players.find(p => p.id === data.loserId);
        //     const challengerName = challenger ? challenger.name : '未知玩家';
        //     const challengedPlayerName = challengedPlayer ? challengedPlayer.name : '未知玩家';
        //     const loserName = loser ? loser.name : '未知玩家';
        //     const resultText = data.valid ? `${challengedPlayerName} 的叫价有效，${challengerName} 失败` : `${challengedPlayerName} 的叫价无效，${challengedPlayerName} 失败`;

        //     this.gameStateManager.addHistoryItem({
        //         id: `challenge_result_${data.challengerId}_${Date.now()}`,
        //         text: `质疑结果: ${resultText}。 ${loserName} 失去一个骰子。`,
        //         timestamp: Date.now(),
        //         type: 'challenge_result',
        //     });
        // }
    }

    /**
     * 游戏结束处理
     * @param data 游戏结束数据 { winner, players }
     */
    private onGameEnd(data: any): void {
        console.log("[GameUI] onGameEnd:", data);

        // 不再隐藏整个bidController节点，而是通知bidController游戏结束
        if (this.bidController) {
            // 调用bidController的方法来处理游戏结束状态
            this.bidController.updateState(false, [0, 0], 0);

            // 禁用所有按钮
            const buttons = this.bidController.node.getComponentsInChildren(Button);
            buttons.forEach(button => {
                if (button instanceof Button) {
                    button.interactable = false;
                }
            });
        }

        // --- 检查 ResultPanel 及其父节点状态 ---
        if (this.gameResultPanel) {
            console.log(`[GameUI] Checking ResultPanel hierarchy before showing:`);
            let currentNode: Node | null = this.gameResultPanel.node;
            let depth = 0;
            while (currentNode && depth < 10) { // Limit depth to prevent infinite loops
                console.log(`- Node: ${currentNode.name}, Active: ${currentNode.active}, ActiveInHierarchy: ${currentNode.activeInHierarchy}`);
                if (currentNode.name === 'Canvas') break; // Stop at Canvas
                currentNode = currentNode.parent;
                depth++;
            }
        } else {
             console.error("[GameUI] gameResultPanel is null in onGameEnd!");
        }
        // --- 检查结束 ---


        // 显示游戏结果面板
        this.gameResultPanel?.showResult(data);

        // 更新最终状态标签
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = `游戏结束!`;
            this.gameStatusLabel.color = new Color(255, 215, 0, 255);
        }
    }

    // --- 处理来自 BidController 的事件 ---

    /**
     * 处理叫价请求
     * @param bid [Face, number]
     */
    private async handlePlaceBid(bid: Bid): Promise<void> {
        console.log(`[GameUI] handlePlaceBid: Received bid [${bid[0]}, ${bid[1]}]`);
        try {
            await network.placeBid(this._gameId, this._playerId, bid);
            console.log("[GameUI] handlePlaceBid: placeBid network request sent.");
        } catch (error) {
            console.error("[GameUI] placeBid failed:", error);
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `叫价失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = Color.RED;
            }
            // 重新启用 BidController 的交互
            const isMyTurn = this.gameStateManager.isPlayerTurn;
            const currentBid = this.gameStateManager.currentBid;
            const totalDice = this.gameStateManager.totalDiceCount;
            this.bidController?.updateState(isMyTurn, currentBid, totalDice);
        }
    }

    /**
     * 处理质疑请求
     */
    private async handleChallenge(): Promise<void> {
        console.log("[GameUI] handleChallenge: Received challenge request.");
        try {
            await network.challenge(this._gameId, this._playerId);
            console.log("[GameUI] handleChallenge: challenge network request sent.");
            if (this.gameStatusLabel) this.gameStatusLabel.string = "质疑中...";

            // 添加质疑的历史记录
            const currentGameState = this.gameStateManager.currentState;
            if (currentGameState) {
                const challenger = currentGameState.players.find(p => p.id === this._playerId);
                const challengerName = challenger ? challenger.name : '未知玩家';

                // 找到被质疑的玩家（上一个出价的玩家）
                const prevPlayerIndex = (currentGameState.currentPlayerIndex - 1 + currentGameState.activePlayers.length) % currentGameState.activePlayers.length;
                const prevPlayerId = currentGameState.activePlayers[prevPlayerIndex];
                const prevPlayer = currentGameState.players.find(p => p.id === prevPlayerId);
                const prevPlayerName = prevPlayer ? prevPlayer.name : '未知玩家';

                // 添加简单记录，结果将在服务器回应后更新
                this.gameStateManager.addHistoryItem({
                    id: `challenge_${this._playerId}_${Date.now()}`,
                    text: `${challengerName} 质疑了 ${prevPlayerName} 的出价`,
                    timestamp: Date.now(),
                    type: 'challenge',
                    playerId: this._playerId
                });
            }
        } catch (error) {
            console.error("[GameUI] challenge failed:", error);
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `质疑失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = Color.RED;
            }
            // 恢复 BidController 状态
            const isMyTurn = this.gameStateManager.isPlayerTurn;
            const currentBid = this.gameStateManager.currentBid;
            const totalDice = this.gameStateManager.totalDiceCount;
            this.bidController?.updateState(isMyTurn, currentBid, totalDice);
        }
    }

    /**
     * 处理开点请求
     */
    private async handleSpotOn(): Promise<void> {
        console.log("[GameUI] handleSpotOn: Received spot-on request.");
        try {
            await network.spotOn(this._gameId, this._playerId);
            console.log("[GameUI] handleSpotOn: spotOn network request sent.");
            if (this.gameStatusLabel) this.gameStatusLabel.string = "开点中...";

            // 添加开点的历史记录
            const currentGameState = this.gameStateManager.currentState;
            if (currentGameState) {
                const player = currentGameState.players.find(p => p.id === this._playerId);
                const playerName = player ? player.name : '未知玩家';

                this.gameStateManager.addHistoryItem({
                    id: `spot_on_${this._playerId}_${Date.now()}`,
                    text: `${playerName} 选择了开点`,
                    timestamp: Date.now(),
                    type: 'spot_on',
                    playerId: this._playerId
                });
            }
        } catch (error) {
            console.error("[GameUI] spotOn failed:", error);
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `开点失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = Color.RED;
            }
            // 恢复 BidController 状态
            const isMyTurn = this.gameStateManager.isPlayerTurn;
            const currentBid = this.gameStateManager.currentBid;
            const totalDice = this.gameStateManager.totalDiceCount;
            this.bidController?.updateState(isMyTurn, currentBid, totalDice);
        }
    }

    /**
     * 处理点数选择按钮点击 (由编辑器配置调用)
     * @param event
     * @param value "1" 到 "6"
     */
    public onBidValueSelect(event: Event, value: string): void {
        // 将事件转发给 BidController 处理
        this.bidController?.onValueSelect(event, value);
    }

    /**
     * 处理返回大厅请求
     */
    private handleBackToLobbyRequested(): void {
        console.log("[GameUI] handleBackToLobbyRequested: Returning to LobbyScene.");
        // 在切换场景前可以做一些清理工作，比如断开游戏相关的网络监听或重置状态
        // network.leaveRoom(); // Consider if leaving the room is necessary here or handled elsewhere
        director.loadScene('LobbyScene');
    }

    // --- 清理 ---
    onDestroy() {
        console.log("[GameUI] onDestroy called.");

        // 移除 BidController 事件监听 (使用 isValid 检查) - 移到前面
        if (this.bidController && isValid(this.bidController.node, true)) {
            this.bidController.node.off('place-bid', this.handlePlaceBid, this);
            this.bidController.node.off('challenge', this.handleChallenge, this);
            this.bidController.node.off('spot-on', this.handleSpotOn, this);
        }

        // 移除 GameStateManager 事件监听 (添加检查) - 移到前面
        if (this.gameStateManager && typeof this.gameStateManager.off === 'function') {
            this.gameStateManager.off('dices-updated', this._onDicesUpdatedCallback);
        }

        // 移除 ResultPanel 事件监听 (使用 isValid 检查) - 移到前面
        if (this.gameResultPanel && isValid(this.gameResultPanel.node, true)) {
            this.gameResultPanel.node.off('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
        }

        // 最后清理网络监听器
        this.cleanupNetworkListeners();
    }

    private cleanupNetworkListeners(): void {
        console.log("[GameUI] Cleaning up network listeners.");
        // Check if network and its properties/methods are valid before calling off
        if (network && typeof network.off === 'function') {
             // Pass callbacks directly. Rely on try-catch in NetworkManager.off for SocketAdapter issues.
             // Ensure callbacks themselves are still assigned, though less likely to be the issue.
             if (this._onStateUpdateCallback) network.off('game:state_update', this._onStateUpdateCallback);
             if (this._onDiceRollCallback) network.off('game:dice_roll', this._onDiceRollCallback);
             if (this._onGameEndCallback) network.off('game:game_end', this._onGameEndCallback);
             if (this._onChallengeResultCallback) network.off('game:challenge_result', this._onChallengeResultCallback);
        } else {
            console.warn("[GameUI] Network instance or network.off is not available during cleanup.");
        }
    }
}
