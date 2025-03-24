import { sys } from 'cc';

/**
 * Socket.IO 适配器
 * 用于解决 Cocos Creator 环境下 Socket.IO 的兼容性问题
 */
export class SocketAdapter {
  private static socket: any = null;
  private static eventListeners: Map<string, Function[]> = new Map();
  private static connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
  private static serverUrl: string = '';

  /**
   * 连接到服务器
   * @param url 服务器地址
   * @param options 连接选项
   * @returns Promise
   */
  public static connect(url: string, options: any = {}): Promise<void> {
    this.serverUrl = url;
    this.connectionStatus = 'connecting';
    this.emit('connecting');

    return new Promise((resolve, reject) => {
      try {
        console.log("[网络][调试] 尝试连接服务器:", url, "选项:", JSON.stringify(options));
        
        // 使用动态脚本加载方式，避免Node.js模块依赖问题
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.6.0/socket.io.min.js';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          try {
            // @ts-ignore - io对象由CDN加载的脚本提供
            this.socket = io(url, {
              ...options,
              transports: ['websocket', 'polling'], // 尝试多种传输方式
              reconnection: true,
              reconnectionDelay: 1000,
              reconnectionAttempts: 10,
              timeout: 10000 // 增加超时时间
            });
            
            console.log("[网络][调试] Socket.IO客户端初始化完成");
            
            this.socket.on('connect', () => {
              console.log("[网络][信息] 成功连接到服务器");
              this.connectionStatus = 'connected';
              this.emit('connected');
              resolve();
            });
            
            this.socket.on('disconnect', () => {
              console.log("[网络][信息] 与服务器断开连接");
              this.connectionStatus = 'disconnected';
              this.emit('disconnected');
            });
            
            this.socket.on('connect_error', (err: Error) => {
              console.error("[网络][错误] 连接错误:", err.message);
              this.connectionStatus = 'error';
              this.emit('connectionError', err);
              reject(err);
            });
            
            this.socket.on('error', (err: Error) => {
              console.error("[网络][错误] Socket错误:", err.message);
              this.connectionStatus = 'error';
              this.emit('error', err);
            });
          } catch (err) {
            console.error("[网络][错误] Socket初始化错误:", err);
            this.connectionStatus = 'error';
            this.emit('connectionError', err);
            reject(err);
          }
        };
        
        script.onerror = (error) => {
          console.error("[网络][错误] 加载Socket.IO脚本失败:", error);
          this.connectionStatus = 'error';
          this.emit('connectionError', new Error('加载Socket.IO客户端失败'));
          reject(error);
        };
        
        // 添加脚本到文档
        document.head.appendChild(script);
      } catch (err) {
        console.error("[网络][错误] 连接过程错误:", err);
        this.connectionStatus = 'error';
        this.emit('connectionError', err);
        reject(err);
      }
    });
  }

  /**
   * 断开连接
   */
  public static disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connectionStatus = 'disconnected';
  }

  /**
   * 发送消息
   * @param event 事件名称
   * @param data 数据
   */
  public static send(event: string, data: any): void {
    if (this.socket && this.connectionStatus === 'connected') {
      console.log("[网络][调试] 发送消息:", event, data);
      this.socket.emit(event, data);
    } else {
      console.error("[网络][错误] 无法发送消息，未连接到服务器");
    }
  }

  /**
   * 添加事件监听器
   * @param event 事件名称
   * @param callback 回调函数
   */
  public static on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      // 注册到本地事件映射
      listeners.push(callback);
      
      // 如果已连接，同时注册到Socket.IO
      if (this.socket && ['connecting', 'connect_error', 'disconnect', 'error'].indexOf(event) === -1) {
        this.socket.on(event, callback as any);
      }
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param data 数据
   */
  private static emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (err) {
          console.error("[网络][错误] 事件处理器错误:", event, err);
        }
      });
    }
  }

  /**
   * 获取当前连接状态
   * @returns 连接状态
   */
  public static getConnectionStatus(): string {
    return this.connectionStatus;
  }
}
