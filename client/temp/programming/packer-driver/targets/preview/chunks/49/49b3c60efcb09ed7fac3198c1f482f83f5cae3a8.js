System.register(["__unresolved_0", "cc", "zod"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, z, _crd, FaceSchema, BidSchema, RollDiceRequestSchema, BidRequestSchema, ChallengeRequestSchema, SpotOnRequestSchema, GetInitialGameStateRequestSchema, GameErrorSchema, PlayerDataSchema, GameStateUpdateSchema, DiceRollResultSchema, BidUpdateSchema, ChallengeResultSchema, SpotOnResultSchema, GameEndSchema;

  function _reportPossibleCrUseOfz(extras) {
    _reporterNs.report("z", "zod", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "./game-types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBid(extras) {
    _reporterNs.report("Bid", "./game-types", _context.meta, extras);
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

      _cclegacy._RF.push({}, "0ec8eYIAQxDBIEtfwHAUdnr", "game-protocol", undefined);

      // 假设 game-types.d.ts 定义了 Face 和 Bid
      // Zod Schema for Face (1 to 6)
      FaceSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).number().int().min(1).max(6); // Zod Schema for Bid [Face, count]

      BidSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).tuple([FaceSchema, // Dice value (1-6)
      (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).number().int().min(1) // Count (at least 1)
      ]); // 获取房间信息请求验证 (虽然在 room-protocol.ts 中，但与游戏场景相关，放这里也合理)
      // 如果 room-protocol.ts 已有，则不需要重复定义
      // export const GetRoomInfoRequestSchema = z.object({
      //   roomId: z.string(),
      // });
      // 开始游戏请求验证 - 注意：服务器端实现不接收参数，所以不需要 Schema
      // export const StartGameRequestSchema = z.object({});
      // 摇骰子请求验证

      _export("RollDiceRequestSchema", RollDiceRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        // 假设 gameId 是 UUID
        count: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int().min(1).optional() // 骰子数量，可选

      })); // 叫价请求验证


      _export("BidRequestSchema", BidRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        // 假设 playerId 是 UUID
        bid: BidSchema
      })); // 质疑请求验证


      _export("ChallengeRequestSchema", ChallengeRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid()
      })); // 即时喊 (Spot On) 请求验证


      _export("SpotOnRequestSchema", SpotOnRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid()
      })); // 获取初始游戏状态请求 Schema (客户端发送)


      _export("GetInitialGameStateRequestSchema", GetInitialGameStateRequestSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid()
      })); // 游戏错误信息 Schema (用于服务器向客户端发送错误)


      _export("GameErrorSchema", GameErrorSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        type: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        // e.g., "bid_error", "challenge_error"
        message: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string()
      })); // 玩家数据 Schema (用于游戏状态更新)


      _export("PlayerDataSchema", PlayerDataSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        id: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        name: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string(),
        diceCount: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int().min(0),
        // 骰子数可以为 0
        isAI: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean() // Added for AI player identification
        // socketId: z.string().optional(), // 通常不在广播中发送 socketId

      })); // 游戏状态更新 Schema (部分，根据需要补充)
      // 注意：这个 Schema 用于服务器广播，不是客户端输入验证


      _export("GameStateUpdateSchema", GameStateUpdateSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        players: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).array(PlayerDataSchema),
        // 添加玩家数据数组
        activePlayers: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).array((_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid()),
        currentPlayerIndex: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int(),
        currentBid: BidSchema.or((_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).tuple([(_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).literal(0), (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).literal(0)])),
        // 允许空叫价 [0, 0]
        roundNumber: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int(),
        moveNumber: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int(),
        status: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).enum(["waiting", "playing", "finished"])
      })); // 骰子结果 Schema (服务器发送给单个玩家)


      _export("DiceRollResultSchema", DiceRollResultSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        dices: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).array(FaceSchema)
      })); // 叫价更新 Schema (服务器广播)


      _export("BidUpdateSchema", BidUpdateSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        bid: BidSchema
      })); // 质疑结果 Schema (服务器广播)


      _export("ChallengeResultSchema", ChallengeResultSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        challengerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        challengedId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        // 添加被质疑者ID
        valid: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        totalCount: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int(),
        loserId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid() // 添加失败者ID
        // winner: z.string().uuid().optional() // GameManager 内部广播的是 loserId

      })); // 即时喊结果 Schema (服务器广播)


      _export("SpotOnResultSchema", SpotOnResultSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        playerId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        valid: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).boolean(),
        totalCount: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).number().int(),
        winner: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid().optional() // SpotOn 成功时没有赢家，失败时有

      })); // 游戏结束 Schema (服务器广播)


      _export("GameEndSchema", GameEndSchema = (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
        error: Error()
      }), z) : z).object({
        gameId: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid(),
        winner: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).string().uuid().optional(),
        // 可能没有赢家（平局？）
        status: (_crd && z === void 0 ? (_reportPossibleCrUseOfz({
          error: Error()
        }), z) : z).enum(["finished", "completed"]) // 包含服务器和客户端的状态

      }));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=49b3c60efcb09ed7fac3198c1f482f83f5cae3a8.js.map