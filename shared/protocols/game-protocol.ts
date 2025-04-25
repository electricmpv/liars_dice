import { z } from "zod";
import type { Face, Bid } from "./game-types"; // 假设 game-types.d.ts 定义了 Face 和 Bid

// Zod Schema for Face (1 to 6)
const FaceSchema = z.number().int().min(1).max(6) as z.ZodSchema<Face>;

// Zod Schema for Bid [Face, count]
const BidSchema = z.tuple([
  FaceSchema, // Dice value (1-6)
  z.number().int().min(1) // Count (at least 1)
]) as z.ZodSchema<Bid>;

// 获取房间信息请求验证 (虽然在 room-protocol.ts 中，但与游戏场景相关，放这里也合理)
// 如果 room-protocol.ts 已有，则不需要重复定义
// export const GetRoomInfoRequestSchema = z.object({
//   roomId: z.string(),
// });

// 开始游戏请求验证 - 注意：服务器端实现不接收参数，所以不需要 Schema
// export const StartGameRequestSchema = z.object({});

// 摇骰子请求验证
export const RollDiceRequestSchema = z.object({
  gameId: z.string().uuid(), // 假设 gameId 是 UUID
  count: z.number().int().min(1).optional(), // 骰子数量，可选
});

// 叫价请求验证
export const BidRequestSchema = z.object({
  gameId: z.string().uuid(),
  playerId: z.string().uuid(), // 假设 playerId 是 UUID
  bid: BidSchema,
});

// 质疑请求验证
export const ChallengeRequestSchema = z.object({
  gameId: z.string().uuid(),
  playerId: z.string().uuid(),
});

// 即时喊 (Spot On) 请求验证
export const SpotOnRequestSchema = z.object({
  gameId: z.string().uuid(),
  playerId: z.string().uuid(),
});

// 获取初始游戏状态请求 Schema (客户端发送)
export const GetInitialGameStateRequestSchema = z.object({
  gameId: z.string().uuid(),
});

// 游戏错误信息 Schema (用于服务器向客户端发送错误)
export const GameErrorSchema = z.object({
  type: z.string(), // e.g., "bid_error", "challenge_error"
  message: z.string(),
});

// 玩家数据 Schema (用于游戏状态更新)
export const PlayerDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  diceCount: z.number().int().min(0), // 骰子数可以为 0
  isAI: z.boolean(), // Added for AI player identification
  // socketId: z.string().optional(), // 通常不在广播中发送 socketId
});

// 游戏状态更新 Schema (部分，根据需要补充)
// 注意：这个 Schema 用于服务器广播，不是客户端输入验证
export const GameStateUpdateSchema = z.object({
  gameId: z.string().uuid(),
  players: z.array(PlayerDataSchema), // 添加玩家数据数组
  activePlayers: z.array(z.string().uuid()),
  currentPlayerIndex: z.number().int(),
  currentBid: BidSchema.or(z.tuple([z.literal(0), z.literal(0)])), // 允许空叫价 [0, 0]
  roundNumber: z.number().int(),
  moveNumber: z.number().int(),
  status: z.enum(["waiting", "playing", "finished"]),
});

// 骰子结果 Schema (服务器发送给单个玩家)
export const DiceRollResultSchema = z.object({
    gameId: z.string().uuid(),
    playerId: z.string().uuid(),
    dices: z.array(FaceSchema)
});

// 叫价更新 Schema (服务器广播)
export const BidUpdateSchema = z.object({
    gameId: z.string().uuid(),
    playerId: z.string().uuid(),
    bid: BidSchema
});

// 质疑结果 Schema (服务器广播)
export const ChallengeResultSchema = z.object({
    gameId: z.string().uuid(),
    challengerId: z.string().uuid(),
    challengedId: z.string().uuid(), // 添加被质疑者ID
    valid: z.boolean(),
    totalCount: z.number().int(),
    loserId: z.string().uuid() // 添加失败者ID
    // winner: z.string().uuid().optional() // GameManager 内部广播的是 loserId
});

// 即时喊结果 Schema (服务器广播)
export const SpotOnResultSchema = z.object({
    gameId: z.string().uuid(),
    playerId: z.string().uuid(),
    valid: z.boolean(),
    totalCount: z.number().int(),
    winner: z.string().uuid().optional() // SpotOn 成功时没有赢家，失败时有
});

// 游戏结束 Schema (服务器广播)
export const GameEndSchema = z.object({
    gameId: z.string().uuid(),
    winner: z.string().uuid().optional(), // 可能没有赢家（平局？）
    status: z.enum(["finished", "completed"]) // 包含服务器和客户端的状态
});
