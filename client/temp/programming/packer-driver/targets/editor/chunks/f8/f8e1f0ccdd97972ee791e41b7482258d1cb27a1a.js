System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, SimpleEventEmitter, Player, GameBid, GameEngine, _crd;

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHand(extras) {
    _reporterNs.report("Hand", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBid(extras) {
    _reporterNs.report("Bid", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEmptyBid(extras) {
    _reporterNs.report("EmptyBid", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerID(extras) {
    _reporterNs.report("PlayerID", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBidData(extras) {
    _reporterNs.report("BidData", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventEmitter(extras) {
    _reporterNs.report("EventEmitter", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "acdc4zbwRVEV7A3SA81elRq", "GameEngine", undefined);

      /**
       * 简单事件发射器实现
       */
      SimpleEventEmitter = class SimpleEventEmitter {
        constructor() {
          this.listeners = [];
        }

        on(callback) {
          this.listeners.push(callback);
        }

        emit(data) {
          this.listeners.forEach(listener => listener(data));
        }

      };
      /**
       * 玩家类
       */

      Player = class Player {
        constructor(id, name, diceLeft) {
          this.hand = void 0;
          this.id = id;
          this.name = name;
          this.diceLeft = diceLeft;
        }
        /**
         * 生成玩家的骰子
         */


        async buildHand() {
          this.hand = await GameEngine.rollDices(this.diceLeft);
        }

      };
      /**
       * 竞价信息类
       */

      GameBid = class GameBid {
        constructor(value = 0, count = 0, playerId = -1) {
          this.value = value;
          this.count = count;
          this.playerId = playerId;
        }

        toJSON() {
          return this.count === 0 ? [0, 0] : [this.value, this.count];
        }
        /**
         * 提高竞价
         * @param value 骰子面值
         * @param count 骰子数量
         * @returns 竞价是否有效
         */


        increase(value, count, playerId) {
          if (!(count >= this.count && count > 0 && (count > this.count || value > this.value))) return false;
          this.count = count;
          this.value = value;
          this.playerId = playerId;
          return true;
        }

      };
      /**
       * 游戏引擎
       */

      _export("default", GameEngine = class GameEngine {
        /**
         * 创建游戏引擎实例
         * @param gameId 游戏ID
         * @param playerNames 玩家名称数组
         * @param initialDiceCount 初始骰子数量
         */
        constructor(gameId, playerNames, initialDiceCount = 5) {
          // 游戏信息
          this.gameId = void 0;
          this.roundNumber = 0;
          this.moveNumber = 0;
          // 玩家相关
          this.players = [];
          this.activePlayers = [];
          // 当前状态
          this.currentBid = new GameBid();
          this.currentPlayerIndex = 0;
          // 网络事件桩
          this.onBidSubmitted = new SimpleEventEmitter();
          this.onDoubtTriggered = new SimpleEventEmitter();
          this.onSpotOnTriggered = new SimpleEventEmitter();
          this.onRoundComplete = new SimpleEventEmitter();
          this.onGameComplete = new SimpleEventEmitter();
          this.gameId = gameId; // 初始化玩家

          for (let i = 0; i < playerNames.length; i++) {
            const player = new Player(i + 1, playerNames[i], initialDiceCount);
            this.players.push(player);
            this.activePlayers.push(i);
          }
        }
        /**
         * 掷骰子生成结果
         * @param count 骰子数量
         * @returns 骰子结果
         */


        static rollDices(count) {
          // 模拟异步操作
          return new Promise(resolve => {
            setTimeout(() => {
              const result = [];

              for (let i = 0; i < count; i++) {
                const value = Math.ceil(Math.random() * 6);
                result.push(value);
              }

              result.sort();
              resolve(result);
            }, 500); // 添加500ms延迟模拟网络或动画效果
          });
        }
        /**
         * 获取当前玩家
         */


        getCurrentPlayer() {
          const playerIndex = this.activePlayers[this.currentPlayerIndex];
          return this.players[playerIndex];
        }
        /**
         * 检查竞价有效性
         */


        checkBidValidity(bid) {
          let count = 0;
          const value = bid.value; // 统计所有玩家手中符合条件的骰子数量

          for (const playerIndex of this.activePlayers) {
            const player = this.players[playerIndex];
            const hand = player.hand || [];

            for (const dice of hand) {
              if (dice === value) {
                count++;
              }
            }
          }

          return count >= bid.count;
        }
        /**
         * 轮转到下一个玩家
         */


        nextTurn() {
          this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.activePlayers.length;
        }
        /**
         * 开始新的回合
         */


        async startNewRound() {
          this.roundNumber++;
          this.moveNumber = 0;
          this.currentBid = new GameBid(); // 为所有玩家生成新的骰子

          const handPromises = this.activePlayers.map(playerIndex => this.players[playerIndex].buildHand());
          await Promise.all(handPromises);
          console.log(`回合 ${this.roundNumber} 开始!`);
        }
        /**
         * 处理玩家竞价
         * @param playerId 玩家ID
         * @param value 骰子面值
         * @param count 骰子数量
         */


        placeBid(playerId, value, count) {
          // 确保是当前玩家的回合
          const currentPlayer = this.getCurrentPlayer();

          if (currentPlayer.id !== playerId) {
            return false;
          } // 尝试提高竞价


          if (!this.currentBid.increase(value, count, playerId)) {
            return false;
          } // 更新游戏状态


          this.moveNumber++;
          this.nextTurn(); // 触发竞价事件

          this.onBidSubmitted.emit({
            playerId,
            bid: [value, count]
          });
          return true;
        }
        /**
         * 处理玩家质疑
         * @param playerId 质疑的玩家ID
         */


        challengeBid(playerId) {
          // 确保是当前玩家的回合
          const currentPlayer = this.getCurrentPlayer();

          if (currentPlayer.id !== playerId) {
            return Promise.resolve();
          } // 检查上一个竞价的有效性


          const previousBidValid = this.checkBidValidity(this.currentBid); // 触发质疑事件

          this.onDoubtTriggered.emit(playerId);
          let loserId;
          let winnerId;

          if (previousBidValid) {
            // 如果竞价有效，质疑者输
            loserId = playerId;
            winnerId = this.currentBid.playerId;
          } else {
            // 如果竞价无效，上一个竞价者输
            loserId = this.currentBid.playerId;
            winnerId = playerId;
          } // 减少失败者的骰子数量


          this.handlePlayerLoss(loserId); // 触发回合结束事件

          this.onRoundComplete.emit({
            winner: winnerId,
            loser: loserId
          });
          return Promise.resolve();
        }
        /**
         * 处理玩家失败(减少骰子数量)
         * @param playerId 失败的玩家ID
         */


        handlePlayerLoss(playerId) {
          // 找到对应的玩家并减少骰子
          for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === playerId) {
              this.players[i].diceLeft -= 1; // 如果玩家没有骰子了，从活跃列表中移除

              if (this.players[i].diceLeft <= 0) {
                const playerIndexInActive = this.activePlayers.indexOf(i);

                if (playerIndexInActive !== -1) {
                  this.activePlayers.splice(playerIndexInActive, 1);
                } // 如果只剩一个玩家，游戏结束


                if (this.activePlayers.length === 1) {
                  const winnerId = this.players[this.activePlayers[0]].id;
                  this.onGameComplete.emit(winnerId);
                }
              }

              break;
            }
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f8e1f0ccdd97972ee791e41b7482258d1cb27a1a.js.map