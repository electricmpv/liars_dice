System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, FriendService, _crd;

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


        async fetchFriends() {
          return new Promise(resolve => {
            // 模拟网络请求
            setTimeout(() => {
              this._friendList = this.getMockFriends();
              this.emit('friend-list-updated', this._friendList);
              resolve(this._friendList);
            }, 600);
          });
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
          console.log(`[FriendService] 发送好友请求给用户 ${userId}，消息：${message || '无'}`); // 模拟发送好友请求

          setTimeout(() => {
            this.emit('friend-request-sent', {
              id: `FR${Date.now().toString().substr(-6)}`,
              targetId: userId,
              message: message || '请求添加您为好友'
            });
          }, 500);
        }
        /**
         * 接受好友请求
         */


        acceptFriendRequest(requestId) {
          console.log(`[FriendService] 接受好友请求 ${requestId}`); // 模拟接受好友请求

          setTimeout(() => {
            // 创建一个新的好友
            const newFriend = {
              id: `user_${Date.now().toString().substr(-6)}`,
              name: `玩家${Math.floor(Math.random() * 1000)}`,
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
          console.log(`[FriendService] 拒绝好友请求 ${requestId}`); // 模拟拒绝好友请求

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
          console.log(`[FriendService] 删除好友 ${friendId}`); // 查找好友

          const index = this._friendList.findIndex(f => f.id === friendId);

          if (index === -1) {
            return;
          } // 模拟删除好友


          setTimeout(() => {
            // 从列表中移除
            const removedFriend = this._friendList.splice(index, 1)[0]; // 触发事件


            this.emit('friend-removed', removedFriend);
            this.emit('friend-list-updated', this._friendList);
          }, 500);
        }
        /**
         * 更新好友状态
         */


        updateFriendStatus(friendId, isOnline, status) {
          console.log(`[FriendService] 更新好友 ${friendId} 状态，在线：${isOnline}，状态：${status}`); // 查找好友

          const friend = this._friendList.find(f => f.id === friendId);

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


          const randomIndex = Math.floor(Math.random() * this._friendList.length);
          const friend = this._friendList[randomIndex]; // 随机更新状态

          const newIsOnline = Math.random() > 0.3; // 70%概率在线

          const newStatus = Math.floor(Math.random() * 3); // 0-2的状态
          // 更新状态

          this.updateFriendStatus(friend.id, newIsOnline, newStatus);
        }
        /**
         * 模拟接收好友请求
         */


        simulateReceiveFriendRequest() {
          const names = ['小明', '小红', '小刚', '小李', '小张', '小王'];
          const randomName = names[Math.floor(Math.random() * names.length)]; // 创建模拟请求

          const request = {
            id: `FR${Date.now().toString().substr(-6)}`,
            senderId: `user_${Date.now().toString().substr(-6)}`,
            senderName: randomName,
            message: `我是${randomName}，请求添加您为好友`,
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

          const listeners = this._listeners.get(eventName);

          if (!listeners) return;

          for (let i = listeners.length - 1; i >= 0; i--) {
            const listener = listeners[i];

            if (listener.callback === callback && (!target || listener.target === target)) {
              listeners.splice(i, 1);
            }
          }
        }
        /**
         * 触发事件
         */


        emit(eventName, ...args) {
          if (!this._listeners.has(eventName)) {
            return;
          }

          const listeners = this._listeners.get(eventName);

          if (!listeners) return;

          for (const listener of listeners) {
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