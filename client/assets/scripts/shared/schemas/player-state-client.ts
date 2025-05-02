/**
 * 客户端使用的 PlayerState 纯接口定义。
 * 这个文件不包含任何 Colyseus Schema 或 @type 装饰器，
 * 确保在浏览器环境中可以安全使用。
 */
export interface PlayerStateClient {
  id: string; // 玩家唯一 ID (可以是数据库 ID 或生成的 UUID)
  sessionId: string; // Colyseus 客户端连接的 Session ID
  name: string; // 玩家昵称
  diceCount: number; // 玩家当前拥有的骰子数量
  isReady: boolean; // 玩家是否准备开始游戏
  isConnected: boolean; // 玩家是否连接 (onLeave 时可以设为 false)
  isAI: boolean; // 是否是 AI 玩家
  aiType: string; // AI 类型 (如果 isAI 为 true)
  // 注意：currentDices 不应在此定义，它通常是服务器单独发送给客户端的
}
