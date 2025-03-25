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
    SocketAdapter.on('roomUpdate', (room: Room) => {
      console.log("[网络][信息] 房间更新:", room);
      this._room = room; // 更新房间信息
      this.emit('roomUpdate', room);
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
    SocketAdapter.on('gameEnd', (data: any) => {
      console.log("[网络][信息] 游戏结束:", data);
      this.emit('gameEnd', data);
    });
    
    // 骰子摇动结果
    SocketAdapter.on('game:dice_roll', (data: any) => {
      console.log("[网络][信息] 骰子结果:", data);
      this.emit('game:dice_roll', data);
    });
    
    // 竞价更新
    SocketAdapter.on('game:bid_update', (data: any) => {
      console.log("[网络][信息] 竞价更新:", data);
      this.emit('game:bid_update', data);
    });
    
    // 游戏状态更新
    SocketAdapter.on('game:state_update', (data: any) => {
      console.log("[网络][信息] 游戏状态更新:", data);
      this.emit('game:state_update', data);
    });
    
    // 质疑结果
    SocketAdapter.on('game:challenge_result', (data: any) => {
      console.log("[网络][信息] 质疑结果:", data);
      this.emit('game:challenge_result', data);
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
   * @returns Promise<{success: boolean, roomId: string, playerId: string}>
   */
  public createRoom(playerName: string): Promise<{success: boolean, roomId: string, playerId: string}> {
      return new Promise((resolve, reject) => {
        SocketAdapter.emitWithAck('createRoom', { playerName }, (response: any) => {
          if (response.success) {
            this._roomId = response.roomId;
            this._playerId = response.playerId;
            resolve({
              success: true,
              roomId: response.roomId,
              playerId: response.playerId
            });
          } else {
            reject(new Error(response.error || '创建房间失败'));
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

    // SocketAdapter可能没有off方法，所以需要检查
    if (SocketAdapter && typeof SocketAdapter.off === 'function') {
      SocketAdapter.off(event, handler);
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
      
      // 发送请求
      SocketAdapter.emitWithAck(event, { ...data, requestId: id }, (response: any) => {
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
      
      // 设置超时处理
      setTimeout(() => {
        const error: NetworkError = {
          code: NetworkErrorCode.REQUEST_TIMEOUT,
          message: `请求超时: ${event}`,
          details: { event, data }
        };
        
        console.error(`[Network] 请求超时: ${event}`, data);
        
        // 触发错误事件
        this.emit('error', error);
        
        reject(error);
      }, 10000);
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
