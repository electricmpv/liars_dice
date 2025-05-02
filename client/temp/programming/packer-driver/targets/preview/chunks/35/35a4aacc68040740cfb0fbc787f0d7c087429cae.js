System.register(["__unresolved_0"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _cjsExports, ___esModule, _errorUtil, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.errorUtil = void 0;
        var errorUtil;

        (function (errorUtil) {
          errorUtil.errToObj = message => typeof message === "string" ? {
            message
          } : message || {};

          errorUtil.toString = message => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
        })(errorUtil || (exports.errorUtil = errorUtil = {})); // #endregion ORIGINAL CODE


        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _errorUtil = module.exports.errorUtil;
      }, {});
    }
  };
});
//# sourceMappingURL=35a4aacc68040740cfb0fbc787f0d7c087429cae.js.map