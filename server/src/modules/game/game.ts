import { Player } from '../player/player';
import { Bid, Face } from '../../../../shared/protocols/game-types.d';
import { FaceValue } from '../../../../shared/protocols/game-values';

/**
 * 游戏状态枚举
 */
type GameStatus = 'waiting' | 'playing' | 'finished';

/**
 * 游戏操作结果
 */
type GameResult = {
  success: boolean;
  error?: string;
  valid?: boolean;
  totalCount?: number;
  gameOver?: boolean;
};

/**
 * 吹牛骰子游戏类
 */
export class Game {
  // 游戏状态
  private _status: GameStatus = 'waiting';
  
  // 游戏玩家列表
  private _players: Player[] = [];
  
  // 当前玩家索引
  private _currentPlayerIndex: number = 0;
  
  // 当前竞价
  private _currentBid: Bid | null = null;
  
  // 获胜玩家ID
  private _winner: string | null = null;

  /**
   * 创建游戏
   * @param id 游戏ID
   */
  constructor(public readonly id: string) {}

  /**
   * 获取游戏状态
   */
  get status(): GameStatus {
    return this._status;
  }

  /**
   * 获取玩家列表
   */
  get players(): Player[] {
    return [...this._players];
  }

  /**
   * 获取当前活跃的玩家ID列表
   */
  get activePlayers(): string[] {
    return this._players
      .filter(player => player.diceCount > 0)
      .map(player => player.id);
  }

  /**
   * 获取当前玩家索引
   */
  get currentPlayerIndex(): number {
    return this._currentPlayerIndex;
  }

  /**
   * 获取当前竞价
   */
  get currentBid(): Bid | null {
    return this._currentBid;
  }

  /**
   * 获取获胜玩家ID
   */
  get winner(): string | null {
    return this._winner;
  }

  /**
   * 添加玩家到游戏
   * @param player 玩家对象
   */
  addPlayer(player: Player): boolean {
    if (this._status !== 'waiting') {
      return false;
    }

    this._players.push(player);
    return true;
  }

  /**
   * 开始游戏
   */
  start(): boolean {
    if (this._players.length < 2 || this._status !== 'waiting') {
      return false;
    }

    this._status = 'playing';
    this._currentPlayerIndex = 0;
    this._currentBid = null;
    
    // 初始化每个玩家的骰子数量
    this._players.forEach(player => {
      player.dices = this.rollDices(5);
    });

    return true;
  }

  /**
   * 掷骰子
   * @param count 骰子数量
   */
  private rollDices(count: number): Face[] {
    const dices: Face[] = [];
    for (let i = 0; i < count; i++) {
      // 生成1-6的随机数作为骰子面值
      const face = Math.floor(Math.random() * 6) + 1;
      dices.push(face as Face);
    }
    return dices;
  }

  /**
   * 进行竞价
   * @param playerId 玩家ID
   * @param bid 竞价
   */
  placeBid(playerId: string, bid: Bid): GameResult {
    // 检查游戏状态
    if (this._status !== 'playing') {
      return { success: false, error: '游戏尚未开始或已经结束' };
    }

    // 检查是否该玩家的回合
    const currentPlayer = this._players[this._currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      return { success: false, error: '不是当前玩家的回合' };
    }

    // 检查竞价是否有效
    if (this._currentBid !== null) {
      const [currentFace, currentCount] = this._currentBid;
      const [newFace, newCount] = bid;

      // 新的竞价面值必须大于等于当前竞价，或者数量更多
      if (
        (newFace === currentFace && newCount <= currentCount) ||
        (newFace !== currentFace && (newCount < currentCount))
      ) {
        return { success: false, error: '竞价无效' };
      }
    }

    // 更新当前竞价
    this._currentBid = bid;

    // 更新当前玩家索引，跳过已经出局的玩家
    this._moveToNextPlayer();

    return { success: true };
  }

  /**
   * 质疑上一个玩家的竞价
   * @param playerId 玩家ID
   */
  challenge(playerId: string): GameResult {
    // 检查游戏状态
    if (this._status !== 'playing') {
      return { success: false, error: '游戏尚未开始或已经结束' };
    }

    // 检查是否有竞价可以质疑
    if (this._currentBid === null) {
      return { success: false, error: '尚无竞价可质疑' };
    }

    // 检查玩家是否已被淘汰
    if (!this.activePlayers.includes(playerId)) {
      return { success: false, error: '该玩家已被淘汰' };
    }

    // 检查是否该玩家的回合
    const currentPlayer = this._players[this._currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      return { success: false, error: '不是当前玩家的回合' };
    }

    // 获取上一个玩家的竞价

    // 获取上一个玩家
    const previousPlayerIndex = this._getPreviousPlayerIndex();
    const previousPlayer = this._players[previousPlayerIndex];

    // 检查竞价是否正确
    const [targetFace, targetCount] = this._currentBid;
    let totalCount = 0;

    // 统计所有玩家骰子中目标面值的数量
    this._players.forEach(player => {
      if (player.diceCount > 0) {
        totalCount += player.dices.filter(face => face === targetFace).length;
      }
    });

    // 判断竞价是否正确
    const isValid = totalCount >= targetCount;

    // 根据质疑结果扣除骰子
    const lastBidPlayer = this._players[this._getPreviousPlayerIndex()];
    const losingPlayer = isValid ? currentPlayer : lastBidPlayer;
    losingPlayer.removeDice(1);

    // 重置当前竞价
    this._currentBid = null;

    // 如果玩家被淘汰，检查游戏是否结束
    const gameOver = losingPlayer.diceCount === 0 && this._checkGameOver();

    // 如果游戏未结束，更新当前玩家索引
    if (!gameOver) {
      this._currentPlayerIndex = this._players.findIndex(player => player.id === losingPlayer.id);
      this._moveToNextPlayer();
    }

    // 开始新回合
    this._startNewRound();

    return {
      success: true,
      valid: isValid,
      totalCount,
      gameOver
    };
  }

