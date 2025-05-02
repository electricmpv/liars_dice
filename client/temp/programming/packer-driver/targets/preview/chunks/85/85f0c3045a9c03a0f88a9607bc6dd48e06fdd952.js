System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, EditBox, Button, Label, director, LoginManager, NetworkManager, NetworkStatus, loadColyseusClient, isColyseusLoaded, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, LoginUI;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLoginManager(extras) {
    _reporterNs.report("LoginManager", "../core/login-manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkStatus(extras) {
    _reporterNs.report("NetworkStatus", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfloadColyseusClient(extras) {
    _reporterNs.report("loadColyseusClient", "../libs/colyseus-loader", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisColyseusLoaded(extras) {
    _reporterNs.report("isColyseusLoaded", "../libs/colyseus-loader", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      EditBox = _cc.EditBox;
      Button = _cc.Button;
      Label = _cc.Label;
      director = _cc.director;
    }, function (_unresolved_2) {
      LoginManager = _unresolved_2.LoginManager;
    }, function (_unresolved_3) {
      NetworkManager = _unresolved_3.NetworkManager;
      NetworkStatus = _unresolved_3.NetworkStatus;
    }, function (_unresolved_4) {
      loadColyseusClient = _unresolved_4.loadColyseusClient;
      isColyseusLoaded = _unresolved_4.isColyseusLoaded;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dd01c8I8i5JBqa6T9egDWyK", "login-ui", undefined);

      // 导入 director 和 sys
      __checkObsolete__(['_decorator', 'Component', 'Node', 'EditBox', 'Button', 'Label', 'director', 'sys']); // 导入 NetworkManager 和 NetworkStatus


      // 导入 Colyseus 加载器
      ({
        ccclass,
        property
      } = _decorator);

      _export("LoginUI", LoginUI = (_dec = ccclass('LoginUI'), _dec2 = property(EditBox), _dec3 = property(EditBox), _dec4 = property(Button), _dec5 = property(Button), _dec6 = property(Label), _dec(_class = (_class2 = class LoginUI extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "usernameInput", _descriptor, this);

          _initializerDefineProperty(this, "passwordInput", _descriptor2, this);

          _initializerDefineProperty(this, "loginButton", _descriptor3, this);

          _initializerDefineProperty(this, "guestLoginButton", _descriptor4, this);

          _initializerDefineProperty(this, "statusLabel", _descriptor5, this);
        }

        start() {
          if (this.loginButton) {
            this.loginButton.node.on(Button.EventType.CLICK, this.onLogin, this);
          }

          if (this.guestLoginButton) {
            this.guestLoginButton.node.on(Button.EventType.CLICK, this.onGuestLogin, this);
          }
        }

        onLogin() {
          var _this = this;

          return _asyncToGenerator(function* () {
            // 改为 async 方法
            if (!_this.usernameInput || !_this.passwordInput || !_this.statusLabel) {
              console.error("UI 元素未正确配置");
              return;
            }

            var username = _this.usernameInput.string;
            var password = _this.passwordInput.string;

            if (!username || !password) {
              _this.statusLabel.string = '请输入用户名和密码';
              return;
            }

            _this.statusLabel.string = '处理中...'; // 提示用户正在处理

            _this.setButtonsInteractable(false); // 禁用按钮防止重复点击


            try {
              // 1. 确保Colyseus客户端库已加载
              if (!(_crd && isColyseusLoaded === void 0 ? (_reportPossibleCrUseOfisColyseusLoaded({
                error: Error()
              }), isColyseusLoaded) : isColyseusLoaded)()) {
                _this.statusLabel.string = '正在加载网络组件...';
                yield (_crd && loadColyseusClient === void 0 ? (_reportPossibleCrUseOfloadColyseusClient({
                  error: Error()
                }), loadColyseusClient) : loadColyseusClient)();
                console.log('[LoginUI] Colyseus客户端库加载成功');
              } // 2. 检查连接状态，仅在 DISCONNECTED 或 ERROR 时连接


              var currentStatus = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                error: Error()
              }), NetworkManager) : NetworkManager).getInstance().status;

              if (currentStatus === (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
                error: Error()
              }), NetworkStatus) : NetworkStatus).DISCONNECTED || currentStatus === (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
                error: Error()
              }), NetworkStatus) : NetworkStatus).ERROR) {
                _this.statusLabel.string = '正在连接服务器...'; // NetworkManager 不需要显式初始化，实例化时会自动初始化
                // 只需要获取实例即可

                (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                  error: Error()
                }), NetworkManager) : NetworkManager).getInstance();
                _this.statusLabel.string = '连接成功，正在登录...';
              } else {
                _this.statusLabel.string = '正在登录...';
              } // 3. 连接成功后执行登录


              (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                error: Error()
              }), LoginManager) : LoginManager).getInstance().login(username, password, _this.onLoginSuccess.bind(_this), _this.onLoginFailure.bind(_this));
            } catch (error) {
              // 连接或登录过程中发生错误
              console.error("[LoginUI] 连接或登录失败:", error);

              _this.onLoginFailure(error.message || "连接或登录时发生错误");

              _this.setButtonsInteractable(true); // 发生错误时重新启用按钮

            }
          })();
        }

        onGuestLogin() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            // 改为 async 方法
            if (!_this2.statusLabel) {
              console.error("UI 元素未正确配置");
              return;
            }

            _this2.statusLabel.string = '处理中...'; // 提示用户正在处理

            _this2.setButtonsInteractable(false); // 禁用按钮防止重复点击


            try {
              // 1. 确保Colyseus客户端库已加载
              if (!(_crd && isColyseusLoaded === void 0 ? (_reportPossibleCrUseOfisColyseusLoaded({
                error: Error()
              }), isColyseusLoaded) : isColyseusLoaded)()) {
                _this2.statusLabel.string = '正在加载网络组件...';
                yield (_crd && loadColyseusClient === void 0 ? (_reportPossibleCrUseOfloadColyseusClient({
                  error: Error()
                }), loadColyseusClient) : loadColyseusClient)();
                console.log('[LoginUI] Colyseus客户端库加载成功');
              } // 2. 检查连接状态，仅在 DISCONNECTED 或 ERROR 时连接


              var currentStatus = (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                error: Error()
              }), NetworkManager) : NetworkManager).getInstance().status;

              if (currentStatus === (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
                error: Error()
              }), NetworkStatus) : NetworkStatus).DISCONNECTED || currentStatus === (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
                error: Error()
              }), NetworkStatus) : NetworkStatus).ERROR) {
                _this2.statusLabel.string = '正在连接服务器...'; // NetworkManager 不需要显式初始化，实例化时会自动初始化
                // 只需要获取实例即可

                (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                  error: Error()
                }), NetworkManager) : NetworkManager).getInstance();
                _this2.statusLabel.string = '连接成功，正在登录...';
              } else {
                _this2.statusLabel.string = '正在登录...';
              } // 3. 生成随机游客名称


              var guestName = "\u6E38\u5BA2_" + Math.floor(Math.random() * 10000);
              (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                error: Error()
              }), LoginManager) : LoginManager).playerName = guestName; // 存储玩家名称

              console.log("[LoginUI] \u4F7F\u7528\u6E38\u5BA2\u540D\u79F0: " + guestName); // 4. 连接成功后执行游客登录，并处理响应

              (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                error: Error()
              }), LoginManager) : LoginManager).getInstance().guestLogin(response => {
                // 修改回调以接收响应
                if (response && response.playerId) {
                  (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                    error: Error()
                  }), LoginManager) : LoginManager).currentPlayerId = response.playerId; // 存储 Player ID

                  console.log("[LoginUI] Player ID stored: " + (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                    error: Error()
                  }), LoginManager) : LoginManager).currentPlayerId);

                  _this2.onLoginSuccess(); // 调用原始的成功处理

                } else {
                  // 对于Colyseus，可能没有明确的playerId返回，直接进入大厅
                  console.log("[LoginUI] 游客登录成功，无需明确的playerId");

                  _this2.onLoginSuccess(); // 调用原始的成功处理

                }
              }, _this2.onLoginFailure.bind(_this2));
            } catch (error) {
              // 连接或登录过程中发生错误
              console.error("[LoginUI] 连接或游客登录失败:", error);

              _this2.onLoginFailure(error.message || "连接或游客登录时发生错误");

              _this2.setButtonsInteractable(true); // 发生错误时重新启用按钮

            }
          })();
        }

        onLoginSuccess() {
          if (this.statusLabel) {
            this.statusLabel.string = '登录成功';
          } // 登录成功后加载大厅场景


          director.loadScene('LobbyScene', err => {
            if (err) {
              console.error("加载 LobbyScene 失败:", err);

              if (this.statusLabel) {
                this.statusLabel.string = "\u52A0\u8F7D\u5927\u5385\u5931\u8D25: " + err.message;
              }

              this.setButtonsInteractable(true); // 加载失败时也应恢复按钮
            } else {
              console.log("成功加载 LobbyScene"); // 成功加载后无需恢复按钮，因为场景已切换
            }
          });
        }

        onLoginFailure(error) {
          if (this.statusLabel) {
            this.statusLabel.string = "\u767B\u5F55\u5931\u8D25: " + error;
          }

          this.setButtonsInteractable(true); // 登录失败时恢复按钮交互
        }
        /**
         * 设置登录和游客按钮的可交互状态
         * @param interactable 是否可交互
         */


        setButtonsInteractable(interactable) {
          if (this.loginButton) {
            this.loginButton.interactable = interactable;
          }

          if (this.guestLoginButton) {
            this.guestLoginButton.interactable = interactable;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "usernameInput", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "passwordInput", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loginButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "guestLoginButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=85f0c3045a9c03a0f88a9607bc6dd48e06fdd952.js.map