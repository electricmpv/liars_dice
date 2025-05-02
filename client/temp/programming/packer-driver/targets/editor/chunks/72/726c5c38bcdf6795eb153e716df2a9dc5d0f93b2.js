System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _cjsExports, ___esModule, _isAsync, _isValid, _isDirty, _isAborted, _OK, _DIRTY, _INVALID, _ParseStatus, _addIssueToContext, _EMPTY_PATH, _makeIssue, __cjsMetaURL;

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

        var __importDefault = this && this.__importDefault || function (mod) {
          return mod && mod.__esModule ? mod : {
            "default": mod
          };
        };

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.isAsync = exports.isValid = exports.isDirty = exports.isAborted = exports.OK = exports.DIRTY = exports.INVALID = exports.ParseStatus = exports.addIssueToContext = exports.EMPTY_PATH = exports.makeIssue = void 0;

        const errors_1 = require("../errors");

        const en_1 = __importDefault(require("../locales/en"));

        const makeIssue = params => {
          const {
            data,
            path,
            errorMaps,
            issueData
          } = params;
          const fullPath = [...path, ...(issueData.path || [])];
          const fullIssue = { ...issueData,
            path: fullPath
          };

          if (issueData.message !== undefined) {
            return { ...issueData,
              path: fullPath,
              message: issueData.message
            };
          }

          let errorMessage = "";
          const maps = errorMaps.filter(m => !!m).slice().reverse();

          for (const map of maps) {
            errorMessage = map(fullIssue, {
              data,
              defaultError: errorMessage
            }).message;
          }

          return { ...issueData,
            path: fullPath,
            message: errorMessage
          };
        };

        exports.makeIssue = makeIssue;
        exports.EMPTY_PATH = [];

        function addIssueToContext(ctx, issueData) {
          const overrideMap = (0, errors_1.getErrorMap)();
          const issue = (0, exports.makeIssue)({
            issueData: issueData,
            data: ctx.data,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, // contextual error map is first priority
            ctx.schemaErrorMap, // then schema-bound map if available
            overrideMap, // then global override map
            overrideMap === en_1.default ? undefined : en_1.default // then global default map
            ].filter(x => !!x)
          });
          ctx.common.issues.push(issue);
        }

        exports.addIssueToContext = addIssueToContext;

        class ParseStatus {
          constructor() {
            this.value = "valid";
          }

          dirty() {
            if (this.value === "valid") this.value = "dirty";
          }

          abort() {
            if (this.value !== "aborted") this.value = "aborted";
          }

          static mergeArray(status, results) {
            const arrayValue = [];

            for (const s of results) {
              if (s.status === "aborted") return exports.INVALID;
              if (s.status === "dirty") status.dirty();
              arrayValue.push(s.value);
            }

            return {
              status: status.value,
              value: arrayValue
            };
          }

          static async mergeObjectAsync(status, pairs) {
            const syncPairs = [];

            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value
              });
            }

            return ParseStatus.mergeObjectSync(status, syncPairs);
          }

          static mergeObjectSync(status, pairs) {
            const finalObject = {};

            for (const pair of pairs) {
              const {
                key,
                value
              } = pair;
              if (key.status === "aborted") return exports.INVALID;
              if (value.status === "aborted") return exports.INVALID;
              if (key.status === "dirty") status.dirty();
              if (value.status === "dirty") status.dirty();

              if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
                finalObject[key.value] = value.value;
              }
            }

            return {
              status: status.value,
              value: finalObject
            };
          }

        }

        exports.ParseStatus = ParseStatus;
        exports.INVALID = Object.freeze({
          status: "aborted"
        });

        const DIRTY = value => ({
          status: "dirty",
          value
        });

        exports.DIRTY = DIRTY;

        const OK = value => ({
          status: "valid",
          value
        });

        exports.OK = OK;

        const isAborted = x => x.status === "aborted";

        exports.isAborted = isAborted;

        const isDirty = x => x.status === "dirty";

        exports.isDirty = isDirty;

        const isValid = x => x.status === "valid";

        exports.isValid = isValid;

        const isAsync = x => typeof Promise !== "undefined" && x instanceof Promise;

        exports.isAsync = isAsync; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _isAsync = module.exports.isAsync;
        _isValid = module.exports.isValid;
        _isDirty = module.exports.isDirty;
        _isAborted = module.exports.isAborted;
        _OK = module.exports.OK;
        _DIRTY = module.exports.DIRTY;
        _INVALID = module.exports.INVALID;
        _ParseStatus = module.exports.ParseStatus;
        _addIssueToContext = module.exports.addIssueToContext;
        _EMPTY_PATH = module.exports.EMPTY_PATH;
        _makeIssue = module.exports.makeIssue;
      }, () => ({
        '../errors': _req,
        '../locales/en': _req0
      }));
    }
  };
});
//# sourceMappingURL=726c5c38bcdf6795eb153e716df2a9dc5d0f93b2.js.map