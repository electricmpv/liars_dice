System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, EventEmitter, _crd;

  _export("EventEmitter", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cb741O0x7VM0JJAqC+/Gevd", "events-polyfill", undefined);

      /**
       * 简单的浏览器兼容版 EventEmitter 实现
       * 替代 Node.js 的 events 模块
       */
      _export("EventEmitter", EventEmitter = class EventEmitter {
        constructor() {
          this.events = {};
        }

        on(event, listener) {
          if (!this.events[event]) {
            this.events[event] = [];
          }

          this.events[event].push(listener);
          return this;
        }

        once(event, listener) {
          const onceWrapper = (...args) => {
            listener(...args);
            this.off(event, onceWrapper);
          };

          return this.on(event, onceWrapper);
        }

        off(event, listener) {
          if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
          }

          return this;
        }

        emit(event, ...args) {
          if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
            return true;
          }

          return false;
        }

        removeAllListeners(event) {
          if (event) {
            this.events[event] = [];
          } else {
            this.events = {};
          }

          return this;
        }

      }); // 创建默认的导出


      _export("default", {
        EventEmitter
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3790c5ab897d685985b83bf27508959da6a556a3.js.map