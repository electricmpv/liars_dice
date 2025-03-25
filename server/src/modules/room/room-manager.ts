import { v4 as uuid } from "uuid";
import type { Room as SharedRoom, RoomStatus as SharedRoomStatus } from "../../../../shared/protocols/room-protocol";

// 房间状态类型
export type RoomStatus = "waiting" | "gaming" | "closed";

// 房间数据结构
export interface Room {
  id: string;
  name?: string;
  status: RoomStatus;
  players: string[]; // 玩家ID列表
  createdAt: number; // 创建时间戳(毫秒)
  updatedAt: number; // 更新时间戳(毫秒)
  gameId?: string;   // 游戏ID（如果有）
}

// 事务结果类型
export interface TransactionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * 玩家信息接口
 */
export interface Player {
  id: string;
  name: string;
  room: string;
}

/**
 * 房间管理器
 * 负责房间的创建、加入、离开等操作
 */
export class RoomManager {
  // 使用Map存储房间和玩家信息
  private rooms: Map<string, Room> = new Map();
  private players: Map<string, Player> = new Map();

  /**
   * 执行一个事务，自动备份和回滚
   * @param action 事务操作函数
   * @returns 事务执行结果
   */
  private executeTransaction<T>(action: () => T): TransactionResult<T> {
    // 备份当前状态
    const roomsBackup = new Map(this.rooms);
    const playersBackup = new Map(this.players);

    try {
      // 执行事务
      const result = action();
      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      // 回滚到备份状态
      console.error(`[房间管理] 事务执行失败，正在回滚: ${error.message}`);
      this.rooms = roomsBackup;
      this.players = playersBackup;
      return {
        success: false,
        error: error.message || "未知错误"
      };
    }
  }

  /**
   * 验证房间ID格式
   * @param roomId 房间ID
   */
  private validateRoomId(roomId: string): boolean {
    // 房间ID格式: 6位数字
    return /^\d{6}$/.test(roomId);
  }

  /**
   * 验证玩家名称
   * @param playerName 玩家名称
   */
  private validatePlayerName(playerName: string): boolean {
    if (!playerName || typeof playerName !== 'string') return false;
    // 玩家名称长度在1-12个字符之间
    return playerName.length > 0 && playerName.length <= 12;
  }

  /**
   * 创建房间
   * @param playerName 玩家名称
   * @returns 创建结果，包含房间ID和玩家ID
   */
  createRoom(playerName: string): TransactionResult<{roomId: string, playerId: string}> {
    return this.executeTransaction(() => {
      console.log(`[房间管理] 开始创建房间，玩家: ${playerName}`);
      
      // 验证玩家名称
      if (!this.validatePlayerName(playerName)) {
        throw new Error("玩家名称无效，请输入1-12个字符");
      }
      
      // 生成房间ID和玩家ID
      const roomId = this.generateRoomId();
      const playerId = uuid();
      
      // 创建玩家
      this.players.set(playerId, {
        id: playerId,
        name: playerName,
        room: roomId
      });
      
      // 创建房间
      const room: Room = {
        id: roomId,
        status: "waiting",
        players: [playerId],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      this.rooms.set(roomId, room);
      
      console.log(`[房间管理] 房间创建成功，ID: ${roomId}, 玩家ID: ${playerId}`);
      return { roomId, playerId };
    });
  }

  /**
   * 加入房间
   * @param roomId 房间ID
   * @param playerName 玩家名称
   * @returns 加入结果，包含玩家ID和房间信息
   */
  joinRoom(roomId: string, playerName: string): TransactionResult<{playerId: string, room: Room}> {
    return this.executeTransaction(() => {
      console.log(`[房间管理] 尝试加入房间，房间ID: ${roomId}, 玩家: ${playerName}`);
      
      // 验证房间ID
      if (!this.validateRoomId(roomId)) {
        throw new Error("房间ID格式错误，请输入6位数字");
      }
      
      // 验证玩家名称
      if (!this.validatePlayerName(playerName)) {
        throw new Error("玩家名称无效，请输入1-12个字符");
      }
      
      // 检查房间是否存在
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error(`房间 ${roomId} 不存在`);
      }
      
      // 检查房间状态
      if (room.status !== "waiting") {
        throw new Error("房间不可加入");
      }
      
      // 检查是否已达到玩家上限 (假设最大6人)
      if (room.players.length >= 6) {
        throw new Error("房间已满");
      }
      
      // 生成玩家ID
      const playerId = uuid();
      
      // 创建玩家
      this.players.set(playerId, {
        id: playerId,
        name: playerName,
        room: roomId
      });
      
      // 将玩家加入房间
      room.players.push(playerId);
      room.updatedAt = Date.now();
      
      console.log(`[房间管理] 玩家 ${playerName} (ID: ${playerId}) 成功加入房间 ${roomId}`);
      return { playerId, room };
    });
  }

