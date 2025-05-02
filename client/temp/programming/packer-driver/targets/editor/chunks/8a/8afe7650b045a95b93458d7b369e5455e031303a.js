System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, NetworkManagerCore, NetworkManager, _crd, networkManager;

  function _reportPossibleCrUseOfNetworkManagerCore(extras) {
    _reporterNs.report("NetworkManagerCore", "../core/network", _context.meta, extras);
  }

  _export("NetworkManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      NetworkManagerCore = _unresolved_2.NetworkManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2011fQwP2NEybyvb6vCmUGG", "network-manager", undefined);

      /**
       * NetworkManager 单例，负责封装网络相关操作，便于 UI 层调用和解耦。
       */
      _export("NetworkManager", NetworkManager = class NetworkManager {
        constructor() {}

        static getInstance() {
          if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
          }

          return NetworkManager.instance;
        }

        get roomId() {
          return (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().roomId;
        }

        get sessionId() {
          return (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().sessionId;
        }

        get roomState() {
          return (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().roomState;
        }

        on(event, handler) {
          (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().on(event, handler);
        }

        off(event, handler) {
          (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().off(event, handler);
        }

        send(type, payload) {
          (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().send(type, payload);
        }

        leaveRoom() {
          return (_crd && NetworkManagerCore === void 0 ? (_reportPossibleCrUseOfNetworkManagerCore({
            error: Error()
          }), NetworkManagerCore) : NetworkManagerCore).getInstance().leaveRoom();
        } // 可根据需要扩展更多网络操作方法


      });

      NetworkManager.instance = void 0;

      _export("networkManager", networkManager = NetworkManager.getInstance());

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8afe7650b045a95b93458d7b369e5455e031303a.js.map