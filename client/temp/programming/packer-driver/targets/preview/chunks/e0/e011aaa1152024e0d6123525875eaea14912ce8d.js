System.register(["@colyseus/schema"], function (_export, _context) {
  "use strict";

  var Schema, MapSchema, ArraySchema, type, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class3, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, PlayerState, LiarDiceRoomState;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_colyseusSchema) {
      Schema = _colyseusSchema.Schema;
      MapSchema = _colyseusSchema.MapSchema;
      ArraySchema = _colyseusSchema.ArraySchema;
      type = _colyseusSchema.type;
    }],
    execute: function () {
      // 定义单个玩家的状态
      _export("PlayerState", PlayerState = (_dec = type("string"), _dec2 = type("string"), _dec3 = type("string"), _dec4 = type("number"), _dec5 = type("boolean"), _dec6 = type("boolean"), _dec7 = type("boolean"), _dec8 = type("string"), _dec9 = type(["number"]), (_class = class PlayerState extends Schema {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "id", _descriptor, this);

          // 玩家唯一 ID (可以是数据库 ID 或生成的 UUID)
          _initializerDefineProperty(this, "sessionId", _descriptor2, this);

          // Colyseus 客户端连接的 Session ID
          _initializerDefineProperty(this, "name", _descriptor3, this);

          // 玩家昵称
          _initializerDefineProperty(this, "diceCount", _descriptor4, this);

          // 玩家当前拥有的骰子数量
          _initializerDefineProperty(this, "isReady", _descriptor5, this);

          // 玩家是否准备开始游戏
          _initializerDefineProperty(this, "isConnected", _descriptor6, this);

          // 玩家是否连接 (onLeave 时可以设为 false)
          _initializerDefineProperty(this, "isAI", _descriptor7, this);

          // 是否是 AI 玩家
          _initializerDefineProperty(this, "aiType", _descriptor8, this);

          // AI 类型 (如果 isAI 为 true)，不使用可选类型
          _initializerDefineProperty(this, "currentDices", _descriptor9, this);
        } // 玩家当前回合的骰子点数 (仅自己可见，考虑是否放在这里或单独发送)


      }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "id", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "sessionId", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "name", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "diceCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "isReady", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "isConnected", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "isAI", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "aiType", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "currentDices", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new ArraySchema();
        }
      })), _class))); // 定义整个游戏房间的状态


      _export("LiarDiceRoomState", LiarDiceRoomState = (_dec10 = type({
        map: PlayerState
      }), _dec11 = type(["string"]), _dec12 = type("number"), _dec13 = type("number"), _dec14 = type("number"), _dec15 = type("string"), _dec16 = type("string"), _dec17 = type("string"), _dec18 = type("number"), _dec19 = type("number"), _dec20 = type("string"), _dec21 = type("boolean"), (_class3 = class LiarDiceRoomState extends Schema {
        constructor() {
          super(...arguments);

          // 玩家列表: key 是 sessionId
          _initializerDefineProperty(this, "players", _descriptor10, this);

          // 参与当前游戏回合的玩家 sessionId 列表 (按顺序)
          _initializerDefineProperty(this, "activePlayerIds", _descriptor11, this);

          // 当前轮到的玩家在 activePlayerIds 中的索引
          _initializerDefineProperty(this, "currentPlayerIndex", _descriptor12, this);

          // 当前叫价的点数 (1-6)
          _initializerDefineProperty(this, "currentBidValue", _descriptor13, this);

          // 0 表示尚未开始叫价
          // 当前叫价的数量
          _initializerDefineProperty(this, "currentBidCount", _descriptor14, this);

          // 0 表示尚未开始叫价
          // 上一个叫价的玩家 sessionId (用于质疑判断)
          _initializerDefineProperty(this, "lastBidderSessionId", _descriptor15, this);

          // 提供默认值
          // 游戏状态: waiting, playing, challenging, roundOver, finished
          _initializerDefineProperty(this, "status", _descriptor16, this);

          // 房主 sessionId (用于开始游戏、踢人等权限)
          _initializerDefineProperty(this, "hostId", _descriptor17, this);

          // 提供默认值
          // 当前游戏回合数
          _initializerDefineProperty(this, "roundNumber", _descriptor18, this);

          // 当前回合叫价次数 (用于判断是否可以质疑)
          _initializerDefineProperty(this, "moveNumber", _descriptor19, this);

          // 回合结算信息 (用于显示谁输了，输了多少骰子等)
          _initializerDefineProperty(this, "roundResult", _descriptor20, this);

          // 提供默认值
          // 本回合是否已经叫过 1 点 (影响 1 点是否为万能骰)
          _initializerDefineProperty(this, "isOneCalledThisRound", _descriptor21, this);
        } // v2.1 新增


      }, (_descriptor10 = _applyDecoratedDescriptor(_class3.prototype, "players", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new MapSchema();
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class3.prototype, "activePlayerIds", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new ArraySchema();
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class3.prototype, "currentPlayerIndex", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class3.prototype, "currentBidValue", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class3.prototype, "currentBidCount", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class3.prototype, "lastBidderSessionId", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class3.prototype, "status", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "waiting";
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class3.prototype, "hostId", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class3.prototype, "roundNumber", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class3.prototype, "moveNumber", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class3.prototype, "roundResult", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class3.prototype, "isOneCalledThisRound", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class3)));
    }
  };
});
//# sourceMappingURL=e011aaa1152024e0d6123525875eaea14912ce8d.js.map