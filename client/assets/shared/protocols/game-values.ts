/**
 * 吹牛骰子游戏值定义
 * 提供枚举值供游戏逻辑使用
 */

// 骰子面值枚举，与类型定义对应
export enum FaceValue {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6
}

// 玩家特殊标识
export enum PlayerValue {
  Yourself = 0,
  EmptyPlayer = -1
}
