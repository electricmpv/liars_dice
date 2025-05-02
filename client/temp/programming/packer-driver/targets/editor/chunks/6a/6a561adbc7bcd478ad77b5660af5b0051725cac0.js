System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, EventEmitter, _crd, events;

  _export("EventEmitter", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "565f8mECltJbqoABagM36w5", "events-browser", undefined);

      /**
       * 浏览器环境中的事件模块模拟
       * 为Colyseus提供兼容性支持
       */
      // 创建全局EventEmitter类
      _export("EventEmitter", EventEmitter = class EventEmitter {
        constructor() {
          this._events = {};
          this._eventsCount = 0;
          this._maxListeners = 10;
          this._events = {};
          this._eventsCount = 0;
        }

        setMaxListeners(n) {
          this._maxListeners = n;
          return this;
        }

        getMaxListeners() {
          return this._maxListeners;
        }

        eventNames() {
          return Object.keys(this._events);
        }

        listeners(type) {
          const events = this._events;
          return events[type] ? [...events[type]] : [];
        }

        listenerCount(type) {
          const events = this._events;
          return events[type] ? events[type].length : 0;
        }

        emit(type, ...args) {
          const events = this._events;
          if (!events[type]) return false;
          const handlers = events[type];
          handlers.forEach(handler => {
            handler.apply(this, args);
          });
          return true;
        }

        on(type, listener) {
          return this.addListener(type, listener);
        }

        addListener(type, listener) {
          const events = this._events;

          if (!events[type]) {
            events[type] = [];
            this._eventsCount++;
          }

          events[type].push(listener);
          return this;
        }

        once(type, listener) {
          const onceWrapper = (...args) => {
            this.removeListener(type, onceWrapper);
            listener.apply(this, args);
          };

          this.on(type, onceWrapper);
          return this;
        }

        off(type, listener) {
          return this.removeListener(type, listener);
        }

        removeListener(type, listener) {
          const events = this._events;
          if (!events[type]) return this;
          events[type] = events[type].filter(l => l !== listener);

          if (events[type].length === 0) {
            delete events[type];
            this._eventsCount--;
          }

          return this;
        }

        removeAllListeners(type) {
          const events = this._events;

          if (type) {
            if (events[type]) {
              delete events[type];
              this._eventsCount--;
            }
          } else {
            this._events = {};
            this._eventsCount = 0;
          }

          return this;
        }

      }); // 导出全局EventEmitter


      window.EventEmitter = EventEmitter; // 导出模拟的events模块接口

      events = {
        EventEmitter
      }; // 确保全局可访问

      window.events = events;

      window.require = function (name) {
        if (name === 'events') {
          return events;
        }

        throw new Error(`Cannot find module '${name}'`);
      };

      _export("default", events);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6a561adbc7bcd478ad77b5660af5b0051725cac0.js.map