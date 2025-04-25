import { v4 as uuid } from "uuid";
import { EventEmitter } from 'events'; // 导入 EventEmitter
// Import both the shared interface and the Zod schema if needed for validation elsewhere
import type { Player as SharedPlayer, Room as SharedRoom, RoomStatus as SharedRoomStatus } from "../../../../shared/protocols/room-protocol";

// 房间状态类型
export type RoomStatus = "waiting" | "gaming" | "closed";

// 房间数据结构
export interface Room {
  id: string;
  hostId: string; // 添加房主ID
  name?: string;
  status: RoomStatus;
  players: string[]; // 内部仍然存储玩家ID列表
  playerCount: number;
  maxPlayers: number;
  hasPassword: boolean;
  isPrivate: boolean;
  hasFriends: boolean;
  createdAt: number;
  updatedAt: number;
  gameId?: string;
}

// 玩家信息接口 (Internal representation, should align with SharedPlayer)
export interface Player {
  id: string;
  name: string;
  roomId: string;
  isReady: boolean;
  isAI: boolean;    // Added based on shared protocol
  aiType?: string; // Added based on shared protocol
  socketId?: string; // Optional: Store socket ID if needed for direct communication
}

/**
 * 房间管理器 - 内存版本
 * 使用JavaScript对象存储房间和玩家信息
 */
export class RoomManager extends EventEmitter { // 继承 EventEmitter
  // 内存存储
  private rooms: Map<string, Room> = new Map();
  private players: Map<string, Player> = new Map();

  constructor() {
    super(); // 调用父类构造函数
  }

