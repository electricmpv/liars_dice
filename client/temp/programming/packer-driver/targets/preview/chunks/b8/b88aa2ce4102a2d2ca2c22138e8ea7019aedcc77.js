System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _req1, _req2, _req3, _cjsExports, ___esModule, _boolean, _bigint, _array, _any, _coerce, _ZodFirstPartyTypeKind, _late, _ZodSchema, _Schema, _custom, _ZodReadonly, _ZodPipeline, _ZodBranded, _BRAND, _ZodNaN, _ZodCatch, _ZodDefault, _ZodNullable, _ZodOptional, _ZodTransformer, _ZodEffects, _ZodPromise, _ZodNativeEnum, _ZodEnum, _ZodLiteral, _ZodLazy, _ZodFunction, _ZodSet, _ZodMap, _ZodRecord, _ZodTuple, _ZodIntersection, _ZodDiscriminatedUnion, _ZodUnion, _ZodObject, _ZodArray, _ZodVoid, _ZodNever, _ZodUnknown, _ZodAny, _ZodNull, _ZodUndefined, _ZodSymbol, _ZodDate, _ZodBoolean, _ZodBigInt, _ZodNumber, _ZodString, _datetimeRegex, _ZodType, _NEVER, _void, _unknown, _union, _undefined, _tuple, _transformer, _symbol, _string, _strictObject, _set, _record, _promise, _preprocess, _pipeline, _ostring, _optional, _onumber, _oboolean, _object, _number, _nullable, _null, _never, _nativeEnum, _nan, _map, _literal, _lazy, _intersection, _instanceof, _function, _enum, _effect, _discriminatedUnion, _date, __cjsMetaURL;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }, function (_unresolved_3) {
      _req0 = _unresolved_3.__cjsMetaURL;
    }, function (_unresolved_4) {
      _req1 = _unresolved_4.__cjsMetaURL;
    }, function (_unresolved_5) {
      _req2 = _unresolved_5.__cjsMetaURL;
    }, function (_unresolved_6) {
      _req3 = _unresolved_6.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function (receiver, state, kind, f) {
          if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
          if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
          return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
        };

        var __classPrivateFieldSet = this && this.__classPrivateFieldSet || function (receiver, state, value, kind, f) {
          if (kind === "m") throw new TypeError("Private method is not writable");
          if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
          if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
          return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
        };

        var _ZodEnum_cache, _ZodNativeEnum_cache;

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.boolean = exports.bigint = exports.array = exports.any = exports.coerce = exports.ZodFirstPartyTypeKind = exports.late = exports.ZodSchema = exports.Schema = exports.custom = exports.ZodReadonly = exports.ZodPipeline = exports.ZodBranded = exports.BRAND = exports.ZodNaN = exports.ZodCatch = exports.ZodDefault = exports.ZodNullable = exports.ZodOptional = exports.ZodTransformer = exports.ZodEffects = exports.ZodPromise = exports.ZodNativeEnum = exports.ZodEnum = exports.ZodLiteral = exports.ZodLazy = exports.ZodFunction = exports.ZodSet = exports.ZodMap = exports.ZodRecord = exports.ZodTuple = exports.ZodIntersection = exports.ZodDiscriminatedUnion = exports.ZodUnion = exports.ZodObject = exports.ZodArray = exports.ZodVoid = exports.ZodNever = exports.ZodUnknown = exports.ZodAny = exports.ZodNull = exports.ZodUndefined = exports.ZodSymbol = exports.ZodDate = exports.ZodBoolean = exports.ZodBigInt = exports.ZodNumber = exports.ZodString = exports.datetimeRegex = exports.ZodType = void 0;
        exports.NEVER = exports.void = exports.unknown = exports.union = exports.undefined = exports.tuple = exports.transformer = exports.symbol = exports.string = exports.strictObject = exports.set = exports.record = exports.promise = exports.preprocess = exports.pipeline = exports.ostring = exports.optional = exports.onumber = exports.oboolean = exports.object = exports.number = exports.nullable = exports.null = exports.never = exports.nativeEnum = exports.nan = exports.map = exports.literal = exports.lazy = exports.intersection = exports.instanceof = exports.function = exports.enum = exports.effect = exports.discriminatedUnion = exports.date = void 0;

        var errors_1 = require("./errors");

        var errorUtil_1 = require("./helpers/errorUtil");

        var parseUtil_1 = require("./helpers/parseUtil");

        var util_1 = require("./helpers/util");

        var ZodError_1 = require("./ZodError");

        class ParseInputLazyPath {
          constructor(parent, value, path, key) {
            this._cachedPath = [];
            this.parent = parent;
            this.data = value;
            this._path = path;
            this._key = key;
          }

          get path() {
            if (!this._cachedPath.length) {
              if (this._key instanceof Array) {
                this._cachedPath.push(...this._path, ...this._key);
              } else {
                this._cachedPath.push(...this._path, this._key);
              }
            }

            return this._cachedPath;
          }

        }

        var handleResult = (ctx, result) => {
          if ((0, parseUtil_1.isValid)(result)) {
            return {
              success: true,
              data: result.value
            };
          } else {
            if (!ctx.common.issues.length) {
              throw new Error("Validation failed but no issues detected.");
            }

            return {
              success: false,

              get error() {
                if (this._error) return this._error;
                var error = new ZodError_1.ZodError(ctx.common.issues);
                this._error = error;
                return this._error;
              }

            };
          }
        };

        function processCreateParams(params) {
          if (!params) return {};
          var {
            errorMap,
            invalid_type_error,
            required_error,
            description
          } = params;

          if (errorMap && (invalid_type_error || required_error)) {
            throw new Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
          }

          if (errorMap) return {
            errorMap: errorMap,
            description
          };

          var customMap = (iss, ctx) => {
            var _a, _b;

            var {
              message
            } = params;

            if (iss.code === "invalid_enum_value") {
              return {
                message: message !== null && message !== void 0 ? message : ctx.defaultError
              };
            }

            if (typeof ctx.data === "undefined") {
              return {
                message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError
              };
            }

            if (iss.code !== "invalid_type") return {
              message: ctx.defaultError
            };
            return {
              message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError
            };
          };

          return {
            errorMap: customMap,
            description
          };
        }

        class ZodType {
          get description() {
            return this._def.description;
          }

          _getType(input) {
            return (0, util_1.getParsedType)(input.data);
          }

          _getOrReturnCtx(input, ctx) {
            return ctx || {
              common: input.parent.common,
              data: input.data,
              parsedType: (0, util_1.getParsedType)(input.data),
              schemaErrorMap: this._def.errorMap,
              path: input.path,
              parent: input.parent
            };
          }

          _processInputParams(input) {
            return {
              status: new parseUtil_1.ParseStatus(),
              ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: (0, util_1.getParsedType)(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent
              }
            };
          }

          _parseSync(input) {
            var result = this._parse(input);

            if ((0, parseUtil_1.isAsync)(result)) {
              throw new Error("Synchronous parse encountered promise.");
            }

            return result;
          }

          _parseAsync(input) {
            var result = this._parse(input);

            return Promise.resolve(result);
          }

          parse(data, params) {
            var result = this.safeParse(data, params);
            if (result.success) return result.data;
            throw result.error;
          }

          safeParse(data, params) {
            var _a;

            var ctx = {
              common: {
                issues: [],
                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
              },
              path: (params === null || params === void 0 ? void 0 : params.path) || [],
              schemaErrorMap: this._def.errorMap,
              parent: null,
              data,
              parsedType: (0, util_1.getParsedType)(data)
            };

            var result = this._parseSync({
              data,
              path: ctx.path,
              parent: ctx
            });

            return handleResult(ctx, result);
          }

          "~validate"(data) {
            var _a, _b;

            var ctx = {
              common: {
                issues: [],
                async: !!this["~standard"].async
              },
              path: [],
              schemaErrorMap: this._def.errorMap,
              parent: null,
              data,
              parsedType: (0, util_1.getParsedType)(data)
            };

            if (!this["~standard"].async) {
              try {
                var result = this._parseSync({
                  data,
                  path: [],
                  parent: ctx
                });

                return (0, parseUtil_1.isValid)(result) ? {
                  value: result.value
                } : {
                  issues: ctx.common.issues
                };
              } catch (err) {
                if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
                  this["~standard"].async = true;
                }

                ctx.common = {
                  issues: [],
                  async: true
                };
              }
            }

            return this._parseAsync({
              data,
              path: [],
              parent: ctx
            }).then(result => (0, parseUtil_1.isValid)(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            });
          }

          parseAsync(data, params) {
            var _this = this;

            return _asyncToGenerator(function* () {
              var result = yield _this.safeParseAsync(data, params);
              if (result.success) return result.data;
              throw result.error;
            })();
          }

          safeParseAsync(data, params) {
            var _this2 = this;

            return _asyncToGenerator(function* () {
              var ctx = {
                common: {
                  issues: [],
                  contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                  async: true
                },
                path: (params === null || params === void 0 ? void 0 : params.path) || [],
                schemaErrorMap: _this2._def.errorMap,
                parent: null,
                data,
                parsedType: (0, util_1.getParsedType)(data)
              };

              var maybeAsyncResult = _this2._parse({
                data,
                path: ctx.path,
                parent: ctx
              });

              var result = yield (0, parseUtil_1.isAsync)(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult);
              return handleResult(ctx, result);
            })();
          }

          refine(check, message) {
            var getIssueProperties = val => {
              if (typeof message === "string" || typeof message === "undefined") {
                return {
                  message
                };
              } else if (typeof message === "function") {
                return message(val);
              } else {
                return message;
              }
            };

            return this._refinement((val, ctx) => {
              var result = check(val);

              var setError = () => ctx.addIssue(_extends({
                code: ZodError_1.ZodIssueCode.custom
              }, getIssueProperties(val)));

              if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then(data => {
                  if (!data) {
                    setError();
                    return false;
                  } else {
                    return true;
                  }
                });
              }

              if (!result) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }

          refinement(check, refinementData) {
            return this._refinement((val, ctx) => {
              if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
                return false;
              } else {
                return true;
              }
            });
          }

          _refinement(refinement) {
            return new ZodEffects({
              schema: this,
              typeName: ZodFirstPartyTypeKind.ZodEffects,
              effect: {
                type: "refinement",
                refinement
              }
            });
          }

          superRefine(refinement) {
            return this._refinement(refinement);
          }

          constructor(def) {
            /** Alias of safeParseAsync */
            this.spa = this.safeParseAsync;
            this._def = def;
            this.parse = this.parse.bind(this);
            this.safeParse = this.safeParse.bind(this);
            this.parseAsync = this.parseAsync.bind(this);
            this.safeParseAsync = this.safeParseAsync.bind(this);
            this.spa = this.spa.bind(this);
            this.refine = this.refine.bind(this);
            this.refinement = this.refinement.bind(this);
            this.superRefine = this.superRefine.bind(this);
            this.optional = this.optional.bind(this);
            this.nullable = this.nullable.bind(this);
            this.nullish = this.nullish.bind(this);
            this.array = this.array.bind(this);
            this.promise = this.promise.bind(this);
            this.or = this.or.bind(this);
            this.and = this.and.bind(this);
            this.transform = this.transform.bind(this);
            this.brand = this.brand.bind(this);
            this.default = this.default.bind(this);
            this.catch = this.catch.bind(this);
            this.describe = this.describe.bind(this);
            this.pipe = this.pipe.bind(this);
            this.readonly = this.readonly.bind(this);
            this.isNullable = this.isNullable.bind(this);
            this.isOptional = this.isOptional.bind(this);
            this["~standard"] = {
              version: 1,
              vendor: "zod",
              validate: data => this["~validate"](data)
            };
          }

          optional() {
            return ZodOptional.create(this, this._def);
          }

          nullable() {
            return ZodNullable.create(this, this._def);
          }

          nullish() {
            return this.nullable().optional();
          }

          array() {
            return ZodArray.create(this);
          }

          promise() {
            return ZodPromise.create(this, this._def);
          }

          or(option) {
            return ZodUnion.create([this, option], this._def);
          }

          and(incoming) {
            return ZodIntersection.create(this, incoming, this._def);
          }

          transform(transform) {
            return new ZodEffects(_extends({}, processCreateParams(this._def), {
              schema: this,
              typeName: ZodFirstPartyTypeKind.ZodEffects,
              effect: {
                type: "transform",
                transform
              }
            }));
          }

          default(def) {
            var defaultValueFunc = typeof def === "function" ? def : () => def;
            return new ZodDefault(_extends({}, processCreateParams(this._def), {
              innerType: this,
              defaultValue: defaultValueFunc,
              typeName: ZodFirstPartyTypeKind.ZodDefault
            }));
          }

          brand() {
            return new ZodBranded(_extends({
              typeName: ZodFirstPartyTypeKind.ZodBranded,
              type: this
            }, processCreateParams(this._def)));
          }

          catch(def) {
            var catchValueFunc = typeof def === "function" ? def : () => def;
            return new ZodCatch(_extends({}, processCreateParams(this._def), {
              innerType: this,
              catchValue: catchValueFunc,
              typeName: ZodFirstPartyTypeKind.ZodCatch
            }));
          }

          describe(description) {
            var This = this.constructor;
            return new This(_extends({}, this._def, {
              description
            }));
          }

          pipe(target) {
            return ZodPipeline.create(this, target);
          }

          readonly() {
            return ZodReadonly.create(this);
          }

          isOptional() {
            return this.safeParse(undefined).success;
          }

          isNullable() {
            return this.safeParse(null).success;
          }

        }

        exports.ZodType = ZodType;
        exports.Schema = ZodType;
        exports.ZodSchema = ZodType;
        var cuidRegex = /^c[^\s-]{8,}$/i;
        var cuid2Regex = /^[0-9a-z]+$/;
        var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i; // const uuidRegex =
        //   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;

        var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
        var nanoidRegex = /^[a-z0-9_-]{21}$/i;
        var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/; // from https://stackoverflow.com/a/46181/1550155
        // old version: too slow, didn't support unicode
        // const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        //old email regex
        // const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
        // eslint-disable-next-line
        // const emailRegex =
        //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
        // const emailRegex =
        //   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        // const emailRegex =
        //   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

        var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i; // const emailRegex =
        //   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
        // from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression

        var _emojiRegex = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
        var emojiRegex; // faster, simpler, safer

        var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
        var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/; // const ipv6Regex =
        // /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;

        var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/; // https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript

        var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/; // https://base64.guru/standards/base64url

        var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/; // simple
        // const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
        // no leap year validation
        // const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
        // with leap year validation

        var dateRegexSource = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
        var dateRegex = new RegExp("^" + dateRegexSource + "$");

        function timeRegexSource(args) {
          // let regex = `\\d{2}:\\d{2}:\\d{2}`;
          var regex = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";

          if (args.precision) {
            regex = regex + "\\.\\d{" + args.precision + "}";
          } else if (args.precision == null) {
            regex = regex + "(\\.\\d+)?";
          }

          return regex;
        }

        function timeRegex(args) {
          return new RegExp("^" + timeRegexSource(args) + "$");
        } // Adapted from https://stackoverflow.com/a/3143231


        function datetimeRegex(args) {
          var regex = dateRegexSource + "T" + timeRegexSource(args);
          var opts = [];
          opts.push(args.local ? "Z?" : "Z");
          if (args.offset) opts.push("([+-]\\d{2}:?\\d{2})");
          regex = regex + "(" + opts.join("|") + ")";
          return new RegExp("^" + regex + "$");
        }

        exports.datetimeRegex = datetimeRegex;

        function isValidIP(ip, version) {
          if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
            return true;
          }

          if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
            return true;
          }

          return false;
        }

        function isValidJWT(jwt, alg) {
          if (!jwtRegex.test(jwt)) return false;

          try {
            var [header] = jwt.split("."); // Convert base64url to base64

            var base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
            var decoded = JSON.parse(atob(base64));
            if (typeof decoded !== "object" || decoded === null) return false;
            if (!decoded.typ || !decoded.alg) return false;
            if (alg && decoded.alg !== alg) return false;
            return true;
          } catch (_a) {
            return false;
          }
        }

        function isValidCidr(ip, version) {
          if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
            return true;
          }

          if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
            return true;
          }

          return false;
        }

        class ZodString extends ZodType {
          _parse(input) {
            if (this._def.coerce) {
              input.data = String(input.data);
            }

            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.string) {
              var _ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(_ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.string,
                received: _ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var status = new parseUtil_1.ParseStatus();
            var ctx = undefined;

            for (var check of this._def.checks) {
              if (check.kind === "min") {
                if (input.data.length < check.value) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_small,
                    minimum: check.value,
                    type: "string",
                    inclusive: true,
                    exact: false,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "max") {
                if (input.data.length > check.value) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_big,
                    maximum: check.value,
                    type: "string",
                    inclusive: true,
                    exact: false,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "length") {
                var tooBig = input.data.length > check.value;
                var tooSmall = input.data.length < check.value;

                if (tooBig || tooSmall) {
                  ctx = this._getOrReturnCtx(input, ctx);

                  if (tooBig) {
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                      code: ZodError_1.ZodIssueCode.too_big,
                      maximum: check.value,
                      type: "string",
                      inclusive: true,
                      exact: true,
                      message: check.message
                    });
                  } else if (tooSmall) {
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                      code: ZodError_1.ZodIssueCode.too_small,
                      minimum: check.value,
                      type: "string",
                      inclusive: true,
                      exact: true,
                      message: check.message
                    });
                  }

                  status.dirty();
                }
              } else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "email",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "emoji") {
                if (!emojiRegex) {
                  emojiRegex = new RegExp(_emojiRegex, "u");
                }

                if (!emojiRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "emoji",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "uuid",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "nanoid") {
                if (!nanoidRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "nanoid",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "cuid",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "cuid2",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "ulid",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "url") {
                try {
                  new URL(input.data);
                } catch (_a) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "url",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                var testResult = check.regex.test(input.data);

                if (!testResult) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "regex",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "trim") {
                input.data = input.data.trim();
              } else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    validation: {
                      includes: check.value,
                      position: check.position
                    },
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
              } else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
              } else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    validation: {
                      startsWith: check.value
                    },
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    validation: {
                      endsWith: check.value
                    },
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "datetime") {
                var regex = datetimeRegex(check);

                if (!regex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    validation: "datetime",
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "date") {
                var _regex = dateRegex;

                if (!_regex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    validation: "date",
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "time") {
                var _regex2 = timeRegex(check);

                if (!_regex2.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    validation: "time",
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "duration") {
                if (!durationRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "duration",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "ip",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "jwt") {
                if (!isValidJWT(input.data, check.alg)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "jwt",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "cidr") {
                if (!isValidCidr(input.data, check.version)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "cidr",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "base64") {
                if (!base64Regex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "base64",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "base64url") {
                if (!base64urlRegex.test(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    validation: "base64url",
                    code: ZodError_1.ZodIssueCode.invalid_string,
                    message: check.message
                  });
                  status.dirty();
                }
              } else {
                util_1.util.assertNever(check);
              }
            }

            return {
              status: status.value,
              value: input.data
            };
          }

          _regex(regex, validation, message) {
            return this.refinement(data => regex.test(data), _extends({
              validation,
              code: ZodError_1.ZodIssueCode.invalid_string
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          _addCheck(check) {
            return new ZodString(_extends({}, this._def, {
              checks: [...this._def.checks, check]
            }));
          }

          email(message) {
            return this._addCheck(_extends({
              kind: "email"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          url(message) {
            return this._addCheck(_extends({
              kind: "url"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          emoji(message) {
            return this._addCheck(_extends({
              kind: "emoji"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          uuid(message) {
            return this._addCheck(_extends({
              kind: "uuid"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          nanoid(message) {
            return this._addCheck(_extends({
              kind: "nanoid"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          cuid(message) {
            return this._addCheck(_extends({
              kind: "cuid"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          cuid2(message) {
            return this._addCheck(_extends({
              kind: "cuid2"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          ulid(message) {
            return this._addCheck(_extends({
              kind: "ulid"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          base64(message) {
            return this._addCheck(_extends({
              kind: "base64"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          base64url(message) {
            // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
            return this._addCheck(_extends({
              kind: "base64url"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          jwt(options) {
            return this._addCheck(_extends({
              kind: "jwt"
            }, errorUtil_1.errorUtil.errToObj(options)));
          }

          ip(options) {
            return this._addCheck(_extends({
              kind: "ip"
            }, errorUtil_1.errorUtil.errToObj(options)));
          }

          cidr(options) {
            return this._addCheck(_extends({
              kind: "cidr"
            }, errorUtil_1.errorUtil.errToObj(options)));
          }

          datetime(options) {
            var _a, _b;

            if (typeof options === "string") {
              return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                local: false,
                message: options
              });
            }

            return this._addCheck(_extends({
              kind: "datetime",
              precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
              offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
              local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false
            }, errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)));
          }

          date(message) {
            return this._addCheck({
              kind: "date",
              message
            });
          }

          time(options) {
            if (typeof options === "string") {
              return this._addCheck({
                kind: "time",
                precision: null,
                message: options
              });
            }

            return this._addCheck(_extends({
              kind: "time",
              precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision
            }, errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)));
          }

          duration(message) {
            return this._addCheck(_extends({
              kind: "duration"
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          regex(regex, message) {
            return this._addCheck(_extends({
              kind: "regex",
              regex: regex
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          includes(value, options) {
            return this._addCheck(_extends({
              kind: "includes",
              value: value,
              position: options === null || options === void 0 ? void 0 : options.position
            }, errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)));
          }

          startsWith(value, message) {
            return this._addCheck(_extends({
              kind: "startsWith",
              value: value
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          endsWith(value, message) {
            return this._addCheck(_extends({
              kind: "endsWith",
              value: value
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          min(minLength, message) {
            return this._addCheck(_extends({
              kind: "min",
              value: minLength
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          max(maxLength, message) {
            return this._addCheck(_extends({
              kind: "max",
              value: maxLength
            }, errorUtil_1.errorUtil.errToObj(message)));
          }

          length(len, message) {
            return this._addCheck(_extends({
              kind: "length",
              value: len
            }, errorUtil_1.errorUtil.errToObj(message)));
          }
          /**
           * Equivalent to `.min(1)`
           */


          nonempty(message) {
            return this.min(1, errorUtil_1.errorUtil.errToObj(message));
          }

          trim() {
            return new ZodString(_extends({}, this._def, {
              checks: [...this._def.checks, {
                kind: "trim"
              }]
            }));
          }

          toLowerCase() {
            return new ZodString(_extends({}, this._def, {
              checks: [...this._def.checks, {
                kind: "toLowerCase"
              }]
            }));
          }

          toUpperCase() {
            return new ZodString(_extends({}, this._def, {
              checks: [...this._def.checks, {
                kind: "toUpperCase"
              }]
            }));
          }

          get isDatetime() {
            return !!this._def.checks.find(ch => ch.kind === "datetime");
          }

          get isDate() {
            return !!this._def.checks.find(ch => ch.kind === "date");
          }

          get isTime() {
            return !!this._def.checks.find(ch => ch.kind === "time");
          }

          get isDuration() {
            return !!this._def.checks.find(ch => ch.kind === "duration");
          }

          get isEmail() {
            return !!this._def.checks.find(ch => ch.kind === "email");
          }

          get isURL() {
            return !!this._def.checks.find(ch => ch.kind === "url");
          }

          get isEmoji() {
            return !!this._def.checks.find(ch => ch.kind === "emoji");
          }

          get isUUID() {
            return !!this._def.checks.find(ch => ch.kind === "uuid");
          }

          get isNANOID() {
            return !!this._def.checks.find(ch => ch.kind === "nanoid");
          }

          get isCUID() {
            return !!this._def.checks.find(ch => ch.kind === "cuid");
          }

          get isCUID2() {
            return !!this._def.checks.find(ch => ch.kind === "cuid2");
          }

          get isULID() {
            return !!this._def.checks.find(ch => ch.kind === "ulid");
          }

          get isIP() {
            return !!this._def.checks.find(ch => ch.kind === "ip");
          }

          get isCIDR() {
            return !!this._def.checks.find(ch => ch.kind === "cidr");
          }

          get isBase64() {
            return !!this._def.checks.find(ch => ch.kind === "base64");
          }

          get isBase64url() {
            // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
            return !!this._def.checks.find(ch => ch.kind === "base64url");
          }

          get minLength() {
            var min = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
              }
            }

            return min;
          }

          get maxLength() {
            var max = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
              }
            }

            return max;
          }

        }

        exports.ZodString = ZodString;

        ZodString.create = params => {
          var _a;

          return new ZodString(_extends({
            checks: [],
            typeName: ZodFirstPartyTypeKind.ZodString,
            coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false
          }, processCreateParams(params)));
        }; // https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034


        function floatSafeRemainder(val, step) {
          var valDecCount = (val.toString().split(".")[1] || "").length;
          var stepDecCount = (step.toString().split(".")[1] || "").length;
          var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
          var valInt = parseInt(val.toFixed(decCount).replace(".", ""));
          var stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
          return valInt % stepInt / Math.pow(10, decCount);
        }

        class ZodNumber extends ZodType {
          constructor() {
            super(...arguments);
            this.min = this.gte;
            this.max = this.lte;
            this.step = this.multipleOf;
          }

          _parse(input) {
            if (this._def.coerce) {
              input.data = Number(input.data);
            }

            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.number) {
              var _ctx2 = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(_ctx2, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.number,
                received: _ctx2.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var ctx = undefined;
            var status = new parseUtil_1.ParseStatus();

            for (var check of this._def.checks) {
              if (check.kind === "int") {
                if (!util_1.util.isInteger(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_type,
                    expected: "integer",
                    received: "float",
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "min") {
                var tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;

                if (tooSmall) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_small,
                    minimum: check.value,
                    type: "number",
                    inclusive: check.inclusive,
                    exact: false,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "max") {
                var tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;

                if (tooBig) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_big,
                    maximum: check.value,
                    type: "number",
                    inclusive: check.inclusive,
                    exact: false,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.not_multiple_of,
                    multipleOf: check.value,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.not_finite,
                    message: check.message
                  });
                  status.dirty();
                }
              } else {
                util_1.util.assertNever(check);
              }
            }

            return {
              status: status.value,
              value: input.data
            };
          }

          gte(value, message) {
            return this.setLimit("min", value, true, errorUtil_1.errorUtil.toString(message));
          }

          gt(value, message) {
            return this.setLimit("min", value, false, errorUtil_1.errorUtil.toString(message));
          }

          lte(value, message) {
            return this.setLimit("max", value, true, errorUtil_1.errorUtil.toString(message));
          }

          lt(value, message) {
            return this.setLimit("max", value, false, errorUtil_1.errorUtil.toString(message));
          }

          setLimit(kind, value, inclusive, message) {
            return new ZodNumber(_extends({}, this._def, {
              checks: [...this._def.checks, {
                kind,
                value,
                inclusive,
                message: errorUtil_1.errorUtil.toString(message)
              }]
            }));
          }

          _addCheck(check) {
            return new ZodNumber(_extends({}, this._def, {
              checks: [...this._def.checks, check]
            }));
          }

          int(message) {
            return this._addCheck({
              kind: "int",
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          positive(message) {
            return this._addCheck({
              kind: "min",
              value: 0,
              inclusive: false,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          negative(message) {
            return this._addCheck({
              kind: "max",
              value: 0,
              inclusive: false,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          nonpositive(message) {
            return this._addCheck({
              kind: "max",
              value: 0,
              inclusive: true,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          nonnegative(message) {
            return this._addCheck({
              kind: "min",
              value: 0,
              inclusive: true,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          multipleOf(value, message) {
            return this._addCheck({
              kind: "multipleOf",
              value: value,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          finite(message) {
            return this._addCheck({
              kind: "finite",
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          safe(message) {
            return this._addCheck({
              kind: "min",
              inclusive: true,
              value: Number.MIN_SAFE_INTEGER,
              message: errorUtil_1.errorUtil.toString(message)
            })._addCheck({
              kind: "max",
              inclusive: true,
              value: Number.MAX_SAFE_INTEGER,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          get minValue() {
            var min = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
              }
            }

            return min;
          }

          get maxValue() {
            var max = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
              }
            }

            return max;
          }

          get isInt() {
            return !!this._def.checks.find(ch => ch.kind === "int" || ch.kind === "multipleOf" && util_1.util.isInteger(ch.value));
          }

          get isFinite() {
            var max = null,
                min = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
                return true;
              } else if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
              } else if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
              }
            }

            return Number.isFinite(min) && Number.isFinite(max);
          }

        }

        exports.ZodNumber = ZodNumber;

        ZodNumber.create = params => {
          return new ZodNumber(_extends({
            checks: [],
            typeName: ZodFirstPartyTypeKind.ZodNumber,
            coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false
          }, processCreateParams(params)));
        };

        class ZodBigInt extends ZodType {
          constructor() {
            super(...arguments);
            this.min = this.gte;
            this.max = this.lte;
          }

          _parse(input) {
            if (this._def.coerce) {
              try {
                input.data = BigInt(input.data);
              } catch (_a) {
                return this._getInvalidInput(input);
              }
            }

            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.bigint) {
              return this._getInvalidInput(input);
            }

            var ctx = undefined;
            var status = new parseUtil_1.ParseStatus();

            for (var check of this._def.checks) {
              if (check.kind === "min") {
                var tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;

                if (tooSmall) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_small,
                    type: "bigint",
                    minimum: check.value,
                    inclusive: check.inclusive,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "max") {
                var tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;

                if (tooBig) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_big,
                    type: "bigint",
                    maximum: check.value,
                    inclusive: check.inclusive,
                    message: check.message
                  });
                  status.dirty();
                }
              } else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.not_multiple_of,
                    multipleOf: check.value,
                    message: check.message
                  });
                  status.dirty();
                }
              } else {
                util_1.util.assertNever(check);
              }
            }

            return {
              status: status.value,
              value: input.data
            };
          }

          _getInvalidInput(input) {
            var ctx = this._getOrReturnCtx(input);

            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.invalid_type,
              expected: util_1.ZodParsedType.bigint,
              received: ctx.parsedType
            });
            return parseUtil_1.INVALID;
          }

          gte(value, message) {
            return this.setLimit("min", value, true, errorUtil_1.errorUtil.toString(message));
          }

          gt(value, message) {
            return this.setLimit("min", value, false, errorUtil_1.errorUtil.toString(message));
          }

          lte(value, message) {
            return this.setLimit("max", value, true, errorUtil_1.errorUtil.toString(message));
          }

          lt(value, message) {
            return this.setLimit("max", value, false, errorUtil_1.errorUtil.toString(message));
          }

          setLimit(kind, value, inclusive, message) {
            return new ZodBigInt(_extends({}, this._def, {
              checks: [...this._def.checks, {
                kind,
                value,
                inclusive,
                message: errorUtil_1.errorUtil.toString(message)
              }]
            }));
          }

          _addCheck(check) {
            return new ZodBigInt(_extends({}, this._def, {
              checks: [...this._def.checks, check]
            }));
          }

          positive(message) {
            return this._addCheck({
              kind: "min",
              value: BigInt(0),
              inclusive: false,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          negative(message) {
            return this._addCheck({
              kind: "max",
              value: BigInt(0),
              inclusive: false,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          nonpositive(message) {
            return this._addCheck({
              kind: "max",
              value: BigInt(0),
              inclusive: true,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          nonnegative(message) {
            return this._addCheck({
              kind: "min",
              value: BigInt(0),
              inclusive: true,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          multipleOf(value, message) {
            return this._addCheck({
              kind: "multipleOf",
              value,
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          get minValue() {
            var min = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
              }
            }

            return min;
          }

          get maxValue() {
            var max = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
              }
            }

            return max;
          }

        }

        exports.ZodBigInt = ZodBigInt;

        ZodBigInt.create = params => {
          var _a;

          return new ZodBigInt(_extends({
            checks: [],
            typeName: ZodFirstPartyTypeKind.ZodBigInt,
            coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false
          }, processCreateParams(params)));
        };

        class ZodBoolean extends ZodType {
          _parse(input) {
            if (this._def.coerce) {
              input.data = Boolean(input.data);
            }

            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.boolean) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.boolean,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodBoolean = ZodBoolean;

        ZodBoolean.create = params => {
          return new ZodBoolean(_extends({
            typeName: ZodFirstPartyTypeKind.ZodBoolean,
            coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false
          }, processCreateParams(params)));
        };

        class ZodDate extends ZodType {
          _parse(input) {
            if (this._def.coerce) {
              input.data = new Date(input.data);
            }

            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.date) {
              var _ctx3 = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(_ctx3, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.date,
                received: _ctx3.parsedType
              });
              return parseUtil_1.INVALID;
            }

            if (isNaN(input.data.getTime())) {
              var _ctx4 = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(_ctx4, {
                code: ZodError_1.ZodIssueCode.invalid_date
              });
              return parseUtil_1.INVALID;
            }

            var status = new parseUtil_1.ParseStatus();
            var ctx = undefined;

            for (var check of this._def.checks) {
              if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_small,
                    message: check.message,
                    inclusive: true,
                    exact: false,
                    minimum: check.value,
                    type: "date"
                  });
                  status.dirty();
                }
              } else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                  ctx = this._getOrReturnCtx(input, ctx);
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_big,
                    message: check.message,
                    inclusive: true,
                    exact: false,
                    maximum: check.value,
                    type: "date"
                  });
                  status.dirty();
                }
              } else {
                util_1.util.assertNever(check);
              }
            }

            return {
              status: status.value,
              value: new Date(input.data.getTime())
            };
          }

          _addCheck(check) {
            return new ZodDate(_extends({}, this._def, {
              checks: [...this._def.checks, check]
            }));
          }

          min(minDate, message) {
            return this._addCheck({
              kind: "min",
              value: minDate.getTime(),
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          max(maxDate, message) {
            return this._addCheck({
              kind: "max",
              value: maxDate.getTime(),
              message: errorUtil_1.errorUtil.toString(message)
            });
          }

          get minDate() {
            var min = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
              }
            }

            return min != null ? new Date(min) : null;
          }

          get maxDate() {
            var max = null;

            for (var ch of this._def.checks) {
              if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
              }
            }

            return max != null ? new Date(max) : null;
          }

        }

        exports.ZodDate = ZodDate;

        ZodDate.create = params => {
          return new ZodDate(_extends({
            checks: [],
            coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
            typeName: ZodFirstPartyTypeKind.ZodDate
          }, processCreateParams(params)));
        };

        class ZodSymbol extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.symbol) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.symbol,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodSymbol = ZodSymbol;

        ZodSymbol.create = params => {
          return new ZodSymbol(_extends({
            typeName: ZodFirstPartyTypeKind.ZodSymbol
          }, processCreateParams(params)));
        };

        class ZodUndefined extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.undefined) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.undefined,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodUndefined = ZodUndefined;

        ZodUndefined.create = params => {
          return new ZodUndefined(_extends({
            typeName: ZodFirstPartyTypeKind.ZodUndefined
          }, processCreateParams(params)));
        };

        class ZodNull extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.null) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.null,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodNull = ZodNull;

        ZodNull.create = params => {
          return new ZodNull(_extends({
            typeName: ZodFirstPartyTypeKind.ZodNull
          }, processCreateParams(params)));
        };

        class ZodAny extends ZodType {
          constructor() {
            super(...arguments); // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.

            this._any = true;
          }

          _parse(input) {
            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodAny = ZodAny;

        ZodAny.create = params => {
          return new ZodAny(_extends({
            typeName: ZodFirstPartyTypeKind.ZodAny
          }, processCreateParams(params)));
        };

        class ZodUnknown extends ZodType {
          constructor() {
            super(...arguments); // required

            this._unknown = true;
          }

          _parse(input) {
            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodUnknown = ZodUnknown;

        ZodUnknown.create = params => {
          return new ZodUnknown(_extends({
            typeName: ZodFirstPartyTypeKind.ZodUnknown
          }, processCreateParams(params)));
        };

        class ZodNever extends ZodType {
          _parse(input) {
            var ctx = this._getOrReturnCtx(input);

            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.invalid_type,
              expected: util_1.ZodParsedType.never,
              received: ctx.parsedType
            });
            return parseUtil_1.INVALID;
          }

        }

        exports.ZodNever = ZodNever;

        ZodNever.create = params => {
          return new ZodNever(_extends({
            typeName: ZodFirstPartyTypeKind.ZodNever
          }, processCreateParams(params)));
        };

        class ZodVoid extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.undefined) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.void,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

        }

        exports.ZodVoid = ZodVoid;

        ZodVoid.create = params => {
          return new ZodVoid(_extends({
            typeName: ZodFirstPartyTypeKind.ZodVoid
          }, processCreateParams(params)));
        };

        class ZodArray extends ZodType {
          _parse(input) {
            var {
              ctx,
              status
            } = this._processInputParams(input);

            var def = this._def;

            if (ctx.parsedType !== util_1.ZodParsedType.array) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.array,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            if (def.exactLength !== null) {
              var tooBig = ctx.data.length > def.exactLength.value;
              var tooSmall = ctx.data.length < def.exactLength.value;

              if (tooBig || tooSmall) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: tooBig ? ZodError_1.ZodIssueCode.too_big : ZodError_1.ZodIssueCode.too_small,
                  minimum: tooSmall ? def.exactLength.value : undefined,
                  maximum: tooBig ? def.exactLength.value : undefined,
                  type: "array",
                  inclusive: true,
                  exact: true,
                  message: def.exactLength.message
                });
                status.dirty();
              }
            }

            if (def.minLength !== null) {
              if (ctx.data.length < def.minLength.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_small,
                  minimum: def.minLength.value,
                  type: "array",
                  inclusive: true,
                  exact: false,
                  message: def.minLength.message
                });
                status.dirty();
              }
            }

            if (def.maxLength !== null) {
              if (ctx.data.length > def.maxLength.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_big,
                  maximum: def.maxLength.value,
                  type: "array",
                  inclusive: true,
                  exact: false,
                  message: def.maxLength.message
                });
                status.dirty();
              }
            }

            if (ctx.common.async) {
              return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
              })).then(result => {
                return parseUtil_1.ParseStatus.mergeArray(status, result);
              });
            }

            var result = [...ctx.data].map((item, i) => {
              return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            });
            return parseUtil_1.ParseStatus.mergeArray(status, result);
          }

          get element() {
            return this._def.type;
          }

          min(minLength, message) {
            return new ZodArray(_extends({}, this._def, {
              minLength: {
                value: minLength,
                message: errorUtil_1.errorUtil.toString(message)
              }
            }));
          }

          max(maxLength, message) {
            return new ZodArray(_extends({}, this._def, {
              maxLength: {
                value: maxLength,
                message: errorUtil_1.errorUtil.toString(message)
              }
            }));
          }

          length(len, message) {
            return new ZodArray(_extends({}, this._def, {
              exactLength: {
                value: len,
                message: errorUtil_1.errorUtil.toString(message)
              }
            }));
          }

          nonempty(message) {
            return this.min(1, message);
          }

        }

        exports.ZodArray = ZodArray;

        ZodArray.create = (schema, params) => {
          return new ZodArray(_extends({
            type: schema,
            minLength: null,
            maxLength: null,
            exactLength: null,
            typeName: ZodFirstPartyTypeKind.ZodArray
          }, processCreateParams(params)));
        };

        function deepPartialify(schema) {
          if (schema instanceof ZodObject) {
            var newShape = {};

            for (var key in schema.shape) {
              var fieldSchema = schema.shape[key];
              newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
            }

            return new ZodObject(_extends({}, schema._def, {
              shape: () => newShape
            }));
          } else if (schema instanceof ZodArray) {
            return new ZodArray(_extends({}, schema._def, {
              type: deepPartialify(schema.element)
            }));
          } else if (schema instanceof ZodOptional) {
            return ZodOptional.create(deepPartialify(schema.unwrap()));
          } else if (schema instanceof ZodNullable) {
            return ZodNullable.create(deepPartialify(schema.unwrap()));
          } else if (schema instanceof ZodTuple) {
            return ZodTuple.create(schema.items.map(item => deepPartialify(item)));
          } else {
            return schema;
          }
        }

        class ZodObject extends ZodType {
          constructor() {
            super(...arguments);
            this._cached = null;
            /**
             * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
             * If you want to pass through unknown properties, use `.passthrough()` instead.
             */

            this.nonstrict = this.passthrough; // extend<
            //   Augmentation extends ZodRawShape,
            //   NewOutput extends util.flatten<{
            //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
            //       ? Augmentation[k]["_output"]
            //       : k extends keyof Output
            //       ? Output[k]
            //       : never;
            //   }>,
            //   NewInput extends util.flatten<{
            //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
            //       ? Augmentation[k]["_input"]
            //       : k extends keyof Input
            //       ? Input[k]
            //       : never;
            //   }>
            // >(
            //   augmentation: Augmentation
            // ): ZodObject<
            //   extendShape<T, Augmentation>,
            //   UnknownKeys,
            //   Catchall,
            //   NewOutput,
            //   NewInput
            // > {
            //   return new ZodObject({
            //     ...this._def,
            //     shape: () => ({
            //       ...this._def.shape(),
            //       ...augmentation,
            //     }),
            //   }) as any;
            // }

            /**
             * @deprecated Use `.extend` instead
             *  */

            this.augment = this.extend;
          }

          _getCached() {
            if (this._cached !== null) return this._cached;

            var shape = this._def.shape();

            var keys = util_1.util.objectKeys(shape);
            return this._cached = {
              shape,
              keys
            };
          }

          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.object) {
              var _ctx5 = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(_ctx5, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.object,
                received: _ctx5.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var {
              status,
              ctx
            } = this._processInputParams(input);

            var {
              shape,
              keys: shapeKeys
            } = this._getCached();

            var extraKeys = [];

            if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
              for (var key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                  extraKeys.push(key);
                }
              }
            }

            var pairs = [];

            for (var _key of shapeKeys) {
              var keyValidator = shape[_key];
              var value = ctx.data[_key];
              pairs.push({
                key: {
                  status: "valid",
                  value: _key
                },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, _key)),
                alwaysSet: _key in ctx.data
              });
            }

            if (this._def.catchall instanceof ZodNever) {
              var unknownKeys = this._def.unknownKeys;

              if (unknownKeys === "passthrough") {
                for (var _key2 of extraKeys) {
                  pairs.push({
                    key: {
                      status: "valid",
                      value: _key2
                    },
                    value: {
                      status: "valid",
                      value: ctx.data[_key2]
                    }
                  });
                }
              } else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                  (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.unrecognized_keys,
                    keys: extraKeys
                  });
                  status.dirty();
                }
              } else if (unknownKeys === "strip") {} else {
                throw new Error("Internal ZodObject error: invalid unknownKeys value.");
              }
            } else {
              // run catchall validation
              var catchall = this._def.catchall;

              for (var _key3 of extraKeys) {
                var _value = ctx.data[_key3];
                pairs.push({
                  key: {
                    status: "valid",
                    value: _key3
                  },
                  value: catchall._parse(new ParseInputLazyPath(ctx, _value, ctx.path, _key3) //, ctx.child(key), value, getParsedType(value)
                  ),
                  alwaysSet: _key3 in ctx.data
                });
              }
            }

            if (ctx.common.async) {
              return Promise.resolve().then( /*#__PURE__*/_asyncToGenerator(function* () {
                var syncPairs = [];

                for (var pair of pairs) {
                  var _key4 = yield pair.key;

                  var _value2 = yield pair.value;

                  syncPairs.push({
                    key: _key4,
                    value: _value2,
                    alwaysSet: pair.alwaysSet
                  });
                }

                return syncPairs;
              })).then(syncPairs => {
                return parseUtil_1.ParseStatus.mergeObjectSync(status, syncPairs);
              });
            } else {
              return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
            }
          }

          get shape() {
            return this._def.shape();
          }

          strict(message) {
            errorUtil_1.errorUtil.errToObj;
            return new ZodObject(_extends({}, this._def, {
              unknownKeys: "strict"
            }, message !== undefined ? {
              errorMap: (issue, ctx) => {
                var _a, _b, _c, _d;

                var defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                if (issue.code === "unrecognized_keys") return {
                  message: (_d = errorUtil_1.errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                };
                return {
                  message: defaultError
                };
              }
            } : {}));
          }

          strip() {
            return new ZodObject(_extends({}, this._def, {
              unknownKeys: "strip"
            }));
          }

          passthrough() {
            return new ZodObject(_extends({}, this._def, {
              unknownKeys: "passthrough"
            }));
          } // const AugmentFactory =
          //   <Def extends ZodObjectDef>(def: Def) =>
          //   <Augmentation extends ZodRawShape>(
          //     augmentation: Augmentation
          //   ): ZodObject<
          //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
          //     Def["unknownKeys"],
          //     Def["catchall"]
          //   > => {
          //     return new ZodObject({
          //       ...def,
          //       shape: () => ({
          //         ...def.shape(),
          //         ...augmentation,
          //       }),
          //     }) as any;
          //   };


          extend(augmentation) {
            return new ZodObject(_extends({}, this._def, {
              shape: () => _extends({}, this._def.shape(), augmentation)
            }));
          }
          /**
           * Prior to zod@1.0.12 there was a bug in the
           * inferred type of merged objects. Please
           * upgrade if you are experiencing issues.
           */


          merge(merging) {
            var merged = new ZodObject({
              unknownKeys: merging._def.unknownKeys,
              catchall: merging._def.catchall,
              shape: () => _extends({}, this._def.shape(), merging._def.shape()),
              typeName: ZodFirstPartyTypeKind.ZodObject
            });
            return merged;
          } // merge<
          //   Incoming extends AnyZodObject,
          //   Augmentation extends Incoming["shape"],
          //   NewOutput extends {
          //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
          //       ? Augmentation[k]["_output"]
          //       : k extends keyof Output
          //       ? Output[k]
          //       : never;
          //   },
          //   NewInput extends {
          //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
          //       ? Augmentation[k]["_input"]
          //       : k extends keyof Input
          //       ? Input[k]
          //       : never;
          //   }
          // >(
          //   merging: Incoming
          // ): ZodObject<
          //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
          //   Incoming["_def"]["unknownKeys"],
          //   Incoming["_def"]["catchall"],
          //   NewOutput,
          //   NewInput
          // > {
          //   const merged: any = new ZodObject({
          //     unknownKeys: merging._def.unknownKeys,
          //     catchall: merging._def.catchall,
          //     shape: () =>
          //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
          //     typeName: ZodFirstPartyTypeKind.ZodObject,
          //   }) as any;
          //   return merged;
          // }


          setKey(key, schema) {
            return this.augment({
              [key]: schema
            });
          } // merge<Incoming extends AnyZodObject>(
          //   merging: Incoming
          // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
          // ZodObject<
          //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
          //   Incoming["_def"]["unknownKeys"],
          //   Incoming["_def"]["catchall"]
          // > {
          //   // const mergedShape = objectUtil.mergeShapes(
          //   //   this._def.shape(),
          //   //   merging._def.shape()
          //   // );
          //   const merged: any = new ZodObject({
          //     unknownKeys: merging._def.unknownKeys,
          //     catchall: merging._def.catchall,
          //     shape: () =>
          //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
          //     typeName: ZodFirstPartyTypeKind.ZodObject,
          //   }) as any;
          //   return merged;
          // }


          catchall(index) {
            return new ZodObject(_extends({}, this._def, {
              catchall: index
            }));
          }

          pick(mask) {
            var _shape = {};
            util_1.util.objectKeys(mask).forEach(key => {
              if (mask[key] && this.shape[key]) {
                _shape[key] = this.shape[key];
              }
            });
            return new ZodObject(_extends({}, this._def, {
              shape: () => _shape
            }));
          }

          omit(mask) {
            var _shape2 = {};
            util_1.util.objectKeys(this.shape).forEach(key => {
              if (!mask[key]) {
                _shape2[key] = this.shape[key];
              }
            });
            return new ZodObject(_extends({}, this._def, {
              shape: () => _shape2
            }));
          }
          /**
           * @deprecated
           */


          deepPartial() {
            return deepPartialify(this);
          }

          partial(mask) {
            var newShape = {};
            util_1.util.objectKeys(this.shape).forEach(key => {
              var fieldSchema = this.shape[key];

              if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
              } else {
                newShape[key] = fieldSchema.optional();
              }
            });
            return new ZodObject(_extends({}, this._def, {
              shape: () => newShape
            }));
          }

          required(mask) {
            var newShape = {};
            util_1.util.objectKeys(this.shape).forEach(key => {
              if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
              } else {
                var fieldSchema = this.shape[key];
                var newField = fieldSchema;

                while (newField instanceof ZodOptional) {
                  newField = newField._def.innerType;
                }

                newShape[key] = newField;
              }
            });
            return new ZodObject(_extends({}, this._def, {
              shape: () => newShape
            }));
          }

          keyof() {
            return createZodEnum(util_1.util.objectKeys(this.shape));
          }

        }

        exports.ZodObject = ZodObject;

        ZodObject.create = (_shape3, params) => {
          return new ZodObject(_extends({
            shape: () => _shape3,
            unknownKeys: "strip",
            catchall: ZodNever.create(),
            typeName: ZodFirstPartyTypeKind.ZodObject
          }, processCreateParams(params)));
        };

        ZodObject.strictCreate = (_shape4, params) => {
          return new ZodObject(_extends({
            shape: () => _shape4,
            unknownKeys: "strict",
            catchall: ZodNever.create(),
            typeName: ZodFirstPartyTypeKind.ZodObject
          }, processCreateParams(params)));
        };

        ZodObject.lazycreate = (shape, params) => {
          return new ZodObject(_extends({
            shape,
            unknownKeys: "strip",
            catchall: ZodNever.create(),
            typeName: ZodFirstPartyTypeKind.ZodObject
          }, processCreateParams(params)));
        };

        class ZodUnion extends ZodType {
          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            var options = this._def.options;

            function handleResults(results) {
              // return first issue-free validation if it exists
              for (var result of results) {
                if (result.result.status === "valid") {
                  return result.result;
                }
              }

              for (var _result of results) {
                if (_result.result.status === "dirty") {
                  // add issues from dirty option
                  ctx.common.issues.push(..._result.ctx.common.issues);
                  return _result.result;
                }
              } // return invalid


              var unionErrors = results.map(result => new ZodError_1.ZodError(result.ctx.common.issues));
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_union,
                unionErrors
              });
              return parseUtil_1.INVALID;
            }

            if (ctx.common.async) {
              return Promise.all(options.map( /*#__PURE__*/_asyncToGenerator(function* (option) {
                var childCtx = _extends({}, ctx, {
                  common: _extends({}, ctx.common, {
                    issues: []
                  }),
                  parent: null
                });

                return {
                  result: yield option._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx
                  }),
                  ctx: childCtx
                };
              }))).then(handleResults);
            } else {
              var dirty = undefined;
              var issues = [];

              for (var option of options) {
                var childCtx = _extends({}, ctx, {
                  common: _extends({}, ctx.common, {
                    issues: []
                  }),
                  parent: null
                });

                var result = option._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: childCtx
                });

                if (result.status === "valid") {
                  return result;
                } else if (result.status === "dirty" && !dirty) {
                  dirty = {
                    result,
                    ctx: childCtx
                  };
                }

                if (childCtx.common.issues.length) {
                  issues.push(childCtx.common.issues);
                }
              }

              if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
              }

              var unionErrors = issues.map(issues => new ZodError_1.ZodError(issues));
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_union,
                unionErrors
              });
              return parseUtil_1.INVALID;
            }
          }

          get options() {
            return this._def.options;
          }

        }

        exports.ZodUnion = ZodUnion;

        ZodUnion.create = (types, params) => {
          return new ZodUnion(_extends({
            options: types,
            typeName: ZodFirstPartyTypeKind.ZodUnion
          }, processCreateParams(params)));
        }; /////////////////////////////////////////////////////
        /////////////////////////////////////////////////////
        //////////                                 //////////
        //////////      ZodDiscriminatedUnion      //////////
        //////////                                 //////////
        /////////////////////////////////////////////////////
        /////////////////////////////////////////////////////


        var getDiscriminator = type => {
          if (type instanceof ZodLazy) {
            return getDiscriminator(type.schema);
          } else if (type instanceof ZodEffects) {
            return getDiscriminator(type.innerType());
          } else if (type instanceof ZodLiteral) {
            return [type.value];
          } else if (type instanceof ZodEnum) {
            return type.options;
          } else if (type instanceof ZodNativeEnum) {
            // eslint-disable-next-line ban/ban
            return util_1.util.objectValues(type.enum);
          } else if (type instanceof ZodDefault) {
            return getDiscriminator(type._def.innerType);
          } else if (type instanceof ZodUndefined) {
            return [undefined];
          } else if (type instanceof ZodNull) {
            return [null];
          } else if (type instanceof ZodOptional) {
            return [undefined, ...getDiscriminator(type.unwrap())];
          } else if (type instanceof ZodNullable) {
            return [null, ...getDiscriminator(type.unwrap())];
          } else if (type instanceof ZodBranded) {
            return getDiscriminator(type.unwrap());
          } else if (type instanceof ZodReadonly) {
            return getDiscriminator(type.unwrap());
          } else if (type instanceof ZodCatch) {
            return getDiscriminator(type._def.innerType);
          } else {
            return [];
          }
        };

        class ZodDiscriminatedUnion extends ZodType {
          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.object) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.object,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var discriminator = this.discriminator;
            var discriminatorValue = ctx.data[discriminator];
            var option = this.optionsMap.get(discriminatorValue);

            if (!option) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator]
              });
              return parseUtil_1.INVALID;
            }

            if (ctx.common.async) {
              return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              });
            } else {
              return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              });
            }
          }

          get discriminator() {
            return this._def.discriminator;
          }

          get options() {
            return this._def.options;
          }

          get optionsMap() {
            return this._def.optionsMap;
          }
          /**
           * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
           * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
           * have a different value for each object in the union.
           * @param discriminator the name of the discriminator property
           * @param types an array of object schemas
           * @param params
           */


          static create(discriminator, options, params) {
            // Get all the valid discriminator values
            var optionsMap = new Map(); // try {

            for (var type of options) {
              var discriminatorValues = getDiscriminator(type.shape[discriminator]);

              if (!discriminatorValues.length) {
                throw new Error("A discriminator value for key `" + discriminator + "` could not be extracted from all schema options");
              }

              for (var value of discriminatorValues) {
                if (optionsMap.has(value)) {
                  throw new Error("Discriminator property " + String(discriminator) + " has duplicate value " + String(value));
                }

                optionsMap.set(value, type);
              }
            }

            return new ZodDiscriminatedUnion(_extends({
              typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
              discriminator,
              options,
              optionsMap
            }, processCreateParams(params)));
          }

        }

        exports.ZodDiscriminatedUnion = ZodDiscriminatedUnion;

        function mergeValues(a, b) {
          var aType = (0, util_1.getParsedType)(a);
          var bType = (0, util_1.getParsedType)(b);

          if (a === b) {
            return {
              valid: true,
              data: a
            };
          } else if (aType === util_1.ZodParsedType.object && bType === util_1.ZodParsedType.object) {
            var bKeys = util_1.util.objectKeys(b);
            var sharedKeys = util_1.util.objectKeys(a).filter(key => bKeys.indexOf(key) !== -1);

            var newObj = _extends({}, a, b);

            for (var key of sharedKeys) {
              var sharedValue = mergeValues(a[key], b[key]);

              if (!sharedValue.valid) {
                return {
                  valid: false
                };
              }

              newObj[key] = sharedValue.data;
            }

            return {
              valid: true,
              data: newObj
            };
          } else if (aType === util_1.ZodParsedType.array && bType === util_1.ZodParsedType.array) {
            if (a.length !== b.length) {
              return {
                valid: false
              };
            }

            var newArray = [];

            for (var index = 0; index < a.length; index++) {
              var itemA = a[index];
              var itemB = b[index];

              var _sharedValue = mergeValues(itemA, itemB);

              if (!_sharedValue.valid) {
                return {
                  valid: false
                };
              }

              newArray.push(_sharedValue.data);
            }

            return {
              valid: true,
              data: newArray
            };
          } else if (aType === util_1.ZodParsedType.date && bType === util_1.ZodParsedType.date && +a === +b) {
            return {
              valid: true,
              data: a
            };
          } else {
            return {
              valid: false
            };
          }
        }

        class ZodIntersection extends ZodType {
          _parse(input) {
            var {
              status,
              ctx
            } = this._processInputParams(input);

            var handleParsed = (parsedLeft, parsedRight) => {
              if ((0, parseUtil_1.isAborted)(parsedLeft) || (0, parseUtil_1.isAborted)(parsedRight)) {
                return parseUtil_1.INVALID;
              }

              var merged = mergeValues(parsedLeft.value, parsedRight.value);

              if (!merged.valid) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.invalid_intersection_types
                });
                return parseUtil_1.INVALID;
              }

              if ((0, parseUtil_1.isDirty)(parsedLeft) || (0, parseUtil_1.isDirty)(parsedRight)) {
                status.dirty();
              }

              return {
                status: status.value,
                value: merged.data
              };
            };

            if (ctx.common.async) {
              return Promise.all([this._def.left._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              }), this._def.right._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              })]).then(_ref3 => {
                var [left, right] = _ref3;
                return handleParsed(left, right);
              });
            } else {
              return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              }));
            }
          }

        }

        exports.ZodIntersection = ZodIntersection;

        ZodIntersection.create = (left, right, params) => {
          return new ZodIntersection(_extends({
            left: left,
            right: right,
            typeName: ZodFirstPartyTypeKind.ZodIntersection
          }, processCreateParams(params)));
        };

        class ZodTuple extends ZodType {
          _parse(input) {
            var {
              status,
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.array) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.array,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            if (ctx.data.length < this._def.items.length) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array"
              });
              return parseUtil_1.INVALID;
            }

            var rest = this._def.rest;

            if (!rest && ctx.data.length > this._def.items.length) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array"
              });
              status.dirty();
            }

            var items = [...ctx.data].map((item, itemIndex) => {
              var schema = this._def.items[itemIndex] || this._def.rest;
              if (!schema) return null;
              return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
            }).filter(x => !!x); // filter nulls

            if (ctx.common.async) {
              return Promise.all(items).then(results => {
                return parseUtil_1.ParseStatus.mergeArray(status, results);
              });
            } else {
              return parseUtil_1.ParseStatus.mergeArray(status, items);
            }
          }

          get items() {
            return this._def.items;
          }

          rest(rest) {
            return new ZodTuple(_extends({}, this._def, {
              rest
            }));
          }

        }

        exports.ZodTuple = ZodTuple;

        ZodTuple.create = (schemas, params) => {
          if (!Array.isArray(schemas)) {
            throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
          }

          return new ZodTuple(_extends({
            items: schemas,
            typeName: ZodFirstPartyTypeKind.ZodTuple,
            rest: null
          }, processCreateParams(params)));
        };

        class ZodRecord extends ZodType {
          get keySchema() {
            return this._def.keyType;
          }

          get valueSchema() {
            return this._def.valueType;
          }

          _parse(input) {
            var {
              status,
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.object) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.object,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var pairs = [];
            var keyType = this._def.keyType;
            var valueType = this._def.valueType;

            for (var key in ctx.data) {
              pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                alwaysSet: key in ctx.data
              });
            }

            if (ctx.common.async) {
              return parseUtil_1.ParseStatus.mergeObjectAsync(status, pairs);
            } else {
              return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
            }
          }

          get element() {
            return this._def.valueType;
          }

          static create(first, second, third) {
            if (second instanceof ZodType) {
              return new ZodRecord(_extends({
                keyType: first,
                valueType: second,
                typeName: ZodFirstPartyTypeKind.ZodRecord
              }, processCreateParams(third)));
            }

            return new ZodRecord(_extends({
              keyType: ZodString.create(),
              valueType: first,
              typeName: ZodFirstPartyTypeKind.ZodRecord
            }, processCreateParams(second)));
          }

        }

        exports.ZodRecord = ZodRecord;

        class ZodMap extends ZodType {
          get keySchema() {
            return this._def.keyType;
          }

          get valueSchema() {
            return this._def.valueType;
          }

          _parse(input) {
            var {
              status,
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.map) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.map,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var keyType = this._def.keyType;
            var valueType = this._def.valueType;
            var pairs = [...ctx.data.entries()].map((_ref4, index) => {
              var [key, value] = _ref4;
              return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
              };
            });

            if (ctx.common.async) {
              var finalMap = new Map();
              return Promise.resolve().then( /*#__PURE__*/_asyncToGenerator(function* () {
                for (var pair of pairs) {
                  var key = yield pair.key;
                  var value = yield pair.value;

                  if (key.status === "aborted" || value.status === "aborted") {
                    return parseUtil_1.INVALID;
                  }

                  if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                  }

                  finalMap.set(key.value, value.value);
                }

                return {
                  status: status.value,
                  value: finalMap
                };
              }));
            } else {
              var _finalMap = new Map();

              for (var pair of pairs) {
                var key = pair.key;
                var value = pair.value;

                if (key.status === "aborted" || value.status === "aborted") {
                  return parseUtil_1.INVALID;
                }

                if (key.status === "dirty" || value.status === "dirty") {
                  status.dirty();
                }

                _finalMap.set(key.value, value.value);
              }

              return {
                status: status.value,
                value: _finalMap
              };
            }
          }

        }

        exports.ZodMap = ZodMap;

        ZodMap.create = (keyType, valueType, params) => {
          return new ZodMap(_extends({
            valueType,
            keyType,
            typeName: ZodFirstPartyTypeKind.ZodMap
          }, processCreateParams(params)));
        };

        class ZodSet extends ZodType {
          _parse(input) {
            var {
              status,
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.set) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.set,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var def = this._def;

            if (def.minSize !== null) {
              if (ctx.data.size < def.minSize.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_small,
                  minimum: def.minSize.value,
                  type: "set",
                  inclusive: true,
                  exact: false,
                  message: def.minSize.message
                });
                status.dirty();
              }
            }

            if (def.maxSize !== null) {
              if (ctx.data.size > def.maxSize.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_big,
                  maximum: def.maxSize.value,
                  type: "set",
                  inclusive: true,
                  exact: false,
                  message: def.maxSize.message
                });
                status.dirty();
              }
            }

            var valueType = this._def.valueType;

            function finalizeSet(elements) {
              var parsedSet = new Set();

              for (var element of elements) {
                if (element.status === "aborted") return parseUtil_1.INVALID;
                if (element.status === "dirty") status.dirty();
                parsedSet.add(element.value);
              }

              return {
                status: status.value,
                value: parsedSet
              };
            }

            var elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));

            if (ctx.common.async) {
              return Promise.all(elements).then(elements => finalizeSet(elements));
            } else {
              return finalizeSet(elements);
            }
          }

          min(minSize, message) {
            return new ZodSet(_extends({}, this._def, {
              minSize: {
                value: minSize,
                message: errorUtil_1.errorUtil.toString(message)
              }
            }));
          }

          max(maxSize, message) {
            return new ZodSet(_extends({}, this._def, {
              maxSize: {
                value: maxSize,
                message: errorUtil_1.errorUtil.toString(message)
              }
            }));
          }

          size(size, message) {
            return this.min(size, message).max(size, message);
          }

          nonempty(message) {
            return this.min(1, message);
          }

        }

        exports.ZodSet = ZodSet;

        ZodSet.create = (valueType, params) => {
          return new ZodSet(_extends({
            valueType,
            minSize: null,
            maxSize: null,
            typeName: ZodFirstPartyTypeKind.ZodSet
          }, processCreateParams(params)));
        };

        class ZodFunction extends ZodType {
          constructor() {
            super(...arguments);
            this.validate = this.implement;
          }

          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.function) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.function,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            function makeArgsIssue(args, error) {
              return (0, parseUtil_1.makeIssue)({
                data: args,
                path: ctx.path,
                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, (0, errors_1.getErrorMap)(), errors_1.defaultErrorMap].filter(x => !!x),
                issueData: {
                  code: ZodError_1.ZodIssueCode.invalid_arguments,
                  argumentsError: error
                }
              });
            }

            function makeReturnsIssue(returns, error) {
              return (0, parseUtil_1.makeIssue)({
                data: returns,
                path: ctx.path,
                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, (0, errors_1.getErrorMap)(), errors_1.defaultErrorMap].filter(x => !!x),
                issueData: {
                  code: ZodError_1.ZodIssueCode.invalid_return_type,
                  returnTypeError: error
                }
              });
            }

            var params = {
              errorMap: ctx.common.contextualErrorMap
            };
            var fn = ctx.data;

            if (this._def.returns instanceof ZodPromise) {
              // Would love a way to avoid disabling this rule, but we need
              // an alias (using an arrow function was what caused 2651).
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              var me = this;
              return (0, parseUtil_1.OK)( /*#__PURE__*/_asyncToGenerator(function* () {
                for (var _len = arguments.length, args = new Array(_len), _key5 = 0; _key5 < _len; _key5++) {
                  args[_key5] = arguments[_key5];
                }

                var error = new ZodError_1.ZodError([]);
                var parsedArgs = yield me._def.args.parseAsync(args, params).catch(e => {
                  error.addIssue(makeArgsIssue(args, e));
                  throw error;
                });
                var result = yield Reflect.apply(fn, this, parsedArgs);
                var parsedReturns = yield me._def.returns._def.type.parseAsync(result, params).catch(e => {
                  error.addIssue(makeReturnsIssue(result, e));
                  throw error;
                });
                return parsedReturns;
              }));
            } else {
              // Would love a way to avoid disabling this rule, but we need
              // an alias (using an arrow function was what caused 2651).
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              var _me = this;

              return (0, parseUtil_1.OK)(function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key6 = 0; _key6 < _len2; _key6++) {
                  args[_key6] = arguments[_key6];
                }

                var parsedArgs = _me._def.args.safeParse(args, params);

                if (!parsedArgs.success) {
                  throw new ZodError_1.ZodError([makeArgsIssue(args, parsedArgs.error)]);
                }

                var result = Reflect.apply(fn, this, parsedArgs.data);

                var parsedReturns = _me._def.returns.safeParse(result, params);

                if (!parsedReturns.success) {
                  throw new ZodError_1.ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                }

                return parsedReturns.data;
              });
            }
          }

          parameters() {
            return this._def.args;
          }

          returnType() {
            return this._def.returns;
          }

          args() {
            for (var _len3 = arguments.length, items = new Array(_len3), _key7 = 0; _key7 < _len3; _key7++) {
              items[_key7] = arguments[_key7];
            }

            return new ZodFunction(_extends({}, this._def, {
              args: ZodTuple.create(items).rest(ZodUnknown.create())
            }));
          }

          returns(returnType) {
            return new ZodFunction(_extends({}, this._def, {
              returns: returnType
            }));
          }

          implement(func) {
            var validatedFunc = this.parse(func);
            return validatedFunc;
          }

          strictImplement(func) {
            var validatedFunc = this.parse(func);
            return validatedFunc;
          }

          static create(args, returns, params) {
            return new ZodFunction(_extends({
              args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
              returns: returns || ZodUnknown.create(),
              typeName: ZodFirstPartyTypeKind.ZodFunction
            }, processCreateParams(params)));
          }

        }

        exports.ZodFunction = ZodFunction;

        class ZodLazy extends ZodType {
          get schema() {
            return this._def.getter();
          }

          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            var lazySchema = this._def.getter();

            return lazySchema._parse({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
          }

        }

        exports.ZodLazy = ZodLazy;

        ZodLazy.create = (getter, params) => {
          return new ZodLazy(_extends({
            getter: getter,
            typeName: ZodFirstPartyTypeKind.ZodLazy
          }, processCreateParams(params)));
        };

        class ZodLiteral extends ZodType {
          _parse(input) {
            if (input.data !== this._def.value) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                received: ctx.data,
                code: ZodError_1.ZodIssueCode.invalid_literal,
                expected: this._def.value
              });
              return parseUtil_1.INVALID;
            }

            return {
              status: "valid",
              value: input.data
            };
          }

          get value() {
            return this._def.value;
          }

        }

        exports.ZodLiteral = ZodLiteral;

        ZodLiteral.create = (value, params) => {
          return new ZodLiteral(_extends({
            value: value,
            typeName: ZodFirstPartyTypeKind.ZodLiteral
          }, processCreateParams(params)));
        };

        function createZodEnum(values, params) {
          return new ZodEnum(_extends({
            values,
            typeName: ZodFirstPartyTypeKind.ZodEnum
          }, processCreateParams(params)));
        }

        class ZodEnum extends ZodType {
          constructor() {
            super(...arguments);

            _ZodEnum_cache.set(this, void 0);
          }

          _parse(input) {
            if (typeof input.data !== "string") {
              var ctx = this._getOrReturnCtx(input);

              var expectedValues = this._def.values;
              (0, parseUtil_1.addIssueToContext)(ctx, {
                expected: util_1.util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodError_1.ZodIssueCode.invalid_type
              });
              return parseUtil_1.INVALID;
            }

            if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
              __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
            }

            if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
              var _ctx6 = this._getOrReturnCtx(input);

              var _expectedValues = this._def.values;
              (0, parseUtil_1.addIssueToContext)(_ctx6, {
                received: _ctx6.data,
                code: ZodError_1.ZodIssueCode.invalid_enum_value,
                options: _expectedValues
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

          get options() {
            return this._def.values;
          }

          get enum() {
            var enumValues = {};

            for (var val of this._def.values) {
              enumValues[val] = val;
            }

            return enumValues;
          }

          get Values() {
            var enumValues = {};

            for (var val of this._def.values) {
              enumValues[val] = val;
            }

            return enumValues;
          }

          get Enum() {
            var enumValues = {};

            for (var val of this._def.values) {
              enumValues[val] = val;
            }

            return enumValues;
          }

          extract(values, newDef) {
            if (newDef === void 0) {
              newDef = this._def;
            }

            return ZodEnum.create(values, _extends({}, this._def, newDef));
          }

          exclude(values, newDef) {
            if (newDef === void 0) {
              newDef = this._def;
            }

            return ZodEnum.create(this.options.filter(opt => !values.includes(opt)), _extends({}, this._def, newDef));
          }

        }

        exports.ZodEnum = ZodEnum;
        _ZodEnum_cache = new WeakMap();
        ZodEnum.create = createZodEnum;

        class ZodNativeEnum extends ZodType {
          constructor() {
            super(...arguments);

            _ZodNativeEnum_cache.set(this, void 0);
          }

          _parse(input) {
            var nativeEnumValues = util_1.util.getValidEnumValues(this._def.values);

            var ctx = this._getOrReturnCtx(input);

            if (ctx.parsedType !== util_1.ZodParsedType.string && ctx.parsedType !== util_1.ZodParsedType.number) {
              var expectedValues = util_1.util.objectValues(nativeEnumValues);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                expected: util_1.util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodError_1.ZodIssueCode.invalid_type
              });
              return parseUtil_1.INVALID;
            }

            if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
              __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util_1.util.getValidEnumValues(this._def.values)), "f");
            }

            if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
              var _expectedValues2 = util_1.util.objectValues(nativeEnumValues);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                received: ctx.data,
                code: ZodError_1.ZodIssueCode.invalid_enum_value,
                options: _expectedValues2
              });
              return parseUtil_1.INVALID;
            }

            return (0, parseUtil_1.OK)(input.data);
          }

          get enum() {
            return this._def.values;
          }

        }

        exports.ZodNativeEnum = ZodNativeEnum;
        _ZodNativeEnum_cache = new WeakMap();

        ZodNativeEnum.create = (values, params) => {
          return new ZodNativeEnum(_extends({
            values: values,
            typeName: ZodFirstPartyTypeKind.ZodNativeEnum
          }, processCreateParams(params)));
        };

        class ZodPromise extends ZodType {
          unwrap() {
            return this._def.type;
          }

          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            if (ctx.parsedType !== util_1.ZodParsedType.promise && ctx.common.async === false) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.promise,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            var promisified = ctx.parsedType === util_1.ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
            return (0, parseUtil_1.OK)(promisified.then(data => {
              return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap
              });
            }));
          }

        }

        exports.ZodPromise = ZodPromise;

        ZodPromise.create = (schema, params) => {
          return new ZodPromise(_extends({
            type: schema,
            typeName: ZodFirstPartyTypeKind.ZodPromise
          }, processCreateParams(params)));
        };

        class ZodEffects extends ZodType {
          innerType() {
            return this._def.schema;
          }

          sourceType() {
            return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
          }

          _parse(input) {
            var _this3 = this;

            var {
              status,
              ctx
            } = this._processInputParams(input);

            var effect = this._def.effect || null;
            var checkCtx = {
              addIssue: arg => {
                (0, parseUtil_1.addIssueToContext)(ctx, arg);

                if (arg.fatal) {
                  status.abort();
                } else {
                  status.dirty();
                }
              },

              get path() {
                return ctx.path;
              }

            };
            checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);

            if (effect.type === "preprocess") {
              var processed = effect.transform(ctx.data, checkCtx);

              if (ctx.common.async) {
                return Promise.resolve(processed).then( /*#__PURE__*/_asyncToGenerator(function* (processed) {
                  if (status.value === "aborted") return parseUtil_1.INVALID;
                  var result = yield _this3._def.schema._parseAsync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx
                  });
                  if (result.status === "aborted") return parseUtil_1.INVALID;
                  if (result.status === "dirty") return (0, parseUtil_1.DIRTY)(result.value);
                  if (status.value === "dirty") return (0, parseUtil_1.DIRTY)(result.value);
                  return result;
                }));
              } else {
                if (status.value === "aborted") return parseUtil_1.INVALID;

                var result = this._def.schema._parseSync({
                  data: processed,
                  path: ctx.path,
                  parent: ctx
                });

                if (result.status === "aborted") return parseUtil_1.INVALID;
                if (result.status === "dirty") return (0, parseUtil_1.DIRTY)(result.value);
                if (status.value === "dirty") return (0, parseUtil_1.DIRTY)(result.value);
                return result;
              }
            }

            if (effect.type === "refinement") {
              var executeRefinement = acc => {
                var result = effect.refinement(acc, checkCtx);

                if (ctx.common.async) {
                  return Promise.resolve(result);
                }

                if (result instanceof Promise) {
                  throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }

                return acc;
              };

              if (ctx.common.async === false) {
                var inner = this._def.schema._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx
                });

                if (inner.status === "aborted") return parseUtil_1.INVALID;
                if (inner.status === "dirty") status.dirty(); // return value is ignored

                executeRefinement(inner.value);
                return {
                  status: status.value,
                  value: inner.value
                };
              } else {
                return this._def.schema._parseAsync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx
                }).then(inner => {
                  if (inner.status === "aborted") return parseUtil_1.INVALID;
                  if (inner.status === "dirty") status.dirty();
                  return executeRefinement(inner.value).then(() => {
                    return {
                      status: status.value,
                      value: inner.value
                    };
                  });
                });
              }
            }

            if (effect.type === "transform") {
              if (ctx.common.async === false) {
                var base = this._def.schema._parseSync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx
                });

                if (!(0, parseUtil_1.isValid)(base)) return base;

                var _result2 = effect.transform(base.value, checkCtx);

                if (_result2 instanceof Promise) {
                  throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
                }

                return {
                  status: status.value,
                  value: _result2
                };
              } else {
                return this._def.schema._parseAsync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: ctx
                }).then(base => {
                  if (!(0, parseUtil_1.isValid)(base)) return base;
                  return Promise.resolve(effect.transform(base.value, checkCtx)).then(result => ({
                    status: status.value,
                    value: result
                  }));
                });
              }
            }

            util_1.util.assertNever(effect);
          }

        }

        exports.ZodEffects = ZodEffects;
        exports.ZodTransformer = ZodEffects;

        ZodEffects.create = (schema, effect, params) => {
          return new ZodEffects(_extends({
            schema,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect
          }, processCreateParams(params)));
        };

        ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
          return new ZodEffects(_extends({
            schema,
            effect: {
              type: "preprocess",
              transform: preprocess
            },
            typeName: ZodFirstPartyTypeKind.ZodEffects
          }, processCreateParams(params)));
        };

        class ZodOptional extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType === util_1.ZodParsedType.undefined) {
              return (0, parseUtil_1.OK)(undefined);
            }

            return this._def.innerType._parse(input);
          }

          unwrap() {
            return this._def.innerType;
          }

        }

        exports.ZodOptional = ZodOptional;

        ZodOptional.create = (type, params) => {
          return new ZodOptional(_extends({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodOptional
          }, processCreateParams(params)));
        };

        class ZodNullable extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType === util_1.ZodParsedType.null) {
              return (0, parseUtil_1.OK)(null);
            }

            return this._def.innerType._parse(input);
          }

          unwrap() {
            return this._def.innerType;
          }

        }

        exports.ZodNullable = ZodNullable;

        ZodNullable.create = (type, params) => {
          return new ZodNullable(_extends({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodNullable
          }, processCreateParams(params)));
        };

        class ZodDefault extends ZodType {
          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            var data = ctx.data;

            if (ctx.parsedType === util_1.ZodParsedType.undefined) {
              data = this._def.defaultValue();
            }

            return this._def.innerType._parse({
              data,
              path: ctx.path,
              parent: ctx
            });
          }

          removeDefault() {
            return this._def.innerType;
          }

        }

        exports.ZodDefault = ZodDefault;

        ZodDefault.create = (type, params) => {
          return new ZodDefault(_extends({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
            defaultValue: typeof params.default === "function" ? params.default : () => params.default
          }, processCreateParams(params)));
        };

        class ZodCatch extends ZodType {
          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input); // newCtx is used to not collect issues from inner types in ctx


            var newCtx = _extends({}, ctx, {
              common: _extends({}, ctx.common, {
                issues: []
              })
            });

            var result = this._def.innerType._parse({
              data: newCtx.data,
              path: newCtx.path,
              parent: _extends({}, newCtx)
            });

            if ((0, parseUtil_1.isAsync)(result)) {
              return result.then(result => {
                return {
                  status: "valid",
                  value: result.status === "valid" ? result.value : this._def.catchValue({
                    get error() {
                      return new ZodError_1.ZodError(newCtx.common.issues);
                    },

                    input: newCtx.data
                  })
                };
              });
            } else {
              return {
                status: "valid",
                value: result.status === "valid" ? result.value : this._def.catchValue({
                  get error() {
                    return new ZodError_1.ZodError(newCtx.common.issues);
                  },

                  input: newCtx.data
                })
              };
            }
          }

          removeCatch() {
            return this._def.innerType;
          }

        }

        exports.ZodCatch = ZodCatch;

        ZodCatch.create = (type, params) => {
          return new ZodCatch(_extends({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
            catchValue: typeof params.catch === "function" ? params.catch : () => params.catch
          }, processCreateParams(params)));
        };

        class ZodNaN extends ZodType {
          _parse(input) {
            var parsedType = this._getType(input);

            if (parsedType !== util_1.ZodParsedType.nan) {
              var ctx = this._getOrReturnCtx(input);

              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.nan,
                received: ctx.parsedType
              });
              return parseUtil_1.INVALID;
            }

            return {
              status: "valid",
              value: input.data
            };
          }

        }

        exports.ZodNaN = ZodNaN;

        ZodNaN.create = params => {
          return new ZodNaN(_extends({
            typeName: ZodFirstPartyTypeKind.ZodNaN
          }, processCreateParams(params)));
        };

        exports.BRAND = Symbol("zod_brand");

        class ZodBranded extends ZodType {
          _parse(input) {
            var {
              ctx
            } = this._processInputParams(input);

            var data = ctx.data;
            return this._def.type._parse({
              data,
              path: ctx.path,
              parent: ctx
            });
          }

          unwrap() {
            return this._def.type;
          }

        }

        exports.ZodBranded = ZodBranded;

        class ZodPipeline extends ZodType {
          _parse(input) {
            var _this4 = this;

            var {
              status,
              ctx
            } = this._processInputParams(input);

            if (ctx.common.async) {
              var handleAsync = /*#__PURE__*/function () {
                var _ref8 = _asyncToGenerator(function* () {
                  var inResult = yield _this4._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx
                  });
                  if (inResult.status === "aborted") return parseUtil_1.INVALID;

                  if (inResult.status === "dirty") {
                    status.dirty();
                    return (0, parseUtil_1.DIRTY)(inResult.value);
                  } else {
                    return _this4._def.out._parseAsync({
                      data: inResult.value,
                      path: ctx.path,
                      parent: ctx
                    });
                  }
                });

                return function handleAsync() {
                  return _ref8.apply(this, arguments);
                };
              }();

              return handleAsync();
            } else {
              var inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              });

              if (inResult.status === "aborted") return parseUtil_1.INVALID;

              if (inResult.status === "dirty") {
                status.dirty();
                return {
                  status: "dirty",
                  value: inResult.value
                };
              } else {
                return this._def.out._parseSync({
                  data: inResult.value,
                  path: ctx.path,
                  parent: ctx
                });
              }
            }
          }

          static create(a, b) {
            return new ZodPipeline({
              in: a,
              out: b,
              typeName: ZodFirstPartyTypeKind.ZodPipeline
            });
          }

        }

        exports.ZodPipeline = ZodPipeline;

        class ZodReadonly extends ZodType {
          _parse(input) {
            var result = this._def.innerType._parse(input);

            var freeze = data => {
              if ((0, parseUtil_1.isValid)(data)) {
                data.value = Object.freeze(data.value);
              }

              return data;
            };

            return (0, parseUtil_1.isAsync)(result) ? result.then(data => freeze(data)) : freeze(result);
          }

          unwrap() {
            return this._def.innerType;
          }

        }

        exports.ZodReadonly = ZodReadonly;

        ZodReadonly.create = (type, params) => {
          return new ZodReadonly(_extends({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodReadonly
          }, processCreateParams(params)));
        }; ////////////////////////////////////////
        ////////////////////////////////////////
        //////////                    //////////
        //////////      z.custom      //////////
        //////////                    //////////
        ////////////////////////////////////////
        ////////////////////////////////////////


        function cleanParams(params, data) {
          var p = typeof params === "function" ? params(data) : typeof params === "string" ? {
            message: params
          } : params;
          var p2 = typeof p === "string" ? {
            message: p
          } : p;
          return p2;
        }

        function custom(check, _params,
        /**
         * @deprecated
         *
         * Pass `fatal` into the params object instead:
         *
         * ```ts
         * z.string().custom((val) => val.length > 5, { fatal: false })
         * ```
         *
         */
        fatal) {
          if (_params === void 0) {
            _params = {};
          }

          if (check) return ZodAny.create().superRefine((data, ctx) => {
            var _a, _b;

            var r = check(data);

            if (r instanceof Promise) {
              return r.then(r => {
                var _a, _b;

                if (!r) {
                  var params = cleanParams(_params, data);

                  var _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;

                  ctx.addIssue(_extends({
                    code: "custom"
                  }, params, {
                    fatal: _fatal
                  }));
                }
              });
            }

            if (!r) {
              var params = cleanParams(_params, data);

              var _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;

              ctx.addIssue(_extends({
                code: "custom"
              }, params, {
                fatal: _fatal
              }));
            }

            return;
          });
          return ZodAny.create();
        }

        exports.custom = custom;
        exports.late = {
          object: ZodObject.lazycreate
        };
        var ZodFirstPartyTypeKind;

        (function (ZodFirstPartyTypeKind) {
          ZodFirstPartyTypeKind["ZodString"] = "ZodString";
          ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
          ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
          ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
          ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
          ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
          ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
          ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
          ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
          ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
          ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
          ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
          ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
          ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
          ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
          ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
          ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
          ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
          ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
          ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
          ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
          ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
          ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
          ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
          ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
          ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
          ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
          ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
          ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
          ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
          ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
          ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
          ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
          ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
          ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
          ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
        })(ZodFirstPartyTypeKind || (exports.ZodFirstPartyTypeKind = ZodFirstPartyTypeKind = {})); // requires TS 4.4+


        class Class {
          constructor() {}

        }

        var instanceOfType = function instanceOfType( // const instanceOfType = <T extends new (...args: any[]) => any>(
        cls, params) {
          if (params === void 0) {
            params = {
              message: "Input not instance of " + cls.name
            };
          }

          return custom(data => data instanceof cls, params);
        };

        exports.instanceof = instanceOfType;
        var stringType = ZodString.create;
        exports.string = stringType;
        var numberType = ZodNumber.create;
        exports.number = numberType;
        var nanType = ZodNaN.create;
        exports.nan = nanType;
        var bigIntType = ZodBigInt.create;
        exports.bigint = bigIntType;
        var booleanType = ZodBoolean.create;
        exports.boolean = booleanType;
        var dateType = ZodDate.create;
        exports.date = dateType;
        var symbolType = ZodSymbol.create;
        exports.symbol = symbolType;
        var undefinedType = ZodUndefined.create;
        exports.undefined = undefinedType;
        var nullType = ZodNull.create;
        exports.null = nullType;
        var anyType = ZodAny.create;
        exports.any = anyType;
        var unknownType = ZodUnknown.create;
        exports.unknown = unknownType;
        var neverType = ZodNever.create;
        exports.never = neverType;
        var voidType = ZodVoid.create;
        exports.void = voidType;
        var arrayType = ZodArray.create;
        exports.array = arrayType;
        var objectType = ZodObject.create;
        exports.object = objectType;
        var strictObjectType = ZodObject.strictCreate;
        exports.strictObject = strictObjectType;
        var unionType = ZodUnion.create;
        exports.union = unionType;
        var discriminatedUnionType = ZodDiscriminatedUnion.create;
        exports.discriminatedUnion = discriminatedUnionType;
        var intersectionType = ZodIntersection.create;
        exports.intersection = intersectionType;
        var tupleType = ZodTuple.create;
        exports.tuple = tupleType;
        var recordType = ZodRecord.create;
        exports.record = recordType;
        var mapType = ZodMap.create;
        exports.map = mapType;
        var setType = ZodSet.create;
        exports.set = setType;
        var functionType = ZodFunction.create;
        exports.function = functionType;
        var lazyType = ZodLazy.create;
        exports.lazy = lazyType;
        var literalType = ZodLiteral.create;
        exports.literal = literalType;
        var enumType = ZodEnum.create;
        exports.enum = enumType;
        var nativeEnumType = ZodNativeEnum.create;
        exports.nativeEnum = nativeEnumType;
        var promiseType = ZodPromise.create;
        exports.promise = promiseType;
        var effectsType = ZodEffects.create;
        exports.effect = effectsType;
        exports.transformer = effectsType;
        var optionalType = ZodOptional.create;
        exports.optional = optionalType;
        var nullableType = ZodNullable.create;
        exports.nullable = nullableType;
        var preprocessType = ZodEffects.createWithPreprocess;
        exports.preprocess = preprocessType;
        var pipelineType = ZodPipeline.create;
        exports.pipeline = pipelineType;

        var ostring = () => stringType().optional();

        exports.ostring = ostring;

        var onumber = () => numberType().optional();

        exports.onumber = onumber;

        var oboolean = () => booleanType().optional();

        exports.oboolean = oboolean;
        exports.coerce = {
          string: arg => ZodString.create(_extends({}, arg, {
            coerce: true
          })),
          number: arg => ZodNumber.create(_extends({}, arg, {
            coerce: true
          })),
          boolean: arg => ZodBoolean.create(_extends({}, arg, {
            coerce: true
          })),
          bigint: arg => ZodBigInt.create(_extends({}, arg, {
            coerce: true
          })),
          date: arg => ZodDate.create(_extends({}, arg, {
            coerce: true
          }))
        };
        exports.NEVER = parseUtil_1.INVALID; // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);

        ___esModule = module.exports.__esModule;
        _boolean = module.exports.boolean;
        _bigint = module.exports.bigint;
        _array = module.exports.array;
        _any = module.exports.any;
        _coerce = module.exports.coerce;
        _ZodFirstPartyTypeKind = module.exports.ZodFirstPartyTypeKind;
        _late = module.exports.late;
        _ZodSchema = module.exports.ZodSchema;
        _Schema = module.exports.Schema;
        _custom = module.exports.custom;
        _ZodReadonly = module.exports.ZodReadonly;
        _ZodPipeline = module.exports.ZodPipeline;
        _ZodBranded = module.exports.ZodBranded;
        _BRAND = module.exports.BRAND;
        _ZodNaN = module.exports.ZodNaN;
        _ZodCatch = module.exports.ZodCatch;
        _ZodDefault = module.exports.ZodDefault;
        _ZodNullable = module.exports.ZodNullable;
        _ZodOptional = module.exports.ZodOptional;
        _ZodTransformer = module.exports.ZodTransformer;
        _ZodEffects = module.exports.ZodEffects;
        _ZodPromise = module.exports.ZodPromise;
        _ZodNativeEnum = module.exports.ZodNativeEnum;
        _ZodEnum = module.exports.ZodEnum;
        _ZodLiteral = module.exports.ZodLiteral;
        _ZodLazy = module.exports.ZodLazy;
        _ZodFunction = module.exports.ZodFunction;
        _ZodSet = module.exports.ZodSet;
        _ZodMap = module.exports.ZodMap;
        _ZodRecord = module.exports.ZodRecord;
        _ZodTuple = module.exports.ZodTuple;
        _ZodIntersection = module.exports.ZodIntersection;
        _ZodDiscriminatedUnion = module.exports.ZodDiscriminatedUnion;
        _ZodUnion = module.exports.ZodUnion;
        _ZodObject = module.exports.ZodObject;
        _ZodArray = module.exports.ZodArray;
        _ZodVoid = module.exports.ZodVoid;
        _ZodNever = module.exports.ZodNever;
        _ZodUnknown = module.exports.ZodUnknown;
        _ZodAny = module.exports.ZodAny;
        _ZodNull = module.exports.ZodNull;
        _ZodUndefined = module.exports.ZodUndefined;
        _ZodSymbol = module.exports.ZodSymbol;
        _ZodDate = module.exports.ZodDate;
        _ZodBoolean = module.exports.ZodBoolean;
        _ZodBigInt = module.exports.ZodBigInt;
        _ZodNumber = module.exports.ZodNumber;
        _ZodString = module.exports.ZodString;
        _datetimeRegex = module.exports.datetimeRegex;
        _ZodType = module.exports.ZodType;
        _NEVER = module.exports.NEVER;
        _void = module.exports.void;
        _unknown = module.exports.unknown;
        _union = module.exports.union;
        _undefined = module.exports.undefined;
        _tuple = module.exports.tuple;
        _transformer = module.exports.transformer;
        _symbol = module.exports.symbol;
        _string = module.exports.string;
        _strictObject = module.exports.strictObject;
        _set = module.exports.set;
        _record = module.exports.record;
        _promise = module.exports.promise;
        _preprocess = module.exports.preprocess;
        _pipeline = module.exports.pipeline;
        _ostring = module.exports.ostring;
        _optional = module.exports.optional;
        _onumber = module.exports.onumber;
        _oboolean = module.exports.oboolean;
        _object = module.exports.object;
        _number = module.exports.number;
        _nullable = module.exports.nullable;
        _null = module.exports.null;
        _never = module.exports.never;
        _nativeEnum = module.exports.nativeEnum;
        _nan = module.exports.nan;
        _map = module.exports.map;
        _literal = module.exports.literal;
        _lazy = module.exports.lazy;
        _intersection = module.exports.intersection;
        _instanceof = module.exports.instanceof;
        _function = module.exports.function;
        _enum = module.exports.enum;
        _effect = module.exports.effect;
        _discriminatedUnion = module.exports.discriminatedUnion;
        _date = module.exports.date;
      }, () => ({
        './errors': _req,
        './helpers/errorUtil': _req0,
        './helpers/parseUtil': _req1,
        './helpers/util': _req2,
        './ZodError': _req3
      }));
    }
  };
});
//# sourceMappingURL=b88aa2ce4102a2d2ca2c22138e8ea7019aedcc77.js.map