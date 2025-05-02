System.register(["__unresolved_0"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _cjsExports, ___esModule, _getParsedType, _ZodParsedType, _objectUtil, _util, __cjsMetaURL;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
        exports.getParsedType = exports.ZodParsedType = exports.objectUtil = exports.util = void 0;
        var util;

        (function (util) {
          util.assertEqual = val => val;

          function assertIs(_arg) {}

          util.assertIs = assertIs;

          function assertNever(_x) {
            throw new Error();
          }

          util.assertNever = assertNever;

          util.arrayToEnum = items => {
            var obj = {};

            for (var item of items) {
              obj[item] = item;
            }

            return obj;
          };

          util.getValidEnumValues = obj => {
            var validKeys = util.objectKeys(obj).filter(k => typeof obj[obj[k]] !== "number");
            var filtered = {};

            for (var k of validKeys) {
              filtered[k] = obj[k];
            }

            return util.objectValues(filtered);
          };

          util.objectValues = obj => {
            return util.objectKeys(obj).map(function (e) {
              return obj[e];
            });
          };

          util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
          ? obj => Object.keys(obj) // eslint-disable-line ban/ban
          : object => {
            var keys = [];

            for (var key in object) {
              if (Object.prototype.hasOwnProperty.call(object, key)) {
                keys.push(key);
              }
            }

            return keys;
          };

          util.find = (arr, checker) => {
            for (var item of arr) {
              if (checker(item)) return item;
            }

            return undefined;
          };

          util.isInteger = typeof Number.isInteger === "function" ? val => Number.isInteger(val) // eslint-disable-line ban/ban
          : val => typeof val === "number" && isFinite(val) && Math.floor(val) === val;

          function joinValues(array, separator) {
            if (separator === void 0) {
              separator = " | ";
            }

            return array.map(val => typeof val === "string" ? "'" + val + "'" : val).join(separator);
          }

          util.joinValues = joinValues;

          util.jsonStringifyReplacer = (_, value) => {
            if (typeof value === "bigint") {
              return value.toString();
            }

            return value;
          };
        })(util || (exports.util = util = {}));

        var objectUtil;

        (function (objectUtil) {
          objectUtil.mergeShapes = (first, second) => {
            return _extends({}, first, second);
          };
        })(objectUtil || (exports.objectUtil = objectUtil = {}));

        exports.ZodParsedType = util.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);

        var getParsedType = data => {
          var t = typeof data;

          switch (t) {
            case "undefined":
              return exports.ZodParsedType.undefined;

            case "string":
              return exports.ZodParsedType.string;

            case "number":
              return isNaN(data) ? exports.ZodParsedType.nan : exports.ZodParsedType.number;

            case "boolean":
              return exports.ZodParsedType.boolean;

            case "function":
              return exports.ZodParsedType.function;

            case "bigint":
              return exports.ZodParsedType.bigint;

            case "symbol":
              return exports.ZodParsedType.symbol;

            case "object":
              if (Array.isArray(data)) {
                return exports.ZodParsedType.array;
              }

              if (data === null) {
                return exports.ZodParsedType.null;
              }

              if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return exports.ZodParsedType.promise;
              }

              if (typeof Map !== "undefined" && data instanceof Map) {
                return exports.ZodParsedType.map;
              }

              if (typeof Set !== "undefined" && data instanceof Set) {
                return exports.ZodParsedType.set;
              }

              if (typeof Date !== "undefined" && data instanceof Date) {
                return exports.ZodParsedType.date;
              }

              return exports.ZodParsedType.object;

            default:
              return exports.ZodParsedType.unknown;
          }
        };

        exports.getParsedType = getParsedType; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _getParsedType = module.exports.getParsedType;
        _ZodParsedType = module.exports.ZodParsedType;
        _objectUtil = module.exports.objectUtil;
        _util = module.exports.util;
      }, {});
    }
  };
});
//# sourceMappingURL=689c76a914d3c15d6cd1dbc585516b2f5fb17b6a.js.map