System.register(["__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _cjsExports, ___esModule, _ZodError, _quotelessJson, _ZodIssueCode, __cjsMetaURL;

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

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.ZodError = exports.quotelessJson = exports.ZodIssueCode = void 0;

        var util_1 = require("./helpers/util");

        exports.ZodIssueCode = util_1.util.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);

        var quotelessJson = obj => {
          var json = JSON.stringify(obj, null, 2);
          return json.replace(/"([^"]+)":/g, "$1:");
        };

        exports.quotelessJson = quotelessJson;

        class ZodError extends Error {
          get errors() {
            return this.issues;
          }

          constructor(issues) {
            var _this;

            super();
            _this = this;
            this.issues = [];

            this.addIssue = sub => {
              this.issues = [...this.issues, sub];
            };

            this.addIssues = function (subs) {
              if (subs === void 0) {
                subs = [];
              }

              _this.issues = [..._this.issues, ...subs];
            };

            var actualProto = new.target.prototype;

            if (Object.setPrototypeOf) {
              // eslint-disable-next-line ban/ban
              Object.setPrototypeOf(this, actualProto);
            } else {
              this.__proto__ = actualProto;
            }

            this.name = "ZodError";
            this.issues = issues;
          }

          format(_mapper) {
            var mapper = _mapper || function (issue) {
              return issue.message;
            };

            var fieldErrors = {
              _errors: []
            };

            var processError = error => {
              for (var issue of error.issues) {
                if (issue.code === "invalid_union") {
                  issue.unionErrors.map(processError);
                } else if (issue.code === "invalid_return_type") {
                  processError(issue.returnTypeError);
                } else if (issue.code === "invalid_arguments") {
                  processError(issue.argumentsError);
                } else if (issue.path.length === 0) {
                  fieldErrors._errors.push(mapper(issue));
                } else {
                  var curr = fieldErrors;
                  var i = 0;

                  while (i < issue.path.length) {
                    var el = issue.path[i];
                    var terminal = i === issue.path.length - 1;

                    if (!terminal) {
                      curr[el] = curr[el] || {
                        _errors: []
                      }; // if (typeof el === "string") {
                      //   curr[el] = curr[el] || { _errors: [] };
                      // } else if (typeof el === "number") {
                      //   const errorArray: any = [];
                      //   errorArray._errors = [];
                      //   curr[el] = curr[el] || errorArray;
                      // }
                    } else {
                      curr[el] = curr[el] || {
                        _errors: []
                      };

                      curr[el]._errors.push(mapper(issue));
                    }

                    curr = curr[el];
                    i++;
                  }
                }
              }
            };

            processError(this);
            return fieldErrors;
          }

          static assert(value) {
            if (!(value instanceof ZodError)) {
              throw new Error("Not a ZodError: " + value);
            }
          }

          toString() {
            return this.message;
          }

          get message() {
            return JSON.stringify(this.issues, util_1.util.jsonStringifyReplacer, 2);
          }

          get isEmpty() {
            return this.issues.length === 0;
          }

          flatten(mapper) {
            if (mapper === void 0) {
              mapper = issue => issue.message;
            }

            var fieldErrors = {};
            var formErrors = [];

            for (var sub of this.issues) {
              if (sub.path.length > 0) {
                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                fieldErrors[sub.path[0]].push(mapper(sub));
              } else {
                formErrors.push(mapper(sub));
              }
            }

            return {
              formErrors,
              fieldErrors
            };
          }

          get formErrors() {
            return this.flatten();
          }

        }

        exports.ZodError = ZodError;

        ZodError.create = issues => {
          var error = new ZodError(issues);
          return error;
        }; // #endregion ORIGINAL CODE


        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _ZodError = module.exports.ZodError;
        _quotelessJson = module.exports.quotelessJson;
        _ZodIssueCode = module.exports.ZodIssueCode;
      }, () => ({
        './helpers/util': _req
      }));
    }
  };
});
//# sourceMappingURL=9ec87b46b64f6630c8b9bc711d7a2835413d8632.js.map