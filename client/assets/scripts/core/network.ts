// import { io, Socket } from "socket.io-client";
import { ChatMessage, Room } from "../../../../shared/protocols/room-protocol";
import { Face, Bid } from "../../../../shared/protocols/game-types.d";
import { SocketAdapter } from "./socket-adapter";

/**
 * 网络管理器错误类型定义
 */
export enum NetworkErrorCode {
    CONNECTION_ERROR = 1001,
    CONNECTION_TIMEOUT = 1002,
    CONNECTION_CLOSED = 1003,
    REQUEST_TIMEOUT = 1004,
    SERVER_ERROR = 1005,
    INVALID_RESPONSE = 1006,
    ROOM_NOT_FOUND = 2001,
    ROOM_FULL = 2002,
    PLAYER_NOT_FOUND = 3001,
    GAME_NOT_FOUND = 4001,
    GAME_ALREADY_STARTED = 4002,
    INVALID_BID = 4003,
    NOT_YOUR_TURN = 4004,
    UNKNOWN_ERROR = 9999
}

/**
 * 网络错误详情
 */
export interface NetworkError {
    code: NetworkErrorCode;
    message: string;
    details?: any;
}

/**
 * 网络状态类型
 */
export enum NetworkStatus {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting'
}

/**
 * 网络连接状态
 */
export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error"
}

/**
 * 网络管理器类
 */
export class NetworkManager {
  private static instance: NetworkManager;
  // private socket: Socket | null = null;
  private serverUrl: string = "http://localhost:3000";
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectTimeout: number = 5000; // 毫秒
  private eventHandlers: Map<string, Array<(data?: any) => void>> = new Map();
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private _status: NetworkStatus = NetworkStatus.DISCONNECTED;
  private autoReconnect: boolean = true;
  private retryCount: number = 0;
  private MAX_RETRIES: number = 5;
  private requestId: number = 0;
  private pendingRequests: Map<string, { 
      resolve: (value: any) => void, 
      reject: (error: NetworkError) => void,
      timer: number
  }> = new Map();
  
  // 新增属性
  private _roomId: string = '';
  private _playerId: string = '';
  private _room: Room | null = null;
  private _gameId: string = '';

