import { 
  Face, 
  Hand, 
  Bid, 
  EmptyBid, 
  PlayerID, 
  BidData,
  DiceResult,
  EventEmitter
} from '../../../../shared/protocols/game-types.d';
import { director, game, Node, CCInteger, Component, Animation, Label, _decorator } from 'cc';
import { network } from './network';

const { ccclass, property } = _decorator;

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

  constructor(
    public id: PlayerID,
    public name: string,
    public diceLeft: number
  ) {}

  /**
   * 生成新的手牌
   */
  async buildHand(): Promise<Hand> {
    this.hand = await GameEngine.rollDices(this.diceLeft);
    return this.hand;
  }
}

/**
 * 竞价信息类
 */
class GameBid {
  constructor(
    public value: number = 0, 
    public count: number = 0, 
    public playerId: PlayerID = -1
  ) {}

  /**
   * 转换为JSON格式
   */
  toJSON(): Bid | EmptyBid {
    if (this.value === 0 || this.count === 0) {
      return [0, 0];
    }
    return [this.value as Face, this.count];
  }

  /**
   * 提高竞价
   * @param value 骰子面值
   * @param count 骰子数量
   * @param playerId 玩家ID
   * @returns 竞价是否有效
   */
  increase(value: number, count: number, playerId: PlayerID): boolean {
    // 首次竞价
    if (this.value === 0 && this.count === 0) {
      if (value >= 1 && value <= 6 && count > 0) {
        this.value = value;
        this.count = count;
        this.playerId = playerId;
        return true;
      }
      return false;
    }

    // 规则1: 数量增加，点数任意
    if (count > this.count) {
      this.value = value;
      this.count = count;
      this.playerId = playerId;
      return true;
    }
    
    // 规则2: 数量相同，点数增加
    if (count === this.count && value > this.value) {
      this.value = value;
      this.count = count;
      this.playerId = playerId;
      return true;
    }
    
    return false;
  }
}

/**
 * 游戏引擎
 */
@ccclass('GameEngine')
export class GameEngine extends Component {
  // 游戏数据
  public readonly gameId: string;
  public roundNumber: number = 0;
  public moveNumber: number = 0;
  private players: Player[] = [];
  private activePlayers: PlayerID[] = [];
  private currentBid: GameBid = new GameBid();
  private currentPlayerIndex: number = 0;
  private diceNodes: Node[] = [];
  private diceAnimations: Animation[] = [];
  private diceLabels: Label[] = [];
  private serverSeed: string = '';

  // 事件发射器
  public onBidSubmitted = new SimpleEventEmitter<BidData>();
  public onDoubtTriggered = new SimpleEventEmitter<PlayerID>();
  public onSpotOnTriggered = new SimpleEventEmitter<PlayerID>();
  public onRoundComplete = new SimpleEventEmitter<{winner: PlayerID, loser: PlayerID}>();
  public onGameComplete = new SimpleEventEmitter<PlayerID>();
  
  // 特效控制
  @property({type: CCInteger})
  animationDuration: number = 1.5;

  @property(Node)
  diceContainer: Node = null!;

  @property(Animation)
  shakeAnimation: Animation = null!;

  /**
   * 构造函数
   * @param gameId 游戏ID
   * @param playerNames 玩家名称数组
   * @param initialDiceCount 初始骰子数量
   */
  constructor(gameId: string, playerNames: string[], initialDiceCount: number = 5) {
    super();
    this.gameId = gameId;
    
    // 初始化玩家
    for (let i = 0; i < playerNames.length; i++) {
      const player = new Player(i+1, playerNames[i], initialDiceCount);
      this.players.push(player);
      this.activePlayers.push(i);
    }
  }

  /**
   * 组件启动时
   */
  start() {
    this.initDiceNodes();
    this.setupNetworkListeners();
  }

  /**
   * 初始化骰子节点
   */
  private initDiceNodes() {
    if (!this.diceContainer) return;
    
    // 获取所有骰子节点
    this.diceContainer.children.forEach(diceNode => {
      this.diceNodes.push(diceNode);
      
      // 获取动画组件
      const anim = diceNode.getComponent(Animation);
      if (anim) {
        this.diceAnimations.push(anim);
      }
      
      // 获取标签组件
      const label = diceNode.getComponentInChildren(Label);
      if (label) {
        this.diceLabels.push(label);
      }
    });
  }

