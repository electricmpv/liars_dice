System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, EventTarget, NetworkManager, GameStateManager, _crd;

  function _reportPossibleCrUseOfBid(extras) {
    _reporterNs.report("Bid", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "./network", _context.meta, extras);
  }

  _export("GameStateManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      EventTarget = _cc.EventTarget;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ad68BLOZNHoazp6NeWpXm0", "game-state-manager", undefined);

      __checkObsolete__(['EventTarget']); // Import NetworkManager


      // Define the expected payload structure for game:challenge_result
      // (Adjust based on actual server implementation if different)
      // 历史记录项类型
      // 游戏状态类型
      // 玩家数据类型

      /**
       * 游戏状态管理器
       * 负责管理游戏状态和历史记录，确保所有客户端状态同步
       */
      _export("GameStateManager", GameStateManager = class GameStateManager extends EventTarget {
        /**
         * 获取当前游戏状态
         */
        get currentState() {
          return this._gameState;
        }
        /**
         * 获取单例实例
         */


        static get instance() {
          if (!this._instance) {
            this._instance = new GameStateManager();
          }

          return this._instance;
        }
        /**
         * 私有构造函数，确保单例
         */


        constructor() {
          super(); // Add listener for challenge results from NetworkManager

          // 游戏状态
          this._gameState = null;
          // 历史记录
          this._historyItems = [];
          // 当前玩家ID
          this._currentPlayerId = '';
          // 当前玩家骰子
          this._playerDices = [];
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('game:challenge_result', this.handleChallengeResult.bind(this));
          console.log("[GameStateManager] Constructor: Registered listener for 'game:challenge_result'");
        } // Add the event handler method


        handleChallengeResult(data) {
          console.log("[GameStateManager] handleChallengeResult received data:", JSON.stringify(data)); // Log the full received data
          // --- DEBUGGING: Log the bid from the event data ---

          console.log(`[GameStateManager] handleChallengeResult: Received bid from event data:`, data == null ? void 0 : data.bid, `Type: ${typeof (data == null ? void 0 : data.bid)}`, `IsArray: ${Array.isArray(data == null ? void 0 : data.bid)}`); // --- END DEBUGGING ---

          if (!this._gameState) {
            console.error("[GameStateManager] Cannot process challenge result: game state is null.");
            return;
          }

          const {
            challengerId,
            challengedId,
            bid,
            isValid,
            actualCount
          } = data; // Find player names from current game state

          const challenger = this._gameState.players.find(p => p.id === challengerId);

          const challenged = this._gameState.players.find(p => p.id === challengedId);

          if (!challenger || !challenged) {
            console.error("[GameStateManager] Cannot find challenger or challenged player in game state.");
            return;
          } // Determine if the challenge was successful from the challenger's perspective
          // addChallengeHistory expects 'valid' to mean "challenge succeeded" (bid was invalid)


          const challengeSucceeded = !isValid; // If bid was NOT valid, challenge succeeded

          this.addChallengeHistory(challengerId, challengedId, challengeSucceeded, // Pass whether the challenge succeeded
          actualCount, challenger.name, challenged.name, bid);
        }
        /**
         * 初始化游戏状态管理器
         * @param playerId 当前玩家ID
         */


        initialize(playerId) {
          this._currentPlayerId = playerId;
          this._historyItems = [];
          this._gameState = null;
          this._playerDices = [];
        }
        /**
         * 更新游戏状态
         * @param stateData 游戏状态数据
         */


        updateGameState(stateData) {
          const prevState = this._gameState;
          this._gameState = stateData; // 触发状态更新事件

          this.emit('state-updated', {
            prevState,
            currentState: stateData
          });
        }
        /**
         * 添加历史记录
         * @param item 历史记录项
         */


        addHistoryItem(item) {
          // 检查是否已存在相同ID的历史记录
          const existingIndex = this._historyItems.findIndex(h => h.id === item.id);

          if (existingIndex >= 0) {
            // 如果已存在，更新而不是添加
            this._historyItems[existingIndex] = item;
          } else {
            // 添加新的历史记录
            this._historyItems.push(item);
          } // 限制历史记录数量


          if (this._historyItems.length > 100) {
            this._historyItems.shift();
          } // 触发历史记录更新事件


          this.emit('history-updated', {
            items: this._historyItems,
            newItem: item
          });
        }
        /**
         * 添加竞价历史记录
         * @param playerId 玩家ID
         * @param bid 竞价
         * @param playerName 玩家名称
         */


        addBidHistory(playerId, bid, playerName) {
          // --- DEBUGGING: Log the received bid value and type ---
          console.log(`[GameStateManager] addBidHistory called for player ${playerName} (${playerId}). Received bid:`, bid, `Type: ${typeof bid}`, `IsArray: ${Array.isArray(bid)}`); // Defensive check before destructuring

          if (!Array.isArray(bid) || bid.length !== 2) {
            console.error(`[GameStateManager] addBidHistory received invalid bid format. Expected [value, count], got:`, bid); // Optionally add a generic history item indicating an error

            this.addSystemHistory(`错误：处理 ${playerName} 的出价时遇到问题。`);
            return; // Prevent the TypeError
          } // --- END DEBUGGING ---


          const [value, count] = bid; // Destructuring should be safe now

          const faceLabel = this.getFaceLabel(value);
          this.addHistoryItem({
            id: `bid_${playerId}_${Date.now()}`,
            text: `${playerName} 出价: ${count}个 ${faceLabel}`,
            timestamp: Date.now(),
            type: 'bid',
            playerId
          });
        }
        /**
         * 添加质疑历史记录
         * @param challengerId 质疑者ID
         * @param challengedId 被质疑者ID
         * @param valid 质疑是否有效
         * @param totalCount 实际骰子数量
         * @param challengerName 质疑者名称
         * @param challengedName 被质疑者名称
         * @param bid 当前竞价
         */


        addChallengeHistory(challengerId, challengedId, valid, totalCount, challengerName, challengedName, bid) {
          // --- DEBUGGING: Log the bid parameter received by this function ---
          console.log(`[GameStateManager] addChallengeHistory called. Received bid parameter:`, bid, `Type: ${typeof bid}`, `IsArray: ${Array.isArray(bid)}`); // Defensive check before destructuring

          if (!Array.isArray(bid) || bid.length !== 2) {
            console.error(`[GameStateManager] addChallengeHistory received invalid bid format. Expected [value, count], got:`, bid);
            this.addSystemHistory(`错误：处理挑战结果时遇到无效的出价数据。`);
            return; // Prevent the TypeError
          } // --- END DEBUGGING ---


          const [value, count] = bid; // Destructuring should be safe now

          const faceLabel = this.getFaceLabel(value);
          let resultText = "";

          if (valid) {
            // 质疑成功 (对方叫大了)
            resultText = `${challengerName} 质疑 ${challengedName} (${count}个${faceLabel}) 成功! 实际数量: ${totalCount}`;
          } else {
            // 质疑失败 (对方没叫大)
            resultText = `${challengerName} 质疑 ${challengedName} (${count}个${faceLabel}) 失败! 实际数量: ${totalCount}`;
          }

          this.addHistoryItem({
            id: `challenge_${challengerId}_${Date.now()}`,
            text: resultText,
            timestamp: Date.now(),
            type: 'challenge',
            playerId: challengerId
          });
        }
        /**
         * 添加即时喊历史记录
         * @param playerId 玩家ID
         * @param valid 即时喊是否有效
         * @param totalCount 实际骰子数量
         * @param playerName 玩家名称
         * @param bid 当前竞价
         */


        addSpotOnHistory(playerId, valid, totalCount, playerName, bid) {
          const [value, count] = bid;
          const faceLabel = this.getFaceLabel(value);
          let resultText = "";

          if (valid) {
            // 开点成功
            resultText = `${playerName} 开点 (${count}个${faceLabel}) 正确! 实际数量: ${totalCount}`;
          } else {
            // 开点失败
            resultText = `${playerName} 开点 (${count}个${faceLabel}) 错误! 实际数量: ${totalCount}`;
          }

          this.addHistoryItem({
            id: `spot_on_${playerId}_${Date.now()}`,
            text: resultText,
            timestamp: Date.now(),
            type: 'spot_on',
            playerId
          });
        }
        /**
         * 添加系统历史记录
         * @param text 系统消息文本
         */


        addSystemHistory(text) {
          this.addHistoryItem({
            id: `system_${Date.now()}`,
            text,
            timestamp: Date.now(),
            type: 'system'
          });
        }
        /**
         * 更新玩家骰子
         * @param dices 骰子数组
         */


        updatePlayerDices(dices) {
          this._playerDices = dices;
          this.emit('dices-updated', {
            dices
          });
        }
        /**
         * 获取当前游戏状态
         */


        get gameState() {
          return this._gameState;
        }
        /**
         * 获取历史记录
         */


        get historyItems() {
          return [...this._historyItems];
        }
        /**
         * 获取当前玩家ID
         */


        get currentPlayerId() {
          return this._currentPlayerId;
        }
        /**
         * 获取当前玩家骰子
         */


        get playerDices() {
          return [...this._playerDices];
        }
        /**
         * 判断当前是否是玩家的回合
         */


        get isPlayerTurn() {
          if (!this._gameState) {
            console.log(`[GameStateManager] isPlayerTurn: 游戏状态为空，返回false`);
            return false;
          }

          const isMyTurn = this._gameState.activePlayers && this._gameState.currentPlayerIndex !== undefined && this._gameState.activePlayers[this._gameState.currentPlayerIndex] === this._currentPlayerId;
          console.log(`[GameStateManager] isPlayerTurn: 当前玩家ID=${this._currentPlayerId}, 活跃玩家列表=${JSON.stringify(this._gameState.activePlayers)}, 当前玩家索引=${this._gameState.currentPlayerIndex}, 结果=${isMyTurn}`); // 测试代码已移除，使用实际的回合状态

          return isMyTurn;
        }
        /**
         * 获取当前竞价
         */


        get currentBid() {
          if (!this._gameState) return [0, 0];
          return this._gameState.currentBid;
        }
        /**
         * 获取总骰子数量
         */


        get totalDiceCount() {
          if (!this._gameState || !this._gameState.players) return 0;
          return this._gameState.players.reduce((sum, p) => sum + p.diceCount, 0);
        }
        /**
         * 获取骰子面值标签
         */


        getFaceLabel(face) {
          return ["?", "一", "二", "三", "四", "五", "六"][face] || `${face}`;
        }
        /**
         * 清理资源
         */


        clear() {
          this._historyItems = [];
          this._gameState = null;
          this._playerDices = [];
          this._currentPlayerId = ''; // 移除监听器

          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('game:challenge_result', this.handleChallengeResult.bind(this));
          console.log("[GameStateManager] Clear: Removed listener for 'game:challenge_result'");
        }

      });

      GameStateManager._instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4d0f6fd4c7fbcb38c6d151f13c4371811f4c607d.js.map