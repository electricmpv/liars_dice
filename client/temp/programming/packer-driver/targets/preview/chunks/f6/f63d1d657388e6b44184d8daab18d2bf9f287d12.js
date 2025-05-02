System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, ChatService, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  _export("ChatService", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "792f0LIPaBJjJl+q/NEqDqk", "chat-service", undefined);

      /**
       * 聊天服务类
       * 负责处理聊天相关的网络请求和数据管理
       */
      __checkObsolete__(['sys']);

      _export("ChatService", ChatService = class ChatService {
        constructor() {
          this._listeners = new Map();
          this._messageList = [];
          this._socket = null;
          this._isConnected = false;
          this._userId = '';
          this._userName = '';
          this.init();
        }
        /**
         * 初始化
         */


        init() {
          // 获取用户信息（从本地存储或全局状态）
          this._userId = sys.localStorage.getItem('userId') || 'user_123456';
          this._userName = sys.localStorage.getItem('userName') || '玩家';
        }
        /**
         * 连接聊天服务器
         */


        connect() {
          var _this = this;

          return _asyncToGenerator(function* () {
            return new Promise(resolve => {
              console.log('[ChatService] 连接聊天服务器...'); // 模拟连接过程

              setTimeout(() => {
                _this._isConnected = true;
                console.log('[ChatService] 聊天服务器连接成功'); // 触发连接成功事件

                _this.emit('connected'); // 加载历史消息


                _this.loadHistoryMessages(); // 设置模拟接收消息


                _this.setupMockMessageReceiver();

                resolve(true);
              }, 1000);
            });
          })();
        }
        /**
         * 断开连接
         */


        disconnect() {
          if (!this._isConnected) {
            return;
          }

          console.log('[ChatService] 断开聊天服务器连接');
          this._isConnected = false; // 触发断开连接事件

          this.emit('disconnected');
        }
        /**
         * 发送消息
         */


        sendMessage(content) {
          if (!this._isConnected) {
            this.emit('chat-error', {
              message: '未连接到聊天服务器'
            });
            return;
          }

          if (!content.trim()) {
            return;
          }

          console.log("[ChatService] \u53D1\u9001\u6D88\u606F: " + content); // 创建消息对象

          var message = {
            id: "msg_" + Date.now(),
            type: 0,
            // 0: 自己, 1: 其他玩家, 2: 系统消息
            senderId: this._userId,
            senderName: this._userName,
            content: content,
            timestamp: Date.now(),
            isRead: true
          }; // 添加到消息列表

          this._messageList.push(message); // 触发消息发送事件


          this.emit('message-sent', message); // 在真实环境中应通过WebSocket发送到服务器
          // 这里只是模拟实现
        }
        /**
         * 发送系统消息
         */


        sendSystemMessage(content) {
          // 创建系统消息对象
          var message = {
            id: "sys_" + Date.now(),
            type: 2,
            // 系统消息
            senderId: 'system',
            senderName: '系统',
            content: content,
            timestamp: Date.now(),
            isRead: false
          }; // 添加到消息列表

          this._messageList.push(message); // 触发消息接收事件


          this.emit('message-received', message);
        }
        /**
         * 加载历史消息
         */


        loadHistoryMessages() {
          // 模拟加载历史消息
          setTimeout(() => {
            var historyMessages = this.getMockHistoryMessages(); // 添加到消息列表

            this._messageList = [...historyMessages, ...this._messageList]; // 触发历史消息加载事件

            this.emit('history-loaded', historyMessages); // 发送一条系统欢迎消息

            this.sendSystemMessage('欢迎来到吹牛骰子游戏聊天室！');
          }, 500);
        }
        /**
         * 设置模拟消息接收器
         */


        setupMockMessageReceiver() {
          // 模拟定时接收消息
          setInterval(() => {
            // 30%概率收到新消息
            if (Math.random() < 0.3) {
              this.receiveMockMessage();
            }
          }, 15000); // 每15秒检查一次
        }
        /**
         * 接收模拟消息
         */


        receiveMockMessage() {
          var mockSenders = [{
            id: 'user_234567',
            name: '李四'
          }, {
            id: 'user_345678',
            name: '王五'
          }, {
            id: 'user_456789',
            name: '赵六'
          }, {
            id: 'user_567890',
            name: '钱七'
          }];
          var mockContents = ['大家好！', '有人一起玩吗？', '这局我真是太倒霉了...', '哈哈，我赢了！', '这游戏太好玩了', '谁来教我怎么玩？', '刚才那把真精彩！', '😊😊😊', '有人在吗？', '今天天气真好']; // 随机选择发送者和内容

          var sender = mockSenders[Math.floor(Math.random() * mockSenders.length)];
          var content = mockContents[Math.floor(Math.random() * mockContents.length)]; // 创建消息对象

          var message = {
            id: "msg_" + Date.now(),
            type: 1,
            // 其他玩家
            senderId: sender.id,
            senderName: sender.name,
            content: content,
            timestamp: Date.now(),
            isRead: false
          }; // 添加到消息列表

          this._messageList.push(message); // 触发消息接收事件


          this.emit('message-received', message);
        }
        /**
         * 获取模拟历史消息
         */


        getMockHistoryMessages() {
          var baseTime = Date.now() - 1000 * 60 * 30; // 30分钟前

          return [{
            id: 'msg_001',
            type: 2,
            // 系统消息
            senderId: 'system',
            senderName: '系统',
            content: '欢迎来到吹牛骰子游戏聊天室！',
            timestamp: baseTime,
            isRead: true
          }, {
            id: 'msg_002',
            type: 1,
            // 其他玩家
            senderId: 'user_234567',
            senderName: '李四',
            content: '大家好，有人要一起玩吗？',
            timestamp: baseTime + 1000 * 60 * 2,
            // 2分钟后
            isRead: true
          }, {
            id: 'msg_003',
            type: 1,
            // 其他玩家
            senderId: 'user_345678',
            senderName: '王五',
            content: '我来！',
            timestamp: baseTime + 1000 * 60 * 4,
            // 4分钟后
            isRead: true
          }, {
            id: 'msg_004',
            type: 0,
            // 自己
            senderId: this._userId,
            senderName: this._userName,
            content: '算我一个',
            timestamp: baseTime + 1000 * 60 * 5,
            // 5分钟后
            isRead: true
          }, {
            id: 'msg_005',
            type: 1,
            // 其他玩家
            senderId: 'user_234567',
            senderName: '李四',
            content: '好，我创建房间了，房间号：R123456',
            timestamp: baseTime + 1000 * 60 * 6,
            // 6分钟后
            isRead: true
          }, {
            id: 'msg_006',
            type: 2,
            // 系统消息
            senderId: 'system',
            senderName: '系统',
            content: '玩家李四创建了房间 R123456',
            timestamp: baseTime + 1000 * 60 * 6.1,
            // 6.1分钟后
            isRead: true
          }, {
            id: 'msg_007',
            type: 1,
            // 其他玩家
            senderId: 'user_456789',
            senderName: '赵六',
            content: '我也来玩！',
            timestamp: baseTime + 1000 * 60 * 8,
            // 8分钟后
            isRead: true
          }, {
            id: 'msg_008',
            type: 1,
            // 其他玩家
            senderId: 'user_456789',
            senderName: '赵六',
            content: '刚才那把真是太刺激了，下次再战！',
            timestamp: baseTime + 1000 * 60 * 20,
            // 20分钟后
            isRead: true
          }];
        }
        /**
         * 注册事件监听
         */


        on(eventName, callback, target) {
          var _this$_listeners$get;

          if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, []);
          }

          (_this$_listeners$get = this._listeners.get(eventName)) == null || _this$_listeners$get.push({
            callback,
            target
          });
        }
        /**
         * 移除事件监听
         */


        off(eventName, callback, target) {
          if (!this._listeners.has(eventName)) {
            return;
          }

          var listeners = this._listeners.get(eventName);

          if (!listeners) return;

          for (var i = listeners.length - 1; i >= 0; i--) {
            var listener = listeners[i];

            if (listener.callback === callback && (!target || listener.target === target)) {
              listeners.splice(i, 1);
            }
          }
        }
        /**
         * 触发事件
         */


        emit(eventName) {
          if (!this._listeners.has(eventName)) {
            return;
          }

          var listeners = this._listeners.get(eventName);

          if (!listeners) return;

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          for (var listener of listeners) {
            if (listener.target) {
              listener.callback.apply(listener.target, args);
            } else {
              listener.callback(...args);
            }
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f63d1d657388e6b44184d8daab18d2bf9f287d12.js.map