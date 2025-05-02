System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _cjsExports, ___esModule, _z, _default, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }, function (_unresolved_3) {
      _req0 = _unresolved_3.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          var desc = Object.getOwnPropertyDescriptor(m, k);

          if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = {
              enumerable: true,
              get: function () {
                return m[k];
              }
            };
          }

          Object.defineProperty(o, k2, desc);
        } : function (o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          o[k2] = m[k];
        });

        var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
          Object.defineProperty(o, "default", {
            enumerable: true,
            value: v
          });
        } : function (o, v) {
          o["default"] = v;
        });

        var __importStar = this && this.__importStar || function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

          __setModuleDefault(result, mod);

          return result;
        };

        var __exportStar = this && this.__exportStar || function (m, exports) {
          for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        };

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.z = void 0;

        const z = __importStar(require("./external"));

        exports.z = z;

        __exportStar(require("./external"), exports);

        exports.default = z; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _z = module.exports.z;
        _default = module.exports.default;
      }, () => ({
        './external': _req,
        './external': _req0
      }));
    }
  };
});
//# sourceMappingURL=cb5347fc45574295828eee4541127a19fe8f1b59.js.map