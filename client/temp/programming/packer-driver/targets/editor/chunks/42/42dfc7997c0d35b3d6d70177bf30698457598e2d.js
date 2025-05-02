System.register(["cc", "__unresolved_0"], function (_export, _context) {
  "use strict";

  var _cclegacy, ColyseusImport, Client, Room, _crd, ColyseusLib, Schema, type, MapSchema, ArraySchema;

  // 辅助函数：将Room状态转换为强类型对象
  function castRoomState(state) {
    if (!state) {
      console.warn('[网络][警告] 尝试转换空状态');
      return {};
    }

    try {
      // 添加类型转换的调试信息
      console.log('[网络][调试] 转换房间状态类型');
      return state;
    } catch (e) {
      console.error('[网络][错误] 转换房间状态类型失败:', e);
      return {};
    }
  }

  _export({
    Client: void 0,
    Room: void 0,
    castRoomState: castRoomState
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_) {
      ColyseusImport = _unresolved_;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "55a624HKHFK9Ia2q7+pfCFi", "colyseus-browser", undefined);
      /**
       * colyseus-browser.ts
       * Cocos Creator客户端使用的Colyseus适配器和类型声明
       * 使用官方推荐的导入方式
       */
      // @ts-ignore - 忽略类型检查，因为这是一个 JavaScript 文件


      // 使用导入的 Colyseus
      ColyseusLib = ColyseusImport.default || ColyseusImport; // 检查必要的 API 是否存在

      if (!ColyseusLib.Client) {
        console.error('[Colyseus] ColyseusLib.Client 不存在');
      }

      if (!ColyseusLib.Schema) {
        console.error('[Colyseus] ColyseusLib.Schema 不存在');
      }

      if (!ColyseusLib.schema || !ColyseusLib.schema.type) {
        console.error('[Colyseus] ColyseusLib.schema.type 不存在');
      } // 导出 Schema 相关类和装饰器


      _export("Schema", Schema = ColyseusLib.Schema);

      _export("type", type = ColyseusLib.schema ? ColyseusLib.schema.type : undefined);

      _export("MapSchema", MapSchema = ColyseusLib.MapSchema);

      _export("ArraySchema", ArraySchema = ColyseusLib.ArraySchema); // 导出其他必要的类型


      // 客户端类 - 使用导入的 Colyseus 模块
      _export("Client", Client = class Client {
        constructor(endpoint) {
          this.originalClient = void 0;

          try {
            if (!ColyseusLib || !ColyseusLib.Client) {
              console.error('[网络][错误] Colyseus模块不存在或无效，请确保 colyseus-cocos-creator.js 已正确加载');
              throw new Error('Colyseus模块不存在或无效');
            }

            this.originalClient = new ColyseusLib.Client(endpoint);
            console.log(`[网络][信息] Colyseus客户端初始化成功: ${endpoint}`);
          } catch (error) {
            console.error('[网络][错误] Colyseus客户端初始化失败:', error);
            throw error;
          }
        } // 加入或创建房间


        async joinOrCreate(roomName, options) {
          try {
            console.log(`[网络][信息] 加入或创建房间: ${roomName}`, options);
            const colyseusRoom = await this.originalClient.joinOrCreate(roomName, options);
            return new Room(colyseusRoom);
          } catch (error) {
            console.error(`[网络][错误] 加入或创建房间失败: ${roomName}`, error); // 增强错误信息

            if (error instanceof Error) {
              const enhancedError = new Error(`加入或创建房间失败: ${error.message}`);
              enhancedError.stack = error.stack;
              throw enhancedError;
            }

            throw error;
          }
        } // 通过ID加入房间


        async joinById(roomId, options) {
          try {
            console.log(`[网络][信息] 加入指定房间ID: ${roomId}`, options);
            const colyseusRoom = await this.originalClient.joinById(roomId, options);
            return new Room(colyseusRoom);
          } catch (error) {
            console.error(`[网络][错误] 加入指定房间失败: ${roomId}`, error); // 增强错误信息

            if (error instanceof Error) {
              const enhancedError = new Error(`加入指定房间失败: ${error.message}`);
              enhancedError.stack = error.stack;
              throw enhancedError;
            }

            throw error;
          }
        } // 创建房间


        async create(roomName, options) {
          try {
            console.log(`[网络][信息] 创建新房间: ${roomName}`, options);
            const colyseusRoom = await this.originalClient.create(roomName, options);
            return new Room(colyseusRoom);
          } catch (error) {
            console.error(`[网络][错误] 创建新房间失败: ${roomName}`, error); // 增强错误信息

            if (error instanceof Error) {
              const enhancedError = new Error(`创建新房间失败: ${error.message}`);
              enhancedError.stack = error.stack;
              throw enhancedError;
            }

            throw error;
          }
        } // 获取可用房间列表


        async getAvailableRooms(roomName) {
          try {
            console.log(`[网络][信息] 获取可用房间列表: ${roomName}`);
            const rooms = await this.originalClient.getAvailableRooms(roomName);
            console.log(`[网络][信息] 获取到 ${rooms.length} 个可用房间`);
            return rooms;
          } catch (error) {
            console.error(`[网络][错误] 获取可用房间列表失败: ${roomName}`, error); // 出错时返回空数组

            return [];
          }
        }

      }); // 房间类 - 包装Colyseus.Room


      _export("Room", Room = class Room {
        constructor(originalRoom) {
          this.originalRoom = void 0;
          this.originalRoom = originalRoom;
          console.log(`[网络][调试] 创建房间包装器，原始房间:`, {
            id: originalRoom == null ? void 0 : originalRoom.id,
            roomId: originalRoom == null ? void 0 : originalRoom.roomId,
            name: originalRoom == null ? void 0 : originalRoom.name,
            sessionId: originalRoom == null ? void 0 : originalRoom.sessionId,
            hasState: !!(originalRoom != null && originalRoom.state)
          }); // 添加额外的错误处理

          if (!originalRoom) {
            console.error('[网络][错误] 创建房间包装器失败: 原始房间对象为空');
          }
        } // 获取房间ID


        get id() {
          var _this$originalRoom;

          return ((_this$originalRoom = this.originalRoom) == null ? void 0 : _this$originalRoom.id) || '';
        } // 获取房间ID


        get roomId() {
          var _this$originalRoom2;

          return ((_this$originalRoom2 = this.originalRoom) == null ? void 0 : _this$originalRoom2.roomId) || '';
        } // 获取房间名称


        get name() {
          var _this$originalRoom3;

          return ((_this$originalRoom3 = this.originalRoom) == null ? void 0 : _this$originalRoom3.name) || '';
        } // 获取会话 ID


        get sessionId() {
          var _this$originalRoom4;

          return ((_this$originalRoom4 = this.originalRoom) == null ? void 0 : _this$originalRoom4.sessionId) || '';
        } // 获取房间状态


        get state() {
          // 添加调试日志
          if (!this.originalRoom) {
            console.warn('[网络][警告] 原始房间对象为空');
            return {};
          }

          if (!this.originalRoom.state) {
            console.warn('[网络][警告] 房间状态为空或未定义');
            return {};
          }

          try {
            // 安全地获取状态信息
            const stateInfo = {
              hasPlayers: !!this.originalRoom.state.players,
              playerCount: 0,
              hostId: this.originalRoom.state.hostId || '未设置',
              status: this.originalRoom.state.status || '未知'
            }; // 安全地获取玩家数量

            if (this.originalRoom.state.players) {
              // 检查 players 对象类型
              if (typeof this.originalRoom.state.players === 'object') {
                // 处理 MapSchema 类型
                if (typeof this.originalRoom.state.players.size === 'number') {
                  stateInfo.playerCount = this.originalRoom.state.players.size;
                } // 处理普通对象类型
                else if (this.originalRoom.state.players.constructor === Object) {
                  stateInfo.playerCount = Object.keys(this.originalRoom.state.players).length;
                } // 处理数组类型
                else if (Array.isArray(this.originalRoom.state.players)) {
                  stateInfo.playerCount = this.originalRoom.state.players.length;
                }
              }
            }

            console.log(`[网络][调试] 获取房间状态:`, stateInfo); // 检查并修复 players 对象，确保它可以被正确处理

            if (this.originalRoom.state.players) {
              var _this$originalRoom$st;

              // 记录 players 对象的类型信息，用于调试
              console.log(`[网络][调试] players 类型: ${typeof this.originalRoom.state.players}, 构造函数: ${((_this$originalRoom$st = this.originalRoom.state.players.constructor) == null ? void 0 : _this$originalRoom$st.name) || '未知'}`); // 如果 players 是 MapSchema 但缺少必要的方法，尝试转换为普通对象

              if (typeof this.originalRoom.state.players === 'object' && this.originalRoom.state.players.constructor.name !== 'Object' && typeof this.originalRoom.state.players.forEach === 'function') {
                // 添加调试日志，记录转换前的状态
                console.log('[网络][调试] 尝试将 MapSchema 转换为普通对象以兼容处理');

                try {
                  // 创建一个临时对象来存储转换后的 players
                  const tempPlayers = {}; // 使用 forEach 方法遍历 MapSchema

                  this.originalRoom.state.players.forEach((value, key) => {
                    tempPlayers[key] = value;
                  }); // 为原始 players 对象添加一些辅助方法，以便客户端代码能正确处理

                  if (typeof this.originalRoom.state.players.entries !== 'function') {
                    this.originalRoom.state.players.entries = function () {
                      return Object.entries(tempPlayers);
                    };
                  }

                  if (typeof this.originalRoom.state.players.keys !== 'function') {
                    this.originalRoom.state.players.keys = function () {
                      return Object.keys(tempPlayers);
                    };
                  }

                  console.log('[网络][调试] MapSchema 转换成功');
                } catch (e) {
                  console.error('[网络][错误] 转换 MapSchema 时出错:', e);
                }
              }
            } // 安全返回状态


            return this.originalRoom.state;
          } catch (e) {
            console.error('[网络][错误] 处理房间状态时出错:', e);
            return {};
          }
        } // 监听状态变化


        onStateChange(callback) {
          if (!this.originalRoom) {
            console.error('[网络][错误] 无法监听状态变化: 原始房间对象为空');
            return;
          }

          try {
            // 包装回调以添加错误处理
            const safeCallback = state => {
              try {
                callback(state);
              } catch (e) {
                console.error('[网络][错误] 状态变化回调执行出错:', e);
              }
            };

            this.originalRoom.onStateChange(safeCallback);
            console.log('[网络][信息] 已注册状态变化监听器');
          } catch (e) {
            console.error('[网络][错误] 注册状态变化监听器失败:', e);
          }
        } // 监听消息


        onMessage(type, callback) {
          if (!this.originalRoom) {
            console.error(`[网络][错误] 无法监听消息 ${type}: 原始房间对象为空`);
            return;
          }

          try {
            // 包装回调以添加错误处理
            const safeCallback = message => {
              try {
                callback(message);
              } catch (e) {
                console.error(`[网络][错误] 消息 ${type} 回调执行出错:`, e);
              }
            };

            this.originalRoom.onMessage(type, safeCallback);
            console.log(`[网络][信息] 已注册消息 ${type} 监听器`);
          } catch (e) {
            console.error(`[网络][错误] 注册消息 ${type} 监听器失败:`, e);
          }
        } // 监听错误


        onError(callback) {
          if (!this.originalRoom) {
            console.error('[网络][错误] 无法监听错误: 原始房间对象为空');
            return;
          }

          try {
            // 包装回调以添加错误处理
            const safeCallback = error => {
              try {
                console.error('[网络][错误] 房间发生错误:', error);
                callback(error);
              } catch (e) {
                console.error('[网络][错误] 错误回调执行出错:', e);
              }
            };

            this.originalRoom.onError(safeCallback);
            console.log('[网络][信息] 已注册错误监听器');
          } catch (e) {
            console.error('[网络][错误] 注册错误监听器失败:', e);
          }
        } // 监听离开房间


        onLeave(callback) {
          if (!this.originalRoom) {
            console.error('[网络][错误] 无法监听离开房间: 原始房间对象为空');
            return;
          }

          try {
            // 包装回调以添加错误处理
            const safeCallback = code => {
              try {
                console.log(`[网络][信息] 离开房间，代码: ${code}`);
                callback(code);
              } catch (e) {
                console.error('[网络][错误] 离开房间回调执行出错:', e);
              }
            };

            this.originalRoom.onLeave(safeCallback);
            console.log('[网络][信息] 已注册离开房间监听器');
          } catch (e) {
            console.error('[网络][错误] 注册离开房间监听器失败:', e);
          }
        } // 发送消息


        send(type, message) {
          if (!this.originalRoom) {
            console.error(`[网络][错误] 无法发送消息 ${type}: 原始房间对象为空`);
            return;
          }

          try {
            this.originalRoom.send(type, message);
            console.log(`[网络][信息] 发送消息: ${type}`, message);
          } catch (e) {
            console.error(`[网络][错误] 发送消息 ${type} 失败:`, e);
          }
        } // 离开房间


        leave(consented = true) {
          if (!this.originalRoom) {
            console.error('[网络][错误] 无法离开房间: 原始房间对象为空');
            return;
          }

          try {
            this.originalRoom.leave(consented);
            console.log('[网络][信息] 离开房间请求已发送');
          } catch (e) {
            console.error('[网络][错误] 离开房间失败:', e);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=42dfc7997c0d35b3d6d70177bf30698457598e2d.js.map