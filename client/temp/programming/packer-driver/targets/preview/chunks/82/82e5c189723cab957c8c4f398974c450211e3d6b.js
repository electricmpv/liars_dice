System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, director, Prefab, NetworkManager, NetworkErrorCode, NetworkErrorHandler, PlayerState, UIUpdater, EventHandler, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, RoomUI;

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

  function _reportPossibleCrUseOfNetworkErrorHandler(extras) {
    _reporterNs.report("NetworkErrorHandler", "../core/error-handler", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLiarDiceRoomState(extras) {
    _reporterNs.report("LiarDiceRoomState", "../../shared/schemas/liar-dice-room-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerState(extras) {
    _reporterNs.report("PlayerState", "../../shared/schemas/player-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIUpdater(extras) {
    _reporterNs.report("UIUpdater", "./ui-updater", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventHandler(extras) {
    _reporterNs.report("EventHandler", "./event-handler", _context.meta, extras);
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
      Node = _cc.Node;
      Label = _cc.Label;
      Button = _cc.Button;
      director = _cc.director;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
      NetworkErrorCode = _unresolved_2.NetworkErrorCode;
    }, function (_unresolved_3) {
      NetworkErrorHandler = _unresolved_3.NetworkErrorHandler;
    }, function (_unresolved_4) {
      PlayerState = _unresolved_4.PlayerState;
    }, function (_unresolved_5) {
      UIUpdater = _unresolved_5.UIUpdater;
    }, function (_unresolved_6) {
      EventHandler = _unresolved_6.EventHandler;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "18a38yFFQRBPol4yuCyh04P", "room-ui", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'Color', 'director', 'Prefab', 'instantiate', 'ScrollView', 'Layout']); // 导入 NetworkManager 而不是 network
      // Use relative path without .ts
      // Import from relative path without .ts
      // 修正导入路径并移除 .ts 后缀
      // 导入客户端专用房间状态
      // 导入客户端专用玩家状态
      // 导入 MapSchema
      // 不再需要导入 MapSchema，改用原生 Map 类型
      // import { LoginManager } from '../core/login-manager'; // Likely not needed directly anymore
      // Import from relative path without .ts


      // Import from relative path without .ts
      // 移除 networkManager 导入，直接使用 NetworkManager
      ({
        ccclass,
        property
      } = _decorator);
      /**image.png
       * 房间内等待场景 UI 组件 (适配 Colyseus)
       */

      _export("RoomUI", RoomUI = (_dec = ccclass('RoomUI'), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property(Prefab), _dec5 = property(Button), _dec6 = property(Label), _dec7 = property(Button), _dec8 = property(Button), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Button), _dec(_class = (_class2 = class RoomUI extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "roomIdLabel", _descriptor, this);

          _initializerDefineProperty(this, "playerListContent", _descriptor2, this);

          _initializerDefineProperty(this, "playerItemPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "readyButton", _descriptor4, this);

          _initializerDefineProperty(this, "readyButtonLabel", _descriptor5, this);

          _initializerDefineProperty(this, "startGameButton", _descriptor6, this);

          _initializerDefineProperty(this, "leaveRoomButton", _descriptor7, this);

          _initializerDefineProperty(this, "statusLabel", _descriptor8, this);

          _initializerDefineProperty(this, "playerCountLabel", _descriptor9, this);

          _initializerDefineProperty(this, "inviteAIButton", _descriptor10, this);

          // Internal state
          this._roomId = '';
          this._sessionId = '';
          // Use Colyseus Session ID
          this._isReady = false;
          this._isHost = false;
          this._colyseusState = null;
          // Store full Colyseus state
          this.maxClients = 6;
          // 最大玩家数量
          // Singletons - Initialize directly at declaration
          this.uiUpdater = (_crd && UIUpdater === void 0 ? (_reportPossibleCrUseOfUIUpdater({
            error: Error()
          }), UIUpdater) : UIUpdater).getInstance();
          this.eventHandler = (_crd && EventHandler === void 0 ? (_reportPossibleCrUseOfEventHandler({
            error: Error()
          }), EventHandler) : EventHandler).getInstance();
        }

        // networkManager is used directly via import
        // Component Lifecycle Methods
        onLoad() {
          console.log("[RoomUI] onLoad method started."); // Initialization moved to declaration

          console.log("[RoomUI] onLoad: Before setupEventListeners");

          if (this.statusLabel) {
            (_crd && NetworkErrorHandler === void 0 ? (_reportPossibleCrUseOfNetworkErrorHandler({
              error: Error()
            }), NetworkErrorHandler) : NetworkErrorHandler).initStatusLabel(this.statusLabel);
          } // Get roomId and sessionId from network manager singleton


          this._roomId = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().roomId;
          this._sessionId = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().sessionId;

          if (!this._roomId || !this._sessionId) {
            console.error("[RoomUI] Missing roomId or sessionId from network module!"); // Use UIUpdater for showing error, pass 'this' (Component) for scheduling

            this.uiUpdater.showError(this.statusLabel, "无法获取玩家或房间信息", true, this); // Consider returning to lobby after delay

            this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
            return;
          }

          if (this.roomIdLabel) {
            this.roomIdLabel.string = "\u623F\u95F4\u53F7: " + this._roomId;
            this.roomIdLabel.string = "\u623F\u95F4\u53F7: " + this._roomId;
          } // 使用事件处理单例统一注册事件，并传入 RoomUI 实例作为上下文


          this.eventHandler.setupEventListeners(this); // Pass 'this'

          console.log("[RoomUI] onLoad: After setupEventListeners");
          this.uiUpdater.updateReadyButtonLabel(this.readyButtonLabel, this._isReady); // Update initial button label
          // Start game button update requires state, will be handled in handleStateChange
          // this.updateStartGameButtonInternal(); // Remove this initial call
          // Bind AI button click

          if (this.inviteAIButton) {
            this.inviteAIButton.node.on(Button.EventType.CLICK, this.onQuickInviteAI, this);
            this.inviteAIButton.interactable = false; // Disable until state loaded and confirmed host
          } // Initial state will come via the 'stateUpdate' event listener


          this.uiUpdater.showInfo(this.statusLabel, "等待房间状态...", true, this); // Show loading state
          // Check if state is already available from NetworkManager cache

          var initialState = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().roomState;

          if (initialState) {
            console.log("[RoomUI] Initial state found in network cache.");
            this.handleStateChange(initialState); // Process initial state if available
          }
        } // 添加 start 方法用于测试


        start() {
          console.log("[RoomUI] start method called.");
        }

        onDestroy() {
          console.log("[RoomUI] onDestroy method called.");
          console.log("[RoomUI] onDestroy: Before removeEventListeners"); // Use the initialized EventHandler instance to remove listeners
          // No need for fallback as it's initialized at declaration

          this.eventHandler.removeEventListeners();
          console.log("[RoomUI] onDestroy: After removeEventListeners");
        } // Removed setupEventListeners and removeEventListeners methods
        // --- Event Handling Methods (called by EventHandler) ---
        // Make them public so EventHandler can call them


        handleStateChange(state) {
          var _director$getScene, _director$getScene2, _director$getScene3, _director$getScene4;

          console.log("[RoomUI] handleStateChange ENTERED. Current Scene: " + ((_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.name)); // 检查状态是否为空

          if (!state) {
            console.warn("[RoomUI] handleStateChange received null state. Aborting.");
            return;
          } // 存储最新状态


          this._colyseusState = state;
          console.log("[RoomUI] State stored locally."); // 确保 sessionId 设置正确（可能在加入后稍有延迟）

          if (!this._sessionId && (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().sessionId) {
            this._sessionId = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().sessionId;
            console.log("[RoomUI] Session ID updated internally: " + this._sessionId);
          }

          if (!this._sessionId) {
            console.error("[RoomUI] Cannot process state update without a session ID! Network Session ID:", (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().sessionId, ". Aborting.");
            return; // Cannot identify self without sessionId
          }

          console.log("[RoomUI] Processing state for sessionId: " + this._sessionId); // 安全处理 players 对象

          var playerCount = 0;
          var playersList = []; // 检查 players 对象是否存在

          if (state.players) {
            try {
              var _state$players$constr;

              // 记录 players 对象的类型信息，用于调试
              console.log("[RoomUI] players \u7C7B\u578B: " + typeof state.players + ", \u6784\u9020\u51FD\u6570: " + (((_state$players$constr = state.players.constructor) == null ? void 0 : _state$players$constr.name) || '未知')); // 尝试不同的方法获取玩家列表

              if (typeof state.players.forEach === 'function') {
                // 如果 players 是 MapSchema 或类似对象，使用 forEach 方法
                console.log('[RoomUI] 使用 forEach 方法处理 players');
                state.players.forEach((player, key) => {
                  // 安全地处理玩家数据，同时支持 id 和 sessionId
                  playersList.push(player);
                  var playerId = player.id || '';
                  var playerSessionId = player.sessionId || key;
                  console.log("[RoomUI] \u73A9\u5BB6: ID=" + playerId + ", SessionID=" + playerSessionId + ", \u540D\u79F0: " + player.name + ", \u51C6\u5907: " + player.isReady + ", \u4E3B\u673A: " + (playerSessionId === state.hostId || key === state.hostId));
                });
                playerCount = playersList.length;
              } else if (typeof state.players === 'object') {
                // 如果 players 是普通对象，使用 Object.values
                console.log('[RoomUI] 使用 Object.values 方法处理 players');
                playersList = Object.values(state.players);
                playerCount = playersList.length;
                playersList.forEach(player => {
                  // 安全地处理玩家数据，同时支持 id 和 sessionId
                  var playerId = player.id || '';
                  var playerSessionId = player.sessionId || '';
                  console.log("[RoomUI] \u73A9\u5BB6: ID=" + playerId + ", SessionID=" + playerSessionId + ", \u540D\u79F0: " + player.name + ", \u51C6\u5907: " + player.isReady + ", \u4E3B\u673A: " + (playerSessionId === state.hostId));
                });
              }

              console.log("[RoomUI] \u5171\u627E\u5230 " + playerCount + " \u540D\u73A9\u5BB6");
            } catch (error) {
              console.error('[RoomUI] 处理 players 对象时出错:', error);
            }
          } else {
            console.warn('[RoomUI] state.players 不存在或为空');
          } // Update internal flags
          // console.log("[RoomUI] Updating internal flags (isHost, isReady)...", state.hostId, this._sessionId);


          this._isHost = this._sessionId === state.hostId; // 使用 MapSchema 的 get 方法访问玩家状态

          var myPlayerState = state.players ? state.players.get(this._sessionId) : undefined;
          this._isReady = (myPlayerState == null ? void 0 : myPlayerState.isReady) || false;
          console.log("[RoomUI] State processed: isHost=" + this._isHost + ", isReady=" + this._isReady + ", myPlayerState found: " + !!myPlayerState); // Update UI elements using UIUpdater and internal methods

          if (this.roomIdLabel && this._roomId !== (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().roomId) {
            // 使用 NetworkManager.getInstance()
            this._roomId = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().roomId;
            this.uiUpdater.updateRoomIdLabel(this.roomIdLabel, this._roomId);
            console.log("[RoomUI] Room ID label updated to: " + this._roomId);
          } // Update Player List using UIUpdater (provide all required args)


          console.log("[RoomUI] Calling uiUpdater.updatePlayerList...");
          this.uiUpdater.updatePlayerList(this.playerListContent, this.playerItemPrefab, state.players, this._sessionId, state.hostId); // Update Ready Button (Label via UIUpdater, interactability handled internally)
          // console.log("[RoomUI] Calling updateReadyButtonInternal...");

          this.updateReadyButtonInternal(); // Use internal method
          // Update Start Game Button (via UIUpdater, conditions calculated internally)
          // console.log("[RoomUI] Calling updateStartGameButtonInternal...");

          this.updateStartGameButtonInternal(); // Use internal method
          // Update Player Count Label using Object.keys length

          if (this.playerCountLabel) {
            var currentCount = state.players ? Object.keys(state.players).length : 0;
            this.uiUpdater.updatePlayerCountLabel(this.playerCountLabel, currentCount, this.maxClients); // console.log(`[RoomUI] Player count label updated: ${currentCount}/${this.maxClients}`);
          } // Update AI Button interactability using Object.keys length


          if (this.inviteAIButton) {
            var _currentCount = state.players ? Object.keys(state.players).length : 0;

            var canInviteAI = this._isHost && _currentCount < this.maxClients && state.status === 'waiting';
            this.uiUpdater.updateInviteAIButton(this.inviteAIButton, canInviteAI); // console.log(`[RoomUI] Invite AI button interactable set to: ${canInviteAI}`);
          } // Clear loading/status message once state is received


          if (this.statusLabel && this.statusLabel.node.active && this.statusLabel.string === "等待房间状态...") {
            this.statusLabel.node.active = false; // Directly hide it

            console.log("[RoomUI] Cleared 'Waiting for state...' status label.");
          } // Check game status for scene transition (alternative to 'gameStarted' message)


          console.log("[RoomUI] Checking game status for scene transition. Current status: " + state.status + ", Current scene: " + ((_director$getScene2 = director.getScene()) == null ? void 0 : _director$getScene2.name));

          if (state.status === 'playing' && ((_director$getScene3 = director.getScene()) == null ? void 0 : _director$getScene3.name) === 'RoomScene') {
            console.log("[RoomUI] Game state is 'playing', navigating to GameScene."); // 无需显式传递 gameId，GameUI 将通过 NetworkManager.getInstance().roomId 获取

            director.loadScene('GameScene');
          } else if (state.status === 'finished' && ((_director$getScene4 = director.getScene()) == null ? void 0 : _director$getScene4.name) === 'RoomScene') {
            // Game finished while waiting? Show message and return to lobby?
            console.log("[RoomUI] Game state is 'finished' while in RoomScene, returning to Lobby.");
            this.uiUpdater.showError(this.statusLabel, "游戏已结束，即将返回大厅...", true, this);
            this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
          }

          console.log("[RoomUI] handleStateChange finished.");
        } // Handle player data message (might be partial update)


        handlePlayerData(data) {
          console.log("[RoomUI] Received player data:", data); // 更新当前玩家信息

          if (data.id) {
            this._sessionId = data.id;
            console.log("[RoomUI] \u66F4\u65B0\u4F1A\u8BDDID: " + this._sessionId);
          } // Update host status if provided


          if (data.hasOwnProperty('isHost')) {
            this._isHost = data.isHost;
            console.log("[RoomUI] Updated host status: " + this._isHost);
            this.updateStartGameButtonInternal(); // Update button state
          } // 如果包含玩家列表，更新UI


          if (data.playerList && Array.isArray(data.playerList)) {
            console.log("[RoomUI] \u6536\u5230\u73A9\u5BB6\u5217\u8868\uFF0C\u5305\u542B " + data.playerList.length + " \u540D\u73A9\u5BB6"); // 清空现有玩家列表

            if (this.playerListContent) {
              this.playerListContent.removeAllChildren();
            } // 创建玩家项 - 这部分逻辑似乎与 handleStateChange 重复，
            // 并且 tempPlayer 未被使用。暂时注释掉以避免错误和冗余。
            // data.playerList.forEach((playerData: any) => {
            //   if (playerData.id && playerData.name) {
            //     // PlayerState is a type, cannot use 'new'
            //     // const tempPlayer: PlayerState = { /* ... */ };
            //     // ... (rest of the logic using tempPlayer)
            //   }
            // });
            // Update player count label if list is provided here


            if (this.playerCountLabel) {
              this.uiUpdater.updatePlayerCountLabel(this.playerCountLabel, data.playerList.length, this.maxClients);
            }
          } // Update UI button states based on potentially changed isHost or isReady


          this.updateReadyButtonInternal();
          this.updateStartGameButtonInternal();
        } // Handle full room state message (might be initial connection or specific request)


        handleFullRoomState(data) {
          console.log("[RoomUI] Received full room state:", data); // 更新房间状态

          if (data.status) {
            // Ensure state object exists before accessing properties
            // Use {} as Type for interfaces/types
            if (!this._colyseusState) this._colyseusState = {}; // Add null check before assignment

            if (this._colyseusState) {
              this._colyseusState.status = data.status;
            }
          } // Update host ID and status


          if (data.hostId) {
            // Ensure state object exists
            // Use {} as Type for interfaces/types
            if (!this._colyseusState) this._colyseusState = {}; // Add null check before assignment

            if (this._colyseusState) {
              this._colyseusState.hostId = data.hostId;
              this._isHost = data.hostId === this._sessionId;
              console.log("[RoomUI] Updated host status from full state: " + this._isHost);
            } else {
              // Handle case where state is null but hostId is provided
              this._isHost = data.hostId === this._sessionId;
              console.log("[RoomUI] Updated host status from full state (state was null): " + this._isHost);
            }
          } // 如果包含玩家列表，更新UI


          if (data.players && Array.isArray(data.players)) {
            var _director$getScene5;

            console.log("[RoomUI] \u6536\u5230\u73A9\u5BB6\u5217\u8868\uFF0C\u5305\u542B " + data.players.length + " \u540D\u73A9\u5BB6"); // 清空现有玩家列表

            if (this.playerListContent) {
              this.playerListContent.removeAllChildren();
            } // Ensure _colyseusState exists before proceeding


            if (!this._colyseusState) this._colyseusState = {}; // Initialize as empty object if needed
            // 创建新的 PlayerState 实例并添加到 Map 中
            // 使用原生 Map 替代 MapSchema

            var playersMap = new Map();
            data.players.forEach(pData => {
              // 检查 pData.id 是否存在
              if (pData && typeof pData === 'object' && pData.hasOwnProperty('id')) {
                // 创建新的 PlayerState 实例
                var playerState = new (_crd && PlayerState === void 0 ? (_reportPossibleCrUseOfPlayerState({
                  error: Error()
                }), PlayerState) : PlayerState)(); // 设置属性

                playerState.id = pData.id || ''; // 设置 id

                playerState.sessionId = pData.sessionId || pData.id || ''; // 优先使用 sessionId，如果没有则使用 id

                playerState.name = pData.name || 'Unknown';
                playerState.isReady = pData.isReady || false;
                playerState.diceCount = pData.diceCount || 5; // 默认给 5 个骰子

                playerState.isConnected = pData.isConnected !== undefined ? pData.isConnected : true;
                playerState.isAI = pData.isAI || false;
                playerState.aiType = pData.aiType || ''; // 将玩家状态添加到 MapSchema 中

                playersMap.set(pData.id, playerState); // Update current player's ready state

                if (pData.id === this._sessionId) {
                  this._isReady = playerState.isReady;
                }
              } else {
                console.warn("[RoomUI] Invalid player data structure in fullRoomState:", pData);
              }
            }); // 更新状态的 players 对象

            this._colyseusState.players = playersMap; // 使用 MapSchema 调用 updatePlayerList

            this.uiUpdater.updatePlayerList(this.playerListContent, this.playerItemPrefab, playersMap, // 传递 MapSchema
            this._sessionId, this._colyseusState.hostId // 使用可能更新的 hostId
            ); // 更新玩家数量标签

            if (this.playerCountLabel) {
              var currentCount = playersMap.size;
              this.uiUpdater.updatePlayerCountLabel(this.playerCountLabel, currentCount, this.maxClients);
            } // 更新按钮状态


            this.updateReadyButtonInternal();
            this.updateStartGameButtonInternal(); // 检查游戏状态并切换场景

            if (data.status === 'playing' && ((_director$getScene5 = director.getScene()) == null ? void 0 : _director$getScene5.name) === 'RoomScene') {
              console.log("[RoomUI] 游戏状态为'playing'，正在切换到GameScene。");
              director.loadScene('GameScene');
            }
          }
        } // This is the correct closing brace for handleFullRoomState
        // Handle specific game started message


        handleGameStarted(data) {
          var _director$getScene6, _director$getScene7;

          console.log("[RoomUI] Received 'gameStarted' message with ID: " + data.gameId + " (Current Scene: " + ((_director$getScene6 = director.getScene()) == null ? void 0 : _director$getScene6.name) + ")"); // Transition only if still in RoomScene

          if (((_director$getScene7 = director.getScene()) == null ? void 0 : _director$getScene7.name) === 'RoomScene') {
            var _this$_colyseusState;

            // Check state status as well to prevent duplicate navigation
            if (((_this$_colyseusState = this._colyseusState) == null ? void 0 : _this$_colyseusState.status) !== 'playing') {
              console.log("[RoomUI] Navigating to GameScene based on 'gameStarted' message.");
              director.loadScene('GameScene');
            } else {
              console.log("[RoomUI] State already 'playing', ignoring redundant 'gameStarted' message.");
            }
          }
        }

        handleKicked(data) {
          console.warn('[RoomUI] Kicked from room:', data == null ? void 0 : data.reason);
          this.uiUpdater.showError(this.statusLabel, "\u60A8\u5DF2\u88AB\u8E22\u51FA\u623F\u95F4" + (data != null && data.reason ? ': ' + data.reason : ''), true, this);
          this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
        }

        handleDisconnect(code) {
          console.error("[RoomUI] Network disconnected. Code: " + code); // Avoid showing error if it was a graceful leave (code 1000) or already leaving

          if (code !== 1000
          /* && !this.isLeaving */
          ) {
            // Add isLeaving flag if needed
            this.uiUpdater.showError(this.statusLabel, "网络连接已断开", true, this);
          } // Always return to lobby on disconnect from room scene


          this.scheduleOnce(() => director.loadScene('LobbyScene'), 3);
        }

        handleNetworkError(error) {
          console.error('[RoomUI] Network error:', error); // Avoid showing redundant timeout errors or normal leave errors

          if (error.code === (_crd && NetworkErrorCode === void 0 ? (_reportPossibleCrUseOfNetworkErrorCode({
            error: Error()
          }), NetworkErrorCode) : NetworkErrorCode).CONNECTION_TIMEOUT || error.code === 1000) {
            // console.warn('[RoomUI] Suppressed timeout or normal disconnect error display.');
            return;
          }

          this.uiUpdater.showError(this.statusLabel, "\u7F51\u7EDC\u9519\u8BEF (" + error.code + "): " + error.message, false, this); // Consider returning to lobby on certain critical errors
        } // --- Internal UI Update Methods ---
        // These methods now primarily manage button interactability and call UIUpdater


        updateReadyButtonInternal() {
          // Update label via UIUpdater
          this.uiUpdater.updateReadyButtonLabel(this.readyButtonLabel, this._isReady); // Handle interactability based on game state

          if (this.readyButton) {
            var _this$_colyseusState2;

            var isWaiting = ((_this$_colyseusState2 = this._colyseusState) == null ? void 0 : _this$_colyseusState2.status) === 'waiting';
            this.readyButton.interactable = isWaiting; // Can only change ready state while waiting
          }
        }

        updateStartGameButtonInternal() {
          var _this$_colyseusState3;

          var isWaiting = ((_this$_colyseusState3 = this._colyseusState) == null ? void 0 : _this$_colyseusState3.status) === 'waiting'; // Check if conditions are met using UIUpdater's method

          var canStart = this.uiUpdater.checkIfCanStartGame(this._isHost, this._colyseusState); // Update button state (active and interactable) via UIUpdater
          // Ensure _colyseusState is checked before accessing status
          // No need to redeclare isWaiting here, it's declared above in the function scope

          this.uiUpdater.updateStartGameButton(this.startGameButton, this._isHost, canStart, isWaiting);
        } // --- Button Click Handlers ---


        onReadyClick() {
          var newState = !this._isReady;
          console.log("[RoomUI] Ready button clicked. Current state: " + this._isReady + ", attempting to set: " + newState); // Disable button temporarily to prevent double clicks

          if (this.readyButton) this.readyButton.interactable = false; // 通过 NetworkManager 发送消息到服务器

          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().send('setReady', {
            ready: newState
          }); // Re-enable button after a short delay, state update will handle visual change and final interactability

          this.scheduleOnce(() => {
            var _this$_colyseusState4;

            // Re-enable only if still in waiting state
            if (this.readyButton && ((_this$_colyseusState4 = this._colyseusState) == null ? void 0 : _this$_colyseusState4.status) === 'waiting') {
              this.readyButton.interactable = true;
            }
          }, 0.5);
        }

        onStartGameClick() {
          var _this$_colyseusState5;

          console.log('[RoomUI] Start Game button clicked.');
          var currentIsWaiting = ((_this$_colyseusState5 = this._colyseusState) == null ? void 0 : _this$_colyseusState5.status) === 'waiting'; // Use correct check

          if (!this._isHost || !currentIsWaiting) {
            this.uiUpdater.showError(this.statusLabel, "只有房主才能在等待时开始游戏", false, this);
            return;
          } // Use UIUpdater to check conditions


          if (!this.uiUpdater.checkIfCanStartGame(this._isHost, this._colyseusState)) {
            this.uiUpdater.showError(this.statusLabel, "有玩家未准备好或人数不足", false, this);
            return;
          }

          if (this.startGameButton) this.startGameButton.interactable = false; // Prevent double click

          this.uiUpdater.showInfo(this.statusLabel, "正在开始游戏...", false, this);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().send('startGame', {}); // 使用 NetworkManager.getInstance()
          // Server state update or 'gameStarted' message will trigger scene change
        }

        onLeaveRoomClick() {
          console.log('[RoomUI] Leave Room button clicked.');
          if (this.leaveRoomButton) this.leaveRoomButton.interactable = false;
          this.uiUpdater.showInfo(this.statusLabel, "正在离开房间...", true, this); // Persistent message

          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().leaveRoom().catch(error => {
            var _director$getScene8;

            // 使用 NetworkManager.getInstance()
            // leaveRoom itself shouldn't really reject, errors handled by onError/onLeave
            console.error("Error during leaveRoom call (unexpected):", error); // Re-enable button only if leave fails unexpectedly AND we are still in room scene

            if (this.leaveRoomButton && ((_director$getScene8 = director.getScene()) == null ? void 0 : _director$getScene8.name) === 'RoomScene') {
              this.leaveRoomButton.interactable = true;
              this.uiUpdater.showError(this.statusLabel, "离开房间失败", false, this); // Show error
            }
          }); // handleDisconnect listener (called via EventHandler) will handle scene change
        }

        onQuickInviteAI() {
          var _this$_colyseusState6, _this$_colyseusState7;

          var isWaiting = ((_this$_colyseusState6 = this._colyseusState) == null ? void 0 : _this$_colyseusState6.status) === 'waiting';

          if (!this._isHost || !isWaiting) {
            this.uiUpdater.showError(this.statusLabel, "只有房主才能在等待时邀请AI", false, this);
            return;
          } // Check player count using Object.keys length


          var currentSize = (_this$_colyseusState7 = this._colyseusState) != null && _this$_colyseusState7.players ? Object.keys(this._colyseusState.players).length : 0;

          if (currentSize >= this.maxClients) {
            this.uiUpdater.showError(this.statusLabel, "房间已满，无法邀请AI", false, this);
            return;
          }

          if (this.inviteAIButton) this.inviteAIButton.interactable = false; // Prevent double click

          this.uiUpdater.showInfo(this.statusLabel, "正在邀请 AI 加入...", false, this);
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().send('addAI', {
            aiType: 'simple_random'
          }); // 使用 NetworkManager.getInstance()
          // Re-enable button after a delay, state update will handle list change and final interactability

          this.scheduleOnce(() => {
            var _this$_colyseusState8, _this$_colyseusState9;

            var currentIsWaiting = ((_this$_colyseusState8 = this._colyseusState) == null ? void 0 : _this$_colyseusState8.status) === 'waiting'; // Check player count using Object.keys length

            var currentSizeAfterWait = (_this$_colyseusState9 = this._colyseusState) != null && _this$_colyseusState9.players ? Object.keys(this._colyseusState.players).length : 0;

            if (this.inviteAIButton && this._isHost && currentIsWaiting && currentSizeAfterWait < this.maxClients) {
              this.inviteAIButton.interactable = true;
            }
          }, 1.0);
        } // Removed old UI update methods (updatePlayerList, createPlayerItem, updateReadyButton, updateStartGameButton, checkIfCanStartGame)
        // Removed old status display methods (showError, showInfo)


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roomIdLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "playerListContent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "playerItemPrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "readyButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "readyButtonLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "startGameButton", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "leaveRoomButton", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "playerCountLabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "inviteAIButton", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=82e5c189723cab957c8c4f398974c450211e3d6b.js.map