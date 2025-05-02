import { z } from "zod";
import { Face, Bid, EmptyBid } from "./game-types.d";

/**
 * 玩家数据验证模式
 */
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  diceCount: z.number().int().min(0)
});

/**
 * 竞价验证模式
 */
export const BidSchema = z.tuple([
  z.number().int().min(1).max(6), // 骰子面值 1-6
  z.number().int().min(1)         // 骰子数量 >=1
]);

/**
 * 游戏状态验证模式
 */
export const GameStateSchema = z.object({
  gameId: z.string(),
  roomId: z.string(),
  players: z.array(PlayerSchema),
  currentPlayer: z.string(),
  remainingDices: z.record(z.number().int().min(0)),
  currentBid: BidSchema.optional(),
  roundNumber: z.number().int().min(0),
  status: z.enum(["waiting", "playing", "finished"]),
  winner: z.string().optional()
});

/**
 * 骰子结果验证模式
 */
export const DiceResultSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  dices: z.array(z.number().int().min(1).max(6)),
  seed: z.string().optional()
});

/**
 * 竞价数据验证模式
 */
export const BidDataSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  bid: BidSchema
});

/**
 * 质疑结果验证模式
 */
export const ChallengeResultSchema = z.object({
  gameId: z.string(),
  challengerId: z.string(),
  challengedId: z.string(),
  bid: z.tuple([z.number(), z.number()]),
  bidValid: z.boolean(),
  actualCount: z.number().int(),
  loserId: z.string()
});

/**
 * 游戏结束验证模式
 */
export const GameEndSchema = z.object({
  gameId: z.string(),
  winner: z.string(),
  players: z.array(PlayerSchema)
});

/**
 * 游戏命令验证模式
 */
export const GameCommandSchema = z.object({
  gameId: z.string(),
  command: z.enum(["start", "pause", "resume", "stop"]),
  data: z.any().optional()
});

/**
 * 摇骰子请求验证模式
 */
export const RollDiceRequestSchema = z.object({
  gameId: z.string(),
  count: z.number().int().min(1)
});

/**
 * 玩家移动验证模式
 */
export const PlayerMoveSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  moveType: z.enum(["bid", "challenge", "spot_on"]),
  bid: BidSchema.optional()
});
