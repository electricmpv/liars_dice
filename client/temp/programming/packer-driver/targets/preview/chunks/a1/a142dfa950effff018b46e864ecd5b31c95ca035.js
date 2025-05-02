System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, ColyseusModule, LiarDiceRoomState, PlayerState, LoginManager, NetworkManager, _crd, NetworkErrorCode, NetworkStatus;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfLiarDiceRoomState(extras) {
    _reporterNs.report("LiarDiceRoomState", "../../shared/schemas/liar-dice-room-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerState(extras) {
    _reporterNs.report("PlayerState", "../../shared/schemas/player-state-client", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLoginManager(extras) {
    _reporterNs.report("LoginManager", "./login-manager", _context.meta, extras);
  }

  _export("NetworkManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      ColyseusModule = _unresolved_2;
    }, function (_unresolved_3) {
      LiarDiceRoomState = _unresolved_3.LiarDiceRoomState;
    }, function (_unresolved_4) {
      PlayerState = _unresolved_4.PlayerState;
    }, function (_unresolved_5) {
      LoginManager = _unresolved_5.LoginManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "95f09hKtjRJJLvPlOGPyFmO", "network", undefined); // 直接从Colyseus插件导入
      // @ts-ignore - 忽略类型检查，因为这是一个JavaScript文件


      /**
       * 网络管理器错误类型定义
       */
      _export("NetworkErrorCode", NetworkErrorCode = /*#__PURE__*/function (NetworkErrorCode) {
        NetworkErrorCode[NetworkErrorCode["CLIENT_INIT_ERROR"] = 1000] = "CLIENT_INIT_ERROR";
        NetworkErrorCode[NetworkErrorCode["CONNECTION_ERROR"] = 1001] = "CONNECTION_ERROR";
        NetworkErrorCode[NetworkErrorCode["CONNECTION_TIMEOUT"] = 1002] = "CONNECTION_TIMEOUT";
        NetworkErrorCode[NetworkErrorCode["CONNECTION_CLOSED"] = 1003] = "CONNECTION_CLOSED";
        NetworkErrorCode[NetworkErrorCode["ROOM_JOIN_ERROR"] = 2000] = "ROOM_JOIN_ERROR";
        NetworkErrorCode[NetworkErrorCode["ROOM_NOT_FOUND"] = 2001] = "ROOM_NOT_FOUND";
        NetworkErrorCode[NetworkErrorCode["ROOM_FULL"] = 2002] = "ROOM_FULL";
        NetworkErrorCode[NetworkErrorCode["SERVER_ERROR"] = 5000] = "SERVER_ERROR";
        NetworkErrorCode[NetworkErrorCode["UNKNOWN_ERROR"] = 9999] = "UNKNOWN_ERROR";
        return NetworkErrorCode;
      }({}));
      /**
       * 网络错误详情
       */


      /**
       * 网络状态类型
       */
      _export("NetworkStatus", NetworkStatus = /*#__PURE__*/function (NetworkStatus) {
        NetworkStatus["DISCONNECTED"] = "disconnected";
        NetworkStatus["CONNECTING"] = "connecting";
        NetworkStatus["JOINING_ROOM"] = "joining";
        NetworkStatus["CONNECTED"] = "connected";
        NetworkStatus["RECONNECTING"] = "reconnecting";
        NetworkStatus["ERROR"] = "error";
        return NetworkStatus;
      }({}));
      /**
       * 骰子游戏房间选项
       */


      /**
       * 网络管理器类
       * 负责处理与Colyseus服务器的通信
       */
      _export("NetworkManager", NetworkManager = class NetworkManager {
        get serverUrl() {
          return this.serverUrls[this.currentServerUrlIndex];
        } // 状态和会话信息


        /**
         * 私有构造函数，确保单例模式
         */
        constructor() {// 私有构造函数，防止直接实例化

          this.colyseusClient = null;
          this.colyseusRoom = null;
          // 支持多个服务器 URL，按优先级排序
          this.serverUrls = ["ws://localhost:3000", "ws://127.0.0.1:3000", "wss://liars-dice-server.example.com" // 如果有生产环境服务器，可以添加
          ];
          this.currentServerUrlIndex = 0;
          this._status = NetworkStatus.DISCONNECTED;
          this._roomId = '';
          this._sessionId = '';
          this._lastState = null;
          // 事件处理器
          this.eventHandlers = new Map();
        }
        /**
         * 获取单例实例
         */


        static getInstance() {
          if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
          }

          return NetworkManager.instance;
        }
        /**
         * 获取当前网络状态
         */


        get status() {
          return this._status;
        }
        /**
         * 获取当前房间ID
         */


        get roomId() {
          return this._roomId;
        }
        /**
         * 获取当前会话ID
         */


        get sessionId() {
          return this._sessionId;
        }
        /**
         * 获取当前房间状态
         */


        get roomState() {
          return this._lastState;
        }
        /**
         * 触发事件
         * @param eventName 事件名称
         * @param data 事件数据
         */


        emit(eventName, data) {
          var handlers = this.eventHandlers.get(eventName);

          if (handlers) {
            handlers.forEach(handler => {
              try {
                handler(data);
              } catch (error) {
                console.error("[\u7F51\u7EDC][\u9519\u8BEF] \u4E8B\u4EF6\u5904\u7406\u5668\u51FA\u9519 " + eventName + ":", error);
              }
            });
          }
        }
        /**
         * 注册事件监听
         * @param eventName 事件名称
         * @param handler 事件处理器
         */


        on(eventName, handler) {
          if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
          }

          var handlers = this.eventHandlers.get(eventName);

          if (handlers && !handlers.includes(handler)) {
            handlers.push(handler);
          }
        }
        /**
         * 移除事件监听
         * @param eventName 事件名称
         * @param handler 事件处理器
         */


        off(eventName, handler) {
          var handlers = this.eventHandlers.get(eventName);

          if (handlers) {
            var index = handlers.indexOf(handler);

            if (index !== -1) {
              handlers.splice(index, 1);
            }
          }
        }
        /**
         * 移除特定事件的所有监听器
         * @param eventName 事件名称
         */


        offAll(eventName) {
          this.eventHandlers.delete(eventName);
        }
        /**
         * 创建错误对象
         * @param code 错误代码
         * @param message 错误消息
         * @param details 详细信息
         * @returns 错误对象
         */


        _createError(code, message, details) {
          return {
            code,
            message,
            details
          };
        }
        /**
         * 初始化Colyseus客户端
         * @returns 成功返回true，失败返回false
         */


        _initColyseusClient() {
          try {
            if (!this.colyseusClient) {
              console.log("[\u7F51\u7EDC] \u521D\u59CB\u5316 Colyseus \u5BA2\u6237\u7AEF\uFF0C\u670D\u52A1\u5668\u5730\u5740: " + this.serverUrl); // 获取Client构造函数，兼容不同的导出方式

              var ClientCtor;

              if (typeof ColyseusModule === "function") {
                // 情况A：ColyseusModule本身就是构造函数
                ClientCtor = ColyseusModule;
              } else if (ColyseusModule.Client) {
                // 情况B：ColyseusModule.Client存在
                ClientCtor = ColyseusModule.Client;
              } else if (ColyseusModule.default) {
                // 情况C：放在.default里
                ClientCtor = ColyseusModule.default.Client || ColyseusModule.default;
              } else {
                throw new Error("无法找到 Colyseus.Client 构造函数");
              } // 确保使用正确的协议和配置


              var serverUrl = this.serverUrl;
              console.log("[\u7F51\u7EDC] \u4F7F\u7528\u670D\u52A1\u5668\u5730\u5740: " + serverUrl); // 禁用 withCredentials，避免 CORS 错误

              this.colyseusClient = new ClientCtor(serverUrl, {
                headers: {},
                urlBuilder: null,
                // 添加自定义配置来禁用 withCredentials
                httpOptions: {
                  withCredentials: false,
                  // 添加重试和超时设置
                  retryCount: 3,
                  retryDelay: 1500,
                  timeout: 10000
                }
              });
            }

            return true;
          } catch (error) {
            console.error('[网络][错误] 初始化 Colyseus 客户端失败:', error);
            this._status = NetworkStatus.ERROR;
            this.emit('error', this._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '初始化客户端失败', error));
            return false;
          }
        }
        /**
         * 尝试下一个服务器URL
         * @returns 是否有下一个URL可尝试
         */


        _tryNextServerUrl() {
          if (this.currentServerUrlIndex < this.serverUrls.length - 1) {
            this.currentServerUrlIndex++;
            console.log("[\u7F51\u7EDC] \u5C1D\u8BD5\u4E0B\u4E00\u4E2A\u670D\u52A1\u5668\u5730\u5740: " + this.serverUrl);
            this.colyseusClient = null; // 重置客户端，强制重新初始化

            return true;
          }

          return false;
        }
        /**
         * 重置服务器URL索引到第一个
         */


        _resetServerUrlIndex() {
          this.currentServerUrlIndex = 0;
        }
        /**
         * 加入或创建骰子游戏房间
         * @param options 选项，如玩家名称、是否创建新房间、房间ID等
         * @returns Promise<Colyseus.Room<LiarDiceRoomState>>
         */


        joinLiarDiceRoom(options) {
          var _this = this;

          return _asyncToGenerator(function* () {
            // 1. 确保客户端已初始化
            if (!_this._initColyseusClient()) {
              throw _this._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '初始化客户端失败');
            } // 2. 如果已在房间中，先离开


            if (_this.colyseusRoom) {
              console.warn("[网络][警告] 已经在一个房间中，将先离开旧房间...");

              try {
                yield _this.leaveRoom();
              } catch (error) {
                console.error("[网络][错误] 离开旧房间失败:", error); // 继续尝试加入新房间
              }
            } // 3. 设置状态


            _this._status = NetworkStatus.JOINING_ROOM;

            _this.emit('statusChange', _this._status);

            try {
              console.log("[\u7F51\u7EDC] " + (options.create ? '创建' : '加入') + "\u623F\u95F4, \u73A9\u5BB6\u540D\u79F0: " + options.playerName + (options.roomId ? ', 房间ID: ' + options.roomId : '')); // 4. 根据选项决定是创建还是加入房间

              if (options.create) {
                // 创建新房间
                _this.colyseusRoom = yield _this.colyseusClient.create("liar_dice", {
                  playerName: options.playerName,
                  userId: (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                    error: Error()
                  }), LoginManager) : LoginManager).currentPlayerId // 传递用户ID

                });
              } else if (options.roomId) {
                // 加入指定ID的房间
                _this.colyseusRoom = yield _this.colyseusClient.joinById(options.roomId, {
                  playerName: options.playerName,
                  userId: (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                    error: Error()
                  }), LoginManager) : LoginManager).currentPlayerId
                });
              } else {
                // 加入任意可用房间，如果没有则创建
                _this.colyseusRoom = yield _this.colyseusClient.joinOrCreate("liar_dice", {
                  playerName: options.playerName,
                  userId: (_crd && LoginManager === void 0 ? (_reportPossibleCrUseOfLoginManager({
                    error: Error()
                  }), LoginManager) : LoginManager).currentPlayerId
                });
              } // 5. 设置房间相关信息


              _this._roomId = _this.colyseusRoom.roomId;
              _this._sessionId = _this.colyseusRoom.sessionId;
              _this._status = NetworkStatus.CONNECTED; // 6. 设置房间监听器

              _this._setupRoomListeners(); // 7. 触发连接成功事件


              _this.emit('connected', {
                roomId: _this._roomId,
                sessionId: _this._sessionId
              });

              _this.emit('statusChange', _this._status);

              console.log("[\u7F51\u7EDC] \u6210\u529F" + (options.create ? '创建' : '加入') + "\u623F\u95F4, ID: " + _this._roomId + ", \u4F1A\u8BDDID: " + _this._sessionId);
              return _this.colyseusRoom;
            } catch (error) {
              // 8. 处理连接错误
              console.error("[\u7F51\u7EDC][\u9519\u8BEF] " + (options.create ? '创建' : '加入') + "\u623F\u95F4\u5931\u8D25:", error); // 尝试下一个服务器地址

              if (_this._tryNextServerUrl()) {
                console.log('[网络] 尝试使用下一个服务器地址重新连接...');
                return _this.joinLiarDiceRoom(options);
              } // 重置服务器索引，以便下次从第一个开始尝试


              _this._resetServerUrlIndex(); // 设置错误状态


              _this._status = NetworkStatus.ERROR;

              _this.emit('statusChange', _this._status); // 根据错误类型创建具体错误


              var errorCode = NetworkErrorCode.ROOM_JOIN_ERROR;
              var errorMessage = '加入房间失败';

              if (error instanceof Error) {
                if (error.message.includes('not found')) {
                  errorCode = NetworkErrorCode.ROOM_NOT_FOUND;
                  errorMessage = '房间不存在';
                } else if (error.message.includes('full')) {
                  errorCode = NetworkErrorCode.ROOM_FULL;
                  errorMessage = '房间已满';
                } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
                  errorCode = NetworkErrorCode.CONNECTION_TIMEOUT;
                  errorMessage = '连接超时';
                }
              }

              var networkError = _this._createError(errorCode, errorMessage, error);

              _this.emit('error', networkError);

              throw networkError;
            }
          })();
        }
        /**
         * 离开当前房间
         */


        leaveRoom() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            if (_this2.colyseusRoom) {
              try {
                console.log("[\u7F51\u7EDC] \u79BB\u5F00\u623F\u95F4: " + _this2._roomId);
                yield _this2.colyseusRoom.leave();
              } catch (error) {
                console.error('[网络][错误] 离开房间时出错:', error);
              } finally {
                _this2._cleanupRoomConnection(NetworkErrorCode.CONNECTION_CLOSED);
              }
            } else {
              console.warn('[网络][警告] 尝试离开房间，但当前未在任何房间中');
            }
          })();
        }
        /**
         * 断开与服务器的连接
         */


        disconnect() {
          this.leaveRoom();

          if (this.colyseusClient) {
            console.log('[网络] 断开与服务器的连接'); // Colyseus.js 客户端没有显式的断开连接方法，离开房间即可

            this.colyseusClient = null;
          }

          this._status = NetworkStatus.DISCONNECTED;
          this.emit('statusChange', this._status);
          this.emit('disconnected');
        }
        /**
         * 向服务器发送消息
         * @param type 消息类型
         * @param payload 消息内容
         */


        send(type, payload) {
          if (!this.colyseusRoom) {
            console.error("[网络] 不在房间内，无法发送消息:", type);
            this.emit('error', this._createError(NetworkErrorCode.CONNECTION_CLOSED, '不在房间内，无法发送消息'));
            return;
          }

          try {
            console.log("[\u7F51\u7EDC] \u53D1\u9001\u6D88\u606F: " + type, payload);
            this.colyseusRoom.send(type, payload);
          } catch (error) {
            console.error("[\u7F51\u7EDC][\u9519\u8BEF] \u53D1\u9001\u6D88\u606F " + type + " \u5931\u8D25:", error);
            this.emit('error', this._createError(NetworkErrorCode.CONNECTION_ERROR, '发送消息失败', error));
          }
        }
        /**
         * 初始化客户端
         * @private
         * @returns 是否初始化成功
         */


        _initClient() {
          return this._initColyseusClient();
        } // 已删除重复的 getAvailableRooms 方法，使用下面的实现

        /**
         * 设置房间监听器
         */


        _setupRoomListeners() {
          if (!this.colyseusRoom) {
            console.error('[网络] 无法设置房间监听器：房间未初始化');
            return;
          }

          console.log("[\u7F51\u7EDC][" + this.colyseusRoom.roomId + "] \u8BBE\u7F6E\u623F\u95F4\u76D1\u542C\u5668...");

          try {
            // 尝试访问state，如果出错则说明Schema版本不兼容
            var stateTest = this.colyseusRoom.state;
            console.log("[\u7F51\u7EDC] \u623F\u95F4\u72B6\u6001\u7C7B\u578B: " + (stateTest ? typeof stateTest : 'undefined')); // 监听房间状态变化

            this.colyseusRoom.onStateChange(state => {
              try {
                // 将服务器的Schema状态转换为客户端可用的普通对象
                var clientState = this._convertSchemaToClientState(state);

                this._lastState = clientState;
                this.emit('stateChange', clientState);
              } catch (error) {
                console.error('[网络] 处理状态变化时出错:', error);
              }
            }); // 监听房间错误

            this.colyseusRoom.onError((code, message) => {
              console.error("[\u7F51\u7EDC][\u9519\u8BEF] \u623F\u95F4\u9519\u8BEF: " + code + " - " + message);
              this.emit('error', this._createError(NetworkErrorCode.SERVER_ERROR, message || '服务器错误', {
                code
              }));
            }); // 监听房间离开事件

            this.colyseusRoom.onLeave(code => {
              console.log("[\u7F51\u7EDC] \u79BB\u5F00\u623F\u95F4\uFF0C\u4EE3\u7801: " + code);

              this._cleanupRoomConnection(code);
            }); // 监听所有消息

            this.colyseusRoom.onMessage("*", data => {
              try {
                // 从数据中提取类型和消息
                var {
                  type,
                  message
                } = data;
                var eventType = String(type);
                console.log("[\u7F51\u7EDC] \u6536\u5230\u6D88\u606F: " + eventType, message); // 触发对应类型的事件

                this.emit(eventType, message); // 同时触发通用消息事件

                this.emit('message', {
                  type: eventType,
                  message
                });
              } catch (error) {
                console.error('[网络] 处理消息时出错:', error);
              }
            }); // 尝试安全地处理初始玩家列表

            this._safelyProcessInitialPlayers(); // 使用 onStateChange 来监听玩家变化


            this.colyseusRoom.onStateChange(state => {
              try {
                this._safelyProcessPlayerChanges(state);
              } catch (error) {
                console.error('[网络] 处理玩家变化时出错:', error);
              }
            });
          } catch (error) {
            console.error('[网络] 设置房间监听器时出错:', error); // 尝试基本的错误恢复

            this.emit('error', this._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '设置房间监听器失败，可能是Schema版本不兼容', {
              originalError: error
            }));
          }
        }
        /**
         * 安全地处理初始玩家列表
         * @private
         */


        _safelyProcessInitialPlayers() {
          try {
            if (!this.colyseusRoom || !this.colyseusRoom.state) return; // 尝试多种方式访问玩家列表

            var state = this.colyseusRoom.state; // 方法1: 使用forEach (如果是MapSchema)

            if (state.players && typeof state.players.forEach === 'function') {
              state.players.forEach((player, sessionId) => {
                try {
                  var playerData = this._extractPlayerData(player);

                  console.log("[\u7F51\u7EDC] \u521D\u59CB\u73A9\u5BB6: " + playerData.name + " (" + sessionId + ")");
                  this.emit('playerJoin', {
                    player: playerData,
                    sessionId
                  });
                } catch (e) {
                  console.error("[\u7F51\u7EDC] \u5904\u7406\u73A9\u5BB6\u6570\u636E\u65F6\u51FA\u9519:", e);
                }
              });
              return;
            } // 方法2: 尝试作为普通对象处理


            if (state.players && typeof state.players === 'object') {
              Object.keys(state.players).forEach(sessionId => {
                try {
                  var player = state.players[sessionId];

                  var playerData = this._extractPlayerData(player);

                  console.log("[\u7F51\u7EDC] \u521D\u59CB\u73A9\u5BB6(\u5BF9\u8C61\u6A21\u5F0F): " + playerData.name + " (" + sessionId + ")");
                  this.emit('playerJoin', {
                    player: playerData,
                    sessionId
                  });
                } catch (e) {
                  console.error("[\u7F51\u7EDC] \u5904\u7406\u73A9\u5BB6\u6570\u636E\u65F6\u51FA\u9519:", e);
                }
              });
              return;
            }

            console.log("[\u7F51\u7EDC] \u65E0\u6CD5\u904D\u5386\u73A9\u5BB6\u5217\u8868\uFF0C\u53EF\u80FD\u662F Schema \u7248\u672C\u4E0D\u517C\u5BB9");
          } catch (error) {
            console.error('[网络] 处理初始玩家列表时出错:', error);
          }
        }
        /**
         * 安全地处理玩家变化
         * @param state 服务器状态
         * @private
         */


        _safelyProcessPlayerChanges(state) {
          if (!state || !this._lastState) return;

          try {
            // 将服务器状态转换为客户端可用的格式
            var clientState = this._convertSchemaToClientState(state); // 处理玩家加入和状态变化


            if (clientState.players) {
              Object.entries(clientState.players).forEach(_ref => {
                var _this$_lastState;

                var [sessionId, player] = _ref;
                var previousPlayers = (_this$_lastState = this._lastState) == null ? void 0 : _this$_lastState.players;
                var previousPlayer = null; // 尝试获取之前的玩家数据

                if (previousPlayers instanceof Map) {
                  previousPlayer = previousPlayers.get(sessionId);
                } else if (previousPlayers && typeof previousPlayers === 'object') {
                  previousPlayer = previousPlayers[sessionId];
                }

                if (!previousPlayer) {
                  // 新玩家加入
                  console.log("[\u7F51\u7EDC] \u73A9\u5BB6\u52A0\u5165: " + player.name + " (" + sessionId + ")");
                  this.emit('playerJoin', {
                    player,
                    sessionId
                  });
                } else if (JSON.stringify(previousPlayer) !== JSON.stringify(player)) {
                  // 玩家状态变化
                  console.log("[\u7F51\u7EDC] \u73A9\u5BB6 " + player.name + " (" + sessionId + ") \u72B6\u6001\u53D8\u5316");
                  this.emit('playerChange', {
                    player,
                    sessionId
                  });
                }
              });
            } // 处理玩家离开


            if (this._lastState.players) {
              // 获取上一个状态的玩家列表
              var lastPlayers = this._lastState.players instanceof Map ? Array.from(this._lastState.players.entries()) : Object.entries(this._lastState.players); // 遍历玩家列表，使用类型断言确保类型安全

              lastPlayers.forEach(entry => {
                var sessionId = entry[0];
                var player = entry[1];
                var currentPlayers = clientState.players;
                var playerExists = false; // 检查玩家是否还存在

                if (currentPlayers instanceof Map) {
                  playerExists = currentPlayers.has(sessionId);
                } else if (currentPlayers && typeof currentPlayers === 'object') {
                  playerExists = sessionId in currentPlayers;
                }

                if (!playerExists) {
                  // 玩家离开
                  console.log("[\u7F51\u7EDC] \u73A9\u5BB6\u79BB\u5F00: " + player.name + " (" + sessionId + ")");
                  this.emit('playerLeave', {
                    player: player,
                    sessionId
                  });
                }
              });
            }

            this._lastState = clientState;
          } catch (error) {
            console.error('[网络] 处理玩家变化时出错:', error);
          }
        }

        _convertSchemaToClientState(state) {
          if (!state) return new (_crd && LiarDiceRoomState === void 0 ? (_reportPossibleCrUseOfLiarDiceRoomState({
            error: Error()
          }), LiarDiceRoomState) : LiarDiceRoomState)();

          try {
            // 创建新的客户端状态对象
            var clientState = new (_crd && LiarDiceRoomState === void 0 ? (_reportPossibleCrUseOfLiarDiceRoomState({
              error: Error()
            }), LiarDiceRoomState) : LiarDiceRoomState)(); // 复制基本属性

            if (state.activePlayerIds) {
              clientState.activePlayerIds = this._extractArrayData(state.activePlayerIds);
            }

            clientState.currentPlayerIndex = this._getNumberProperty(state, 'currentPlayerIndex', 0);
            clientState.currentBidValue = this._getNumberProperty(state, 'currentBidValue', 0);
            clientState.currentBidCount = this._getNumberProperty(state, 'currentBidCount', 0);
            clientState.lastBidderSessionId = this._getStringProperty(state, 'lastBidderSessionId', '');
            clientState.status = this._getStringProperty(state, 'status', 'waiting');
            clientState.hostId = this._getStringProperty(state, 'hostId', '');
            clientState.roundNumber = this._getNumberProperty(state, 'roundNumber', 0);
            clientState.moveNumber = this._getNumberProperty(state, 'moveNumber', 0);
            clientState.roundResult = this._getStringProperty(state, 'roundResult', '');
            clientState.isOneCalledThisRound = this._getBooleanProperty(state, 'isOneCalledThisRound', false); // 处理玩家列表

            if (state.players) {
              // 如果是MapSchema，使用forEach
              if (typeof state.players.forEach === 'function') {
                state.players.forEach((player, sessionId) => {
                  var playerData = this._extractPlayerData(player);

                  clientState.players.set(sessionId, playerData);
                });
              } // 如果是普通对象，使用Object.entries
              else if (typeof state.players === 'object') {
                Object.entries(state.players).forEach(_ref2 => {
                  var [sessionId, player] = _ref2;

                  var playerData = this._extractPlayerData(player);

                  clientState.players.set(sessionId, playerData);
                });
              }
            }

            return clientState;
          } catch (error) {
            console.error('[网络] 转换Schema状态时出错:', error);
            return new (_crd && LiarDiceRoomState === void 0 ? (_reportPossibleCrUseOfLiarDiceRoomState({
              error: Error()
            }), LiarDiceRoomState) : LiarDiceRoomState)();
          }
        }
        /**
         * 提取玩家数据
         * @param player 服务器玩家数据
         * @returns 客户端玩家数据
         * @private
         */


        _extractPlayerData(player) {
          var playerData = new (_crd && PlayerState === void 0 ? (_reportPossibleCrUseOfPlayerState({
            error: Error()
          }), PlayerState) : PlayerState)();
          if (!player) return playerData;

          try {
            // 复制基本属性
            playerData.id = this._getStringProperty(player, 'id', '');
            playerData.sessionId = this._getStringProperty(player, 'sessionId', '');
            playerData.name = this._getStringProperty(player, 'name', '');
            playerData.diceCount = this._getNumberProperty(player, 'diceCount', 0);
            playerData.isReady = this._getBooleanProperty(player, 'isReady', false);
            playerData.isConnected = this._getBooleanProperty(player, 'isConnected', true);
            playerData.isAI = this._getBooleanProperty(player, 'isAI', false);
            playerData.aiType = this._getStringProperty(player, 'aiType', ''); // 如果有骰子数据，也复制过来

            if (player.currentDices) {
              playerData.currentDices = this._extractArrayData(player.currentDices);
            }
          } catch (error) {
            console.error('[网络] 提取玩家数据时出错:', error);
          }

          return playerData;
        }
        /**
         * 安全地提取数组数据
         * @param arr 数组或ArraySchema
         * @returns 普通数组
         * @private
         */


        _extractArrayData(arr) {
          if (!arr) return [];

          try {
            // 如果是ArraySchema，使用toArray方法
            if (typeof arr.toArray === 'function') {
              return arr.toArray();
            } // 如果是普通数组，直接返回


            if (Array.isArray(arr)) {
              return [...arr];
            } // 如果是类数组对象，转换为数组


            if (typeof arr.forEach === 'function') {
              var result = [];
              arr.forEach(item => result.push(item));
              return result;
            } // 如果是普通对象，尝试转换为数组


            if (typeof arr === 'object') {
              return Object.values(arr);
            }
          } catch (error) {
            console.error('[网络] 提取数组数据时出错:', error);
          }

          return [];
        }
        /**
         * 安全地获取字符串属性
         * @param obj 对象
         * @param prop 属性名
         * @param defaultValue 默认值
         * @returns 字符串值
         * @private
         */


        _getStringProperty(obj, prop, defaultValue) {
          if (defaultValue === void 0) {
            defaultValue = '';
          }

          if (!obj) return defaultValue;

          try {
            // 尝试直接访问
            if (obj[prop] !== undefined) {
              return String(obj[prop]);
            } // 尝试通过getter访问


            if (typeof obj.get === 'function') {
              var value = obj.get(prop);

              if (value !== undefined) {
                return String(value);
              }
            }
          } catch (error) {// 忽略错误，返回默认值
          }

          return defaultValue;
        }
        /**
         * 安全地获取数字属性
         * @param obj 对象
         * @param prop 属性名
         * @param defaultValue 默认值
         * @returns 数字值
         * @private
         */


        _getNumberProperty(obj, prop, defaultValue) {
          if (defaultValue === void 0) {
            defaultValue = 0;
          }

          if (!obj) return defaultValue;

          try {
            // 尝试直接访问
            if (obj[prop] !== undefined) {
              var num = Number(obj[prop]);
              return isNaN(num) ? defaultValue : num;
            } // 尝试通过getter访问


            if (typeof obj.get === 'function') {
              var value = obj.get(prop);

              if (value !== undefined) {
                var _num = Number(value);

                return isNaN(_num) ? defaultValue : _num;
              }
            }
          } catch (error) {// 忽略错误，返回默认值
          }

          return defaultValue;
        }
        /**
         * 安全地获取布尔属性
         * @param obj 对象
         * @param prop 属性名
         * @param defaultValue 默认值
         * @returns 布尔值
         * @private
         */


        _getBooleanProperty(obj, prop, defaultValue) {
          if (defaultValue === void 0) {
            defaultValue = false;
          }

          if (!obj) return defaultValue;

          try {
            // 尝试直接访问
            if (obj[prop] !== undefined) {
              return Boolean(obj[prop]);
            } // 尝试通过getter访问


            if (typeof obj.get === 'function') {
              var value = obj.get(prop);

              if (value !== undefined) {
                return Boolean(value);
              }
            }
          } catch (error) {// 忽略错误，返回默认值
          }

          return defaultValue;
        }
        /**
         * 清理房间连接相关状态并触发断开连接事件
         * @param code 断开连接的代码
         */


        _cleanupRoomConnection(code) {
          if (!this.colyseusRoom && this._status === NetworkStatus.DISCONNECTED) {
            return; // 避免重复清理
          } // 记录之前的房间ID，用于日志


          var prevRoomId = this._roomId; // 重置房间相关状态

          this.colyseusRoom = null;
          this._roomId = '';
          this._sessionId = '';
          this._lastState = null;
          this._status = NetworkStatus.DISCONNECTED; // 触发状态变化和断开连接事件

          console.log("[\u7F51\u7EDC] \u623F\u95F4\u8FDE\u63A5\u5DF2\u6E05\u7406: " + prevRoomId);
          this.emit('statusChange', this._status);
          this.emit('roomDisconnected', {
            code,
            roomId: prevRoomId
          });
        }
        /**
         * 获取可用房间列表
         * @param roomName 可选的房间名称过滤
         * @returns Promise<RoomAvailable[]>
         */


        getAvailableRooms(roomName) {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            if (!_this3._initColyseusClient()) {
              throw _this3._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '初始化客户端失败');
            }

            try {
              console.log('[网络] 获取可用房间列表...'); // 构造正确的HTTP URL，而不是WebSocket URL

              var httpUrl = _this3.serverUrl.replace('ws://', 'http://').replace('wss://', 'https://');

              var path = roomName ? "/rooms/" + roomName : '/rooms';
              console.log("[\u7F51\u7EDC] \u8BF7\u6C42\u623F\u95F4\u5217\u8868URL: " + httpUrl + path); // 使用正确的HTTP URL请求

              var response = yield _this3.colyseusClient.http.get(path); // 处理响应数据，确保返回数组

              var rooms = Array.isArray(response) ? response : [];
              console.log("[\u7F51\u7EDC] \u627E\u5230 " + rooms.length + " \u4E2A\u53EF\u7528\u623F\u95F4");
              return rooms;
            } catch (error) {
              console.error('[网络][错误] 获取可用房间列表失败:', error); // 尝试下一个服务器地址

              if (_this3._tryNextServerUrl()) {
                console.log('[网络] 尝试使用下一个服务器地址重新获取房间列表...'); // 重置客户端并重试

                _this3.colyseusClient = null;

                _this3._initColyseusClient();

                return _this3.getAvailableRooms(roomName);
              } // 重置服务器索引，以便下次从第一个开始尝试


              _this3._resetServerUrlIndex();

              var networkError = _this3._createError(NetworkErrorCode.CONNECTION_ERROR, '获取可用房间列表失败', error);

              _this3.emit('error', networkError);

              throw networkError;
            }
          })();
        }
        /**
         * 重新连接到之前的房间
         * @param sessionId 之前的会话ID
         * @param roomId 之前的房间ID
         * @returns Promise<boolean> 是否重连成功
         */


        reconnect(sessionId, roomId) {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            if (!sessionId || !roomId) {
              console.error('[网络][错误] 重连失败: 缺少会话ID或房间ID');
              return false;
            }

            if (!_this4._initColyseusClient()) {
              return false;
            }

            _this4._status = NetworkStatus.RECONNECTING;

            _this4.emit('statusChange', _this4._status);

            try {
              console.log("[\u7F51\u7EDC] \u5C1D\u8BD5\u91CD\u8FDE\u5230\u623F\u95F4: " + roomId + ", \u4F1A\u8BDDID: " + sessionId); // Colyseus.js 客户端可能没有直接的 reconnect 方法
              // 我们使用 joinById 来模拟重连

              _this4.colyseusRoom = yield _this4.colyseusClient.joinById(roomId, {
                sessionId: sessionId,
                reconnect: true
              });
              _this4._roomId = _this4.colyseusRoom.roomId;
              _this4._sessionId = _this4.colyseusRoom.sessionId;
              _this4._status = NetworkStatus.CONNECTED;

              _this4._setupRoomListeners();

              _this4.emit('reconnected', {
                roomId: _this4._roomId,
                sessionId: _this4._sessionId
              });

              _this4.emit('statusChange', _this4._status);

              console.log("[\u7F51\u7EDC] \u91CD\u8FDE\u6210\u529F, \u623F\u95F4ID: " + _this4._roomId + ", \u4F1A\u8BDDID: " + _this4._sessionId);
              return true;
            } catch (error) {
              console.error('[网络][错误] 重连失败:', error); // 尝试下一个服务器地址

              if (_this4._tryNextServerUrl()) {
                console.log('[网络] 尝试使用下一个服务器地址重新重连...');
                return _this4.reconnect(sessionId, roomId);
              } // 重置服务器索引，以便下次从第一个开始尝试


              _this4._resetServerUrlIndex();

              _this4._status = NetworkStatus.ERROR;

              _this4.emit('statusChange', _this4._status);

              var networkError = _this4._createError(NetworkErrorCode.CONNECTION_ERROR, '重连失败', error);

              _this4.emit('error', networkError);

              return false;
            }
          })();
        }

      });

      NetworkManager.instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a142dfa950effff018b46e864ecd5b31c95ca035.js.map