import { 
  Face, 
  Hand, 
  Bid, 
  EmptyBid, 
  PlayerID, 
  BidData,
  EventEmitter
} from '../../../../shared/protocols/game-types.d';

/**
 * 简单事件发射器实现
 */
class SimpleEventEmitter<T> implements EventEmitter<T> {
  private listeners: ((data: T) => void)[] = [];

  on(callback: (data: T) => void): void {
    this.listeners.push(callback);
  }

  emit(data: T): void {
    this.listeners.forEach(listener => listener(data));
  }
}

/**
 * 玩家类
 */
class Player {
  public hand?: Hand;

  constructor (
    public id: PlayerID,
    public name: string,
    public diceLeft: number,
  ) {}

  /**
   * 生成玩家的骰子
   */
  public async buildHand(): Promise<void> {
    this.hand = await GameEngine.rollDices(this.diceLeft);
  }
}

/**
 * 竞价信息类
 */
class GameBid {
  constructor(public value: number = 0, public count: number = 0, public playerId: PlayerID = -1) {}
  
  toJSON(): Bid | EmptyBid {
    return this.count === 0 ? [0, 0] : [this.value as Face, this.count];
  }

  /**
   * 提高竞价
   * @param value 骰子面值
   * @param count 骰子数量
   * @returns 竞价是否有效
   */
  increase(value: number, count: number, playerId: PlayerID): boolean {
    if (!(count >= this.count && count > 0
      && (count > this.count || value > this.value)))
      return false;
      
    this.count = count;
    this.value = value;
    this.playerId = playerId;
    return true;
  }
}

/**
 * 游戏引擎
 */
export default class GameEngine {
  // 游戏信息
  public readonly gameId: string;
  public roundNumber: number = 0;
  public moveNumber: number = 0;

  // 玩家相关
  private players: Player[] = [];
  private activePlayers: PlayerID[] = [];
  
  // 当前状态
  private currentBid: GameBid = new GameBid();
  private currentPlayerIndex: number = 0;

  // 网络事件桩
  public onBidSubmitted = new SimpleEventEmitter<BidData>();
  public onDoubtTriggered = new SimpleEventEmitter<PlayerID>();
  public onSpotOnTriggered = new SimpleEventEmitter<PlayerID>();
  public onRoundComplete = new SimpleEventEmitter<{winner: PlayerID, loser: PlayerID}>();
  public onGameComplete = new SimpleEventEmitter<PlayerID>();

  /**
   * 创建游戏引擎实例
   * @param gameId 游戏ID
   * @param playerNames 玩家名称数组
   * @param initialDiceCount 初始骰子数量
   */
  constructor(
    gameId: string, 
    playerNames: string[], 
    initialDiceCount: number = 5
  ) {
    this.gameId = gameId;
    
    // 初始化玩家
    for (let i = 0; i < playerNames.length; i++) {
      const player = new Player(i+1, playerNames[i], initialDiceCount);
      this.players.push(player);
      this.activePlayers.push(i);
    }
  }

  /**
   * 掷骰子生成结果
   * @param count 骰子数量
   * @returns 骰子结果
   */
  public static rollDices(count: number): Promise<Hand> {
    // 模拟异步操作
    return new Promise<Hand>((resolve) => {
      setTimeout(() => {
        const result: Hand = [];
        for (let i = 0; i < count; i++) {
          const value = Math.ceil(Math.random() * 6) as Face;
          result.push(value);
        }
        result.sort();
        resolve(result);
      }, 500); // 添加500ms延迟模拟网络或动画效果
    });
  }

  /**
   * 获取当前玩家
   */
  public getCurrentPlayer(): Player {
    const playerIndex = this.activePlayers[this.currentPlayerIndex];
    return this.players[playerIndex];
  }

  /**
   * 检查竞价有效性
   */
  private checkBidValidity(bid: GameBid): boolean {
    let count = 0;
    const value = bid.value;

    // 统计所有玩家手中符合条件的骰子数量
    for (const playerIndex of this.activePlayers) {
      const player = this.players[playerIndex];
      const hand = player.hand || [];
      
      for (const dice of hand) {
        if (dice === value) {
          count++;
        }
      }
    }

    return count >= bid.count;
  }

  /**
   * 轮转到下一个玩家
   */
  private nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.activePlayers.length;
  }

  /**
   * 开始新的回合
   */
  public async startNewRound(): Promise<void> {
    this.roundNumber++;
    this.moveNumber = 0;
    this.currentBid = new GameBid();
    
    // 为所有玩家生成新的骰子
    const handPromises = this.activePlayers.map(
      playerIndex => this.players[playerIndex].buildHand()
    );
    await Promise.all(handPromises);
    
    console.log(`回合 ${this.roundNumber} 开始!`);
  }

  /**
   * 处理玩家竞价
   * @param playerId 玩家ID
   * @param value 骰子面值
   * @param count 骰子数量
   */
  public placeBid(playerId: PlayerID, value: number, count: number): boolean {
    // 确保是当前玩家的回合
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return false;
    }

    // 尝试提高竞价
    if (!this.currentBid.increase(value, count, playerId)) {
      return false;
    }

    // 更新游戏状态
    this.moveNumber++;
    this.nextTurn();
    
    // 触发竞价事件
    this.onBidSubmitted.emit({
      playerId,
      bid: [value as Face, count]
    });
    
    return true;
  }

  /**
   * 处理玩家质疑
   * @param playerId 质疑的玩家ID
   */
  public challengeBid(playerId: PlayerID): Promise<void> {
    // 确保是当前玩家的回合
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return Promise.resolve();
    }

    // 检查上一个竞价的有效性
    const previousBidValid = this.checkBidValidity(this.currentBid);
    
    // 触发质疑事件
    this.onDoubtTriggered.emit(playerId);
    
    let loserId: PlayerID;
    let winnerId: PlayerID;
    
    if (previousBidValid) {
      // 如果竞价有效，质疑者输
      loserId = playerId;
      winnerId = this.currentBid.playerId;
    } else {
      // 如果竞价无效，上一个竞价者输
      loserId = this.currentBid.playerId;
      winnerId = playerId;
    }
    
    // 减少失败者的骰子数量
    this.handlePlayerLoss(loserId);
    
    // 触发回合结束事件
    this.onRoundComplete.emit({
      winner: winnerId,
      loser: loserId
    });
    return Promise.resolve();
  }

  /**
   * 处理玩家失败(减少骰子数量)
   * @param playerId 失败的玩家ID
   */
  private handlePlayerLoss(playerId: PlayerID): void {
    // 找到对应的玩家并减少骰子
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === playerId) {
        this.players[i].diceLeft -= 1;
        
        // 如果玩家没有骰子了，从活跃列表中移除
        if (this.players[i].diceLeft <= 0) {
          const playerIndexInActive = this.activePlayers.indexOf(i);
          if (playerIndexInActive !== -1) {
            this.activePlayers.splice(playerIndexInActive, 1);
          }
          
          // 如果只剩一个玩家，游戏结束
          if (this.activePlayers.length === 1) {
            const winnerId = this.players[this.activePlayers[0]].id;
            this.onGameComplete.emit(winnerId);
          }
        }
        break;
      }
    }
  }
}
