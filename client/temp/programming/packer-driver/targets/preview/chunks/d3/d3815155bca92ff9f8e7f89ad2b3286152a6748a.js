System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, PlayerState, _crd;

  _export("PlayerState", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a8030mf/CpCQZeG7oyGUlGj", "PlayerState", undefined);

      /**
       * 客户端专用的PlayerState定义
       * 用于解决Colyseus Schema导入问题
       */
      // 客户端使用的PlayerState类，不使用装饰器
      _export("PlayerState", PlayerState = class PlayerState {
        // 从服务器数据构造
        constructor(data) {
          this.id = "";
          this.sessionId = "";
          this.name = "";
          this.diceCount = 0;
          this.isReady = false;
          this.isConnected = true;
          this.isAI = false;
          this.aiType = "";
          // 可选的骰子数组，仅在客户端使用
          this.currentDices = [];

          if (data) {
            this.id = data.id || "";
            this.sessionId = data.sessionId || "";
            this.name = data.name || "";
            this.diceCount = data.diceCount || 0;
            this.isReady = data.isReady || false;
            this.isConnected = data.isConnected !== false; // 默认为true

            this.isAI = data.isAI || false;
            this.aiType = data.aiType || ""; // 如果有骰子数据，也复制过来

            if (data.currentDices) {
              this.currentDices = [...data.currentDices];
            }
          }
        } // 从服务器数据更新


        update(data) {
          if (!data) return;
          if (data.id !== undefined) this.id = data.id;
          if (data.sessionId !== undefined) this.sessionId = data.sessionId;
          if (data.name !== undefined) this.name = data.name;
          if (data.diceCount !== undefined) this.diceCount = data.diceCount;
          if (data.isReady !== undefined) this.isReady = data.isReady;
          if (data.isConnected !== undefined) this.isConnected = data.isConnected;
          if (data.isAI !== undefined) this.isAI = data.isAI;
          if (data.aiType !== undefined) this.aiType = data.aiType; // 如果有骰子数据，也更新

          if (data.currentDices) {
            this.currentDices = [...data.currentDices];
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d3815155bca92ff9f8e7f89ad2b3286152a6748a.js.map