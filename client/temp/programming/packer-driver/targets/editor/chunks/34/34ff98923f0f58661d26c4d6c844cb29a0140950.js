System.register(["__unresolved_0", "cc", "zod"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, z, _crd, PlayerSchema, RoomSchema, ChatMessageSchema, HeartbeatSchema, CreateRoomRequestSchema, JoinRoomRequestSchema, LeaveRoomRequestSchema, GetRoomInfoRequestSchema;

  function _reportPossibleCrUseOfz(extras) {
    _reporterNs.report("z", "zod", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_zod) {
      z = _zod.z;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f8ba1bBbR1P/ZQ0G+bj3RK+", "room-protocol", undefined);

      // 玩家接口定义
      // 房间状态定义
      // 房间接口定义
      // 玩家验证Schema
      _export("PlayerSchema", PlayerSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        id: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        name: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        isReady: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        isAI: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        // Added for AI player identification
        aiType: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().optional() // Optional: Specifies the type of AI

      })); // 聊天消息接口
      // 心跳检测接口


      // 房间验证Schema
      _export("RoomSchema", RoomSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        id: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        hostId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        // 添加 hostId 验证
        name: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().optional(),
        players: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).array(PlayerSchema),
        // 修改为 PlayerSchema 数组验证
        playerCount: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number(),
        maxPlayers: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number(),
        status: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).enum(["waiting", "gaming", "closed"]),
        hasPassword: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        isPrivate: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        hasFriends: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        createdAt: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).date().optional(),
        updatedAt: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).date().optional()
      })); // 聊天消息验证Schema


      _export("ChatMessageSchema", ChatMessageSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        roomId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        senderId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        senderName: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        content: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().min(1).max(500),
        timestamp: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number()
      })); // 心跳验证Schema


      _export("HeartbeatSchema", HeartbeatSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        timestamp: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number(),
        clientTime: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().optional()
      })); // 创建房间请求验证


      _export("CreateRoomRequestSchema", CreateRoomRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        playerName: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().min(1).max(20)
      })); // 加入房间请求验证


      _export("JoinRoomRequestSchema", JoinRoomRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        roomId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        playerName: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().min(1).max(20)
      })); // 离开房间请求验证


      _export("LeaveRoomRequestSchema", LeaveRoomRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        roomId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string()
      })); // 获取房间信息请求验证


      _export("GetRoomInfoRequestSchema", GetRoomInfoRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        roomId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string()
      }));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=34ff98923f0f58661d26c4d6c844cb29a0140950.js.map