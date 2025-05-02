System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, Sprite, NetworkManager, NetworkStatus, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, ConnectionStatus;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkStatus(extras) {
    _reporterNs.report("NetworkStatus", "../core/network", _context.meta, extras);
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
      Node = _cc.Node;
      Label = _cc.Label;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
      NetworkStatus = _unresolved_2.NetworkStatus;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4983cmCWVJCiodmps8dR8yA", "connection-status", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 网络连接状态UI组件
       */

      _export("ConnectionStatus", ConnectionStatus = (_dec = ccclass('ConnectionStatus'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property(Node), _dec5 = property(Color), _dec6 = property(Color), _dec7 = property(Color), _dec8 = property(Color), _dec(_class = (_class2 = class ConnectionStatus extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "statusLabel", _descriptor, this);

          _initializerDefineProperty(this, "statusIcon", _descriptor2, this);

          _initializerDefineProperty(this, "reconnectButton", _descriptor3, this);

          _initializerDefineProperty(this, "connectedColor", _descriptor4, this);

          _initializerDefineProperty(this, "connectingColor", _descriptor5, this);

          _initializerDefineProperty(this, "disconnectedColor", _descriptor6, this);

          _initializerDefineProperty(this, "reconnectingColor", _descriptor7, this);

          this.isManualDisconnect = false;
        }

        start() {
          // 注册网络事件监听器
          this.registerNetworkEvents(); // 初始化UI状态

          this.updateConnectionStatus((_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().status); // 设置重连按钮点击事件

          if (this.reconnectButton) {
            this.reconnectButton.on(Node.EventType.TOUCH_END, this.onReconnectClick, this);
          }
        }

        onDestroy() {
          // 移除事件监听器
          this.unregisterNetworkEvents(); // 移除按钮点击事件

          if (this.reconnectButton) {
            this.reconnectButton.off(Node.EventType.TOUCH_END, this.onReconnectClick, this);
          }
        }
        /**
         * 注册网络事件监听器
         */


        registerNetworkEvents() {
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('connected', () => this.onConnected());
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('connecting', () => this.onConnecting());
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('disconnected', () => this.onDisconnected());
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('status', status => this.onStatusChange(status));
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('error', error => this.onNetworkError(error));
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('reconnect_failed', () => this.onReconnectFailed());
        }
        /**
         * 移除网络事件监听器
         */


        unregisterNetworkEvents() {
          // 由于SocketAdapter要求同样的回调引用，我们需要重新创建之前注册的匿名函数的空白处理程序
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('connected', () => {});
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('connecting', () => {});
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('disconnected', () => {});
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('status', () => {});
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('error', () => {});
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().off('reconnect_failed', () => {});
        }
        /**
         * 连接成功事件处理
         */


        onConnected() {
          this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).CONNECTED);
          this.isManualDisconnect = false;
        }
        /**
         * 连接中事件处理
         */


        onConnecting() {
          this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).CONNECTING);
        }
        /**
         * 断开连接事件处理
         */


        onDisconnected() {
          this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).DISCONNECTED);
        }
        /**
         * 状态变化事件处理
         */


        onStatusChange(status) {
          this.updateConnectionStatus(status);
        }
        /**
         * 网络错误事件处理
         */


        onNetworkError(error) {
          console.error('[ConnectionStatus] 网络错误:', error); // 更新UI显示错误消息

          if (this.statusLabel) {
            this.statusLabel.string = "\u8FDE\u63A5\u9519\u8BEF: " + error.message;
            this.statusLabel.color = this.disconnectedColor;
          } // 显示重连按钮


          if (this.reconnectButton && !this.isManualDisconnect) {
            this.reconnectButton.active = true;
          }
        }
        /**
         * 重连失败事件处理
         */


        onReconnectFailed() {
          console.error('[ConnectionStatus] 重连失败，已达到最大重试次数'); // 更新UI显示重连失败消息

          if (this.statusLabel) {
            this.statusLabel.string = '重连失败，请手动重连';
            this.statusLabel.color = this.disconnectedColor;
          } // 显示重连按钮


          if (this.reconnectButton) {
            this.reconnectButton.active = true;
          }
        }
        /**
         * 更新连接状态UI
         */


        updateConnectionStatus(status) {
          if (!this.statusLabel || !this.statusIcon) return;
          var statusText = '';
          var statusColor = this.disconnectedColor;
          var showReconnectButton = false;

          switch (status) {
            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).CONNECTED:
              statusText = '已连接';
              statusColor = this.connectedColor;
              showReconnectButton = false;
              break;

            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).CONNECTING:
              statusText = '连接中...';
              statusColor = this.connectingColor;
              showReconnectButton = false;
              break;

            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).RECONNECTING:
              statusText = '重新连接中...';
              statusColor = this.reconnectingColor;
              showReconnectButton = false;
              break;

            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).DISCONNECTED:
              statusText = '未连接';
              statusColor = this.disconnectedColor;
              showReconnectButton = !this.isManualDisconnect;
              break;

            default:
              statusText = '未知状态';
              statusColor = this.disconnectedColor;
              showReconnectButton = true;
              break;
          } // 更新状态文本和颜色


          this.statusLabel.string = statusText;
          this.statusLabel.color = statusColor; // 更新状态图标颜色

          this.statusIcon.color = statusColor; // 显示/隐藏重连按钮

          if (this.reconnectButton) {
            this.reconnectButton.active = showReconnectButton;
          }
        }
        /**
         * 重连按钮点击处理
         */


        onReconnectClick() {
          console.log('[ConnectionStatus] 手动重连'); // 更新UI状态

          if (this.statusLabel) {
            this.statusLabel.string = '连接中...';
            this.statusLabel.color = this.connectingColor;
          } // 隐藏重连按钮


          if (this.reconnectButton) {
            this.reconnectButton.active = false;
          } // 尝试重新连接
          // 注意：NetworkManager 不需要 connect 方法，它在需要时会自动初始化和连接


          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance();
        }
        /**
         * 断开连接（用于外部调用）
         */


        disconnect() {
          this.isManualDisconnect = true;
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().disconnect();
        }
        /**
         * 连接（用于外部调用）
         */


        connect() {
          this.isManualDisconnect = false; // NetworkManager 不需要 connect 方法，它在需要时会自动初始化和连接

          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "statusIcon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "reconnectButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "connectedColor", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 255, 0);
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "connectingColor", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 165, 0);
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "disconnectedColor", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 0, 0);
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "reconnectingColor", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 191, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=64103c172f2e7b45066d39c062e540c20408d28a.js.map