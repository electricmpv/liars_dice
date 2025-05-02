System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PlayerState, LiarDiceRoomState, _crd;

  function _reportPossibleCrUseOfPlayerState(extras) {
    _reporterNs.report("PlayerState", "./PlayerState", _context.meta, extras);
  }

  _export("LiarDiceRoomState", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      PlayerState = _unresolved_2.PlayerState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4c9d8Wj40RGT7ISPIHimjUZ", "LiarDiceState", undefined);

      /**
       * 客户端专用的骰子游戏房间状态
       * 用于解决Colyseus Schema导入问题
       */
      _export("LiarDiceRoomState", LiarDiceRoomState = class LiarDiceRoomState {
        // 从服务器数据构造
        constructor(data) {
          // 玩家列表: key 是 sessionId
          this.players = new Map();
          // 参与当前游戏回合的玩家 sessionId 列表 (按顺序)
          this.activePlayerIds = [];
          // 当前轮到的玩家在 activePlayerIds 中的索引
          this.currentPlayerIndex = 0;
          // 当前叫价的点数 (1-6)
          this.currentBidValue = 0;
          // 0 表示尚未开始叫价
          // 当前叫价的数量
          this.currentBidCount = 0;
          // 0 表示尚未开始叫价
          // 上一个叫价的玩家 sessionId (用于质疑判断)
          this.lastBidderSessionId = "";
          // 游戏状态: waiting, playing, challenging, roundOver, finished
          this.status = "waiting";
          // 房主 sessionId (用于开始游戏、踢人等权限)
          this.hostId = "";
          // 当前游戏回合数
          this.roundNumber = 0;
          // 当前回合叫价次数 (用于判断是否可以质疑)
          this.moveNumber = 0;
          // 回合结算信息 (用于显示谁输了，输了多少骰子等)
          this.roundResult = "";
          // 本回合是否已经叫过 1 点 (影响 1 点是否为万能骰)
          this.isOneCalledThisRound = false;

          if (data) {
            this.update(data);
          }
        } // 从服务器数据更新


        update(data) {
          if (!data) return; // 更新基本属性

          if (data.currentPlayerIndex !== undefined) this.currentPlayerIndex = data.currentPlayerIndex;
          if (data.currentBidValue !== undefined) this.currentBidValue = data.currentBidValue;
          if (data.currentBidCount !== undefined) this.currentBidCount = data.currentBidCount;
          if (data.lastBidderSessionId !== undefined) this.lastBidderSessionId = data.lastBidderSessionId;
          if (data.status !== undefined) this.status = data.status;
          if (data.hostId !== undefined) this.hostId = data.hostId;
          if (data.roundNumber !== undefined) this.roundNumber = data.roundNumber;
          if (data.moveNumber !== undefined) this.moveNumber = data.moveNumber;
          if (data.roundResult !== undefined) this.roundResult = data.roundResult;
          if (data.isOneCalledThisRound !== undefined) this.isOneCalledThisRound = data.isOneCalledThisRound; // 更新活跃玩家列表

          if (data.activePlayerIds) {
            this.activePlayerIds = [...data.activePlayerIds];
          } // 更新玩家数据


          if (data.players) {
            // 清空玩家列表，重新添加
            this.players.clear(); // 如果是数组，则遍历添加

            if (Array.isArray(data.players)) {
              for (const playerData of data.players) {
                if (playerData && playerData.sessionId) {
                  this.players.set(playerData.sessionId, new (_crd && PlayerState === void 0 ? (_reportPossibleCrUseOfPlayerState({
                    error: Error()
                  }), PlayerState) : PlayerState)(playerData));
                }
              }
            } // 如果是对象，则遍历键值对
            else if (typeof data.players === 'object') {
              for (const sessionId in data.players) {
                const playerData = data.players[sessionId];

                if (playerData) {
                  this.players.set(sessionId, new (_crd && PlayerState === void 0 ? (_reportPossibleCrUseOfPlayerState({
                    error: Error()
                  }), PlayerState) : PlayerState)(playerData));
                }
              }
            }
          }
        } // 获取当前玩家


        getCurrentPlayer() {
          if (this.activePlayerIds.length === 0) return undefined;
          const currentSessionId = this.activePlayerIds[this.currentPlayerIndex];
          return this.players.get(currentSessionId);
        } // 获取上一个叫价的玩家


        getLastBidder() {
          if (!this.lastBidderSessionId) return undefined;
          return this.players.get(this.lastBidderSessionId);
        } // 获取房主


        getHost() {
          if (!this.hostId) return undefined;
          return this.players.get(this.hostId);
        } // 获取所有玩家数组


        getPlayersArray() {
          return Array.from(this.players.values());
        } // 获取活跃玩家数组


        getActivePlayersArray() {
          return this.activePlayerIds.map(sessionId => this.players.get(sessionId)).filter(player => player !== undefined);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9157da5e97a97a6f74c18e7e533120b41af97ab1.js.map