System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _cjsExports, ___esModule, _default, __cjsMetaURL;

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

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        const util_1 = require("../helpers/util");

        const ZodError_1 = require("../ZodError");

        const errorMap = (issue, _ctx) => {
          let message;

          switch (issue.code) {
            case ZodError_1.ZodIssueCode.invalid_type:
              if (issue.received === util_1.ZodParsedType.undefined) {
                message = "Required";
              } else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
              }

              break;

            case ZodError_1.ZodIssueCode.invalid_literal:
              message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util_1.util.jsonStringifyReplacer)}`;
              break;

            case ZodError_1.ZodIssueCode.unrecognized_keys:
              message = `Unrecognized key(s) in object: ${util_1.util.joinValues(issue.keys, ", ")}`;
              break;

            case ZodError_1.ZodIssueCode.invalid_union:
              message = `Invalid input`;
              break;

            case ZodError_1.ZodIssueCode.invalid_union_discriminator:
              message = `Invalid discriminator value. Expected ${util_1.util.joinValues(issue.options)}`;
              break;

            case ZodError_1.ZodIssueCode.invalid_enum_value:
              message = `Invalid enum value. Expected ${util_1.util.joinValues(issue.options)}, received '${issue.received}'`;
              break;

            case ZodError_1.ZodIssueCode.invalid_arguments:
              message = `Invalid function arguments`;
              break;

            case ZodError_1.ZodIssueCode.invalid_return_type:
              message = `Invalid function return type`;
              break;

            case ZodError_1.ZodIssueCode.invalid_date:
              message = `Invalid date`;
              break;

            case ZodError_1.ZodIssueCode.invalid_string:
              if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                  message = `Invalid input: must include "${issue.validation.includes}"`;

                  if (typeof issue.validation.position === "number") {
                    message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                  }
                } else if ("startsWith" in issue.validation) {
                  message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                } else if ("endsWith" in issue.validation) {
                  message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                } else {
                  util_1.util.assertNever(issue.validation);
                }
              } else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
              } else {
                message = "Invalid";
              }

              break;

            case ZodError_1.ZodIssueCode.too_small:
              if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;else message = "Invalid input";
              break;

            case ZodError_1.ZodIssueCode.too_big:
              if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;else message = "Invalid input";
              break;

            case ZodError_1.ZodIssueCode.custom:
              message = `Invalid input`;
              break;

            case ZodError_1.ZodIssueCode.invalid_intersection_types:
              message = `Intersection results could not be merged`;
              break;

            case ZodError_1.ZodIssueCode.not_multiple_of:
              message = `Number must be a multiple of ${issue.multipleOf}`;
              break;

            case ZodError_1.ZodIssueCode.not_finite:
              message = "Number must be finite";
              break;

            default:
              message = _ctx.defaultError;
              util_1.util.assertNever(issue);
          }

          return {
            message
          };
        };

        exports.default = errorMap; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _default = module.exports.default;
      }, () => ({
        '../helpers/util': _req,
        '../ZodError': _req0
      }));
    }
  };
});
//# sourceMappingURL=b593564442e55619cadb25f58ea3031f8392e221.js.map