  /**
   * 设置网络监听器
   */
  private setupNetworkListeners() {
    // 监听骰子结果
    network.on('game:dice_roll', (data: { gameId: string, playerId: string, dices: Face[] }) => {
      if (data.gameId === this.gameId) {
        const playerIndex = this.players.findIndex(p => p.id.toString() === data.playerId);
        if (playerIndex !== -1) {
          this.players[playerIndex].hand = data.dices;
          
          // 如果是当前玩家，显示骰子
          if (this.players[playerIndex].id === 0) {
            this.showDiceResult(data.dices);
          }
        }
      }
    });
    
    // 监听竞价更新
    network.on('game:bid_update', (data: BidData) => {
      if (data.playerId) {
        const value = data.bid[0];
        const count = data.bid[1];
        const playerId = typeof data.playerId === 'string' ? parseInt(data.playerId) : data.playerId;
        
        this.currentBid.increase(value, count, playerId);
        this.onBidSubmitted.emit(data);
      }
    });
    
    // 监听质疑结果
    network.on('game:challenge_result', (data: any) => {
      this.handleChallengeResult(data);
    });
    
    // 监听游戏结束
    network.on('game:game_end', (data: any) => {
      if (data.winner) {
        const winnerId = typeof data.winner === 'string' ? parseInt(data.winner) : data.winner;
        this.onGameComplete.emit(winnerId);
      }
    });
  }

  /**
   * 处理质疑结果
   */
  private handleChallengeResult(data: any) {
    const challengerId = typeof data.challengerId === 'string' ? parseInt(data.challengerId) : data.challengerId;
    const challengedId = typeof data.challengedId === 'string' ? parseInt(data.challengedId) : data.challengedId;
    const loserId = typeof data.loserId === 'string' ? parseInt(data.loserId) : data.loserId;
    
    if (loserId) {
      // 减少失败者的骰子数量
      this.handlePlayerLoss(loserId);
      
      // 触发回合结束事件
      this.onRoundComplete.emit({
        winner: loserId === challengerId ? challengedId : challengerId,
        loser: loserId
      });
    }
  }

  /**
   * 掷骰子生成结果（客户端模拟）
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
   * 摇骰子（与服务器同步）
   * @param count 骰子数量
   * @returns 骰子结果
   */
  async rollDices(count: number): Promise<DiceResult> {
    // 播放摇骰子动画
    this.playShakeAnimation();
    
    // 请求服务器生成骰子结果
    const result = await this.syncWithServer(count);
    
    // 显示骰子结果
    setTimeout(() => {
      this.showDiceResult(result.faces);
    }, this.animationDuration * 1000);
    
    return result;
  }

  /**
   * 与服务器同步骰子结果
   * @param count 骰子数量
   * @returns 骰子结果
   */
  private async syncWithServer(count: number): Promise<DiceResult> {
    try {
      // 向服务器请求骰子结果
      const response = await network.rollDice(this.gameId, this.getCurrentPlayer().id.toString());
      
      // 确保返回的骰子结果是Face类型
      const faces: Face[] = (response.dices || []).map(val => val as Face);
      
      return {
        faces
      };
    } catch (error) {
      console.error('[游戏][错误] 同步骰子失败:', error);
      
      // 如果服务器请求失败，回退到客户端生成
      const result = await GameEngine.rollDices(count);
      return { faces: result };
    }
  }

  /**
   * 播放摇骰子动画
   */
  playShakeAnimation() {
    if (this.shakeAnimation) {
      this.shakeAnimation.play();
    }
    
    // 播放每个骰子的动画
    this.diceAnimations.forEach(anim => {
      if (anim) {
        anim.play('dice_roll');
      }
    });
  }

  /**
   * 显示骰子结果
   * @param results 骰子结果
   */
  showDiceResult(results: Face[]) {
    // 先隐藏所有骰子
    this.diceNodes.forEach((node, index) => {
      node.active = index < results.length;
    });
    
    // 显示结果
    for (let i = 0; i < results.length && i < this.diceLabels.length; i++) {
      if (this.diceLabels[i]) {
        this.diceLabels[i].string = results[i].toString();
      }
    }
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
    
    console.log(`[游戏][信息] 回合 ${this.roundNumber} 开始!`);
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
    
    // 发送到服务器
    network.placeBid(this.gameId, playerId.toString(), [value as Face, count]);
    
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

    // 触发质疑事件
    this.onDoubtTriggered.emit(playerId);
    
    // 发送到服务器
    network.challenge(this.gameId, playerId.toString());
    
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
