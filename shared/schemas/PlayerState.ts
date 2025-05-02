import { Schema, type, ArraySchema } from "@colyseus/schema";

/**
 * 玩家状态类
 * 注意：所有需要同步的属性都必须使用 @type() 装饰器
 */
export class PlayerState extends Schema {
  @type("string")
  id: string = "";

  @type("string")
  sessionId: string = "";

  @type("string")
  name: string = "";

  @type("number")
  diceCount: number = 5;

  @type("boolean")
  isReady: boolean = false;

  @type("boolean")
  isConnected: boolean = true;

  @type("boolean")
  isAI: boolean = false;

  @type("string")
  aiType: string = "";
  
  // 添加currentDices属性，使用@type()装饰器
  @type(["number"])
  currentDices = new ArraySchema<number>();

  /**
   * 创建新的玩家状态
   */
  constructor(id: string = "", sessionId: string = "", name: string = "", diceCount: number = 5) {
    super();
    // 初始化属性，必须在 super() 之后
    this.id = id;
    this.sessionId = sessionId;
    this.name = name;
    this.diceCount = diceCount;
  }
}
