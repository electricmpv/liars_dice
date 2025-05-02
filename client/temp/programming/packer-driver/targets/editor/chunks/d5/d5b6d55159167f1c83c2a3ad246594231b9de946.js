System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _crd;

  function _reportPossibleCrUseOfPlayerStateClient(extras) {
    _reporterNs.report("PlayerStateClient", "./player-state-client", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e877efOlstL5a/zv9zW3R4g", "liar-dice-room-state-client", undefined); // 导入客户端 PlayerState 接口

      /**
       * 客户端使用的 LiarDiceRoomState 纯接口定义。
       * 这个文件不包含任何 Colyseus Schema 或 @type 装饰器，
       * 确保在浏览器环境中可以安全使用。
       */


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d5b6d55159167f1c83c2a3ad246594231b9de946.js.map