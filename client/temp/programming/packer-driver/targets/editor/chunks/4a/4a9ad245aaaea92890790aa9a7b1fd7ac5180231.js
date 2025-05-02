System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Button, loadColyseusClient, isColyseusLoaded, NetworkManager, LoginManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, ColyseusTestTool;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfloadColyseusClient(extras) {
    _reporterNs.report("loadColyseusClient", "../libs/colyseus-loader", _context.meta, extras);
  }

  function _reportPossibleCrUseOfisColyseusLoaded(extras) {
    _reporterNs.report("isColyseusLoaded", "../libs/colyseus-loader", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLoginManager(extras) {
    _reporterNs.report("LoginManager", "../core/login-manager", _context.meta, extras);
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
      Label = _cc.Label;
      Button = _cc.Button;
    }, function (_unresolved_2) {
      loadColyseusClient = _unresolved_2.loadColyseusClient;
      isColyseusLoaded = _unresolved_2.isColyseusLoaded;
    }, function (_unresolved_3) {
      NetworkManager = _unresolved_3.NetworkManager;
    }, function (_unresolved_4) {
      LoginManager = _unresolved_4.LoginManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3b2fbtXORZA14qG50d4PCh3", "colyseus-tester", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Colyseus测试工具
       * 用于测试Colyseus连接和房间加入
       */

      _export("ColyseusTestTool", ColyseusTestTool = (_dec = ccclass('ColyseusTestTool'), _dec2 = property(Label), _dec3 = property(Button), _dec4 = property(Button), _dec(_class = (_class2 = class ColyseusTestTool extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "statusLabel", _descriptor, this);

          _initializerDefineProperty(this, "testButton", _descriptor2, this);

          _initializerDefineProperty(this, "clearButton", _descriptor3, this);

          _initializerDefineProperty(this, "serverUrl", _descriptor4, this);

          this._logs = [];
          this._maxLogs = 20;
        }

        start() {
          this.updateStatus('准备测试Colyseus连接'); // 设置按钮事件

          if (this.testButton) {
            this.testButton.node.on(Button.EventType.CLICK, this.onTestButtonClick, this);
          }

          if (this.clearButton) {
            this.clearButton.node.on(Button.EventType.CLICK, this.onClearButtonClick, this);
          }
        }

        onDestroy() {
          // 清理按钮事件
          if (this.testButton) {
            this.testButton.node.off(Button.EventType.CLICK, this.onTestButtonClick, this);
          }

          if (this.clearButton) {
            this.clearButton.node.off(Button.EventType.CLICK, this.onClearButtonClick, this);
          }
        }
        /**
         * 测试按钮点击事件
         */


        async onTestButtonClick() {
          this.log('开始测试Colyseus连接...');

          try {
            // 1. 测试Colyseus客户端加载
            this.log('1. 测试Colyseus客户端加载');

            if (!(_crd && isColyseusLoaded === void 0 ? (_reportPossibleCrUseOfisColyseusLoaded({
              error: Error()
            }), isColyseusLoaded) : isColyseusLoaded)()) {
              this.log('Colyseus客户端未加载，正在加载...');
              await (_crd && loadColyseusClient === void 0 ? (_reportPossibleCrUseOfloadColyseusClient({
                error: Error()
              }), loadColyseusClient) : loadColyseusClient)();
              this.log('Colyseus客户端加载成功');
            } else {
              this.log('Colyseus客户端已加载');
            } // 2. 测试网络管理器初始化


            this.log('2. 测试网络管理器初始化'); // NetworkManager 不需要显式初始化，它在需要时会自动初始化

            this.log('网络管理器初始化成功'); // 3. 测试加入房间

            this.log('3. 测试加入房间');
            const playerName = `测试用户_${Math.floor(Math.random() * 10000)}`;
            (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
              error: Error()
            }), LoginManager) : LoginManager).playerName = playerName;
            this.log(`使用玩家名称: ${playerName}`);
            const room = await (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().joinLiarDiceRoom({
              playerName: playerName,
              create: true
            });
            this.log(`房间加入成功: ${room.roomId}`);
            this.log(`会话ID: ${room.sessionId}`);
            this.log(`房间名称: ${room.name}`); // 4. 测试发送消息

            this.log('4. 测试发送消息');
            (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().send('test_message', {
              content: '这是一条测试消息'
            });
            this.log('测试消息已发送'); // 5. 等待3秒后离开房间

            this.log('5. 等待3秒后离开房间');
            await new Promise(resolve => setTimeout(resolve, 3000));
            await (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
              error: Error()
            }), NetworkManager) : NetworkManager).getInstance().leaveRoom();
            this.log('已离开房间');
            this.log('测试完成，所有步骤成功');
          } catch (error) {
            this.log(`测试失败: ${error instanceof Error ? error.message : String(error)}`);
            console.error('Colyseus测试失败:', error);
          }
        }
        /**
         * 清除按钮点击事件
         */


        onClearButtonClick() {
          this._logs = [];
          this.updateStatus('日志已清除');
        }
        /**
         * 添加日志
         * @param message 日志消息
         */


        log(message) {
          console.log(`[ColyseusTest] ${message}`);

          this._logs.push(`${new Date().toLocaleTimeString()}: ${message}`); // 限制日志数量


          if (this._logs.length > this._maxLogs) {
            this._logs.shift();
          }

          this.updateStatus(this._logs.join('\n'));
        }
        /**
         * 更新状态标签
         * @param status 状态文本
         */


        updateStatus(status) {
          if (this.statusLabel) {
            this.statusLabel.string = status;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "testButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "clearButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "serverUrl", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "ws://localhost:3000";
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4a9ad245aaaea92890790aa9a7b1fd7ac5180231.js.map