  /**
   * 即时喊（宣称竞价数量正好相等）
   * @param playerId 玩家ID
   */
  spotOn(playerId: string): GameResult {
    // 检查游戏状态
    if (this._status !== 'playing') {
      return { success: false, error: '游戏尚未开始或已经结束' };
    }

    // 检查是否有竞价可以即时喊
    if (this._currentBid === null) {
      return { success: false, error: '尚无竞价可即时喊' };
    }

    // 检查玩家是否已被淘汰
    if (!this.activePlayers.includes(playerId)) {
      return { success: false, error: '该玩家已被淘汰' };
    }

    // 检查是否该玩家的回合
    const currentPlayer = this._players[this._currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      return { success: false, error: '不是当前玩家的回合' };
    }

    // 统计所有骰子中当前竞价面值的数量
    const [bidFace, bidCount] = this._currentBid;
    const totalCount = this._countFaceInAllDices(bidFace);

    // 确定即时喊是否成功
    const spotOnValid = totalCount === bidCount;

    // 根据即时喊结果增加或移除骰子
    if (spotOnValid) {
      // 即时喊成功，当前玩家得到一个骰子
      currentPlayer.addDice(1);
    } else {
      // 即时喊失败，当前玩家失去一个骰子
      currentPlayer.removeDice(1);
    }

    // 重置当前竞价
    this._currentBid = null;

    // 检查游戏是否结束
    const gameOver = this._checkGameOver();

    // 创建新回合
    if (!gameOver) {
      this._startNewRound();
    }

    return { 
      success: true, 
      valid: spotOnValid, 
      totalCount, 
      gameOver
    };
  }

  /**
   * 统计所有骰子中指定面值的数量
   * @param face 骰子面值
   */
  private _countFaceInAllDices(face: Face): number {
    let count = 0;
    this._players.forEach(player => {
      player.dices.forEach(dice => {
        if (dice === face) {
          count++;
        }
      });
    });
    return count;
  }

  /**
   * 移动到下一个有效玩家
   */
  private _moveToNextPlayer(): void {
    const activePlayers = this.activePlayers;
    if (activePlayers.length <= 1) {
      return;
    }

    let nextIndex = (this._currentPlayerIndex + 1) % this._players.length;
    
    // 跳过已经出局的玩家
    while (!this._players[nextIndex].isActive()) {
      nextIndex = (nextIndex + 1) % this._players.length;
    }
    
    this._currentPlayerIndex = nextIndex;
  }

  /**
   * 获取上一个有效玩家的索引
   */
  private _getPreviousPlayerIndex(): number {
    const activePlayers = this.activePlayers;
    if (activePlayers.length <= 1) {
      return this._currentPlayerIndex;
    }

    let prevIndex = this._currentPlayerIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this._players.length - 1;
    }
    
    // 跳过已经出局的玩家
    while (!this._players[prevIndex].isActive()) {
      prevIndex--;
      if (prevIndex < 0) {
        prevIndex = this._players.length - 1;
      }
    }
    
    return prevIndex;
  }

  /**
   * 检查游戏是否结束
   */
  private _checkGameOver(): boolean {
    // 获取活跃玩家
    const activePlayers = this.activePlayers;
    
    // 只剩一个玩家，游戏结束
    if (activePlayers.length === 1) {
      // 设置游戏状态为结束
      this._status = 'finished';
      
      // 设置获胜者
      this._winner = activePlayers[0];
      
      // 确保当前玩家索引指向获胜者
      this._currentPlayerIndex = this._players.findIndex(player => player.id === this._winner);
      
      // 重置当前竞价
      this._currentBid = null;
      
      return true;
    }
    
    return false;
  }

  /**
   * 开始新回合
   */
  private _startNewRound(): void {
    // 为每个活跃玩家重新掷骰子
    this._players.forEach(player => {
      if (player.isActive()) {
        player.dices = this.rollDices(player.diceCount);
      }
    });
    
    // 重置竞价
    this._currentBid = null;
  }
}
