import { EventTarget } from 'cc';
import { Bid, Face } from '../../../../shared/protocols/game-types.d';
// Import network instance
import { network } from './network';

// Define the expected payload structure for game:challenge_result
// (Adjust based on actual server implementation if different)
interface ChallengeResultPayload {
    challengerId: string;
    challengedId: string;
    bid: Bid; // The bid that was challenged
    isValid: boolean; // Whether the bid was valid (true) or invalid (false) -> challenge failed/succeeded
    actualCount: number; // The actual count of the bid value (including wilds if applicable)
    allDice?: { [playerId: string]: Face[] }; // Optional: might be sent by server
    loserId: string; // Who lost the die
    // Player names might be sent, or we look them up
    challengerName?: string;
    challengedName?: string;
}


// 历史记录项类型
export interface HistoryItem {
    id: string;
    text: string;
    timestamp: number;
    type: 'bid' | 'challenge' | 'spot_on' | 'system';
    playerId?: string;
}

// 游戏状态类型
export interface GameStateData {
    gameId: string;
    players: PlayerData[];
    activePlayers: string[];
    currentPlayerIndex: number;
    currentBid: Bid | [0, 0];
    roundNumber: number;
    moveNumber: number;
    status: "waiting" | "playing" | "finished";
    winner?: string;
}

// 玩家数据类型
export interface PlayerData {
    id: string;
    name: string;
    diceCount: number;
}

/**
 * 游戏状态管理器
 * 负责管理游戏状态和历史记录，确保所有客户端状态同步
 */
export class GameStateManager extends EventTarget {
    private static _instance: GameStateManager;

    // 游戏状态
    private _gameState: GameStateData | null = null;

    // 历史记录
    private _historyItems: HistoryItem[] = [];

    // 当前玩家ID
    private _currentPlayerId: string = '';

    // 当前玩家骰子
    private _playerDices: Face[] = [];
    
    /**
     * 获取当前游戏状态
     */
    public get currentState(): GameStateData | null {
        return this._gameState;
    }

    /**
     * 获取单例实例
     */
    public static get instance(): GameStateManager {
        if (!this._instance) {
            this._instance = new GameStateManager();
        }
        return this._instance;
    }

    /**
     * 私有构造函数，确保单例
     */
    private constructor() {
        super();
        // Add listener for challenge results from NetworkManager
        network.on('game:challenge_result', this.handleChallengeResult.bind(this));
        console.log("[GameStateManager] Constructor: Registered listener for 'game:challenge_result'");
    }

    // Add the event handler method
    private handleChallengeResult(data: ChallengeResultPayload): void {
        console.log("[GameStateManager] handleChallengeResult received data:", JSON.stringify(data)); // Log the full received data

        // --- DEBUGGING: Log the bid from the event data ---
        console.log(`[GameStateManager] handleChallengeResult: Received bid from event data:`, data?.bid, `Type: ${typeof data?.bid}`, `IsArray: ${Array.isArray(data?.bid)}`);
        // --- END DEBUGGING ---

        if (!this._gameState) {
            console.error("[GameStateManager] Cannot process challenge result: game state is null.");
            return;
        }

        const { challengerId, challengedId, bid, isValid, actualCount } = data;

        // Find player names from current game state
        const challenger = this._gameState.players.find(p => p.id === challengerId);
        const challenged = this._gameState.players.find(p => p.id === challengedId);

        if (!challenger || !challenged) {
            console.error("[GameStateManager] Cannot find challenger or challenged player in game state.");
            return;
        }

        // Determine if the challenge was successful from the challenger's perspective
        // addChallengeHistory expects 'valid' to mean "challenge succeeded" (bid was invalid)
        const challengeSucceeded = !isValid; // If bid was NOT valid, challenge succeeded

        this.addChallengeHistory(
            challengerId,
            challengedId,
            challengeSucceeded, // Pass whether the challenge succeeded
            actualCount,
            challenger.name,
            challenged.name,
            bid
        );
    }


    /**
     * 初始化游戏状态管理器
     * @param playerId 当前玩家ID
     */
    public initialize(playerId: string): void {
        this._currentPlayerId = playerId;
        this._historyItems = [];
        this._gameState = null;
        this._playerDices = [];
    }