  /**
   * 创建房间
   */
  // 修改返回类型以匹配 joinRoom 的成功响应结构
  async createRoom(playerName: string): Promise<{ success: boolean; data?: { playerId: string; room: Room }; error?: string }> {
    try {
      const roomId = this.generateRoomId();
      const playerId = uuid();

      // 创建房间
      const room: Room = {
        id: roomId,
        hostId: playerId, // 设置房主ID
        status: "waiting",
        players: [playerId],
        playerCount: 1,
        maxPlayers: 6,
        hasPassword: false,
        isPrivate: false,
        hasFriends: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // 创建玩家
      const player: Player = {
        id: playerId,
        name: playerName,
        roomId: roomId,
        isReady: false, // 默认未准备
        isAI: false   // Human player
      };

      // 存储到内存
      this.rooms.set(roomId, room);
      this.players.set(playerId, player);

      // 返回包含完整房间信息的成功响应
      // 注意：移除了重复的存储代码块
      return {
        success: true,
        data: {
          playerId,
          room // 返回创建的房间对象
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "创建房间失败"
      };
    }
  }

  /**
   * 加入房间
   */
  async joinRoom(roomId: string, playerName: string): Promise<{ success: boolean; data?: { playerId: string; room: Room }; error?: string }> {
    try {
      // 检查房间是否存在
      const room = this.rooms.get(roomId);
      if (!room) {
        return { success: false, error: "房间不存在" };
      }

      // 检查房间状态
      if (room.status !== 'waiting') {
        return { success: false, error: "房间已开始游戏或已关闭" };
      }

      // 检查房间人数
      if (room.playerCount >= room.maxPlayers) {
        return { success: false, error: "房间已满" };
      }

      // 创建新玩家
      const playerId = uuid();
      const player: Player = {
        id: playerId,
        name: playerName,
        roomId: roomId,
        isReady: false, // 默认未准备
        isAI: false   // Human player
      };

      // 更新房间信息
      room.players.push(playerId);
      room.playerCount = room.players.length;
      room.updatedAt = Date.now();

      // 存储到内存
      this.players.set(playerId, player);
      this.rooms.set(roomId, room);

      return {
        success: true,
        data: {
          playerId,
          room
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "加入房间失败"
      };
    }
  }

  /**
   * 添加 AI 玩家到房间
   */
  async addAIPlayer(roomId: string, aiType: string = 'coward'): Promise<{ success: boolean; data?: { playerId: string; room: Room }; error?: string }> {
    try {
      const room = this.rooms.get(roomId);
      if (!room) {
        return { success: false, error: "房间不存在" };
      }

      if (room.status !== 'waiting') {
        return { success: false, error: "房间已开始游戏或已关闭" };
      }

      if (room.playerCount >= room.maxPlayers) {
        return { success: false, error: "房间已满" };
      }

      const aiPlayerId = `ai_${aiType}_${uuid()}`;
      const aiName = `胆小鬼 AI`; // Or derive from aiType

      const aiPlayer: Player = {
        id: aiPlayerId,
        name: aiName,
        roomId: roomId,
        isReady: true, // AI is always ready
        isAI: true,
        aiType: aiType,
        // socketId: undefined // AI doesn't have a socket connection
      };

      // 更新房间信息
      room.players.push(aiPlayerId);
      room.playerCount = room.players.length;
      room.updatedAt = Date.now();

      // 存储 AI 玩家和更新后的房间
      this.players.set(aiPlayerId, aiPlayer);
      this.rooms.set(roomId, room);

      console.log(`[RoomManager] AI player ${aiName} (${aiPlayerId}) added to room ${roomId}`);

      return {
        success: true,
        data: {
          playerId: aiPlayerId,
          room
        }
      };
    } catch (error) {
      console.error(`[RoomManager] Failed to add AI player to room ${roomId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "添加 AI 玩家失败"
      };
    }
  }

  /**
   * 离开房间
   */
  async leaveRoom(roomId: string, playerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 检查房间是否存在
      const room = this.rooms.get(roomId);
      if (!room) {
        return { success: false, error: "房间不存在" };
      }

      // 检查玩家是否在房间中
      const playerIndex = room.players.indexOf(playerId);
      if (playerIndex === -1) {
        return { success: false, error: "玩家不在房间中" };
      }

      // 从房间中移除玩家
      room.players.splice(playerIndex, 1);
      room.playerCount = room.players.length;
      room.updatedAt = Date.now();

      // 如果房间中没有玩家了，则关闭房间
      let statusChanged = false;
      if (room.playerCount === 0 && room.status !== 'closed') {
        room.status = 'closed';
        statusChanged = true;
      }

      // 更新房间信息
      this.rooms.set(roomId, room);

      // 如果状态变为 closed，发出事件
      if (statusChanged) {
        this.emit('roomClosed', roomId); // 发出房间关闭事件
        console.log(`[RoomManager] 房间 ${roomId} 因最后玩家离开而关闭，已发出 roomClosed 事件`);
      }

      // 从玩家列表中移除玩家
      this.players.delete(playerId);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "离开房间失败"
      };
    }
  }

  /**
   * 获取房间信息
   */
  async getRoom(roomId: string): Promise<Room | null> {
    try {
      // 直接从内存中获取房间信息
      const room = this.rooms.get(roomId);
      return room || null;
    } catch (error) {
      console.error("获取房间信息失败:", error);
      return null;
    }
  }

  /**
   * 获取玩家信息
   */
  async getPlayer(playerId: string): Promise<Player | null> {
    try {
      // 直接从内存中获取玩家信息
      const player = this.players.get(playerId);
      return player || null;
    } catch (error) {
      console.error("获取玩家信息失败:", error);
      return null;
    }
  }

  /**
   * 更新房间状态
   */
  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<{ success: boolean; error?: string }> {
    try {
      // 对 status 进行简单验证
      const validStatuses: RoomStatus[] = ["waiting", "gaming", "closed"];
      if (!validStatuses.includes(status)) {
          throw new Error("无效的房间状态");
      }

      // 检查房间是否存在
      const room = this.rooms.get(roomId);
      if (!room) {
        return { success: false, error: "房间不存在" };
      }

      // 检查状态是否真的改变
      if (room.status !== status) {
        const oldStatus = room.status;
        room.status = status;
        room.updatedAt = Date.now();
        this.rooms.set(roomId, room);
        // 发出状态变更事件
        this.emit('roomStatusChanged', { roomId, oldStatus, newStatus: status });
        console.log(`[RoomManager] 房间 ${roomId} 状态从 ${oldStatus} 更新为 ${status}，已发出 roomStatusChanged 事件`);
        return { success: true };
      } else {
        // 状态未改变，也算成功，但不发事件
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "更新房间状态失败"
      };
    }
  }

  /**
   * 设置玩家准备状态
   */
  async setPlayerReadyState(playerId: string, isReady: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const player = this.players.get(playerId);
      if (!player) {
        return { success: false, error: "玩家不存在" };
      }
      player.isReady = isReady;
      this.players.set(playerId, player); // 更新 Map 中的玩家信息
      console.log(`[RoomManager] 玩家 ${playerId} 状态更新为: ${isReady ? '准备' : '未准备'}`);
      return { success: true };
    } catch (error) {
      console.error(`[RoomManager] 设置玩家 ${playerId} 准备状态失败:`, error);
      return { success: false, error: "设置准备状态时发生错误" };
    }
  }

  /**
   * 获取所有活跃房间
   */
  async getActiveRooms(): Promise<Room[]> {
    try {
      // 从内存中过滤出活跃房间
      const activeRooms: Room[] = [];

      for (const room of this.rooms.values()) {
        if (room.status !== 'closed' && room.playerCount > 0) {
          activeRooms.push(room);
        }
      }

      return activeRooms;
    } catch (error) {
      console.error("获取活跃房间失败:", error);
      return [];
    }
  }

  /**
   * 生成6位数字房间ID
   */
  private generateRoomId(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 转换为共享协议格式
   */
  async convertToSharedRoom(roomId: string): Promise<SharedRoom> {
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new Error("房间不存在");
    }

    // 获取详细玩家信息
    const detailedPlayers = await Promise.all(
      room.players.map(async (playerId) => {
        const player = await this.getPlayer(playerId);
        if (!player) {
          // 理论上不应该发生，但需要处理
          console.error(`[RoomManager] 严重错误: 在 convertToSharedRoom 中找不到玩家 ${playerId}`);
          // 返回一个默认/错误状态的玩家对象或抛出错误，取决于设计
          // 这里我们返回一个基础对象，避免完全失败
          // Consider logging this more severely or handling differently
          return { id: playerId, name: "未知玩家", isReady: false, isAI: false }; // Assume not AI if error
        }
        // Map internal Player to SharedPlayer structure
        const sharedPlayer: SharedPlayer = {
            id: player.id,
            name: player.name,
            isReady: player.isReady ?? false, // Use ?? provide default value
            isAI: player.isAI,
            aiType: player.aiType
        };
        return sharedPlayer;
      })
    );

    // Ensure the returned object matches the SharedRoom interface
    const sharedRoomData: SharedRoom = {
      id: room.id,
      hostId: room.hostId, // 添加 hostId
      name: room.name,
      status: this.convertRoomStatus(room.status),
      players: detailedPlayers, // Now contains SharedPlayer objects
      playerCount: room.playerCount,
      maxPlayers: room.maxPlayers,
  hasPassword: room.hasPassword,
  isPrivate: room.isPrivate,
  hasFriends: room.hasFriends,
  createdAt: new Date(room.createdAt),
  updatedAt: new Date(room.updatedAt)
    };
    return sharedRoomData;
  }

  private convertRoomStatus(status: RoomStatus): SharedRoomStatus {
    switch (status) {
      case "waiting": return "waiting";
      case "gaming": return "gaming";
      case "closed": return "closed";
      default: return "waiting";
    }
  }
}