  /**
   * 获取单例实例
   * @returns NetworkManager实例
   */
  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  /**
   * 获取当前连接状态
   * @returns 连接状态
   */
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * 连接到服务器
   * @returns Promise
   */
  public connect(): Promise<void> {
    // 如果已经连接，直接返回成功
    if (this.connectionStatus === ConnectionStatus.CONNECTED) {
      return Promise.resolve();
    }

    // 设置连接中状态
    this.connectionStatus = ConnectionStatus.CONNECTING;
    this._status = NetworkStatus.CONNECTING;
    this.emit('connecting');
    
    console.log("[网络][信息] 正在连接到服务器:", this.serverUrl);

    // 创建Socket连接
    return SocketAdapter.connect(this.serverUrl, {
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: this.reconnectTimeout,
      transports: ["websocket", "polling"] // 添加polling作为备选传输方式
    })
    .then(() => {
      console.log("[网络][信息] 连接成功");
      this.connectionStatus = ConnectionStatus.CONNECTED;
      this._status = NetworkStatus.CONNECTED;
      this.emit('connected');
      this.reconnectAttempts = 0;

      // 设置socket事件监听
      SocketAdapter.on('disconnect', () => {
        console.log("[网络][信息] 连接断开");
        this.connectionStatus = ConnectionStatus.DISCONNECTED;
        this._status = NetworkStatus.DISCONNECTED;
        this.emit('disconnected');
      });

      SocketAdapter.on('connect_error', (error: Error) => {
        console.error("[网络][错误] 连接错误:", error);
        this.connectionStatus = ConnectionStatus.ERROR;
        this._status = NetworkStatus.DISCONNECTED;
        this.emit('connectionError', error);
      });

      // 业务事件监听
      this.setupBusinessEvents();
    })
    .catch((error) => {
      console.error("[网络][错误] 连接失败:", error);
      this.connectionStatus = ConnectionStatus.ERROR;
      this._status = NetworkStatus.DISCONNECTED;
      this.emit('connectionError', error);
      
      // 尝试重连
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[网络][信息] 尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        
        setTimeout(() => {
          this.connect();
        }, this.reconnectTimeout);
      }
      
      throw error;
    });
  }

  /**
   * 设置业务事件监听
   */
  private setupBusinessEvents(): void {
    // 聊天消息
    SocketAdapter.on('chatMessage', (message: ChatMessage) => {
      console.log("[网络][信息] 收到聊天消息:", message);
      this.emit('chatMessage', message);
    });

    // 房间更新
    SocketAdapter.on('roomUpdate', (data: any) => { // 接收原始数据 data
      console.log("[NetworkManager] Raw 'roomUpdate' event data received:", JSON.stringify(data).substring(0, 500)); // 打印原始数据
      // 假设服务器发送的数据结构是 { room: Room }
      const room = data?.room; // 从 data 中提取 room 对象
      if (room) {
        console.log("[网络][信息] 房间更新 (extracted):", room);
        this._room = room; // 更新房间信息
        this.emit('roomUpdate', room); // 分发提取出的 room 对象
      } else {
        console.error("[NetworkManager] Received 'roomUpdate' event but 'room' data is missing or invalid:", data);
        // 可以选择是否分发一个错误或空事件
        // this.emit('error', { message: "Invalid roomUpdate data received", details: data });
      }
    });

    // 游戏开始
    SocketAdapter.on('gameStart', (data: any) => {
      console.log("[网络][信息] 游戏开始:", data);
      if (data.gameId) {
        this._gameId = data.gameId;
      }
      this.emit('gameStart', data);
    });

    // 游戏结束
    SocketAdapter.on('game:game_end', (data: any) => { // 修正事件名称
      console.log("[网络][信息] 游戏结束:", data);
      this.emit('game:game_end', data); // 保持内部事件名一致或修改 GameUI 监听器
    });
    
    // 骰子摇动结果
    SocketAdapter.on('game:dice_roll', (data: any) => {
      console.log("[网络][信息] 骰子结果:", data);
      this.emit('game:dice_roll', data);
    });
    
    // 竞价更新
    SocketAdapter.on('game:bid_update', (data: any) => {
      console.log("[NetworkManager] Received 'game:bid_update' from SocketAdapter. Data:", JSON.stringify(data)); // 添加日志
      console.log("[网络][信息] 竞价更新:", data);
      this.emit('game:bid_update', data);
      console.log("[NetworkManager] Emitted 'game:bid_update' internally."); // 添加日志
    });
    
    // 游戏状态更新
    SocketAdapter.on('game:state_update', (data: any) => {
      console.log("[NetworkManager] Received 'game:state_update' from SocketAdapter. Data:", JSON.stringify(data)); // 添加日志
      console.log("[网络][信息] 游戏状态更新:", data);
      this.emit('game:state_update', data);
    });
    
    // 质疑结果
    SocketAdapter.on('game:challenge_result', (data: any) => {
      console.log("[NetworkManager] Received 'game:challenge_result' from SocketAdapter. Data:", JSON.stringify(data)); // 添加日志
      console.log("[网络][信息] 质疑结果:", data);
      this.emit('game:challenge_result', data);
      console.log("[NetworkManager] Emitted 'game:challenge_result' internally."); // 添加日志
    });
  }

  /**
   * 断开连接
   */
  public disconnect(): void {
    SocketAdapter.disconnect();
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
    this._status = NetworkStatus.DISCONNECTED;
  }

  /**
   * 发送消息
   * @param event 事件名称
   * @param data 数据
   * @returns Promise
   */
  public send(event: string, data: any): Promise<void> {
    if (!SocketAdapter || this.connectionStatus !== ConnectionStatus.CONNECTED) {
      console.error("[网络][错误] 未连接到服务器，无法发送消息");
      return Promise.reject(new Error("未连接到服务器"));
    }

    return new Promise<void>((resolve) => {
      SocketAdapter.emitWithAck(event, data, (response: any) => {
        resolve();
      });
    });
  }

  /**
   * 创建房间
   * @param playerName 玩家名称
   * @returns Promise<{success: boolean, data?: { playerId: string; room: Room }; error?: string}>
   */
  // 修改方法签名以匹配新的返回类型
  public createRoom(playerName: string): Promise<{success: boolean, data?: { playerId: string; room: Room }; error?: string}> {
      // 修改返回类型以匹配服务器回调的完整结构
      return new Promise<{success: boolean, data?: { playerId: string; room: Room }; error?: string}>((resolve, reject) => {
        SocketAdapter.emitWithAck('createRoom', { playerName }, (response: any) => {
          // 直接将服务器返回的完整响应传递给 resolve
          if (response.success && response.data && response.data.room) {
             // 更新本地缓存（如果需要）
             this._roomId = response.data.room.id;
             this._playerId = response.data.playerId;
             this._room = response.data.room; // 缓存房间信息
             resolve(response); // 传递完整响应
          } else {
             // 如果响应结构不符合预期或 success 为 false
             console.error('[Network] createRoom received invalid success response:', response);
             reject(new Error(response.error || '创建房间失败或响应格式错误'));
          }
        });
  
        setTimeout(() => {
          reject(new Error("创建房间超时"));
        }, 5000);
      });
  }

  /**
   * 加入房间
   * @param roomId 房间ID
   * @param playerName 玩家名称
   * @returns Promise<{success: boolean, playerId: string, room: Room}>
   */
  public joinRoom(roomId: string, playerName: string): Promise<{success: boolean, playerId: string, room: Room}> {
      return new Promise((resolve, reject) => {
        SocketAdapter.emitWithAck('joinRoom', { roomId, playerName }, (response: any) => {
          if (response.success) {
            this._roomId = roomId;
            this._playerId = response.playerId;
            this._room = response.room;
            resolve({
              success: true,
              playerId: response.playerId,
              room: response.room
            });
          } else {
            reject(new Error(response.error || '加入房间失败'));
          }
        });

        setTimeout(() => {
          reject(new Error("加入房间超时"));
        }, 5000);
      });
  }

  /**
   * 发送聊天消息
   * @param content 消息内容
   * @returns Promise<void>
   */
  public sendChatMessage(content: string): Promise<void> {
    if (!this._roomId || !this._playerId) {
      return Promise.reject(new Error("未加入房间"));
    }

    return this.send('chatMessage', {
      roomId: this._roomId,
      senderId: this._playerId,
      content
    });
  }

  /**
   * 离开房间
   * @returns Promise<void>
   */
  public leaveRoom(): Promise<void> {
    if (!this._roomId || !this._playerId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      SocketAdapter.emitWithAck('leaveRoom', {
        roomId: this._roomId,
        playerId: this._playerId
      }, (response: any) => {
        if (response.success) {
          this._roomId = '';
          this._playerId = '';
          this._room = null;
          resolve();
        } else {
          reject(new Error(response.error || '离开房间失败'));
        }
      });

      setTimeout(() => {
        reject(new Error("离开房间超时"));
      }, 5000);
    });
  }

  /**
   * 获取房间ID
   */
  public get roomId(): string {
    return this._roomId;
  }

  /**
   * 获取玩家ID
   */
  public get playerId(): string {
    return this._playerId;
  }

  /**
   * 获取房间信息
   */
  public get room(): Room | null {
    return this._room;
  }
  
  /**
   * 获取游戏ID
   */
  public get gameId(): string {
    return this._gameId;
  }

  /**
   * 添加事件监听
   * @param event 事件名称
   * @param handler 处理函数
   */
  public on(event: string, handler: (data?: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);

    // 如果是Socket.IO事件，还需要添加对应的监听
    if (SocketAdapter) {
      SocketAdapter.on(event, handler);
    }
  }

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param handler 处理函数
   */
  public off(event: string, handler: (data?: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }

    // SocketAdapter可能没有off方法，所以需要检查，并且检查 SocketAdapter 实例是否仍然有效
    // (注意：SocketAdapter 本身没有 isValid 属性，我们假设检查它是否为 null 足够)
    if (SocketAdapter && typeof SocketAdapter.off === 'function') {
        try {
            // 尝试调用 off，如果 SocketAdapter 内部状态无效，可能会抛错，但至少不会因为 SocketAdapter 本身为 null 而报错
            SocketAdapter.off(event, handler);
        } catch (e) {
            console.warn(`[NetworkManager] Error calling SocketAdapter.off for event "${event}":`, e);
        }
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param data 数据
   */
  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 发送请求并等待响应
   * @param event 事件名
   * @param data 请求数据
   * @returns Promise<any>
   */
  public request(event: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // 检查连接状态
      if (!SocketAdapter || this.connectionStatus !== ConnectionStatus.CONNECTED) {
        const error: NetworkError = {
          code: NetworkErrorCode.CONNECTION_CLOSED,
          message: '网络连接已关闭'
        };
        reject(error);
        return;
      }
      
      // 生成请求ID
      const id = `${event}_${this.requestId++}`;
      
      // 设置超时定时器
      const timerId = setTimeout(() => {
        // 清除挂起的请求记录
        this.pendingRequests.delete(id);
        const error: NetworkError = {
          code: NetworkErrorCode.REQUEST_TIMEOUT,
          message: `请求超时: ${event}`,
          details: { event, data }
        };
        console.error(`[Network] 请求超时: ${event}`, data);
        this.emit('error', error);
        reject(error);
      }, 10000); // 10秒超时

      // 存储挂起的请求
      this.pendingRequests.set(id, { resolve, reject, timer: timerId as unknown as number }); // Store timerId

      // 发送请求
      SocketAdapter.emitWithAck(event, { ...data, requestId: id }, (response: any) => {
        // 清除超时定时器，因为已收到响应
        clearTimeout(timerId);
        // 从挂起列表中移除
        this.pendingRequests.delete(id);

        console.log(`[Network] 收到响应: ${event}`, response);

        // 如果响应包含错误
        if (!response.success) {
          const error: NetworkError = {
            code: NetworkErrorCode.SERVER_ERROR,
            message: response.error || '服务器错误',
            details: { event, data }
          };
          
          // 触发错误事件
          this.emit('error', error);
          
          reject(error);
          return;
        }
        
        // 成功响应
        resolve(response);
      });
      // 超时处理已移到前面
    });
  }

  /**
   * 处理连接错误
   */
  private handleConnectionError(): void {
    console.error('[Network] 连接错误');
    
    const networkError: NetworkError = {
      code: NetworkErrorCode.CONNECTION_ERROR,
      message: '服务器连接错误'
    };
    
    // 更新状态
    this._status = NetworkStatus.DISCONNECTED;
    
    // 触发错误事件
    this.emit('error', networkError);
    
    // 尝试重连
    if (this.autoReconnect && this.retryCount < this.MAX_RETRIES) {
      this._status = NetworkStatus.RECONNECTING;
      this.emit('status', this._status);
      
      this.retryCount++;
      
      console.log(`[Network] 尝试重连 (${this.retryCount}/${this.MAX_RETRIES})...`);
      
      // 指数退避重试
      const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 10000);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else if (this.retryCount >= this.MAX_RETRIES) {
      // 达到最大重试次数
      this.emit('reconnect_failed');
      
      // 重置重试计数
      this.retryCount = 0;
    }
  }

  /**
   * 获取当前网络状态
   */
  public get status(): NetworkStatus {
    return this._status;
  }

  /**
   * 开始游戏
   * @returns Promise<{gameId: string}>
   */
  public startGame(): Promise<{gameId: string}> {
    if (!this._roomId || !this._playerId) {
      return Promise.reject(new Error("未加入房间"));
    }
    
    return this.request('startGame', { roomId: this._roomId });
  }
  
  /**
   * 摇骰子
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @returns Promise<{dices: Face[]}>
   */
  public rollDice(gameId: string, playerId: string): Promise<{dices: Face[]}> {
    if (!gameId || !playerId) {
      return Promise.reject(new Error("游戏ID或玩家ID无效"));
    }
    
    return this.request('game:roll_dice', { 
      gameId,
      playerId
    });
  }
  
  /**
   * 发送竞价
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param bid 竞价[面值,数量]
   * @returns Promise<void>
   */
  public placeBid(gameId: string, playerId: string, bid: Bid): Promise<void> {
    return this.request('game:bid', {
      gameId,
      playerId,
      bid
    });
  }
  
  /**
   * 发送质疑
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @returns Promise<void>
   */
  public challenge(gameId: string, playerId: string): Promise<void> {
    return this.request('game:challenge', {
      gameId,
      playerId
    });
  }
  
  /**
   * 发送即时喊（Spot On）
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @returns Promise<void>
   */
  public spotOn(gameId: string, playerId: string): Promise<void> {
    return this.request('game:spot_on', {
      gameId,
      playerId
    });
  }
}

// 导出单例
export const network = NetworkManager.getInstance();
