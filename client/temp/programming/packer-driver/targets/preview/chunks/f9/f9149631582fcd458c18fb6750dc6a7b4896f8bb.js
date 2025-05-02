System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, director, Color, NetworkManager, NetworkStatus, NetworkErrorHandler, _crd, NetworkErrorType;

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "./network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkStatus(extras) {
    _reporterNs.report("NetworkStatus", "./network", _context.meta, extras);
  }

  _export("NetworkErrorHandler", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      director = _cc.director;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
      NetworkStatus = _unresolved_2.NetworkStatus;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6f2dfohdvBGqLqXjB0V6Lf/", "error-handler", undefined);

      __checkObsolete__(['_decorator', 'Node', 'Label', 'director', 'Color']);

      /**
       * 网络错误类型
       */
      _export("NetworkErrorType", NetworkErrorType = /*#__PURE__*/function (NetworkErrorType) {
        NetworkErrorType["TIMEOUT"] = "timeout";
        NetworkErrorType["CONNECTION_REFUSED"] = "connection_refused";
        NetworkErrorType["SERVER_ERROR"] = "server_error";
        NetworkErrorType["UNKNOWN"] = "unknown";
        return NetworkErrorType;
      }({}));
      /**
       * 网络错误处理器
       */


      _export("NetworkErrorHandler", NetworkErrorHandler = class NetworkErrorHandler {
        /**
         * 初始化状态标签
         * @param label 状态标签组件
         */
        static initStatusLabel(label) {
          this.statusLabel = label;
          this.updateConnectionStatus((_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().status); // 监听连接状态变化

          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('connected', () => this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).CONNECTED));
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('disconnected', () => this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).DISCONNECTED));
          (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
            error: Error()
          }), NetworkManager) : NetworkManager).getInstance().on('connectionError', () => this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).ERROR));
        }
        /**
         * 手动重连
         */


        static manualReconnect() {
          this.retryCount = 0; // 重置重试次数

          this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).CONNECTING); // NetworkManager 不需要显式初始化，直接尝试重新连接

          try {
            // 尝试重新连接
            console.log('[网络] 尝试重新连接...');
          } catch (err) {
            console.error('[网络][错误] 手动重连失败:', err);
            this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).ERROR); // 可以显示错误提示
            // 也可以选择自动重试
            // this.retryConnection(NetworkErrorType.UNKNOWN);
          }
        }
        /**
         * 更新连接状态显示
         * @param status 连接状态
         */


        static updateConnectionStatus(status) {
          if (!this.statusLabel) return;

          switch (status) {
            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).CONNECTED:
              this.statusLabel.string = "已连接";
              this.statusLabel.color = new Color(0, 255, 0);
              break;

            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).CONNECTING:
              this.statusLabel.string = "连接中...";
              this.statusLabel.color = new Color(255, 255, 0);
              break;

            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).DISCONNECTED:
              this.statusLabel.string = "未连接";
              this.statusLabel.color = new Color(255, 0, 0);
              break;

            case (_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
              error: Error()
            }), NetworkStatus) : NetworkStatus).ERROR:
              this.statusLabel.string = "连接错误";
              this.statusLabel.color = new Color(255, 0, 0);
              break;
          }
        }
        /**
         * 处理连接错误
         * @param error 错误对象
         */


        static handleConnectionError(error) {
          console.error("[错误处理][错误] 连接错误:", error.message);
          var errorType = this.getErrorType(error);
          this.updateConnectionStatus((_crd && NetworkStatus === void 0 ? (_reportPossibleCrUseOfNetworkStatus({
            error: Error()
          }), NetworkStatus) : NetworkStatus).ERROR);

          switch (errorType) {
            case NetworkErrorType.TIMEOUT:
              this.showRetryDialog("连接超时，是否重试？");
              break;

            case NetworkErrorType.CONNECTION_REFUSED:
              this.showRetryDialog("连接被拒绝，服务器可能未启动，是否重试？");
              break;

            case NetworkErrorType.SERVER_ERROR:
              this.showRetryDialog("服务器错误，是否重试？");
              break;

            default:
              this.showRetryDialog("未知错误，是否重试？");
              break;
          }
        }
        /**
         * 获取错误类型
         * @param error 错误对象
         * @returns 错误类型
         */


        static getErrorType(error) {
          var message = error.message.toLowerCase();

          if (message.includes('timeout')) {
            return NetworkErrorType.TIMEOUT;
          } else if (message.includes('refused') || message.includes('econnrefused')) {
            return NetworkErrorType.CONNECTION_REFUSED;
          } else if (message.includes('server') || message.includes('500')) {
            return NetworkErrorType.SERVER_ERROR;
          }

          return NetworkErrorType.UNKNOWN;
        }
        /**
         * 显示重试对话框
         * @param message 对话框消息
         */


        static showRetryDialog(message) {
          // 这里应该调用Cocos原生对话框API，为了简单起见，我们使用console
          console.warn("[错误处理][警告] " + message); // 重试逻辑，实际项目中应该由用户确认后再执行

          this.retryConnection(NetworkErrorType.UNKNOWN);
        }
        /**
         * 重试连接
         * @param errorCode 错误代码
         */


        static retryConnection(errorCode) {
          if (this.retryCount >= this.maxRetryCount) {
            console.error("[\u7F51\u7EDC][\u9519\u8BEF] \u8FDE\u63A5\u5931\u8D25\uFF0C\u5DF2\u8FBE\u5230\u6700\u5927\u91CD\u8BD5\u6B21\u6570 " + this.maxRetryCount);
            director.loadScene('LoginScene'); // 返回登录场景

            return;
          }

          this.retryCount++;
          console.log("[\u7F51\u7EDC][\u4FE1\u606F] \u7B2C " + this.retryCount + " \u6B21\u91CD\u8BD5\u8FDE\u63A5...");
          setTimeout(() => {
            try {
              // NetworkManager 不需要显式初始化，直接获取实例
              (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                error: Error()
              }), NetworkManager) : NetworkManager).getInstance();
              console.log('[网络][信息] 重新连接成功');
            } catch (err) {
              console.error('[网络][错误] 重试连接失败:', err); // 继续重试或返回登录

              this.retryConnection(errorCode);
            }
          }, this.retryDelay);
        }

      });

      NetworkErrorHandler.retryCount = 0;
      NetworkErrorHandler.maxRetryCount = 3;
      NetworkErrorHandler.retryDelay = 3000;
      // 3秒
      NetworkErrorHandler.statusLabel = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f9149631582fcd458c18fb6750dc6a7b4896f8bb.js.map