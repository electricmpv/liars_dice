import { Server, Socket } from "socket.io";
import { RoomManager } from "../room/room-manager";
import { ChatMessageSchema, HeartbeatSchema } from "../../../../shared/protocols/room-protocol";
import type { ChatMessage, Heartbeat } from "../../../../shared/protocols/room-protocol";

/**
 * 骰子游戏Socket服务器
 */
export class DiceSocketServer {
  private io: Server;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private roomManager: RoomManager;

  /**
   * 创建Socket服务器
   * @param port 服务器端口
   * @param roomManager 房间管理器
   */
  constructor(private port: number, roomManager?: RoomManager) {
    this.roomManager = roomManager || new RoomManager();
    
    // 初始化Socket.IO服务器
    this.io = new Server(port, {
      cors: { origin: "*" },
      transports: ["websocket"]
    });

    // 设置连接处理
    this.io.on("connection", (socket: Socket) => {
      console.log(`新客户端已连接: ${socket.id}`);
      
      // 处理核心事件
      this.handleCoreEvents(socket);
      
      // 处理房间事件
      this.handleRoomEvents(socket);
      
      // 处理聊天事件
      this.handleChatEvents(socket);
      
      // 处理断开连接
      socket.on("disconnect", (reason) => {
        console.log(`客户端断开连接: ${socket.id}, 原因: ${reason}`);
        this.handleDisconnect(socket);
      });
    });

    // 启动心跳检测
    this.startHeartbeat();
    
    console.log(`骰子游戏Socket服务器已启动，端口: ${this.port}`);
  }

  /**
   * 处理核心事件
   */
  private handleCoreEvents(socket: Socket): void {
    // 处理心跳检测
    socket.on("heartbeat", (_data) => {
      try {
        // 使用Zod验证心跳数据
        const heartbeat = HeartbeatSchema.parse(_data);
        // 响应心跳
        socket.emit("heartbeat:response", {
          serverTime: Date.now(),
          clientTime: heartbeat.timestamp
        });
      } catch (error) {
        console.error("心跳数据验证失败:", error);
      }
    });

    // 处理错误
    socket.on("error", (error) => {
      console.error(`Socket错误: ${socket.id}`, error);
    });
  }

  /**
   * 处理房间事件
   */
  private handleRoomEvents(socket: Socket): void {
    // 创建房间
    socket.on("createRoom", async (_data, callback) => {
      try {
        const result = await this.roomManager.createRoom(_data.playerName);
        
        // 将socket加入房间
        socket.join(result.roomId);
        
        // 保存玩家ID到socket数据
        socket.data.playerId = result.playerId;
        socket.data.roomId = result.roomId;
        
        // 如果提供了回调函数，返回结果
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            ...result
          });
        }
        
        // 广播房间更新
        this.broadcastRoomUpdate(result.roomId);
      } catch (error) {
        console.error("创建房间失败:", error);
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: "创建房间失败"
          });
        }
      }
    });

    // 加入房间
    socket.on("joinRoom", async (_data, callback) => {
      try {
        const result = await this.roomManager.joinRoom(_data.roomId, _data.playerName);
        
        // 将socket加入房间
        socket.join(_data.roomId);
        
        // 保存玩家ID到socket数据
        socket.data.playerId = result.playerId;
        socket.data.roomId = _data.roomId;
        
        // 如果提供了回调函数，返回结果
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            playerId: result.playerId,
            room: result.room
          });
        }
        
        // 广播房间更新
        this.broadcastRoomUpdate(_data.roomId);
      } catch (error) {
        console.error("加入房间失败:", error instanceof Error ? error.message : "未知错误");
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "加入房间失败",
            playerId: "",
          });
        }
      }
    });

    // 离开房间
    socket.on("leaveRoom", async (_data, callback) => {
      try {
        if (!socket.data.roomId || !socket.data.playerId) {
          throw new Error("玩家未在房间中");
        }
        
        await this.roomManager.leaveRoom(socket.data.roomId, socket.data.playerId);
        
        // 将socket离开房间
        socket.leave(socket.data.roomId);
        
        // 清除socket数据
        const roomId = socket.data.roomId;
        socket.data.roomId = undefined;
        socket.data.playerId = undefined;
        
        // 如果提供了回调函数，返回结果
        if (callback && typeof callback === 'function') {
          callback({
            success: true
          });
        }
        
        // 广播房间更新
        this.broadcastRoomUpdate(roomId);
      } catch (error) {
        console.error("离开房间失败:", error);
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: "离开房间失败"
          });
        }
      }
    });
  }

  /**
   * 处理聊天事件
   */
  private handleChatEvents(socket: Socket): void {
    socket.on("chatMessage", (_data, callback) => {
      try {
        // 使用Zod验证消息数据
        const validatedMessage = ChatMessageSchema.parse(_data);
        
        // 获取房间ID
        const roomId = validatedMessage.roomId;
        
        // 验证用户是否在此房间中
        if (socket.data.roomId !== roomId) {
          throw new Error("您不在此房间中，无法发送消息");
        }
        
        // 向房间内所有人广播消息(包括发送者)
        this.io.to(roomId).emit("chatBroadcast", {
          message: validatedMessage
        });
        
        // 如果提供了回调函数，返回成功
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            message: validatedMessage
          });
        }
      } catch (error) {
        console.error("发送聊天消息失败:", error);
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "发送消息失败"
          });
        }
      }
    });
  }

  /**
   * 处理客户端断开连接
   */
  private handleDisconnect(socket: Socket): void {
    // 如果玩家在房间中，则让其离开房间
    if (socket.data.roomId && socket.data.playerId) {
      try {
        this.roomManager.leaveRoom(socket.data.roomId, socket.data.playerId);
        // 广播房间更新
        this.broadcastRoomUpdate(socket.data.roomId as string);
      } catch (error) {
        console.error("断开连接时离开房间失败:", error);
      }
    }
  }

  /**
   * 广播房间更新
   */
  private broadcastRoomUpdate(roomId: string): void {
    const room = this.roomManager.getRoom(roomId);
    if (room) {
      this.io.to(roomId).emit("roomUpdate", {
        room
      });
    }
  }

  /**
   * 启动心跳检测
   */
  private startHeartbeat(): void {
    // 定期检查所有连接的客户端
    this.heartbeatInterval = setInterval(() => {
      const sockets = this.io.sockets.sockets;
      sockets.forEach((socket) => {
        // 发送心跳检测
        socket.emit("heartbeat:ping", {
          timestamp: Date.now()
        });
      });
    }, 30000); // 每30秒发送一次心跳
  }

  /**
   * 关闭服务器
   */
  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.io.close();
    console.log("骰子游戏Socket服务器已关闭");
  }
}
