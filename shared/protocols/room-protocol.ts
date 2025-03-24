import { z } from "zod";

// 房间状态定义
export type RoomStatus = "waiting" | "gaming" | "closed";

// 房间接口定义
export interface Room {
  id: string;
  name?: string;
  players: string[];
  status: RoomStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  name: z.string().optional(),
  players: z.array(z.string()),
  status: z.enum(["waiting", "gaming", "closed"]),
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
