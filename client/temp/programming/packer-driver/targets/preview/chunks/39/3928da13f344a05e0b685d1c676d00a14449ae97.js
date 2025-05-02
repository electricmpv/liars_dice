System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, FriendService, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  _export("FriendService", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f323eQnZLFG6YGtgxvG9X+s", "friend-service", undefined);

      /**
       * 好友服务类
       * 负责处理好友相关的网络请求和数据管理
       */
      __checkObsolete__(['sys']);

      _export("FriendService", FriendService = class FriendService {
        constructor() {
          this._listeners = new Map();
          this._friendList = [];
          this._currentFilter = 'all';
          this._socket = null;
          this.init();
        }
        /**
         * 初始化
         */


        init() {
          // 初始化WebSocket连接（真实环境中应连接到实际服务器）
          this.initSocketConnection();
        }
        /**
         * 初始化Socket连接
         */


        initSocketConnection() {
          // 真实环境中应连接到实际的WebSocket服务器
          // 这里只是模拟实现
          console.log('[FriendService] 初始化Socket连接'); // 模拟接收好友状态更新

          setInterval(() => {
            this.simulateFriendStatusUpdate();
          }, 30000); // 每30秒模拟一次
        }
        /**
         * 获取好友列表
         */


        fetchFriends() {
          var _this = this;

          return _asyncToGenerator(function* () {
            return new Promise(resolve => {
              // 模拟网络请求
              setTimeout(() => {
                _this._friendList = _this.getMockFriends();

                _this.emit('friend-list-updated', _this._friendList);

                resolve(_this._friendList);
              }, 600);
            });
          })();
        }
        /**
         * 设置过滤器
         */


        setFilter(filter) {
          this._currentFilter = filter;
        }
        /**
         * 获取当前过滤器
         */


        getFilter() {
          return this._currentFilter;
        }
        /**
         * 获取过滤后的好友列表
         */


        getFilteredFriends(friends) {
          switch (this._currentFilter) {
            case 'online':
              return friends.filter(friend => friend.isOnline);

            case 'playing':
              return friends.filter(friend => friend.isOnline && friend.status === 1);

            case 'all':
            default:
              return friends;
          }
        }
        /**
         * 发送好友请求
         */


        sendFriendRequest(userId, message) {
          console.log("[FriendService] \u53D1\u9001\u597D\u53CB\u8BF7\u6C42\u7ED9\u7528\u6237 " + userId + "\uFF0C\u6D88\u606F\uFF1A" + (message || '无')); // 模拟发送好友请求

          setTimeout(() => {
            this.emit('friend-request-sent', {
              id: "FR" + Date.now().toString().substr(-6),
              targetId: userId,
              message: message || '请求添加您为好友'
            });
          }, 500);
        }
        /**
         * 接受好友请求
         */


        acceptFriendRequest(requestId) {
          console.log("[FriendService] \u63A5\u53D7\u597D\u53CB\u8BF7\u6C42 " + requestId); // 模拟接受好友请求

          setTimeout(() => {
            // 创建一个新的好友
            var newFriend = {
              id: "user_" + Date.now().toString().substr(-6),
              name: "\u73A9\u5BB6" + Math.floor(Math.random() * 1000),
              avatar: null,
              isOnline: true,
              status: 0,
              level: Math.floor(Math.random() * 30) + 1,
              addedAt: Date.now()
            }; // 添加到好友列表

            this._friendList.unshift(newFriend); // 触发事件


            this.emit('friend-request-accepted', {
              requestId,
              friend: newFriend
            });
            this.emit('friend-list-updated', this._friendList);
          }, 500);
        }
        /**
         * 拒绝好友请求
         */


        rejectFriendRequest(requestId) {
          console.log("[FriendService] \u62D2\u7EDD\u597D\u53CB\u8BF7\u6C42 " + requestId); // 模拟拒绝好友请求

          setTimeout(() => {
            this.emit('friend-request-rejected', {
              requestId
            });
          }, 300);
        }
        /**
         * 删除好友
         */


        removeFriend(friendId) {
          console.log("[FriendService] \u5220\u9664\u597D\u53CB " + friendId); // 查找好友

          var index = this._friendList.findIndex(f => f.id === friendId);

          if (index === -1) {
            return;
          } // 模拟删除好友


          setTimeout(() => {
            // 从列表中移除
            var removedFriend = this._friendList.splice(index, 1)[0]; // 触发事件


            this.emit('friend-removed', removedFriend);
            this.emit('friend-list-updated', this._friendList);
          }, 500);
        }
        /**
         * 更新好友状态
         */


        updateFriendStatus(friendId, isOnline, status) {
          console.log("[FriendService] \u66F4\u65B0\u597D\u53CB " + friendId + " \u72B6\u6001\uFF0C\u5728\u7EBF\uFF1A" + isOnline + "\uFF0C\u72B6\u6001\uFF1A" + status); // 查找好友

          var friend = this._friendList.find(f => f.id === friendId);

          if (!friend) {
            return;
          } // 更新状态


          friend.isOnline = isOnline;

          if (status !== undefined) {
            friend.status = status;
          } // 触发事件


          this.emit('friend-status-changed', friend);
          this.emit('friend-list-updated', this._friendList);
        }
        /**
         * 模拟好友状态更新
         */


        simulateFriendStatusUpdate() {
          if (this._friendList.length === 0) {
            return;
          } // 随机选择一个好友


          var randomIndex = Math.floor(Math.random() * this._friendList.length);
          var friend = this._friendList[randomIndex]; // 随机更新状态

          var newIsOnline = Math.random() > 0.3; // 70%概率在线

          var newStatus = Math.floor(Math.random() * 3); // 0-2的状态
          // 更新状态

          this.updateFriendStatus(friend.id, newIsOnline, newStatus);
        }
        /**
         * 模拟接收好友请求
         */


        simulateReceiveFriendRequest() {
          var names = ['小明', '小红', '小刚', '小李', '小张', '小王'];
          var randomName = names[Math.floor(Math.random() * names.length)]; // 创建模拟请求

          var request = {
            id: "FR" + Date.now().toString().substr(-6),
            senderId: "user_" + Date.now().toString().substr(-6),
            senderName: randomName,
            message: "\u6211\u662F" + randomName + "\uFF0C\u8BF7\u6C42\u6DFB\u52A0\u60A8\u4E3A\u597D\u53CB",
            timestamp: Date.now()
          }; // 触发事件

          this.emit('friend-request-received', request);
        }
        /**
         * 模拟好友数据
         */


        getMockFriends() {
          return [{
            id: 'user_123456',
            name: '张三',
            avatar: null,
            isOnline: true,
            status: 0,
            // 在线
            level: 25,
            addedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 // 一周前

          }, {
            id: 'user_234567',
            name: '李四',
            avatar: null,
            isOnline: true,
            status: 1,
            // 游戏中
            level: 18,
            addedAt: Date.now() - 1000 * 60 * 60 * 24 * 14 // 两周前

          }, {
            id: 'user_345678',
            name: '王五',
            avatar: null,
            isOnline: false,
            status: 0,
            level: 32,
            addedAt: Date.now() - 1000 * 60 * 60 * 24 * 30 // 一个月前

          }, {
            id: 'user_456789',
            name: '赵六',
            avatar: null,
            isOnline: true,
            status: 2,
            // 匹配中
            level: 10,
            addedAt: Date.now() - 1000 * 60 * 60 * 24 * 2 // 两天前

          }, {
            id: 'user_567890',
            name: '钱七',
            avatar: null,
            isOnline: false,
            status: 0,
            level: 5,
            addedAt: Date.now() - 1000 * 60 * 60 * 24 * 60 // 两个月前

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
//# sourceMappingURL=3928da13f344a05e0b685d1c676d00a14449ae97.js.map