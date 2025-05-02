import { PlayerStateClient } from "./player-state-client"; // 导入客户端 PlayerState 接口

/**
 * 客户端使用的 LiarDiceRoomState 纯接口定义。
 * 这个文件不包含任何 Colyseus Schema 或 @type 装饰器，
 * 确保在浏览器环境中可以安全使用。
 */
export interface LiarDiceRoomStateClient {
  // 玩家列表: key 是 sessionId
  players: Record<string, PlayerStateClient>; // 使用 Record<string, PlayerStateClient> 代替 MapSchema

  // 参与当前游戏回合的玩家 sessionId 列表 (按顺序)
  activePlayerIds: string[]; // 使用 string[] 代替 ArraySchema<string>

  // 当前轮到的玩家在 activePlayerIds 中的索引
  currentPlayerIndex: number;

  // 当前叫价的点数 (1-6)
  currentBidValue: number;

  // 当前叫价的数量
  currentBidCount: number;

  // 上一个叫价的玩家 sessionId (用于质疑判断)
  lastBidderSessionId: string;

  // 游戏状态: waiting, playing, challenging, roundOver, finished
  status: string;

  // 房主 sessionId (用于开始游戏、踢人等权限)
  hostId: string;

  // 当前游戏回合数
  roundNumber: number;

  // 当前回合叫价次数 (用于判断是否可以质疑)
  moveNumber: number;

  // 回合结算信息 (用于显示谁输了，输了多少骰子等)
  roundResult: string;

  // 本回合是否已经叫过 1 点 (影响 1 点是否为万能骰)
  isOneCalledThisRound: boolean;
}
