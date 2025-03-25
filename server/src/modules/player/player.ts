import { Face } from '../../../../shared/protocols/game-types.d';

/**
 * 玩家类
 * 表示参与游戏的一个玩家
 */
export class Player {
  // 玩家骰子
  private _dices: Face[] = [];
  
  /**
   * 创建玩家
   * @param id 玩家ID
   * @param name 玩家名称
   * @param diceCount 初始骰子数量
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    private _diceCount: number = 5
  ) {}
  
  /**
   * 获取玩家当前骰子数量
   */
  get diceCount(): number {
    return this._diceCount;
  }
  
  /**
   * 设置玩家的骰子
   */
  set dices(dices: Face[]) {
    this._dices = dices;
    this._diceCount = dices.length;
  }
  
  /**
   * 获取玩家的骰子
   */
  get dices(): Face[] {
    return this._dices;
  }
  
  /**
   * 增加骰子数量
   * @param count 增加的数量
   */
  addDice(count: number = 1): void {
    this._diceCount += count;
  }
  
  /**
   * 减少骰子数量
   * @param count 减少的数量
   */
  removeDice(count: number = 1): void {
    this._diceCount = Math.max(0, this._diceCount - count);
  }
  
  /**
   * 检查玩家是否还有骰子
   */
  isActive(): boolean {
    return this._diceCount > 0;
  }
  
  /**
   * 转换为JSON对象
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      diceCount: this._diceCount
    };
  }
}
