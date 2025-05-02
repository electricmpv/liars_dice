System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, ScrollView, director, RoomItem, PlayerItem, ChatItem, FilterTab, SystemNotice, FriendRequest, RoomService, FriendService, ChatService, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _crd, ccclass, property, LobbyState, LobbyController;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRoomItem(extras) {
    _reporterNs.report("RoomItem", "../../prefabs/room-item", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerItem(extras) {
    _reporterNs.report("PlayerItem", "../../prefabs/player-item", _context.meta, extras);
  }

  function _reportPossibleCrUseOfChatItem(extras) {
    _reporterNs.report("ChatItem", "../../prefabs/chat-item", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFilterTab(extras) {
    _reporterNs.report("FilterTab", "../../prefabs/filter-tab", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSystemNotice(extras) {
    _reporterNs.report("SystemNotice", "../../prefabs/system-notice", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFriendRequest(extras) {
    _reporterNs.report("FriendRequest", "../../prefabs/friend-request", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoomService(extras) {
    _reporterNs.report("RoomService", "./services/room-service", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimplifiedRoomInfo(extras) {
    _reporterNs.report("SimplifiedRoomInfo", "./services/room-service", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFriendService(extras) {
    _reporterNs.report("FriendService", "./services/friend-service", _context.meta, extras);
  }

  function _reportPossibleCrUseOfChatService(extras) {
    _reporterNs.report("ChatService", "./services/chat-service", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoomAvailable(extras) {
    _reporterNs.report("RoomAvailable", "colyseus.js", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSharedRoomStatus(extras) {
    _reporterNs.report("SharedRoomStatus", "../../../../../shared/protocols/room-protocol", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      ScrollView = _cc.ScrollView;
      director = _cc.director;
    }, function (_unresolved_2) {
      RoomItem = _unresolved_2.RoomItem;
    }, function (_unresolved_3) {
      PlayerItem = _unresolved_3.PlayerItem;
    }, function (_unresolved_4) {
      ChatItem = _unresolved_4.ChatItem;
    }, function (_unresolved_5) {
      FilterTab = _unresolved_5.FilterTab;
    }, function (_unresolved_6) {
      SystemNotice = _unresolved_6.SystemNotice;
    }, function (_unresolved_7) {
      FriendRequest = _unresolved_7.FriendRequest;
    }, function (_unresolved_8) {
      RoomService = _unresolved_8.RoomService;
    }, function (_unresolved_9) {
      FriendService = _unresolved_9.FriendService;
    }, function (_unresolved_10) {
      ChatService = _unresolved_10.ChatService;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9f6454tsf9Pk5dVYKFk34CO", "lobby-controller", undefined);

      // 导入 director
      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'ScrollView', 'director']); // RoomService now exports SimplifiedRoomInfo adaptation helper


      // Import Colyseus type
      // Corrected relative path (5 levels up) and removing .ts extension
      ({
        ccclass,
        property
      } = _decorator); // 大厅状态枚举

      LobbyState = /*#__PURE__*/function (LobbyState) {
        LobbyState[LobbyState["ROOM_LIST"] = 0] = "ROOM_LIST";
        LobbyState[LobbyState["FRIEND_LIST"] = 1] = "FRIEND_LIST";
        LobbyState[LobbyState["RANKING"] = 2] = "RANKING";
        LobbyState[LobbyState["SETTINGS"] = 3] = "SETTINGS";
        return LobbyState;
      }(LobbyState || {});
      /**
       * 大厅场景控制器
       * 功能：
       * 1. 管理大厅UI和交互逻辑
       * 2. 协调房间列表、好友列表、聊天系统等模块
       * 3. 处理状态切换和场景跳转
       */


      _export("LobbyController", LobbyController = (_dec = ccclass('LobbyController'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(Prefab), _dec5 = property(Prefab), _dec6 = property(Prefab), _dec7 = property(Prefab), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Node), _dec14 = property(ScrollView), _dec15 = property(ScrollView), _dec16 = property(ScrollView), _dec17 = property(Node), _dec18 = property(Node), _dec19 = property(Node), _dec20 = property(Node), _dec21 = property(Node), _dec22 = property(Node), _dec23 = property(Node), _dec(_class = (_class2 = class LobbyController extends Component {
        constructor() {
          super(...arguments);

          // 预制体引用
          _initializerDefineProperty(this, "roomItemPrefab", _descriptor, this);

          _initializerDefineProperty(this, "playerItemPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "chatItemPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "filterTabPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "systemNoticePrefab", _descriptor5, this);

          _initializerDefineProperty(this, "friendRequestPrefab", _descriptor6, this);

          // UI容器引用
          _initializerDefineProperty(this, "roomListContainer", _descriptor7, this);

          _initializerDefineProperty(this, "friendListContainer", _descriptor8, this);

          _initializerDefineProperty(this, "chatMessageContainer", _descriptor9, this);

          _initializerDefineProperty(this, "filterTabsContainer", _descriptor10, this);

          _initializerDefineProperty(this, "noticeContainer", _descriptor11, this);

          _initializerDefineProperty(this, "popupLayer", _descriptor12, this);

          _initializerDefineProperty(this, "roomScrollView", _descriptor13, this);

          _initializerDefineProperty(this, "friendScrollView", _descriptor14, this);

          _initializerDefineProperty(this, "chatScrollView", _descriptor15, this);

          // UI面板引用
          _initializerDefineProperty(this, "headerPanel", _descriptor16, this);

          _initializerDefineProperty(this, "contentPanel", _descriptor17, this);

          _initializerDefineProperty(this, "footerPanel", _descriptor18, this);

          _initializerDefineProperty(this, "roomListPanel", _descriptor19, this);

          _initializerDefineProperty(this, "friendListPanel", _descriptor20, this);

          _initializerDefineProperty(this, "rankListPanel", _descriptor21, this);

          _initializerDefineProperty(this, "settingsPanel", _descriptor22, this);

          // 服务实例
          this._roomService = null;
          this._friendService = null;
          this._chatService = null;
          // 状态管理
          this._currentState = LobbyState.ROOM_LIST;
          this._filterTabs = new Map();
          // 分组管理过滤标签
          this._systemNotice = null;
          // 系统通知实例
          // 缓存的数据
          this._cachedRooms = [];
          // Store RoomAvailable from RoomService
          this._cachedFriends = [];
          // Keep as any[] for now, adapt later if needed
          this._cachedMessages = [];
          // Keep as any[]
          // 用于防止重复加入
          this._isJoiningRoom = false;
        }

        onLoad() {
          this.initServices();
          this.initSystemNotice();
          this.setupEventListeners();
        }

        start() {
          // 初始化默认状态
          this.setState(LobbyState.ROOM_LIST); // 加载初始数据

          this.loadInitialData(); // 创建过滤标签

          this.createFilterTabs();
        }

        onDestroy() {
          this.removeEventListeners(); // 销毁服务实例

          if (this._roomService && typeof this._roomService.onDestroy === 'function') {
            this._roomService.onDestroy();
          }

          if (this._friendService && typeof this._friendService.onDestroy === 'function') {
            this._friendService.onDestroy();
          }

          if (this._chatService && typeof this._chatService.onDestroy === 'function') {
            this._chatService.onDestroy();
          }
        }
        /**
         * 初始化服务
         */


        initServices() {
          this._roomService = new (_crd && RoomService === void 0 ? (_reportPossibleCrUseOfRoomService({
            error: Error()
          }), RoomService) : RoomService)();
          this._friendService = new (_crd && FriendService === void 0 ? (_reportPossibleCrUseOfFriendService({
            error: Error()
          }), FriendService) : FriendService)();
          this._chatService = new (_crd && ChatService === void 0 ? (_reportPossibleCrUseOfChatService({
            error: Error()
          }), ChatService) : ChatService)();
        }
        /**
         * 初始化系统通知组件
         */


        initSystemNotice() {
          if (this.systemNoticePrefab && this.noticeContainer) {
            var noticeNode = instantiate(this.systemNoticePrefab);
            this.noticeContainer.addChild(noticeNode);
            this._systemNotice = noticeNode.getComponent(_crd && SystemNotice === void 0 ? (_reportPossibleCrUseOfSystemNotice({
              error: Error()
            }), SystemNotice) : SystemNotice);
          }
        }
        /**
         * 设置事件监听
         */


        setupEventListeners() {
          // 房间相关事件
          this._roomService.on('room-list-updated', this.updateRoomList, this);

          this._roomService.on('room-created', this.onRoomCreated, this);

          this._roomService.on('room-joined', this.onRoomJoined, this);

          this._roomService.on('room-join-failed', this.onRoomJoinFailed, this); // 好友相关事件


          this._friendService.on('friend-list-updated', this.updateFriendList, this);

          this._friendService.on('friend-request-received', this.showFriendRequest, this);

          this._friendService.on('friend-status-changed', this.updateFriendStatus, this); // 聊天相关事件


          this._chatService.on('message-received', this.onMessageReceived, this);

          this._chatService.on('message-sent', this.onMessageSent, this);

          this._chatService.on('chat-error', this.onChatError, this);
        }
        /**
         * 移除事件监听
         */


        removeEventListeners() {
          // 房间相关事件
          this._roomService.off('room-list-updated', this.updateRoomList, this);

          this._roomService.off('room-created', this.onRoomCreated, this);

          this._roomService.off('room-joined', this.onRoomJoined, this);

          this._roomService.off('room-join-failed', this.onRoomJoinFailed, this); // 好友相关事件


          this._friendService.off('friend-list-updated', this.updateFriendList, this);

          this._friendService.off('friend-request-received', this.showFriendRequest, this);

          this._friendService.off('friend-status-changed', this.updateFriendStatus, this); // 聊天相关事件


          this._chatService.off('message-received', this.onMessageReceived, this);

          this._chatService.off('message-sent', this.onMessageSent, this);

          this._chatService.off('chat-error', this.onChatError, this);
        }
        /**
         * 加载初始数据
         */


        loadInitialData() {
          var _this = this;

          return _asyncToGenerator(function* () {
            try {
              // 显示加载中通知
              _this.showNotice("正在加载数据...", "info"); // 并行加载数据


              yield Promise.all([_this._roomService.fetchRooms(), _this._friendService.fetchFriends(), _this._chatService.connect()]); // 显示成功通知

              _this.showNotice("数据加载完成", "success");
            } catch (error) {
              console.error("加载数据失败:", error);

              _this.showNotice("数据加载失败，请重试", "error");
            }
          })();
        }
        /**
         * 创建过滤标签
         */


        createFilterTabs() {
          if (!this.filterTabPrefab || !this.filterTabsContainer) return; // 创建房间过滤标签

          var roomTabs = [{
            id: 'all',
            name: '全部房间'
          }, {
            id: 'waiting',
            name: '等待中'
          }, {
            id: 'playing',
            name: '游戏中'
          }, {
            id: 'friends',
            name: '好友房间'
          }];
          this.createTabGroup('room', roomTabs, this.onRoomFilterChanged.bind(this)); // 创建好友过滤标签

          var friendTabs = [{
            id: 'all',
            name: '全部好友'
          }, {
            id: 'online',
            name: '在线好友'
          }, {
            id: 'playing',
            name: '游戏中'
          }];
          this.createTabGroup('friend', friendTabs, this.onFriendFilterChanged.bind(this));
        }
        /**
         * 创建标签组
         */


        createTabGroup(groupId, tabs, callback) {
          if (!this.filterTabPrefab || !this.filterTabsContainer) return;
          var group = [];
          tabs.forEach((tab, index) => {
            var tabNode = instantiate(this.filterTabPrefab);
            var tabComp = tabNode.getComponent(_crd && FilterTab === void 0 ? (_reportPossibleCrUseOfFilterTab({
              error: Error()
            }), FilterTab) : FilterTab);
            tabComp.setTabId(tab.id);
            tabComp.setTabName(tab.name);
            tabComp.setGroupId(groupId);
            tabComp.setTabIndex(index); // 设置第一个标签为选中状态

            if (index === 0) {
              tabComp.setSelected(true);
            } // 添加标签切换事件


            tabNode.on('tab-selected', event => {
              // 更新同组其他标签状态
              group.forEach(otherTab => {
                if (otherTab !== tabComp) {
                  otherTab.setSelected(false);
                }
              }); // 调用回调

              if (callback) {
                callback(tab.id);
              }
            });
            this.filterTabsContainer.addChild(tabNode);
            group.push(tabComp);
          });

          this._filterTabs.set(groupId, group);
        }
        /**
         * 设置当前状态
         */


        setState(newState) {
          this._currentState = newState;
          this.updateUIState();
        }
        /**
         * 更新UI状态
         */


        updateUIState() {
          // 隐藏所有面板
          if (this.roomListPanel) this.roomListPanel.active = false;
          if (this.friendListPanel) this.friendListPanel.active = false;
          if (this.rankListPanel) this.rankListPanel.active = false;
          if (this.settingsPanel) this.settingsPanel.active = false; // 显示当前状态对应的面板

          switch (this._currentState) {
            case LobbyState.ROOM_LIST:
              if (this.roomListPanel) this.roomListPanel.active = true; // 更新房间列表

              this.updateRoomList(this._cachedRooms);
              break;

            case LobbyState.FRIEND_LIST:
              if (this.friendListPanel) this.friendListPanel.active = true; // 更新好友列表

              this.updateFriendList(this._cachedFriends);
              break;

            case LobbyState.RANKING:
              if (this.rankListPanel) this.rankListPanel.active = true;
              break;

            case LobbyState.SETTINGS:
              if (this.settingsPanel) this.settingsPanel.active = true;
              break;
          } // 更新过滤标签显示


          this.updateFilterTabsVisibility();
        }
        /**
         * 更新过滤标签显示
         */


        updateFilterTabsVisibility() {
          if (!this.filterTabsContainer) return; // 获取所有分组

          this._filterTabs.forEach((tabs, groupId) => {
            // 根据当前状态决定是否显示
            var visible = groupId === 'room' && this._currentState === LobbyState.ROOM_LIST || groupId === 'friend' && this._currentState === LobbyState.FRIEND_LIST; // 设置标签显示/隐藏

            tabs.forEach(tab => {
              tab.node.active = visible;
            });
          });
        }
        /**
         * 切换到房间列表
         */


        switchToRoomList() {
          this.setState(LobbyState.ROOM_LIST);
        }
        /**
         * 切换到好友列表
         */


        switchToFriendList() {
          this.setState(LobbyState.FRIEND_LIST);
        }
        /**
         * 切换到排行榜
         */


        switchToRanking() {
          this.setState(LobbyState.RANKING);
        }
        /**
         * 切换到设置
         */


        switchToSettings() {
          this.setState(LobbyState.SETTINGS);
        }
        /**
         * 房间过滤器改变
         */


        onRoomFilterChanged(filterId) {
          this._roomService.setFilter(filterId);

          this.updateRoomList(this._cachedRooms);
        }
        /**
         * 好友过滤器改变
         */


        onFriendFilterChanged(filterId) {
          this._friendService.setFilter(filterId);

          this.updateFriendList(this._cachedFriends);
        }
        /**
         * 更新房间列表 (适配 Colyseus RoomAvailable)
         */


        updateRoomList(rooms) {
          // Change parameter type
          if (!this.roomListContainer || !this.roomItemPrefab) return; // 缓存房间列表

          this._cachedRooms = rooms; // 如果不是房间列表状态，不更新UI

          if (this._currentState !== LobbyState.ROOM_LIST) return; // 清空当前列表

          this.roomListContainer.removeAllChildren(); // 获取过滤后的房间

          var filteredRooms = this._roomService.getFilteredRooms(rooms); // 添加房间项
          // 添加房间项 - 使用适配器转换 RoomAvailable


          filteredRooms.forEach(roomAvailable => {
            var _adaptedInfo$hasPassw, _adaptedInfo$isPrivat;

            // Variable renamed for clarity
            var adaptedInfo = (_crd && RoomService === void 0 ? (_reportPossibleCrUseOfRoomService({
              error: Error()
            }), RoomService) : RoomService).adaptRoomAvailable(roomAvailable); // Use static adapter method

            var roomNode = instantiate(this.roomItemPrefab);
            var roomComp = roomNode.getComponent(_crd && RoomItem === void 0 ? (_reportPossibleCrUseOfRoomItem({
              error: Error()
            }), RoomItem) : RoomItem); // Pass the adapted info to the RoomItem component

            roomComp.setRoomInfo({
              roomId: adaptedInfo.id,
              roomName: adaptedInfo.name,
              playerCount: adaptedInfo.playerCount,
              maxPlayers: adaptedInfo.maxPlayers,
              status: adaptedInfo.status,
              // Cast status to expected type
              hasPassword: (_adaptedInfo$hasPassw = adaptedInfo.hasPassword) != null ? _adaptedInfo$hasPassw : false,
              // Provide default value
              isPrivate: (_adaptedInfo$isPrivat = adaptedInfo.isPrivate) != null ? _adaptedInfo$isPrivat : false,
              // Provide default value
              hasFriends: false // TODO: Implement friend logic later

            }); // 监听房间点击事件

            roomNode.on('room-item-clicked', () => this.onRoomItemClicked(adaptedInfo), this); // Pass adaptedInfo

            roomNode.on('join-room', () => this.onJoinRoomClicked(adaptedInfo), this); // Pass adaptedInfo

            this.roomListContainer.addChild(roomNode); // 播放新增动画

            roomComp.playNewItemAnimation();
          }); // 刷新滚动视图

          if (this.roomScrollView) {
            this.roomScrollView.scrollToTop();
          }
        }
        /**
         * 更新好友列表
         */


        updateFriendList(friends) {
          if (!this.friendListContainer || !this.playerItemPrefab) return; // 缓存好友列表

          this._cachedFriends = friends; // 如果不是好友列表状态，不更新UI

          if (this._currentState !== LobbyState.FRIEND_LIST) return; // 清空当前列表

          this.friendListContainer.removeAllChildren(); // 获取过滤后的好友

          var filteredFriends = this._friendService.getFilteredFriends(friends); // 添加好友项


          filteredFriends.forEach(friend => {
            var playerNode = instantiate(this.playerItemPrefab);
            var playerComp = playerNode.getComponent(_crd && PlayerItem === void 0 ? (_reportPossibleCrUseOfPlayerItem({
              error: Error()
            }), PlayerItem) : PlayerItem);
            playerComp.setPlayerId(friend.id);
            playerComp.setPlayerName(friend.name);
            playerComp.setIsOnline(friend.isOnline);

            if (friend.avatar) {
              playerComp.setAvatar(friend.avatar);
            } // 监听玩家点击事件


            playerNode.on('player-item-clicked', this.onPlayerItemClicked, this);
            this.friendListContainer.addChild(playerNode);
          }); // 刷新滚动视图

          if (this.friendScrollView) {
            this.friendScrollView.scrollToTop();
          }
        }
        /**
         * 添加聊天消息
         */


        addChatMessage(message) {
          if (!this.chatMessageContainer || !this.chatItemPrefab) return; // 创建消息项

          var chatNode = instantiate(this.chatItemPrefab);
          var chatComp = chatNode.getComponent(_crd && ChatItem === void 0 ? (_reportPossibleCrUseOfChatItem({
            error: Error()
          }), ChatItem) : ChatItem);
          chatComp.setMessageData({
            id: message.id,
            type: message.type,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            timestamp: message.timestamp
          }); // 添加到消息容器

          this.chatMessageContainer.addChild(chatNode); // 播放新消息动画

          chatComp.playNewMessageAnimation(); // 滚动到最新消息

          if (this.chatScrollView) {
            this.chatScrollView.scrollToBottom();
          } // 缓存消息


          this._cachedMessages.push(message); // 限制缓存消息数量


          if (this._cachedMessages.length > 100) {
            this._cachedMessages.shift();
          }
        }
        /**
         * 显示系统通知
         */


        showNotice(text, type, duration, isPersistent) {
          if (type === void 0) {
            type = 'info';
          }

          if (isPersistent === void 0) {
            isPersistent = false;
          }

          if (this._systemNotice) {
            this._systemNotice.show(text, type, duration, isPersistent);
          }
        }
        /**
         * 显示好友请求
         */


        showFriendRequest(requestInfo) {
          if (!this.friendRequestPrefab || !this.popupLayer) return; // 创建好友请求节点

          var requestNode = instantiate(this.friendRequestPrefab);
          var requestComp = requestNode.getComponent(_crd && FriendRequest === void 0 ? (_reportPossibleCrUseOfFriendRequest({
            error: Error()
          }), FriendRequest) : FriendRequest); // 设置请求信息

          requestComp.show({
            requestId: requestInfo.id,
            senderId: requestInfo.senderId,
            senderName: requestInfo.senderName,
            message: requestInfo.message,
            requestType: requestInfo.type
          }); // 监听请求事件

          requestNode.on('request-accepted', event => {
            this._friendService.acceptFriendRequest(event.detail.requestId);

            this.showNotice("\u5DF2\u63A5\u53D7 " + event.detail.senderName + " \u7684\u597D\u53CB\u8BF7\u6C42", 'success');
          }, this);
          requestNode.on('request-rejected', event => {
            this._friendService.rejectFriendRequest(event.detail.requestId);
          }, this);
          this.popupLayer.addChild(requestNode);
        }
        /**
         * 更新好友状态
         */


        updateFriendStatus(friendInfo) {
          // 更新缓存中的好友状态
          var friend = this._cachedFriends.find(f => f.id === friendInfo.id);

          if (friend) {
            friend.isOnline = friendInfo.isOnline;
            friend.status = friendInfo.status;
          } // 如果是好友列表状态，更新UI


          if (this._currentState === LobbyState.FRIEND_LIST) {
            this.updateFriendList(this._cachedFriends);
          } // 如果从离线变为在线，显示通知


          if (friendInfo.isOnline && friend && !friend.isOnline) {
            this.showNotice("\u597D\u53CB " + friendInfo.name + " \u4E0A\u7EBF\u4E86", 'info');
          }
        }
        /**
         * 房间项点击事件 (接收 SimplifiedRoomInfo)
         */


        onRoomItemClicked(roomInfo) {
          // const roomInfo = event.detail; // No longer using event detail
          console.log('房间点击:', roomInfo); // 显示房间详情
          // TODO: 实现房间详情展示
        }
        /**
        // 用于防止重复加入
        private _isJoiningRoom: boolean = false;
         /**
         * 加入房间按钮点击事件 (接收 SimplifiedRoomInfo)
         */


        onJoinRoomClicked(roomInfo) {
          // Change parameter type
          if (this._isJoiningRoom) {
            console.warn('[LobbyController] Already attempting to join a room.');
            return; // 防止重复点击
          }

          this._isJoiningRoom = true; // 设置标志位

          console.log('加入房间 (Simplified):', roomInfo); // Log adapted info
          // Use adaptedInfo.id instead of roomInfo.roomId

          if (!roomInfo || !roomInfo.id) {
            console.error('[LobbyController] onJoinRoomClicked: 无效的 roomInfo 或 id');
            this.showNotice("加入房间失败：无效的房间信息", "error");
            this._isJoiningRoom = false; // 重置标志位

            return;
          } // 检查房间是否有密码 (use adaptedInfo.hasPassword)


          if (roomInfo.hasPassword) {
            // TODO: Implement password input popup logic
            this.showNotice("该房间需要密码，暂不支持加入", "warning");
            this._isJoiningRoom = false; // 重置标志位
          } else {
            // No password, join directly using adaptedInfo.id
            this.showNotice("\u6B63\u5728\u52A0\u5165\u623F\u95F4 " + (roomInfo.name || roomInfo.id) + "...", "info"); // Use adapted name/id
            // No need to check typeof id, as it's guaranteed string by interface

            this._roomService.joinRoom(roomInfo.id).finally(() => {
              // Reset the flag regardless of success/failure (event is emitted by service)
              this._isJoiningRoom = false;
            }); // No need for the 'else' block checking typeof roomId

          }
        }
        /**
         * 玩家项点击事件
         */


        onPlayerItemClicked(event) {
          var playerInfo = event.detail;
          console.log('玩家点击:', playerInfo); // 显示玩家信息菜单
          // TODO: 实现玩家信息菜单
        }
        /**
         * 房间创建成功事件
         */


        onRoomCreated(roomInfo) {
          this.showNotice("\u623F\u95F4 \"" + roomInfo.name + "\" \u521B\u5EFA\u6210\u529F", 'success'); // TODO: 跳转到游戏场景
        }
        /**
         * 房间加入成功事件
         */


        onRoomJoined(roomInfo) {
          this.showNotice("\u5DF2\u52A0\u5165\u623F\u95F4 \"" + roomInfo.name + "\"", 'success'); // 跳转到游戏场景 (假设场景名为 RoomScene)

          console.log("[LobbyController] \u51C6\u5907\u8DF3\u8F6C\u5230\u623F\u95F4\u573A\u666F: RoomScene, \u623F\u95F4\u4FE1\u606F:", roomInfo); // 可以在跳转前保存一些需要传递给下一个场景的数据
          // director.settings.set('currentRoomInfo', roomInfo); // 示例：使用 settings 传递数据

          director.loadScene('RoomScene', err => {
            if (err) {
              console.error("[LobbyController] \u8DF3\u8F6C\u5230 RoomScene \u5931\u8D25:", err);
              this.showNotice("跳转房间场景失败", "error");
            }
          });
        }
        /**
         * 房间加入失败事件
         */


        onRoomJoinFailed(error) {
          // 加入失败时 RoomService 会发出事件，这里显示通知
          // _isJoiningRoom 标志位已在 joinRoom 的 finally 块中重置
          this.showNotice("\u52A0\u5165\u623F\u95F4\u5931\u8D25: " + (error.error || '未知错误'), 'error'); // 使用 error.error
        }
        /**
         * 消息接收事件
         */


        onMessageReceived(message) {
          this.addChatMessage(message);
        }
        /**
         * 消息发送事件
         */


        onMessageSent(message) {
          this.addChatMessage(message);
        }
        /**
         * 聊天错误事件
         */


        onChatError(error) {
          this.showNotice("\u804A\u5929\u9519\u8BEF: " + error.message, 'error');
        }
        /**
         * 创建房间
         */


        createRoom(roomInfo) {
          this._roomService.createRoom(roomInfo);
        }
        /**
         * 发送聊天消息
         */


        sendChatMessage(content) {
          this._chatService.sendMessage(content);
        }
        /**
         * 发送好友请求
         */


        sendFriendRequest(userId, message) {
          // 显式处理 undefined 情况
          if (typeof message === 'string') {
            this._friendService.sendFriendRequest(userId, message);
          } else {
            // 如果 message 是 undefined 或其他非字符串类型，传递空字符串
            this._friendService.sendFriendRequest(userId, '');
          }
        }
        /**
         * 快速加入按钮点击处理
         */


        onQuickJoinClicked() {
          console.log('[LobbyController] Quick Join button clicked.');
          this.showNotice("正在尝试快速加入...", "info"); // TODO: 调用 RoomService 的快速加入逻辑
          // this._roomService.quickJoin().catch(error => {
          //     this.showNotice(`快速加入失败: ${error.message}`, 'error');
          // });
        }
        /**
         * 刷新按钮点击处理
         */


        onRefreshClicked() {
          console.log('[LobbyController] Refresh button clicked.');
          this.showNotice("正在刷新房间列表...", "info");
          this.loadInitialData().catch(error => {
            // 错误已在 loadInitialData 内部处理并显示通知
            console.error('[LobbyController] Error refreshing data:', error);
          });
        }
        /**
         * 返回按钮点击处理
         */


        onBackButtonClick() {
          console.log('[LobbyController] Back button clicked.'); // 返回登录场景

          director.loadScene('LoginScene', err => {
            if (err) {
              console.error("[LobbyController] \u8DF3\u8F6C\u5230 LoginScene \u5931\u8D25:", err);
              this.showNotice("返回登录失败", "error");
            }
          });
        }
        /**
         * 设置按钮点击处理
         */


        onSettingsButtonClicked() {
          console.log('[LobbyController] Settings button clicked.');
          this.switchToSettings();
        }
        /**
         * 搜索房间按钮点击处理
         */


        onSearchRoomClicked() {
          console.log('[LobbyController] Search Room button clicked.'); // TODO: 实现搜索房间的 UI 逻辑，例如弹出搜索框

          this.showNotice("搜索功能暂未实现", "warning");
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roomItemPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "playerItemPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "chatItemPrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "filterTabPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "systemNoticePrefab", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "friendRequestPrefab", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "roomListContainer", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "friendListContainer", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "chatMessageContainer", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "filterTabsContainer", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "noticeContainer", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "popupLayer", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "roomScrollView", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "friendScrollView", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "chatScrollView", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "headerPanel", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "contentPanel", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "footerPanel", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "roomListPanel", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "friendListPanel", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "rankListPanel", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "settingsPanel", [_dec23], {
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
//# sourceMappingURL=e8705763ad3bc96b0039baaceb86fb6147b0ad35.js.map