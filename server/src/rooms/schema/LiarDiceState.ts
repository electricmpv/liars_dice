import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

// 定义单个玩家的状态
export class PlayerState extends Schema {
  @type("string") id!: string; // 玩家唯一 ID (可以是数据库 ID 或生成的 UUID)
  @type("string") sessionId!: string; // Colyseus 客户端连接的 Session ID
  @type("string") name!: string; // 玩家昵称
  @type("number") diceCount!: number; // 玩家当前拥有的骰子数量
  @type("boolean") isReady: boolean = false; // 玩家是否准备开始游戏
  @type("boolean") isConnected: boolean = true; // 玩家是否连接 (onLeave 时可以设为 false)
  @type("boolean") isAI: boolean = false; // 是否是 AI 玩家
  @type("string") aiType?: string; // AI 类型 (如果 isAI 为 true)
  @type(["number"]) currentDices: ArraySchema<number> = new ArraySchema<number>(); // 玩家当前回合的骰子点数 (仅自己可见，考虑是否放在这里或单独发送)
}

// 定义整个游戏房间的状态
export class LiarDiceRoomState extends Schema {
  // 玩家列表: key 是 sessionId
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();

  // 参与当前游戏回合的玩家 sessionId 列表 (按顺序)
  @type(["string"]) activePlayerIds = new ArraySchema<string>();

  // 当前轮到的玩家在 activePlayerIds 中的索引
  @type("number") currentPlayerIndex: number = 0;

  // 当前叫价的点数 (1-6)
  @type("number") currentBidValue: number = 0; // 0 表示尚未开始叫价

  // 当前叫价的数量
  @type("number") currentBidCount: number = 0; // 0 表示尚未开始叫价

  // 上一个叫价的玩家 sessionId (用于质疑判断)
  @type("string") lastBidderSessionId?: string;

  // 游戏状态: waiting, playing, challenging, roundOver, finished
  @type("string") status: string = "waiting";

  // 房主 sessionId (用于开始游戏、踢人等权限)
  @type("string") hostId?: string;

  // 当前游戏回合数
  @type("number") roundNumber: number = 0;

  // 当前回合叫价次数 (用于判断是否可以质疑)
  @type("number") moveNumber: number = 0;

  // 回合结算信息 (可选，用于显示谁输了，输了多少骰子等)
  @type("string") roundResult?: string; // 可以是 JSON 字符串或其他格式

  // 本回合是否已经叫过 1 点 (影响 1 点是否为万能骰)
  @type("boolean") isOneCalledThisRound: boolean = false; // v2.1 新增
}