    /**
     * 更新游戏状态
     * @param stateData 游戏状态数据
     */
    public updateGameState(stateData: GameStateData): void {
        const prevState = this._gameState;
        this._gameState = stateData;

        // 触发状态更新事件
        this.emit('state-updated', {
            prevState,
            currentState: stateData
        });
    }

    /**
     * 添加历史记录
     * @param item 历史记录项
     */
    public addHistoryItem(item: HistoryItem): void {
        // 检查是否已存在相同ID的历史记录
        const existingIndex = this._historyItems.findIndex(h => h.id === item.id);
        if (existingIndex >= 0) {
            // 如果已存在，更新而不是添加
            this._historyItems[existingIndex] = item;
        } else {
            // 添加新的历史记录
            this._historyItems.push(item);
        }

        // 限制历史记录数量
        if (this._historyItems.length > 100) {
            this._historyItems.shift();
        }

        // 触发历史记录更新事件
        this.emit('history-updated', {
            items: this._historyItems,
            newItem: item
        });
    }

    /**
     * 添加竞价历史记录
     * @param playerId 玩家ID
     * @param bid 竞价
     * @param playerName 玩家名称
     */
    public addBidHistory(playerId: string, bid: Bid, playerName: string): void {
        // --- DEBUGGING: Log the received bid value and type ---
        console.log(`[GameStateManager] addBidHistory called for player ${playerName} (${playerId}). Received bid:`, bid, `Type: ${typeof bid}`, `IsArray: ${Array.isArray(bid)}`);

        // Defensive check before destructuring
        if (!Array.isArray(bid) || bid.length !== 2) {
            console.error(`[GameStateManager] addBidHistory received invalid bid format. Expected [value, count], got:`, bid);
            // Optionally add a generic history item indicating an error
            this.addSystemHistory(`错误：处理 ${playerName} 的出价时遇到问题。`);
            return; // Prevent the TypeError
        }
        // --- END DEBUGGING ---

        const [value, count] = bid; // Destructuring should be safe now
        const faceLabel = this.getFaceLabel(value as Face);

        this.addHistoryItem({
            id: `bid_${playerId}_${Date.now()}`,
            text: `${playerName} 出价: ${count}个 ${faceLabel}`,
            timestamp: Date.now(),
            type: 'bid',
            playerId
        });
    }

    /**
     * 添加质疑历史记录
     * @param challengerId 质疑者ID
     * @param challengedId 被质疑者ID
     * @param valid 质疑是否有效
     * @param totalCount 实际骰子数量
     * @param challengerName 质疑者名称
     * @param challengedName 被质疑者名称
     * @param bid 当前竞价
     */
    public addChallengeHistory(
        challengerId: string,
        challengedId: string,
        valid: boolean,
        totalCount: number,
        challengerName: string,
        challengedName: string,
        bid: Bid | [0, 0]
    ): void {
        // --- DEBUGGING: Log the bid parameter received by this function ---
        console.log(`[GameStateManager] addChallengeHistory called. Received bid parameter:`, bid, `Type: ${typeof bid}`, `IsArray: ${Array.isArray(bid)}`);

        // Defensive check before destructuring
        if (!Array.isArray(bid) || bid.length !== 2) {
            console.error(`[GameStateManager] addChallengeHistory received invalid bid format. Expected [value, count], got:`, bid);
            this.addSystemHistory(`错误：处理挑战结果时遇到无效的出价数据。`);
            return; // Prevent the TypeError
        }
        // --- END DEBUGGING ---

        const [value, count] = bid; // Destructuring should be safe now
        const faceLabel = this.getFaceLabel(value as Face);

        let resultText = "";

        if (valid) { // 质疑成功 (对方叫大了)
            resultText = `${challengerName} 质疑 ${challengedName} (${count}个${faceLabel}) 成功! 实际数量: ${totalCount}`;
        } else { // 质疑失败 (对方没叫大)
            resultText = `${challengerName} 质疑 ${challengedName} (${count}个${faceLabel}) 失败! 实际数量: ${totalCount}`;
        }

        this.addHistoryItem({
            id: `challenge_${challengerId}_${Date.now()}`,
            text: resultText,
            timestamp: Date.now(),
            type: 'challenge',
            playerId: challengerId
        });
    }

