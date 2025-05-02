System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, EventTarget, NetworkManager, LoginManager, _dec, _class, _crd, ccclass, RoomService;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "../../../core/network", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLoginManager(extras) {
    _reporterNs.report("LoginManager", "../../../core/login-manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoomAvailable(extras) {
    _reporterNs.report("RoomAvailable", "colyseus.js", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      EventTarget = _cc.EventTarget;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
    }, function (_unresolved_3) {
      LoginManager = _unresolved_3.LoginManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e3b45KKIoZFRqWUkAbZqp+U", "room-service", undefined);

      __checkObsolete__(['_decorator', 'EventTarget']); // 使用 NetworkManager 单例而不是 network


      // 用于获取玩家名
      // Colyseus 提供的类型
      // 移除旧的 Room 类型导入，因为 getAvailableRooms 返回 RoomAvailable
      // import type { Room } from '../../../../../../shared/protocols/room-protocol';
      ({
        ccclass
      } = _decorator); // 适配 RoomAvailable 到一个 LobbyController 可能期望的简化结构
      // 或者让 LobbyController 直接处理 RoomAvailable

      /**
       * 房间服务类 (已适配 Colyseus)
       * 负责处理与房间相关的逻辑和网络通信
       */
      _export("RoomService", RoomService = (_dec = ccclass('RoomService'), _dec(_class = class RoomService extends EventTarget {
        // 销毁状态标志
        constructor() {
          super(); // 不再监听 lobbyUpdate，房间列表通过主动请求获取
          // network.on('lobbyUpdate', this.handleLobbyUpdate.bind(this));

          this._currentFilter = 'all';
          // 当前过滤器
          this._cachedRooms = [];
          // 缓存原始 Colyseus 房间列表
          this._isDestroyed = false;
        }
        /**
         * 获取房间列表 (适配 Colyseus)
         */


        fetchRooms() {
          var _this = this;

          return _asyncToGenerator(function* () {
            console.log('[RoomService] Fetching rooms via Colyseus...');
            if (_this._isDestroyed) return;

            try {
              // 调用 NetworkManager 单例方法
              var roomsAvailable = yield (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                error: Error()
              }), NetworkManager) : NetworkManager).getInstance().getAvailableRooms();
              if (_this._isDestroyed) return; // 检查销毁状态

              _this._cachedRooms = roomsAvailable; // 缓存原始数据

              console.log('[RoomService] Colyseus rooms fetched:', _this._cachedRooms.length); // 发出事件，通知 LobbyController 更新 UI，传递原始数据

              if (!_this._isDestroyed) _this.emit('room-list-updated', _this._cachedRooms); // 检查销毁状态
            } catch (error) {
              console.error('[RoomService] Error fetching Colyseus rooms:', error);
              if (!_this._isDestroyed) _this.emit('fetch-error', {
                message: error instanceof Error ? error.message : '获取房间列表时发生未知错误'
              }); // 检查销毁状态
            }
          })();
        }
        /**
         * 设置过滤器
         * @param filterId 过滤器ID ('all', 'waiting', 'playing', 'friends')
         */


        setFilter(filterId) {
          if (this._isDestroyed) return;
          this._currentFilter = filterId;
          console.log("[RoomService] Filter set to: " + filterId); // 触发更新，让 Controller 重新获取过滤后的列表

          if (!this._isDestroyed) this.emit('room-list-updated', this._cachedRooms); // 使用缓存的数据触发更新
        }
        /**
         * 获取过滤后的房间列表 (适配 Colyseus RoomAvailable)
         * @param rooms 可选的原始 RoomAvailable 列表，如果未提供则使用缓存
         * @returns 过滤后的 RoomAvailable 列表
         */


        getFilteredRooms(rooms) {
          var sourceRooms = rooms || this._cachedRooms;
          console.log("[RoomService] Filtering " + sourceRooms.length + " rooms with filter: " + this._currentFilter);

          switch (this._currentFilter) {
            case 'waiting':
              // 需要假设 metadata 包含 status 字段
              return sourceRooms.filter(room => {
                var _room$metadata;

                return ((_room$metadata = room.metadata) == null ? void 0 : _room$metadata.status) === 'waiting';
              });

            case 'playing':
              // 需要假设 metadata 包含 status 字段
              return sourceRooms.filter(room => {
                var _room$metadata2, _room$metadata3;

                return ((_room$metadata2 = room.metadata) == null ? void 0 : _room$metadata2.status) === 'playing' || ((_room$metadata3 = room.metadata) == null ? void 0 : _room$metadata3.status) === 'gaming';
              });
            // 兼容旧状态名

            case 'friends':
              // TODO: 实现好友房间过滤逻辑 (需要好友服务和服务器 metadata 支持)
              console.warn('[RoomService] Friends filter not implemented yet.');
              return sourceRooms;
            // 暂时返回全部

            case 'all':
            default:
              return sourceRooms;
          }
        }
        /**
         * 加入房间 (适配 Colyseus)
         * @param roomId 房间ID
         */


        joinRoom(roomId) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            if (_this2._isDestroyed) return;
            console.log("[RoomService] Attempting to join Colyseus room: " + roomId);

            try {
              var playerName = (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                error: Error()
              }), LoginManager) : LoginManager).playerName || "Player_" + Math.random().toString().substring(2, 6); // 获取玩家名

              var room = yield (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                error: Error()
              }), NetworkManager) : NetworkManager).getInstance().joinLiarDiceRoom({
                roomId,
                playerName
              }); // 使用新的方法

              if (_this2._isDestroyed) return; // Double check after await

              console.log("[RoomService] Joined Colyseus room successfully: " + room.roomId); // 发出事件，只传递 roomId，让 RoomUI 通过 network 获取状态

              if (!_this2._isDestroyed) _this2.emit('room-joined', {
                id: room.roomId,
                name: room.name
              });
            } catch (error) {
              console.error("[RoomService] Error joining Colyseus room " + roomId + ":", error);
              if (!_this2._isDestroyed) _this2.emit('room-join-failed', {
                roomId,
                error: error instanceof Error ? error.message : '加入房间时发生未知错误'
              });
            }
          })();
        }
        /**
         * 创建房间 (适配 Colyseus)
         * @param roomInfo 房间信息 (例如名称) - { name: string }
         */


        createRoom(roomInfo) {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            if (_this3._isDestroyed) return;
            console.log('[RoomService] Attempting to create Colyseus room:', roomInfo);

            try {
              var playerName = (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                error: Error()
              }), LoginManager) : LoginManager).playerName || "Creator_" + Math.random().toString().substring(2, 6);
              var options = {
                playerName: playerName,
                create: true,
                // 从 roomInfo 获取房间名，或提供默认名
                roomName: (roomInfo == null ? void 0 : roomInfo.name) || playerName + "\u7684\u623F\u95F4" // 可以添加其他创建选项，如密码、最大玩家数，需要服务器支持
                // maxPlayers: 6,
                // password: '...'

              };
              var room = yield (_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
                error: Error()
              }), NetworkManager) : NetworkManager).getInstance().joinLiarDiceRoom(options); // 使用 joinLiarDiceRoom 并设置 create 标志

              if (_this3._isDestroyed) return; // Double check after await

              console.log("[RoomService] Created Colyseus room successfully: " + room.roomId); // 创建即加入，发出 room-joined 事件

              if (!_this3._isDestroyed) _this3.emit('room-joined', {
                id: room.roomId,
                name: room.name
              });
            } catch (error) {
              console.error("[RoomService] Error creating Colyseus room:", error);
              if (!_this3._isDestroyed) _this3.emit('room-create-failed', {
                error: error instanceof Error ? error.message : '创建房间时发生未知错误'
              });
            }
          })();
        } // 清理资源


        onDestroy() {
          console.log('[RoomService] Destroying...');
          this._isDestroyed = true; // 不再需要取消 lobbyUpdate 监听
          // network.off('lobbyUpdate', this.handleLobbyUpdate.bind(this));
        } // --- 辅助函数 ---

        /**
         * 将 Colyseus RoomAvailable 转换为简化的房间信息对象 (LobbyController 可能需要)
         * @param room RoomAvailable 对象
         * @returns SimplifiedRoomInfo 对象
         */


        static adaptRoomAvailable(room) {
          var _room$metadata4, _room$metadata5, _room$metadata6, _room$metadata7;

          return {
            id: room.roomId,
            name: ((_room$metadata4 = room.metadata) == null ? void 0 : _room$metadata4.roomName) || "\u623F\u95F4 " + room.roomId.substring(0, 4),
            playerCount: room.clients,
            maxPlayers: room.maxClients,
            status: ((_room$metadata5 = room.metadata) == null ? void 0 : _room$metadata5.status) || 'waiting',
            hasPassword: ((_room$metadata6 = room.metadata) == null ? void 0 : _room$metadata6.hasPassword) || false,
            isPrivate: ((_room$metadata7 = room.metadata) == null ? void 0 : _room$metadata7.isPrivate) || false
          };
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a8f27a9aac29afae6097a948fd95a578f1c4c725.js.map