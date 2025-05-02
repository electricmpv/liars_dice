import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";
import { PlayerState } from "./PlayerState"; // Import PlayerState

// 重新导出PlayerState，使其可以被其他模块导入
export { PlayerState }

/**
 * 定义整个游戏房间的状态
 * 注意：所有需要同步的属性都必须使用 @type() 装饰器
 */
export class LiarDiceRoomState extends Schema {
  // 玩家列表: key 是 sessionId
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  // 参与当前游戏回合的玩家 sessionId 列表 (按顺序)
  @type(["string"])
  activePlayerIds = new ArraySchema<string>();

  // 当前轮到的玩家在 activePlayerIds 中的索引
  @type("number")
  currentPlayerIndex = 0;

  // 当前叫价的点数 (1-6)
  @type("number")
  currentBidValue = 0; // 0 表示尚未开始叫价

  // 当前叫价的数量
  @type("number")
  currentBidCount = 0; // 0 表示尚未开始叫价

  // 上一个叫价的玩家 sessionId (用于质疑判断)
  @type("string")
  lastBidderSessionId = ""; // 提供默认值

  // 游戏状态: waiting, playing, challenging, roundOver, finished
  @type("string")
  status = "waiting";

  // 房主 sessionId (用于开始游戏、踢人等权限)
  @type("string")
  hostId = ""; // 提供默认值

  // 当前游戏回合数
  @type("number")
  roundNumber = 0;

  // 当前回合叫价次数 (用于判断是否可以质疑)
  @type("number")
  moveNumber = 0;

  // 当前回合结果 (用于显示在UI上)
  @type("string")
  roundResult = "";

  // 是否在当前回合中已经叫过1 (用于判断是否可以叫1)
  @type("boolean")
  isOneCalledThisRound = false;

  /**
   * 创建新的游戏房间状态
   */
  constructor() {
    super();
    // 确保所有属性都已初始化
    // 确保所有属性都已初始化，必须在 super() 之后
    this.players = new MapSchema<PlayerState>();
    this.activePlayerIds = new ArraySchema<string>();
    this.currentPlayerIndex = 0;
    this.currentBidValue = 0;
    this.currentBidCount = 0;
    this.lastBidderSessionId = "";
    this.status = "waiting";
    this.hostId = "";
    this.roundNumber = 0;
    this.moveNumber = 0;
    this.roundResult = "";
    this.isOneCalledThisRound = false;
  }
}
