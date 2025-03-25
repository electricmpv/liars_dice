import { Socket } from "socket.io";
import { ChatMessageSchema } from "../../../../shared/protocols/room-protocol";
import type { ChatMessage } from "../../../../shared/protocols/room-protocol";
import { RoomManager, TransactionResult } from "../room/room-manager";

/**
 * 事件处理器类
 */
export class EventHandlers {
  constructor(private roomManager: RoomManager) {}

  /**
   * 处理聊天消息
   * @param socket Socket连接
   */
  public handleChat(socket: Socket): void {
    socket.on("chatMessage", (msg: any, callback: (response: any) => void) => {
      try {
        const validatedMessage = ChatMessageSchema.parse(msg);
        
        // 如果玩家不在房间中，则不能发送消息
        if (!socket.data.roomId) {
          callback({ success: false, message: "您不在房间中，无法发送消息" });
          return;
        }

        // 广播消息给房间内的所有玩家
        socket.to(socket.data.roomId as string).emit("chatMessage", {
          ...validatedMessage,
          from: socket.data.playerId,
          playerName: socket.data.playerName || "未知玩家"
        });

        callback({ success: true });
      } catch (error) {
        console.error("处理聊天消息失败:", error);
        callback({ success: false, message: "消息格式无效" });
      }
    });
  }

  /**
   * 处理创建房间事件
   * @param socket Socket连接
   */
  public handleCreateRoom(socket: Socket): void {
    socket.on("createRoom", (data: any, callback: (response: any) => void) => {
      try {
        const { playerName } = data;
        
        // 验证玩家名称
        if (!playerName || typeof playerName !== 'string' || playerName.length < 2 || playerName.length > 20) {
          throw new Error("玩家名称无效");
        }
        
        // 创建房间
        const result: TransactionResult = this.roomManager.createRoom(playerName);
        
        if (!result.success || !result.data) {
          throw new Error(result.error || "创建房间失败");
        }
        
        const { roomId, playerId } = result.data;
        
        // 将socket加入房间
        socket.join(roomId);
        
        // 保存玩家信息到socket数据
        socket.data.playerId = playerId;
        socket.data.roomId = roomId;
        socket.data.playerName = playerName;
        
        // 返回成功响应
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            roomId: roomId,
            playerId: playerId
          });
        }
        
        console.log(`[房间][信息] 玩家 ${playerName} 创建了房间 ${roomId}`);
      } catch (error) {
        console.error("[房间][错误] 创建房间失败:", error);
        
        // 返回错误响应
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "创建房间失败"
          });
        }
      }
    });
  }

  /**
   * 处理加入房间事件
   * @param socket Socket连接
   */
  public handleJoinRoom(socket: Socket): void {
    socket.on("joinRoom", (data: any, callback: (response: any) => void) => {
      try {
        const { roomId, playerName } = data;
        
        // 验证参数
        if (!roomId || typeof roomId !== 'string') {
          throw new Error("房间ID无效");
        }
        
        if (!playerName || typeof playerName !== 'string' || playerName.length < 2 || playerName.length > 20) {
          throw new Error("玩家名称无效");
        }
        
        // 加入房间
        const result: TransactionResult = this.roomManager.joinRoom(roomId, playerName);
        
        if (!result.success || !result.data) {
          throw new Error(result.error || "加入房间失败");
        }
        
        const { playerId, room } = result.data;
        
        // 将socket加入房间
        socket.join(roomId);
        
        // 保存玩家信息到socket数据
        socket.data.playerId = playerId;
        socket.data.roomId = roomId;
        socket.data.playerName = playerName;
        
        // 返回成功响应
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            playerId: playerId,
            room: room
          });
        }
        
        console.log(`[房间][信息] 玩家 ${playerName} 加入了房间 ${roomId}`);
      } catch (error) {
        console.error("[房间][错误] 加入房间失败:", error);
        
        // 返回错误响应
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "加入房间失败",
            playerId: ""
          });
        }
      }
    });
  }

  /**
   * 处理离开房间事件
   * @param socket Socket连接
   */
  public handleLeaveRoom(socket: Socket): void {
    socket.on("leaveRoom", (_data: any, callback: (response: any) => void) => {
      try {
        // 检查socket数据
        if (!socket.data.roomId || !socket.data.playerId) {
          callback({ success: false, message: "您当前不在任何房间中" });
          return;
        }
        const roomId = socket.data.roomId as string;
        const playerId = socket.data.playerId as string;
        
        // 离开房间
        const result: TransactionResult = this.roomManager.leaveRoom(roomId, playerId);
        
        if (!result.success) {
          throw new Error(result.error || "离开房间失败");
        }
        
        // socket离开房间
        socket.leave(roomId);
        
        // 清理socket数据
        delete socket.data.roomId;
        delete socket.data.playerId;
        
        // 返回成功响应
        callback({
          success: true,
          message: "已成功离开房间"
        });
        
        console.log(`[房间][信息] 玩家 ${playerId} 离开了房间 ${roomId}`);
      } catch (error) {
        console.error("[房间][错误] 离开房间失败:", error);
        callback({
          success: false,
          error: error instanceof Error ? error.message : "离开房间失败"
        });
      }
    });
  }

  /**
   * 处理连接断开事件
   * @param socket Socket连接
   */
  public handleDisconnect(socket: Socket): void {
    socket.on("disconnect", (_reason: any) => {
      try {
        // 如果玩家在房间中，让其离开房间
        if (socket.data.roomId && socket.data.playerId) {
          const roomId = socket.data.roomId as string;
          const playerId = socket.data.playerId as string;
          
          const result: TransactionResult = this.roomManager.leaveRoom(roomId, playerId);
          
          if (result.success) {
            console.log(`[网络][信息] 玩家 ${playerId} 断开连接，已从房间 ${roomId} 移除`);
          } else {
            console.error(`[网络][错误] 玩家 ${playerId} 断开连接后离开房间失败: ${result.error}`);
          }
        }
      } catch (error) {
        console.error("处理断开连接事件失败:", error);
      }
    });
  }
}