    /**
     * 添加即时喊历史记录
     * @param playerId 玩家ID
     * @param valid 即时喊是否有效
     * @param totalCount 实际骰子数量
     * @param playerName 玩家名称
     * @param bid 当前竞价
     */
    public addSpotOnHistory(
        playerId: string,
        valid: boolean,
        totalCount: number,
        playerName: string,
        bid: Bid | [0, 0]
    ): void {
        const [value, count] = bid;
        const faceLabel = this.getFaceLabel(value as Face);

        let resultText = "";

        if (valid) { // 开点成功
            resultText = `${playerName} 开点 (${count}个${faceLabel}) 正确! 实际数量: ${totalCount}`;
        } else { // 开点失败
            resultText = `${playerName} 开点 (${count}个${faceLabel}) 错误! 实际数量: ${totalCount}`;
        }

        this.addHistoryItem({
            id: `spot_on_${playerId}_${Date.now()}`,
            text: resultText,
            timestamp: Date.now(),
            type: 'spot_on',
            playerId
        });
    }

    /**
     * 添加系统历史记录
     * @param text 系统消息文本
     */
    public addSystemHistory(text: string): void {
        this.addHistoryItem({
            id: `system_${Date.now()}`,
            text,
            timestamp: Date.now(),
            type: 'system'
        });
    }

    /**
     * 更新玩家骰子
     * @param dices 骰子数组
     */
    public updatePlayerDices(dices: Face[]): void {
        this._playerDices = dices;
        this.emit('dices-updated', { dices });
    }

    /**
     * 获取当前游戏状态
     */
    public get gameState(): GameStateData | null {
        return this._gameState;
    }

    /**
     * 获取历史记录
     */
    public get historyItems(): HistoryItem[] {
        return [...this._historyItems];
    }

    /**
     * 获取当前玩家ID
     */
    public get currentPlayerId(): string {
        return this._currentPlayerId;
    }

    /**
     * 获取当前玩家骰子
     */
    public get playerDices(): Face[] {
        return [...this._playerDices];
    }

    /**
     * 判断当前是否是玩家的回合
     */
    public get isPlayerTurn(): boolean {
        if (!this._gameState) {
            console.log(`[GameStateManager] isPlayerTurn: 游戏状态为空，返回false`);
            return false;
        }

        const isMyTurn = this._gameState.activePlayers &&
            this._gameState.currentPlayerIndex !== undefined &&
            this._gameState.activePlayers[this._gameState.currentPlayerIndex] === this._currentPlayerId;

        console.log(`[GameStateManager] isPlayerTurn: 当前玩家ID=${this._currentPlayerId}, 活跃玩家列表=${JSON.stringify(this._gameState.activePlayers)}, 当前玩家索引=${this._gameState.currentPlayerIndex}, 结果=${isMyTurn}`);

        // 测试代码已移除，使用实际的回合状态
        return isMyTurn;
    }

    /**
     * 获取当前竞价
     */
    public get currentBid(): Bid | [0, 0] {
        if (!this._gameState) return [0, 0];
        return this._gameState.currentBid;
    }

    /**
     * 获取总骰子数量
     */
    public get totalDiceCount(): number {
        if (!this._gameState || !this._gameState.players) return 0;
        return this._gameState.players.reduce((sum, p) => sum + p.diceCount, 0);
    }

    /**
     * 获取骰子面值标签
     */
    private getFaceLabel(face: Face): string {
        return ["?", "一", "二", "三", "四", "五", "六"][face] || `${face}`;
    }

    /**
     * 清理资源
     */
    public clear(): void {
        this._historyItems = [];
        this._gameState = null;
        this._playerDices = [];
        this._currentPlayerId = '';
        // Remove listener
        network.off('game:challenge_result', this.handleChallengeResult.bind(this));
        console.log("[GameStateManager] Clear: Removed listener for 'game:challenge_result'");
    }
}