  /**
   * 离开房间
   * @param roomId 房间ID
   * @param playerId 玩家ID
   * @returns 离开结果，true表示成功
   */
  leaveRoom(roomId: string, playerId: string): TransactionResult<boolean> {
    return this.executeTransaction(() => {
      console.log(`[房间管理] 尝试离开房间，房间ID: ${roomId}, 玩家ID: ${playerId}`);
      
      // 验证房间ID
      if (!this.validateRoomId(roomId)) {
        throw new Error("房间ID格式错误");
      }
      
      // 检查房间是否存在
      const room = this.rooms.get(roomId);
      if (!room) {
        console.log(`[房间管理] 房间 ${roomId} 不存在，无需离开`);
        return true; // 房间不存在也算成功离开
      }
      
      // 检查玩家是否存在
      const player = this.players.get(playerId);
      if (!player) {
        console.log(`[房间管理] 玩家 ${playerId} 不存在，无需离开`);
        return true; // 玩家不存在也算成功离开
      }
      
      // 检查玩家是否在该房间
      if (player.room !== roomId) {
        console.log(`[房间管理] 玩家 ${playerId} 不在房间 ${roomId} 中`);
        return true; // 玩家不在该房间也算成功离开
      }
      
      // 从房间中移除玩家
      const playerIndex = room.players.indexOf(playerId);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        room.updatedAt = Date.now();
      }
      
      // 从玩家列表中移除该玩家
      this.players.delete(playerId);
      
      // 如果房间空了，删除房间
      if (room.players.length === 0) {
        console.log(`[房间管理] 房间 ${roomId} 已无玩家，正在删除`);
        this.rooms.delete(roomId);
      }
      
      console.log(`[房间管理] 玩家 ${playerId} 已成功离开房间 ${roomId}`);
      return true;
    });
  }

  /**
   * 根据ID获取房间信息
   * @param roomId 房间ID
   * @returns 房间信息
   */
  getRoom(roomId: string): Room | null {
    if (!roomId || !this.validateRoomId(roomId)) {
      return null;
    }
    
    return this.rooms.get(roomId) || null;
  }

  /**
   * 获取玩家信息
   * @param playerId 玩家ID
   * @returns 玩家信息
   */
  getPlayer(playerId: string): Player | null {
    if (!playerId) return null;
    return this.players.get(playerId) || null;
  }

  /**
   * 更新房间状态
   * @param roomId 房间ID
   * @param status 新状态
   * @returns 更新结果
   */
  updateRoomStatus(roomId: string, status: RoomStatus): TransactionResult<boolean> {
    return this.executeTransaction(() => {
      const room = this.rooms.get(roomId);
      if (!room) {
        throw new Error(`房间 ${roomId} 不存在`);
      }
      
      room.status = status;
      room.updatedAt = Date.now();
      return true;
    });
  }

  /**
   * 获取所有活跃房间
   * @returns 活跃房间列表
   */
  getActiveRooms(): Room[] {
    return Array.from(this.rooms.values()).filter(room => 
      room.status !== "closed" && room.players.length > 0
    );
  }

  /**
   * 验证房间-玩家关系一致性
   * 确保房间列表中的玩家和玩家列表中的房间关系一致
   * @returns 是否一致
   */
  verifyRoomPlayerConsistency(): boolean {
    console.log(`[房间管理] 开始验证房间-玩家关系一致性`);
    let isConsistent = true;
    
    // 遍历所有房间
    for (const [roomId, room] of this.rooms.entries()) {
      // 检查房间中的每个玩家
      for (const playerId of room.players) {
        const player = this.players.get(playerId);
        
        // 如果玩家不存在或玩家的房间ID不匹配
        if (!player || player.room !== roomId) {
          console.error(`[房间管理] 房间-玩家不一致: 房间 ${roomId} 包含玩家 ${playerId}，但玩家不存在或不在此房间`);
          isConsistent = false;
          
          // 自动修复：从房间玩家列表中移除不存在的玩家
          if (!player) {
            console.log(`[房间管理] 自动修复: 从房间 ${roomId} 移除不存在的玩家 ${playerId}`);
            const playerIndex = room.players.indexOf(playerId);
            if (playerIndex !== -1) {
              room.players.splice(playerIndex, 1);
              room.updatedAt = Date.now();
            }
          }
          // 自动修复：更新玩家的房间ID
          else if (player.room !== roomId) {
            console.log(`[房间管理] 自动修复: 更新玩家 ${playerId} 的房间ID为 ${roomId}`);
            player.room = roomId;
          }
        }
      }
      
      // 如果房间中没有玩家，考虑删除
      if (room.players.length === 0 && room.status !== "waiting") {
        console.log(`[房间管理] 检测到空房间 ${roomId}，状态为 ${room.status}，考虑删除`);
        // 只删除已完成的空房间
        if (room.status === "closed") {
          console.log(`[房间管理] 自动清理: 删除空的已完成房间 ${roomId}`);
          this.rooms.delete(roomId);
        }
      }
    }
    
    return isConsistent;
  }

  /**
   * 验证玩家一致性
   * @returns 是否一致
   */
  verifyPlayerConsistency(): boolean {
    console.log(`[房间管理] 开始验证玩家一致性`);
    let isConsistent = true;
    
    // 遍历所有玩家
    for (const [playerId, player] of this.players.entries()) {
      // 检查玩家所在房间是否存在
      const room = this.rooms.get(player.room);
      
      if (!room) {
        console.error(`[房间管理] 玩家一致性错误: 玩家 ${playerId} 关联的房间 ${player.room} 不存在`);
        isConsistent = false;
        
        // 自动修复：删除没有有效房间的玩家
        console.log(`[房间管理] 自动修复: 删除无效房间的玩家 ${playerId}`);
        this.players.delete(playerId);
        continue;
      }
      
      // 检查房间玩家列表是否包含该玩家
      if (!room.players.includes(playerId)) {
        console.error(`[房间管理] 玩家一致性错误: 玩家 ${playerId} 声称在房间 ${player.room}，但房间玩家列表不包含此玩家`);
        isConsistent = false;
        
        // 自动修复：将玩家添加到房间
        console.log(`[房间管理] 自动修复: 将玩家 ${playerId} 添加到房间 ${player.room}`);
        room.players.push(playerId);
        room.updatedAt = Date.now();
      }
    }
    
    return isConsistent;
  }

  /**
   * 全局一致性检查
   * @returns 是否一致
   */
  verifyGlobalConsistency(): boolean {
    console.log(`[房间管理] 开始全局一致性检查`);
    
    // 执行各个一致性检查
    const roomPlayerConsistency = this.verifyRoomPlayerConsistency();
    const playerConsistency = this.verifyPlayerConsistency();
    
    const isGloballyConsistent = roomPlayerConsistency && playerConsistency;
    
    if (isGloballyConsistent) {
      console.log(`[房间管理] 全局一致性检查通过`);
    } else {
      console.error(`[房间管理] 全局一致性检查失败，请检查日志`);
    }
    
    return isGloballyConsistent;
  }

  /**
   * 生成一个6位数字的房间ID
   * @returns 房间ID
   */
  private generateRoomId(): string {
    // 生成6位随机数字
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 确保ID唯一
    if (this.rooms.has(randomId)) {
      return this.generateRoomId(); // 递归重试
    }
    
    return randomId;
  }

  /**
   * 将内部Room对象转换为共享协议格式
   * @param room 内部Room对象
   * @returns 共享协议格式的Room对象
   */
  convertToSharedRoom(room: Room): SharedRoom {
    return {
      id: room.id,
      name: room.name,
      status: this.convertRoomStatus(room.status),
      players: [...room.players],
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt)
    };
  }

  /**
   * 转换房间状态
   * @param status 内部状态
   * @returns 共享协议状态
   */
  private convertRoomStatus(status: RoomStatus): SharedRoomStatus {
    switch (status) {
      case "waiting": 
        return "waiting";
      case "gaming": 
        return "gaming";
      case "closed": 
        return "closed";
      default:
        return "waiting";
    }
  }
}
