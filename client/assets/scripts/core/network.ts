// import { io, Socket } from "socket.io-client";
import { ChatMessage, Room } from "../../../../shared/protocols/room-protocol";
import { SocketAdapter } from "./socket-adapter";

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
  private serverUrl: string = "ws://localhost:3000";
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectTimeout: number = 5000; // 毫秒
  private eventHandlers: Map<string, Array<(data?: any) => void>> = new Map();
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;

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
    this.emit('connecting');
    
    console.log("[网络][信息] 正在连接到服务器:", this.serverUrl);

    // 创建Socket连接
    return SocketAdapter.connect(this.serverUrl, {
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: this.reconnectTimeout,
      transports: ["websocket"]
    })
    .then(() => {
      console.log("[网络][信息] 连接成功");
      this.connectionStatus = ConnectionStatus.CONNECTED;
      this.emit('connected');
      this.reconnectAttempts = 0;

      // 设置socket事件监听
      SocketAdapter.on('disconnect', () => {
        console.log("[网络][信息] 连接断开");
        this.connectionStatus = ConnectionStatus.DISCONNECTED;
        this.emit('disconnected');
      });

      SocketAdapter.on('connect_error', (error: Error) => {
        console.error("[网络][错误] 连接错误:", error);
        this.connectionStatus = ConnectionStatus.ERROR;
        this.emit('connectionError', error);
      });

      // 业务事件监听
      this.setupBusinessEvents();
    })
    .catch((error) => {
      console.error("[网络][错误] 连接失败:", error);
      this.connectionStatus = ConnectionStatus.ERROR;
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
      this.emit('roomUpdate', room);
    });

    // 游戏开始
    SocketAdapter.on('gameStart', (data: any) => {
      console.log("[网络][信息] 游戏开始:", data);
      this.emit('gameStart', data);
    });

    // 游戏结束
    SocketAdapter.on('gameEnd', (data: any) => {
      console.log("[网络][信息] 游戏结束:", data);
      this.emit('gameEnd', data);
    });
  }

  /**
   * 断开连接
   */
  public disconnect(): void {
    SocketAdapter.disconnect();
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
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
      SocketAdapter.send(event, data);
      resolve();
    });
  }

  /**
   * 创建房间
   * @param playerName 玩家名称
   * @returns Promise<{roomId: string, playerId: string}>
   */
  public createRoom(playerName: string): Promise<{roomId: string, playerId: string}> {
    return new Promise((resolve, reject) => {
      this.send('createRoom', { playerName })
        .then(() => {
          // 监听房间创建成功事件
          const handler = (data: {roomId: string, playerId: string}) => {
            this.off('roomCreated', handler);
            resolve(data);
          };
          
          this.on('roomCreated', handler);
          
          // 超时处理
          setTimeout(() => {
            this.off('roomCreated', handler);
            reject(new Error("创建房间超时"));
          }, 5000);
        })
        .catch(reject);
    });
  }

  /**
   * 加入房间
   * @param roomId 房间ID
   * @param playerName 玩家名称
   * @returns Promise<{roomId: string, playerId: string}>
   */
  public joinRoom(roomId: string, playerName: string): Promise<{roomId: string, playerId: string}> {
    return new Promise((resolve, reject) => {
      this.send('joinRoom', { roomId, playerName })
        .then(() => {
          // 监听加入房间成功事件
          const handler = (data: {roomId: string, playerId: string}) => {
            this.off('roomJoined', handler);
            resolve(data);
          };
          
          this.on('roomJoined', handler);
          
          // 超时处理
          setTimeout(() => {
            this.off('roomJoined', handler);
            reject(new Error("加入房间超时"));
          }, 5000);
        })
        .catch(reject);
    });
  }

  /**
   * 获取当前连接状态
   * @returns 连接状态
   */
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * 添加事件监听器
   * @param event 事件名称
   * @param handler 处理函数
   */
  public on(event: string, handler: (data?: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param handler 处理函数
   */
  public off(event: string, handler: (data?: any) => void): void {
    if (!this.eventHandlers.has(event)) return;
    
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
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
   * 发送聊天消息
   * @param message 消息内容
   * @param roomId 房间ID
   * @returns Promise
   */
  public sendChatMessage(message: string, roomId: string): Promise<void> {
    if (SocketAdapter && this.connectionStatus === ConnectionStatus.CONNECTED) {
      return this.send('chatMessage', { message, roomId });
    } else {
      return Promise.reject(new Error("未连接到服务器"));
    }
  }
}

// 导出单例
export const network = NetworkManager.getInstance();
