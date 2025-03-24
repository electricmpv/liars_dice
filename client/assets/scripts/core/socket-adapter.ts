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

    // 使用标准的 WebSocket API
    return new Promise((resolve, reject) => {
      try {
        // 动态加载 socket.io-client
        // 使用脚本标签方式加载以避免模块加载问题
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.5.0/socket.io.min.js';
        script.onload = () => {
          try {
            // @ts-ignore - 全局io由上面的脚本加载
            this.socket = io(url, options);
            
            this.socket.on('connect', () => {
              this.connectionStatus = 'connected';
              this.emit('connected');
              resolve();
            });
            
            this.socket.on('disconnect', () => {
              this.connectionStatus = 'disconnected';
              this.emit('disconnected');
            });
            
            this.socket.on('connect_error', (err: Error) => {
              this.connectionStatus = 'error';
              this.emit('connectionError', err);
              reject(err);
            });
          } catch (err) {
            this.connectionStatus = 'error';
            this.emit('connectionError', err);
            reject(err);
          }
        };
        
        script.onerror = (error) => {
          this.connectionStatus = 'error';
          this.emit('connectionError', new Error('加载Socket.IO客户端失败'));
          reject(error);
        };
        
        document.head.appendChild(script);
      } catch (err) {
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
      this.socket = null;
    }
    this.connectionStatus = 'disconnected';
  }

  /**
   * 发送事件
   * @param event 事件名
   * @param data 数据
   */
  public static send(event: string, data: any): void {
    if (this.socket && this.connectionStatus === 'connected') {
      this.socket.emit(event, data);
    } else {
      console.error('[网络][错误] 尝试在未连接状态下发送数据');
    }
  }

  /**
   * 监听事件
   * @param event 事件名
   * @param callback 回调函数
   */
  public static on(event: string, callback: Function): void {
    // 处理内部事件
    const internalEvents = ['connected', 'connecting', 'disconnected', 'connectionError'];
    if (internalEvents.indexOf(event) > -1) {
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event)?.push(callback);
      return;
    }

    // 处理服务器事件
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * 发送内部事件
   * @param event 事件名
   * @param data 数据
   */
  private static emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * 获取连接状态
   * @returns 连接状态
   */
  public static getConnectionStatus(): 'disconnected' | 'connecting' | 'connected' | 'error' {
    return this.connectionStatus;
  }

  /**
   * 获取服务器地址
   * @returns 服务器地址
   */
  public static getServerUrl(): string {
    return this.serverUrl;
  }
}
