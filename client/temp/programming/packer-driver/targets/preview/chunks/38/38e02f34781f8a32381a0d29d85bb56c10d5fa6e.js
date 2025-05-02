System.register(["__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _cjsExports, ___esModule, _getErrorMap, _setErrorMap, _defaultErrorMap, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        var __importDefault = this && this.__importDefault || function (mod) {
          return mod && mod.__esModule ? mod : {
            "default": mod
          };
        };

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.getErrorMap = exports.setErrorMap = exports.defaultErrorMap = void 0;

        var en_1 = __importDefault(require("./locales/en"));

        exports.defaultErrorMap = en_1.default;
        var overrideErrorMap = en_1.default;

        function setErrorMap(map) {
          overrideErrorMap = map;
        }

        exports.setErrorMap = setErrorMap;

        function getErrorMap() {
          return overrideErrorMap;
        }

        exports.getErrorMap = getErrorMap; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _getErrorMap = module.exports.getErrorMap;
        _setErrorMap = module.exports.setErrorMap;
        _defaultErrorMap = module.exports.defaultErrorMap;
      }, () => ({
        './locales/en': _req
      }));
    }
  };
});
//# sourceMappingURL=38e02f34781f8a32381a0d29d85bb56c10d5fa6e.js.map