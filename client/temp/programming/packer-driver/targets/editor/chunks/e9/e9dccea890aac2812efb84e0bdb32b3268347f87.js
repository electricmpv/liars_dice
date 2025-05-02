System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  /**
   * 检查Colyseus客户端是否已加载
   * 现在使用插件脚本方式，这个函数始终返回true
   */
  function loadColyseusClient() {
    return Promise.resolve();
  }
  /**
   * 检查Colyseus是否已加载
   */


  function isColyseusLoaded() {
    return typeof window.Colyseus !== 'undefined' && !!window.Colyseus.Client;
  }

  _export({
    loadColyseusClient: loadColyseusClient,
    isColyseusLoaded: isColyseusLoaded
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "85aecnB/qJOobUJ9wabEPlK", "colyseus-loader", undefined);
      /**
       * colyseus-loader.ts
       * 这个文件负责检查Colyseus客户端是否已加载
       * 现在使用插件脚本方式，不再需要动态加载
       */
      // 定义全局Colyseus对象类型


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e9dccea890aac2812efb84e0bdb32b3268347f87.js.map