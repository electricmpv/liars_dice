System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Color, director, isValid, NetworkManager, NetworkErrorCode, PlayerDisplayController, BidController, DiceDisplayController, GameHistoryPanel, GameResultPanel, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, GameUI;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkError(extras) {
    _reporterNs.report("NetworkError", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkErrorCode(extras) {
    _reporterNs.report("NetworkErrorCode", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerDisplayController(extras) {
    _reporterNs.report("PlayerDisplayController", "./player-display-controller", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBidController(extras) {
    _reporterNs.report("BidController", "./bid-controller", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDiceDisplayController(extras) {
    _reporterNs.report("DiceDisplayController", "./dice-display-controller", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameHistoryPanel(extras) {
    _reporterNs.report("GameHistoryPanel", "./game-history-panel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameResultPanel(extras) {
    _reporterNs.report("GameResultPanel", "./game-result-panel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLiarDiceRoomStateClient(extras) {
    _reporterNs.report("LiarDiceRoomStateClient", "../shared/schemas/liar-dice-room-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerStateClient(extras) {
    _reporterNs.report("PlayerStateClient", "../shared/schemas/player-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/types/game-types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBid(extras) {
    _reporterNs.report("Bid", "../../shared/types/game-types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerData(extras) {
    _reporterNs.report("PlayerData", "./player-display-controller", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
      Color = _cc.Color;
      director = _cc.director;
      isValid = _cc.isValid;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
      NetworkErrorCode = _unresolved_2.NetworkErrorCode;
    }, function (_unresolved_3) {
      PlayerDisplayController = _unresolved_3.PlayerDisplayController;
    }, function (_unresolved_4) {
      BidController = _unresolved_4.BidController;
    }, function (_unresolved_5) {
      DiceDisplayController = _unresolved_5.DiceDisplayController;
    }, function (_unresolved_6) {
      GameHistoryPanel = _unresolved_6.GameHistoryPanel;
    }, function (_unresolved_7) {
      GameResultPanel = _unresolved_7.GameResultPanel;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1c1e5EaJ/9J2LU8zBGnY4zf", "game-ui", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'Button', 'director', 'isValid']); // Import Colyseus-based network


      // Import new client-side interfaces
      // Import shared types
      // Import PlayerData type expected by PlayerDisplayController
      // Assuming PlayerData is exported or defined here
      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 游戏UI主控制器 (适配 Colyseus)
       * 负责协调各个UI组件和处理网络事件/状态更新
       */

      _export("GameUI", GameUI = (_dec = ccclass('GameUI'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(_crd && PlayerDisplayController === void 0 ? (_reportPossibleCrUseOfPlayerDisplayController({
        error: Error()
      }), PlayerDisplayController) : PlayerDisplayController), _dec5 = property(_crd && BidController === void 0 ? (_reportPossibleCrUseOfBidController({
        error: Error()
      }), BidController) : BidController), _dec6 = property(_crd && DiceDisplayController === void 0 ? (_reportPossibleCrUseOfDiceDisplayController({
        error: Error()
      }), DiceDisplayController) : DiceDisplayController), _dec7 = property(_crd && GameHistoryPanel === void 0 ? (_reportPossibleCrUseOfGameHistoryPanel({
        error: Error()
      }), GameHistoryPanel) : GameHistoryPanel), _dec8 = property(_crd && GameResultPanel === void 0 ? (_reportPossibleCrUseOfGameResultPanel({
        error: Error()
      }), GameResultPanel) : GameResultPanel), _dec(_class = (_class2 = class GameUI extends Component {
        constructor(...args) {
          super(...args);

          // --- UI 元素引用 ---
          _initializerDefineProperty(this, "gameStatusLabel", _descriptor, this);

          _initializerDefineProperty(this, "roundLabel", _descriptor2, this);

          // --- 控制器引用 ---
          _initializerDefineProperty(this, "playerDisplayController", _descriptor3, this);

          _initializerDefineProperty(this, "bidController", _descriptor4, this);

          _initializerDefineProperty(this, "diceDisplayController", _descriptor5, this);

          _initializerDefineProperty(this, "gameHistoryPanel", _descriptor6, this);

          _initializerDefineProperty(this, "gameResultPanel", _descriptor7, this);

          // --- 游戏状态 ---
          this._roomId = '';
          this._sessionId = '';
          // Use Colyseus session ID
          this._myDices = [];
          // Store own dices received via message
          this._currentBid = [0, 0];
          // Store current bid from state
          this._isMyTurn = false;
          this._totalDiceInGame = 0;

          // --- Network Listener Callbacks ---
          // Type the state parameter as 'any' to avoid importing the original Schema file at runtime
          // Cast to the client interface inside the handler
          this._onStateUpdateCallback = state => this.handleStateChange(state);

          this._onYourDicesCallback = data => this.handleYourDices(data);

          // Type adjusted
          this._onNewRoundCallback = data => this.handleNewRound(data);

          this._onNextTurnCallback = data => this.handleNextTurn(data);

          this._onPlayerBidCallback = data => this.handlePlayerBidUpdate(data);

          this._onChallengeRevealCallback = data => this.handleChallengeReveal(data);

          this._onGameFinishedCallback = data => this.handleGameFinished(data);

          this._onDisconnectCallback = code => this.handleDisconnect(code);

          this._onErrorCallback = error => this.handleNetworkError(error);
        }

        // Listener for generic messages (e.g., chat) - can be handled directly or via NetworkManager specific events
        // private _onMessageCallback = (data: { type: string, message: any }) => this.handleServerMessage(data);
        onLoad() {
          console.log("[GameUI] onLoad called.");
          this.listenToNetworkEvents();
          this.listenToBidControllerEvents();
          this.listenToResultPanelEvents();
        }

        start() {
          console.log("[GameUI] start called.");
          this.initUI();
          this._roomId = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().roomId;
          this._sessionId = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().sessionId; // Get own session ID

          if (!this._roomId || !this._sessionId) {
            console.error("[GameUI] Missing roomId or sessionId from NetworkManager!");
            if (this.gameStatusLabel) this.gameStatusLabel.string = "错误：无法获取游戏信息"; // Consider returning to lobby

            this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
            return;
          }

          console.log(`[GameUI] Room ID: ${this._roomId}, Player Session ID: ${this._sessionId}`); // Initialize PlayerDisplayController

          if (this.playerDisplayController) {
            this.playerDisplayController.initialize(this._sessionId);
          } else {
            console.error("[GameUI] PlayerDisplayController is not assigned!");
          } // Initial game state will be received via the 'stateUpdate' event


          if (this.gameStatusLabel) this.gameStatusLabel.string = "等待游戏状态..."; // Check if state is already cached in NetworkManager

          if ((_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().roomState) {
            console.log("[GameUI] Initial state found in network cache."); // Cast the cached state before passing to the handler

            this.handleStateChange((_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().roomState);
          }
        }
        /**
         * 初始化UI元素状态
         */


        initUI() {
          if (this.gameStatusLabel) this.gameStatusLabel.string = "连接中...";
          if (this.roundLabel) this.roundLabel.string = "回合: 0";
          if (this.gameResultPanel) this.gameResultPanel.hidePanel();
          if (this.bidController) this.bidController.node.active = false; // Hide bid controls initially

          if (this.diceDisplayController) this.diceDisplayController.clearDices();
        }
        /**
         * 监听网络事件
         */


        listenToNetworkEvents() {
          console.log("[GameUI] Registering network listeners.");
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('stateUpdate', this._onStateUpdateCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('yourDices', this._onYourDicesCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('newRound', this._onNewRoundCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('nextTurn', this._onNextTurnCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('playerBid', this._onPlayerBidCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('challengeReveal', this._onChallengeRevealCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('gameFinished', this._onGameFinishedCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('disconnected', this._onDisconnectCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('error', this._onErrorCallback); // network.on('messageReceived', this._onMessageCallback); // For chat etc.
        }
        /**
         * 移除网络事件监听
         */


        cleanupNetworkListeners() {
          console.log("[GameUI] Cleaning up network listeners.");
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('stateUpdate', this._onStateUpdateCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('yourDices', this._onYourDicesCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('newRound', this._onNewRoundCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('nextTurn', this._onNextTurnCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('playerBid', this._onPlayerBidCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('challengeReveal', this._onChallengeRevealCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('gameFinished', this._onGameFinishedCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('disconnected', this._onDisconnectCallback);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('error', this._onErrorCallback); // network.off('messageReceived', this._onMessageCallback);
        }
        /**
         * 监听来自 BidController 的事件
         */


        listenToBidControllerEvents() {
          if (this.bidController) {
            console.log("[GameUI] Registering BidController listeners.");
            this.bidController.node.on('place-bid', this.handleLocalPlaceBid, this); // Renamed handler

            this.bidController.node.on('challenge', this.handleLocalChallenge, this); // Renamed handler
            // this.bidController.node.on('spot-on', this.handleLocalSpotOn, this); // Add if implemented
          } else {
            console.warn("[GameUI] BidController not available for event listening.");
          }
        }
        /**
         * 监听来自 GameResultPanel 的事件
         */


        listenToResultPanelEvents() {
          if (this.gameResultPanel) {
            this.gameResultPanel.node.on('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
          }
        } // --- Network Event Handlers ---

        /**
         * 主状态更新处理
         * Accepts the state casted to the client-side interface type
         */


        handleStateChange(state) {
          var _this$gameResultPanel, _this$gameResultPanel2;

          // Use Client Interface type
          // console.log("[GameUI] Handling State Change:", JSON.stringify(state).substring(0, 300));
          if (!this._sessionId) {
            console.error("[GameUI] Cannot handle state change, own sessionId is unknown.");
            return;
          }

          if (!state) {
            console.warn("[GameUI] Received null state in handleStateChange.");
            return;
          } // Update players display


          if (this.playerDisplayController && state.players) {
            // CONVERT from Record<string, PlayerStateClient> to PlayerData[]
            const playersDataArray = Object.entries(state.players).map(([sessionId, pState]) => ({
              id: sessionId,
              // Use sessionId as the key which maps to PlayerData's id
              name: pState.name,
              isReady: pState.isReady,
              isAI: pState.isAI,
              diceCount: pState.diceCount
            })); // activePlayerIds is now string[]

            const activePlayerIdsArray = state.activePlayerIds;
            const currentPlayerId = activePlayerIdsArray[state.currentPlayerIndex]; // Pass the converted PlayerData[]

            this.playerDisplayController.updatePlayerDisplays(playersDataArray, currentPlayerId);
          } // Update total dice count using Object.values with Record


          this._totalDiceInGame = 0;

          if (state.players) {
            this._totalDiceInGame = Object.values(state.players).reduce((sum, p) => sum + p.diceCount, 0);
          } // Update current bid


          this._currentBid = [state.currentBidValue, state.currentBidCount]; // Check if it's my turn using standard array indexing

          this._isMyTurn = state.status === 'playing' && state.activePlayerIds[state.currentPlayerIndex] === this._sessionId; // Update BidController state

          if (this.bidController) {
            this.bidController.node.active = state.status === 'playing'; // Show/hide based on game status

            if (state.status === 'playing') {
              // Use 'any' to bypass strict type check for the bid array if casting doesn't work
              const bidForController = this._currentBid[1] === 0 ? [0, 0] : [this._currentBid[0], this._currentBid[1]];
              this.bidController.updateState(this._isMyTurn, bidForController, this._totalDiceInGame);
            }
          } // Update round label


          if (this.roundLabel) {
            this.roundLabel.string = `回合: ${state.roundNumber}`;
          } // Update status label


          this.updateGameStatusLabel(state); // If status is finished, show results (might be redundant with handleGameFinished)

          if (state.status === 'finished' && !((_this$gameResultPanel = this.gameResultPanel) != null && _this$gameResultPanel.node.active) && state.players) {
            var _winner;

            console.log("[GameUI] State indicates game finished, showing results panel."); // Find winner using Object.values for Record

            let winner = undefined;

            for (const p of Object.values(state.players)) {
              // Iterate over values of Record
              if (p.diceCount > 0) {
                winner = p;
                break; // Assuming only one winner, exit loop once found
              }
            } // Pass winnerSessionId safely (it can be undefined)


            this.handleGameFinished({
              winnerSessionId: (_winner = winner) == null ? void 0 : _winner.sessionId
            }); // PlayerStateClient has sessionId
          } else if (state.status !== 'finished' && (_this$gameResultPanel2 = this.gameResultPanel) != null && _this$gameResultPanel2.node.active) {
            this.gameResultPanel.hidePanel(); // Hide result panel if game restarts or returns to waiting
          }
        }
        /**
         * 处理服务器发送的个人骰子信息
         */


        handleYourDices(data) {
          var _this$diceDisplayCont;

          console.log(`[GameUI] Received my dices:`, data.dices);
          this._myDices = data.dices;
          (_this$diceDisplayCont = this.diceDisplayController) == null || _this$diceDisplayCont.displayDices(this._myDices); // Add history item for dice roll - REMOVED (History logging responsibility moved)
          // if (this.gameHistoryPanel) { ... }
        }
        /**
         * 处理新回合开始的消息
         */


        handleNewRound(data) {
          var _this$diceDisplayCont2, _this$gameResultPanel3;

          console.log(`[GameUI] Handling new round: ${data.roundNumber}`);
          if (this.roundLabel) this.roundLabel.string = `回合: ${data.roundNumber}`;
          this._myDices = []; // Clear previous dices

          (_this$diceDisplayCont2 = this.diceDisplayController) == null || _this$diceDisplayCont2.clearDices(); // Clear display

          if ((_this$gameResultPanel3 = this.gameResultPanel) != null && _this$gameResultPanel3.node.active) this.gameResultPanel.hidePanel(); // Hide previous result
          // Add history item - REMOVED (History logging responsibility moved)
          // if (this.gameHistoryPanel) { ... }
          // State update will handle player displays and turn indicator
        }
        /**
         * 处理轮到下一玩家的消息
         */


        handleNextTurn(data) {
          console.log(`[GameUI] Handling next turn. Current player: ${data.currentPlayerSessionId}`);
          this._isMyTurn = data.currentPlayerSessionId === this._sessionId; // State update should follow shortly, this is just for quicker UI feedback if needed
          // We rely on handleStateChange to update most UI elements
          // Removed call to non-existent updateTurn
          // if (this.bidController) {
          //      this.bidController.updateTurn(this._isMyTurn);
          // }
          // Add history item if turn passed *without* a bid (e.g. after challenge)
          // We need more context here, maybe rely on state change for history?
        }
        /**
         * 处理其他玩家叫价的广播消息
         */


        handlePlayerBidUpdate(data) {
          console.log(`[GameUI] Handling player bid update: ${data.sessionId} bids ${data.count}x${data.value}`);
          this._currentBid = [data.value, data.count]; // Update local cache of current bid
          // Add history item - REMOVED (History logging responsibility moved)
          // if (this.gameHistoryPanel) { ... }
          // State update should follow, rely on handleStateChange for BidController update
          // If state update is slow, could update BidController here:
          // if (this.bidController) {
          //    this.bidController.updateCurrentBid(this._currentBid);
          // }
        }
        /**
         * 处理质疑结果揭示的消息
         */


        handleChallengeReveal(data) {
          console.log("[GameUI] Handling challenge reveal:", data); // Display all revealed dice

          if (this.diceDisplayController) {
            // Need a way to show all dice temporarily
            // this.diceDisplayController.showAllDices(data.allDice);
            // For now, just ensure own dice are correct (already handled by yourDices?)
            this.diceDisplayController.displayDices(this._myDices); // Re-display own dice
          } // Add detailed history item - REMOVED (History logging responsibility moved)
          // if (this.gameHistoryPanel) { ... }
          // Update status label temporarily


          if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "质疑结果...";
            this.gameStatusLabel.color = Color.YELLOW;
          } // Hide bid controls during reveal/pause


          if (this.bidController) {
            this.bidController.node.active = false;
          } // Next round/game end will be triggered by state change after server delay

        }
        /**
         * 处理游戏结束的消息
         */


        handleGameFinished(data) {
          console.log("[GameUI] Handling game finished:", data); // Disable bid controls

          if (this.bidController) {
            this.bidController.node.active = false;
          } // Show result panel


          if (this.gameResultPanel) {
            var _data$winnerSessionId;

            // Adapt data if necessary (e.g., get full player list from last state)
            const finalState = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().roomState; // Treat last known state as 'any'
            // CONVERT finalState players (likely MapSchema-like) to PlayerData[]

            const playersDataForResult = [];

            if (finalState && finalState.players) {
              try {
                // Attempt MapSchema-like iteration first
                finalState.players.forEach((pState, sessionId) => {
                  playersDataForResult.push({
                    id: sessionId,
                    name: pState.name,
                    isReady: pState.isReady,
                    isAI: pState.isAI,
                    diceCount: pState.diceCount
                  });
                });
              } catch (e) {
                console.warn("[GameUI] Could not iterate finalState.players like MapSchema, trying Object.entries", e); // Fallback to Object.entries if forEach fails

                try {
                  Object.entries(finalState.players).forEach(([sessionId, pState]) => {
                    playersDataForResult.push({
                      id: sessionId,
                      name: pState.name,
                      isReady: pState.isReady,
                      isAI: pState.isAI,
                      diceCount: pState.diceCount
                    });
                  });
                } catch (e2) {
                  console.error("[GameUI] Failed to iterate finalState.players", e2);
                }
              }
            } // Pass winnerSessionId safely as string | undefined


            this.gameResultPanel.showResult({
              winner: (_data$winnerSessionId = data.winnerSessionId) != null ? _data$winnerSessionId : '',
              players: playersDataForResult
            });
          } // Update status label


          if (this.gameStatusLabel) {
            const winnerDisplayName = data.winnerName || (data.winnerSessionId ? `玩家 ${data.winnerSessionId.substring(0, 4)}` : "无");
            this.gameStatusLabel.string = `游戏结束! ${winnerDisplayName} 获胜!`;
            this.gameStatusLabel.color = new Color(255, 215, 0, 255); // Gold color
          }
        }
        /**
         * 处理网络断开连接
         */


        handleDisconnect(code) {
          console.error(`[GameUI] Network disconnected. Code: ${code}`);
          if (!isValid(this.node)) return; // Check if component is still valid

          if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "网络连接已断开";
            this.gameStatusLabel.color = Color.RED;
          } // Optionally show result panel with error/disconnect message?
          // For now, just return to lobby after a delay


          this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
        }
        /**
         * 处理网络错误
         */


        handleNetworkError(error) {
          console.error('[GameUI] Network error:', error);
          if (!isValid(this.node)) return;

          if (this.gameStatusLabel) {
            this.gameStatusLabel.string = `网络错误: ${error.message}`;
            this.gameStatusLabel.color = Color.RED;
          } // Consider returning to lobby on critical errors


          if (error.code !== (_crd && NetworkErrorCode === void 0 ? (_reportPossibleCrUseOfNetworkErrorCode({
            error: Error()
          }), NetworkErrorCode) : NetworkErrorCode).SERVER_ERROR) {
            // Avoid leaving on temporary server issues?
            this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
          }
        } // --- UI Action Handlers ---

        /**
         * 处理本地玩家叫价事件 (from BidController)
         */


        handleLocalPlaceBid(bid) {
          console.log(`[GameUI] handleLocalPlaceBid: Sending bid [${bid[0]}, ${bid[1]}]`);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().send('bid', {
            value: bid[0],
            count: bid[1]
          }); // Temporarily disable controls, server state update will re-enable if necessary
          // Removed call to non-existent updateTurn
          // if (this.bidController) this.bidController.updateTurn(false);

          if (this.gameStatusLabel) this.gameStatusLabel.string = "等待其他玩家...";
        }
        /**
         * 处理本地玩家质疑事件 (from BidController)
         */


        handleLocalChallenge() {
          console.log("[GameUI] handleLocalChallenge: Sending challenge.");
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().send('challenge', {}); // Temporarily disable controls and update status
          // Removed call to non-existent updateTurn
          // if (this.bidController) this.bidController.updateTurn(false);

          if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "质疑中...";
            this.gameStatusLabel.color = Color.YELLOW;
          }
        }
        /**
         * 处理本地玩家开点事件 (from BidController) - IF IMPLEMENTED
         */
        // private handleLocalSpotOn(): void {
        //     console.log("[GameUI] handleLocalSpotOn: Sending spot_on.");
        //     network.send('spot_on', {});
        //     // Temporarily disable controls and update status
        //     // Removed call to non-existent updateTurn
        //     // if (this.bidController) this.bidController.updateTurn(false);
        //     if (this.gameStatusLabel) this.gameStatusLabel.string = "开点中...";
        // }

        /**
         * 处理点数选择按钮点击 (由编辑器配置调用 - Optional, can be handled within BidController)
         */
        // public onBidValueSelect(event: Event, value: string): void {
        //     this.bidController?.onValueSelect(event, value);
        // }

        /**
         * 处理返回大厅请求 (from GameResultPanel)
         */


        handleBackToLobbyRequested() {
          console.log("[GameUI] Back to lobby requested."); // Ensure room is left before changing scene

          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().leaveRoom().finally(() => {
            director.loadScene('LobbyScene');
          });
        }
        /**
         * 更新游戏状态标签 (根据 client interface state)
         * Accepts the state casted to the client-side interface type
         */


        updateGameStatusLabel(state) {
          // Use Client Interface type
          if (!this.gameStatusLabel || !this._sessionId) return; // activePlayerIds is now string[]

          const currentPlayerId = state.activePlayerIds[state.currentPlayerIndex];
          const isMyTurn = currentPlayerId === this._sessionId;

          if (state.status === 'playing') {
            if (isMyTurn) {
              this.gameStatusLabel.string = "轮到你行动！";
              this.gameStatusLabel.color = new Color(0, 255, 0, 255); // Green
            } else {
              var _this$playerDisplayCo, _currentPlayerId$subs;

              // Removed duplicate declaration, use the outer scoped variable
              const currentPlayerName = ((_this$playerDisplayCo = this.playerDisplayController) == null ? void 0 : _this$playerDisplayCo.getPlayerNameWithAlias(currentPlayerId)) || `玩家 ${(_currentPlayerId$subs = currentPlayerId == null ? void 0 : currentPlayerId.substring(0, 4)) != null ? _currentPlayerId$subs : '??'}`;
              this.gameStatusLabel.string = `等待 ${currentPlayerName} 行动...`;
              this.gameStatusLabel.color = Color.WHITE;
            }
          } else if (state.status === 'challenging') {
            this.gameStatusLabel.string = "质疑中...";
            this.gameStatusLabel.color = Color.YELLOW;
          } else if (state.status === 'roundOver') {
            this.gameStatusLabel.string = "回合结束，等待下一轮...";
            this.gameStatusLabel.color = Color.WHITE;
          } else if (state.status === 'finished') {
            var _winner2;

            // Winner determination might need refinement based on final state
            // Find winner using Object.values for Record
            let winner = undefined; // Use client interface

            if (state.players) {
              for (const p of Object.values(state.players)) {
                // Iterate over values of Record
                if (p.diceCount > 0) {
                  winner = p;
                  break; // Assuming only one winner
                }
              }
            } // Safely get winner name, ensure sessionId is a non-empty string before calling alias lookup


            let winnerDisplayName = "无";
            const winnerSessionId = (_winner2 = winner) == null ? void 0 : _winner2.sessionId; // PlayerStateClient has sessionId

            if (winner && winnerSessionId) {
              var _this$playerDisplayCo2;

              // Check if winner and sessionId are truthy (non-empty string)
              // Ensure winnerSessionId is definitely a string before passing
              winnerDisplayName = ((_this$playerDisplayCo2 = this.playerDisplayController) == null ? void 0 : _this$playerDisplayCo2.getPlayerNameWithAlias(winnerSessionId)) || winner.name || "无";
            }

            this.gameStatusLabel.string = `游戏结束! ${winnerDisplayName} 获胜!`;
            this.gameStatusLabel.color = new Color(255, 215, 0, 255); // Gold
          } else if (state.status === 'waiting') {
            this.gameStatusLabel.string = "游戏尚未开始";
            this.gameStatusLabel.color = Color.WHITE;
          } else {
            this.gameStatusLabel.string = `状态: ${state.status}`; // Fallback

            this.gameStatusLabel.color = Color.WHITE;
          }
        } // --- 清理 ---


        onDestroy() {
          console.log("[GameUI] onDestroy called.");
          this.cleanupNetworkListeners(); // Ensure network listeners are removed first
          // Remove BidController listeners

          if (this.bidController && isValid(this.bidController.node, true)) {
            this.bidController.node.off('place-bid', this.handleLocalPlaceBid, this);
            this.bidController.node.off('challenge', this.handleLocalChallenge, this); // this.bidController.node.off('spot-on', this.handleLocalSpotOn, this);
          } // Remove ResultPanel listeners


          if (this.gameResultPanel && isValid(this.gameResultPanel.node, true)) {
            this.gameResultPanel.node.off('back-to-lobby-requested', this.handleBackToLobbyRequested, this);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameStatusLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "roundLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "playerDisplayController", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bidController", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "diceDisplayController", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gameHistoryPanel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gameResultPanel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4361dea7aac2c6b66a45d8d916c3dcb1c8bd0b5c.js.map