import { v4 as uuid } from "uuid";
import type { Room } from "../../../../shared/protocols/room-protocol";

/**
 * 玩家信息接口
 */
interface Player {
  id: string;
  name: string;
  room?: string;
}

/**
 * 房间管理器
 */
export class RoomManager {
  // 使用Map存储房间和玩家信息
  private rooms = new Map<string, Room>();
  private players = new Map<string, Player>();

  /**
   * 创建新房间
   * @param playerName 创建者名称
   * @returns 房间ID和玩家ID
   */
  createRoom(playerName: string): { roomId: string, playerId: string } {
    // 生成唯一ID
    const roomId = uuid();
    const playerId = uuid();

    // 保存玩家信息
    this.players.set(playerId, {
      id: playerId,
      name: playerName,
      room: roomId
    });

    // 创建房间
    const room: Room = {
      id: roomId,
      name: `${playerName}的房间`,
      players: [playerId],
      status: "waiting",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 保存房间
    this.rooms.set(roomId, room);

    console.log(`房间已创建: ${roomId}, 创建者: ${playerName}(${playerId})`);
    console.log(`当前房间数量: ${this.rooms.size}, 房间列表: ${Array.from(this.rooms.keys()).join(", ")}`);
    return { roomId, playerId };
  }

  /**
   * 加入房间
   * @param roomId 房间ID
   * @param playerName 玩家名称
   * @returns 玩家ID和房间信息
   */
  joinRoom(roomId: string, playerName: string): { playerId: string, room: Room } {
    console.log(`尝试加入房间, ID: "${roomId}", 玩家: ${playerName}`);
    console.log(`当前房间数量: ${this.rooms.size}, 房间列表: ${Array.from(this.rooms.keys()).join(", ")}`);
    
    // 检查房间是否存在
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`房间不存在, 提供的ID: "${roomId}"`);
      throw new Error("房间不存在");
    }

    // 检查房间状态
    if (room.status !== "waiting") {
      throw new Error("房间不可加入");
    }

    // 检查房间玩家数量
    if (room.players.length >= 6) {
      throw new Error("房间已满");
    }

    // 生成玩家ID
    const playerId = uuid();

    // 保存玩家信息
    this.players.set(playerId, {
      id: playerId,
      name: playerName,
      room: roomId
    });

    // 更新房间信息
    room.players.push(playerId);
    room.updatedAt = new Date();

    // 更新房间
    this.rooms.set(roomId, room);

    console.log(`玩家已加入房间: ${playerName}(${playerId}) -> ${roomId}`);
    return { playerId, room };
  }

  /**
   * 离开房间
   * @param roomId 房间ID
   * @param playerId 玩家ID
   */
  leaveRoom(roomId: string, playerId: string): void {
    console.log(`尝试离开房间, ID: "${roomId}", 玩家: ${playerId}`);
    console.log(`当前房间数量: ${this.rooms.size}, 房间列表: ${Array.from(this.rooms.keys()).join(", ")}`);
    
    // 检查房间是否存在
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`房间不存在, 提供的ID: "${roomId}"`);
      throw new Error("房间不存在");
    }

    // 从房间中移除玩家
    const playerIndex = room.players.indexOf(playerId);
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);
      room.updatedAt = new Date();

      // 如果房间没有玩家了，删除房间
      if (room.players.length === 0) {
        this.rooms.delete(roomId);
        console.log(`房间已删除: ${roomId}`);
      } else {
        // 更新房间
        this.rooms.set(roomId, room);
      }

      // 移除玩家的房间信息
      const player = this.players.get(playerId);
      if (player) {
        player.room = undefined;
        this.players.set(playerId, player);
      }

      console.log(`玩家已离开房间: ${playerId} -> ${roomId}`);
    } else {
      throw new Error("玩家不在此房间中");
    }
  }

  /**
   * 获取房间信息
   * @param roomId 房间ID
   * @returns 房间信息
   */
  getRoom(roomId: string): Room | undefined {
    console.log(`尝试获取房间信息, ID: "${roomId}"`);
    console.log(`当前房间数量: ${this.rooms.size}, 房间列表: ${Array.from(this.rooms.keys()).join(", ")}`);
    
    // 检查房间是否存在
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`房间不存在, 提供的ID: "${roomId}"`);
      throw new Error("房间不存在");
    }

    return room;
  }

  /**
   * 获取玩家信息
   * @param playerId 玩家ID
   * @returns 玩家信息
   */
  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  /**
   * 获取所有活跃房间
   * @returns 活跃房间列表
   */
  getActiveRooms(): Room[] {
    return Array.from(this.rooms.values()).filter(room => room.status !== "closed");
  }

  /**
   * 更新房间状态
   * @param roomId 房间ID
   * @param status 新状态
   */
  updateRoomStatus(roomId: string, status: "waiting" | "gaming" | "closed"): void {
    console.log(`尝试更新房间状态, ID: "${roomId}", 状态: ${status}`);
    console.log(`当前房间数量: ${this.rooms.size}, 房间列表: ${Array.from(this.rooms.keys()).join(", ")}`);
    
    // 检查房间是否存在
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`房间不存在, 提供的ID: "${roomId}"`);
      throw new Error("房间不存在");
    }

    room.status = status;
    room.updatedAt = new Date();
    this.rooms.set(roomId, room);
    console.log(`房间状态已更新: ${roomId} -> ${status}`);
  }
}
