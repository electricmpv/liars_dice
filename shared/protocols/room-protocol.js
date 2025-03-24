"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRoomRequestSchema = exports.JoinRoomRequestSchema = exports.CreateRoomRequestSchema = exports.HeartbeatSchema = exports.ChatMessageSchema = exports.RoomSchema = void 0;
const zod_1 = require("zod");
// 房间验证Schema
exports.RoomSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    players: zod_1.z.array(zod_1.z.string()),
    status: zod_1.z.enum(["waiting", "gaming", "closed"]),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional()
});
// 聊天消息验证Schema
exports.ChatMessageSchema = zod_1.z.object({
    roomId: zod_1.z.string(),
    senderId: zod_1.z.string(),
    senderName: zod_1.z.string(),
    content: zod_1.z.string().min(1).max(500),
    timestamp: zod_1.z.number()
});
// 心跳验证Schema
exports.HeartbeatSchema = zod_1.z.object({
    timestamp: zod_1.z.number(),
    clientTime: zod_1.z.number().optional()
});
// 创建房间请求验证
exports.CreateRoomRequestSchema = zod_1.z.object({
    playerName: zod_1.z.string().min(1).max(20)
});
// 加入房间请求验证
exports.JoinRoomRequestSchema = zod_1.z.object({
    roomId: zod_1.z.string(),
    playerName: zod_1.z.string().min(1).max(20)
});
// 离开房间请求验证
exports.LeaveRoomRequestSchema = zod_1.z.object({
    roomId: zod_1.z.string(),
    playerId: zod_1.z.string()
});
//# sourceMappingURL=room-protocol.js.map