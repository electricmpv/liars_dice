System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, networkManager, EventHandler, _crd;

  function _reportPossibleCrUseOfnetworkManager(extras) {
    _reporterNs.report("networkManager", "./network-manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoomUI(extras) {
    _reporterNs.report("RoomUI", "./room-ui", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLiarDiceRoomStateClient(extras) {
    _reporterNs.report("LiarDiceRoomStateClient", "../shared/schemas/liar-dice-room-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkError(extras) {
    _reporterNs.report("NetworkError", "../core/network", _context.meta, extras);
  }

  _export("EventHandler", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      networkManager = _unresolved_2.networkManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "059beD7tdJOdbd4lepVhTCy", "event-handler", undefined);

      // Use the singleton instance
      // Import RoomUI type for context
      // Import the new client-side interface type
      // Import error type

      /**
       * EventHandler 单例，负责统一管理 RoomUI 的网络事件监听和分发。
       */
      _export("EventHandler", EventHandler = class EventHandler {
        constructor() {
          this.context = null;
          // Store the RoomUI instance
          // Store bound handlers to ensure 'this' context is correct when called by network events
          // State handler accepts 'any' from network, will be cast later
          this.boundHandleStateChange = void 0;
          this.boundHandleGameStarted = void 0;
          this.boundHandleKicked = void 0;
          this.boundHandleDisconnect = void 0;
          this.boundHandleNetworkError = void 0;
          this.boundHandlePlayerData = void 0;
          this.boundHandleFullRoomState = void 0;
          // Bind methods in constructor to ensure 'this' refers to EventHandler instance
          // These bound methods will then call the methods on the stored RoomUI context
          this.boundHandleStateChange = this._handleStateChange.bind(this);
          this.boundHandleGameStarted = this._handleGameStarted.bind(this);
          this.boundHandleKicked = this._handleKicked.bind(this);
          this.boundHandleDisconnect = this._handleDisconnect.bind(this);
          this.boundHandleNetworkError = this._handleNetworkError.bind(this);
          this.boundHandlePlayerData = this._handlePlayerData.bind(this);
          this.boundHandleFullRoomState = this._handleFullRoomState.bind(this);
        }

        static getInstance() {
          if (!EventHandler.instance) {
            EventHandler.instance = new EventHandler();
          }

          return EventHandler.instance;
        } // Setup listeners, storing the RoomUI context


        setupEventListeners(context) {
          var _context$node;

          if (this.context) {
            console.warn("[EventHandler] Listeners already set up for a context. Overwriting.");
            this.removeEventListeners(); // Remove old listeners first
          }

          this.context = context;
          console.log("[EventHandler] Setting up listeners for context:", context == null || (_context$node = context.node) == null ? void 0 : _context$node.name);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('stateUpdate', this.boundHandleStateChange);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('gameStarted', this.boundHandleGameStarted);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('kicked', this.boundHandleKicked);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('disconnected', this.boundHandleDisconnect);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('error', this.boundHandleNetworkError);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('playerData', this.boundHandlePlayerData);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).on('fullRoomState', this.boundHandleFullRoomState);
        } // Remove listeners and clear context


        removeEventListeners() {
          if (!this.context) {// console.warn("[EventHandler] No context found, cannot remove listeners effectively.");
            // Still try to remove listeners from networkManager in case they were somehow added without context
          }

          console.log("[EventHandler] Removing listeners.");
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('stateUpdate', this.boundHandleStateChange);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('gameStarted', this.boundHandleGameStarted);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('kicked', this.boundHandleKicked);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('disconnected', this.boundHandleDisconnect);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('error', this.boundHandleNetworkError);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('playerData', this.boundHandlePlayerData);
          (_crd && networkManager === void 0 ? (_reportPossibleCrUseOfnetworkManager({
            error: Error()
          }), networkManager) : networkManager).off('fullRoomState', this.boundHandleFullRoomState);
          this.context = null; // Clear the context
        } // --- Internal Handlers ---
        // These call the corresponding public methods on the stored RoomUI context
        // Accepts 'any' from the bound listener, casts to client interface before forwarding


        _handleStateChange(state) {
          if (this.context) {
            // Forward the call to the RoomUI instance's method, casting state
            // Need to ensure handleStateChange is public in RoomUI and accepts LiarDiceRoomStateClient
            this.context.handleStateChange(state);
          } else {
            console.warn("[EventHandler] Received stateUpdate but no context is set.");
          }
        }

        _handleGameStarted(data) {
          if (this.context) {
            this.context.handleGameStarted(data);
          } else {
            console.warn("[EventHandler] Received gameStarted but no context is set.");
          }
        }

        _handleKicked(data) {
          if (this.context) {
            this.context.handleKicked(data);
          } else {
            console.warn("[EventHandler] Received kicked but no context is set.");
          }
        }

        _handleDisconnect(code) {
          if (this.context) {
            this.context.handleDisconnect(code);
          } else {
            console.warn("[EventHandler] Received disconnected but no context is set.");
          }
        }

        _handleNetworkError(error) {
          if (this.context) {
            this.context.handleNetworkError(error);
          } else {
            console.warn("[EventHandler] Received error but no context is set.");
          }
        }

        _handlePlayerData(data) {
          if (this.context) {
            this.context.handlePlayerData(data);
          } else {
            console.warn("[EventHandler] Received playerData but no context is set.");
          }
        }

        _handleFullRoomState(data) {
          if (this.context) {
            this.context.handleFullRoomState(data);
          } else {
            console.warn("[EventHandler] Received fullRoomState but no context is set.");
          }
        }

      });

      EventHandler.instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=acc0c6beb35fefa926a46e9e4903a66b3b08afb1.js.map