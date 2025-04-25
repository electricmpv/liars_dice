import { z } from "zod";

// 玩家接口定义
export interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isAI: boolean; // Added for AI player identification
  aiType?: string; // Optional: Specifies the type of AI (e.g., 'coward')
}

// 房间状态定义
export type RoomStatus = "waiting" | "gaming" | "closed";

// 房间接口定义
export interface Room {
  id: string;
  hostId: string; // 添加房主ID
  name?: string;
  players: Player[]; // 修改为 Player 对象数组
  playerCount: number;
  maxPlayers: number;
  status: RoomStatus;
  hasPassword: boolean;
  isPrivate: boolean;
  hasFriends: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 玩家验证Schema
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  isReady: z.boolean(),
  isAI: z.boolean(), // Added for AI player identification
  aiType: z.string().optional() // Optional: Specifies the type of AI
});

// 聊天消息接口
export interface ChatMessage {
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

// 心跳检测接口
export interface Heartbeat {
  timestamp: number;
  clientTime?: number;
}

// 房间验证Schema
export const RoomSchema = z.object({
  id: z.string(),
  hostId: z.string(), // 添加 hostId 验证
  name: z.string().optional(),
  players: z.array(PlayerSchema), // 修改为 PlayerSchema 数组验证
  playerCount: z.number(),
  maxPlayers: z.number(),
  status: z.enum(["waiting", "gaming", "closed"]),
  hasPassword: z.boolean(),
  isPrivate: z.boolean(),
  hasFriends: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// 聊天消息验证Schema
export const ChatMessageSchema = z.object({
  roomId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  content: z.string().min(1).max(500),
  timestamp: z.number()
});

// 心跳验证Schema
export const HeartbeatSchema = z.object({
  timestamp: z.number(),
  clientTime: z.number().optional()
});

// 创建房间请求验证
export const CreateRoomRequestSchema = z.object({
  playerName: z.string().min(1).max(20)
});

// 加入房间请求验证
export const JoinRoomRequestSchema = z.object({
  roomId: z.string(),
  playerName: z.string().min(1).max(20)
});

// 离开房间请求验证
export const LeaveRoomRequestSchema = z.object({
  roomId: z.string(),
  playerId: z.string()
});

// 获取房间信息请求验证
export const GetRoomInfoRequestSchema = z.object({
  roomId: z.string(),
});
