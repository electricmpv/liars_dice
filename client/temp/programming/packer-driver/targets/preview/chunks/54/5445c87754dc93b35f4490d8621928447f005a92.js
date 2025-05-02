System.register(["zod"], function (_export, _context) {
  "use strict";

  var z, PlayerSchema, RoomSchema, ChatMessageSchema, HeartbeatSchema, CreateRoomRequestSchema, JoinRoomRequestSchema, LeaveRoomRequestSchema, GetRoomInfoRequestSchema;
  return {
    setters: [function (_zod) {
      z = _zod.z;
    }],
    execute: function () {
      // 玩家接口定义
      // 房间状态定义
      // 房间接口定义
      // 玩家验证Schema
      _export("PlayerSchema", PlayerSchema = z.object({
        id: z.string(),
        name: z.string(),
        isReady: z.boolean(),
        isAI: z.boolean(),
        // Added for AI player identification
        aiType: z.string().optional() // Optional: Specifies the type of AI

      })); // 聊天消息接口
      // 心跳检测接口


      // 房间验证Schema
      _export("RoomSchema", RoomSchema = z.object({
        id: z.string(),
        hostId: z.string(),
        // 添加 hostId 验证
        name: z.string().optional(),
        players: z.array(PlayerSchema),
        // 修改为 PlayerSchema 数组验证
        playerCount: z.number(),
        maxPlayers: z.number(),
        status: z.enum(["waiting", "gaming", "closed"]),
        hasPassword: z.boolean(),
        isPrivate: z.boolean(),
        hasFriends: z.boolean(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
      })); // 聊天消息验证Schema


      _export("ChatMessageSchema", ChatMessageSchema = z.object({
        roomId: z.string(),
        senderId: z.string(),
        senderName: z.string(),
        content: z.string().min(1).max(500),
        timestamp: z.number()
      })); // 心跳验证Schema


      _export("HeartbeatSchema", HeartbeatSchema = z.object({
        timestamp: z.number(),
        clientTime: z.number().optional()
      })); // 创建房间请求验证


      _export("CreateRoomRequestSchema", CreateRoomRequestSchema = z.object({
        playerName: z.string().min(1).max(20)
      })); // 加入房间请求验证


      _export("JoinRoomRequestSchema", JoinRoomRequestSchema = z.object({
        roomId: z.string(),
        playerName: z.string().min(1).max(20)
      })); // 离开房间请求验证


      _export("LeaveRoomRequestSchema", LeaveRoomRequestSchema = z.object({
        roomId: z.string(),
        playerId: z.string()
      })); // 获取房间信息请求验证


      _export("GetRoomInfoRequestSchema", GetRoomInfoRequestSchema = z.object({
        roomId: z.string()
      }));
    }
  };
});
//# sourceMappingURL=5445c87754dc93b35f4490d8621928447f005a92.js.map