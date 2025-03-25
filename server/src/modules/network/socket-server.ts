import { Server, Socket } from "socket.io";
import { RoomManager } from "../room/room-manager";
import { ChatMessageSchema, HeartbeatSchema } from "../../../../shared/protocols/room-protocol";
import type { ChatMessage, Heartbeat } from "../../../../shared/protocols/room-protocol";
import { GameRoundManager } from "../game/game-manager";

// 创建单例房间管理器
const globalRoomManager = new RoomManager();
// 创建单例游戏管理器
const globalGameManager = new GameRoundManager();

/**
 * 骰子游戏Socket服务器
 */
export class DiceSocketServer {
  private io: Server;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private roomManager: RoomManager;
  private gameManager: GameRoundManager;

  /**
   * 创建Socket服务器
   * @param port 服务器端口
   * @param roomManager 房间管理器
   * @param gameManager 游戏管理器
   */
  constructor(private port: number, roomManager?: RoomManager, gameManager?: GameRoundManager) {
    // 使用全局房间管理器或传入的房间管理器
    this.roomManager = roomManager || globalRoomManager;
    // 使用全局游戏管理器或传入的游戏管理器
    this.gameManager = gameManager || globalGameManager;
    
    // 初始化Socket.IO服务器
    this.io = new Server(port, {
      cors: { 
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ["websocket", "polling"]
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
      
      // 处理游戏事件
      this.handleGameEvents(socket);
      
      // 处理测试事件
      this.handleTestEvents(socket);
      
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
   * 处理房间相关事件
   */
  private handleRoomEvents(socket: Socket): void {
    // 创建房间
    socket.on("createRoom", async (_data, callback) => {
      try {
        console.log(`[Socket服务器] 收到创建房间请求: ${JSON.stringify(_data)}`);
        const result = this.roomManager.createRoom(_data.playerName);
        
        if (result.success && result.data) {
          // 创建房间成功
          const { roomId, playerId } = result.data;
          
          // 保存玩家ID和房间ID到socket数据
          socket.data.playerId = playerId;
          socket.data.roomId = roomId;
          
          // 加入Socket.IO房间（用于广播消息）
          socket.join(roomId);
          
          console.log(`[Socket服务器] 创建房间成功: 房间ID=${roomId}, 玩家ID=${playerId}`);
          callback({ success: true, roomId, playerId });
        } else {
          // 创建房间失败
          console.error(`[Socket服务器] 创建房间失败: ${result.error}`);
          callback({ success: false, error: result.error });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 创建房间异常:`, error);
        callback({ success: false, error: error.message || "创建房间时发生错误" });
      }
    });

    // 加入房间
    socket.on("joinRoom", async (_data, callback) => {
      try {
        console.log(`[Socket服务器] 收到加入房间请求: ${JSON.stringify(_data)}`);
        const result = this.roomManager.joinRoom(_data.roomId, _data.playerName);
        
        if (result.success && result.data) {
          // 加入房间成功
          const { playerId, room } = result.data;
          
          // 保存玩家ID和房间ID到socket数据
          socket.data.playerId = playerId;
          socket.data.roomId = room.id;
          
          // 加入Socket.IO房间（用于广播消息）
          socket.join(room.id);
          
          // 发送房间更新事件给房间内所有人
          const sharedRoom = this.roomManager.convertToSharedRoom(room);
          socket.to(room.id).emit("roomUpdated", { room: sharedRoom });
          
          console.log(`[Socket服务器] 加入房间成功: 房间ID=${room.id}, 玩家ID=${playerId}`);
          callback({ 
            success: true, 
            playerId,
            room: sharedRoom
          });
        } else {
          // 加入房间失败
          console.error(`[Socket服务器] 加入房间失败: ${result.error}`);
          callback({ success: false, error: result.error });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 加入房间异常:`, error);
        callback({ success: false, error: error.message || "加入房间时发生错误" });
      }
    });

    // 离开房间
    socket.on("leaveRoom", async (_data, callback) => {
      try {
        // 检查socket数据
        if (!socket.data.roomId || !socket.data.playerId) {
          callback({ success: false, error: "您当前不在任何房间中" });
          return;
        }
        
        const roomId = socket.data.roomId as string;
        const playerId = socket.data.playerId as string;
        
        // 获取房间信息（用于通知其他玩家）
        const roomBeforeLeave = this.roomManager.getRoom(roomId);
        
        // 离开房间
        const result = this.roomManager.leaveRoom(roomId, playerId);
        
        if (result.success) {
          // socket离开房间
          socket.leave(roomId);
          
          // 清理socket数据
          delete socket.data.roomId;
          delete socket.data.playerId;
          
          // 如果房间还存在，通知其他玩家有人离开
          if (roomBeforeLeave) {
            const updatedRoom = this.roomManager.getRoom(roomId);
            if (updatedRoom) {
              const sharedRoom = this.roomManager.convertToSharedRoom(updatedRoom);
              socket.to(roomId).emit("roomUpdated", { room: sharedRoom });
            }
          }
          
          console.log(`[Socket服务器] 离开房间成功: 玩家ID=${playerId} 离开了房间 ${roomId}`);
          callback({ success: true });
        } else {
          // 离开房间失败
          console.error(`[Socket服务器] 离开房间失败: ${result.error}`);
          callback({ success: false, error: result.error });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 离开房间异常:`, error);
        callback({ success: false, error: error.message || "离开房间时发生错误" });
      }
    });

    // 获取房间信息
    socket.on("getRoomInfo", async ({ roomId }, callback) => {
      try {
        console.log(`[Socket服务器] 收到获取房间信息请求: 房间ID=${roomId}`);
        
        if (!roomId || typeof roomId !== 'string') {
          callback({ success: false, error: "房间ID无效" });
          return;
        }
        
        const room = this.roomManager.getRoom(roomId);
        
        if (room) {
          const sharedRoom = this.roomManager.convertToSharedRoom(room);
          callback({ success: true, room: sharedRoom });
        } else {
          callback({ success: false, error: "房间不存在" });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 获取房间信息异常:`, error);
        callback({ success: false, error: error.message || "获取房间信息时发生错误" });
      }
    });

    // 获取活跃房间列表
    socket.on("getActiveRooms", async (_data, callback) => {
      try {
        console.log(`[Socket服务器] 收到获取活跃房间列表请求`);
        
        const rooms = this.roomManager.getActiveRooms();
        const sharedRooms = rooms.map(room => this.roomManager.convertToSharedRoom(room));
        
        callback({ success: true, rooms: sharedRooms });
      } catch (error: any) {
        console.error(`[Socket服务器] 获取活跃房间列表异常:`, error);
        callback({ success: false, error: error.message || "获取活跃房间列表时发生错误" });
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
   * 处理游戏事件
   */
  private handleGameEvents(socket: Socket): void {
    // 开始游戏
    socket.on("startGame", async (data, callback) => {
      try {
        if (!socket.data.roomId) {
          throw new Error("玩家未在房间中");
        }
    
        const roomId = socket.data.roomId;
        const room = this.roomManager.getRoom(roomId);
    
        if (!room) {
          throw new Error("房间不存在");
        }
    
        // 转换玩家数据为 PlayerData 格式
        const playerDataList = room.players.map(playerId => {
          const player = this.roomManager.getPlayer(playerId);
          if (!player) {
            throw new Error(`找不到玩家：${playerId}`);
          }
          return {
            id: player.id,
            name: player.name,
            diceCount: 5, // 默认每个玩家5个骰子
            socketId: this.getSocketIdByPlayerId(playerId)
          };
        });
        
        // 创建游戏
        const gameState = await this.gameManager.createGame(roomId, playerDataList);
        
        // 更新房间状态
        this.roomManager.updateRoomStatus(roomId, "gaming");
        
        // 广播游戏开始
        this.io.to(roomId).emit("gameStart", {
          gameId: gameState.gameId,
          players: gameState.players
        });
    
        if (callback) {
          callback({ success: true, gameId: gameState.gameId });
        }
      } catch (error) {
        console.error("开始游戏失败:", error);
        if (callback) {
          callback({ 
            success: false, 
            error: error instanceof Error ? error.message : "开始游戏失败" 
          });
        }
      }
    });
    
    // 骰子摇动请求
    socket.on("game:roll_dice", async (_data, callback) => {
      try {
        if (!socket.data.playerId) {
          throw new Error("玩家ID不存在");
        }
        
        const gameId = _data.gameId;
        const count = _data.count || 5;
        
        // 摇骰子并生成结果
        const result = await this.gameManager.rollDice(gameId, socket.data.playerId, count);
        
        // 回调函数返回骰子结果
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            dices: result.dices,
            seed: result.seed
          });
        }
        
        // 只给请求的玩家发送骰子结果
        socket.emit("game:dice_roll", {
          gameId,
          playerId: socket.data.playerId,
          dices: result.dices
        });
      } catch (error) {
        console.error("摇骰子失败:", error);
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "摇骰子失败"
          });
        }
      }
    });
    
    // 玩家竞价
    socket.on("game:bid", async (_data) => {
      try {
        const gameId = _data.gameId;
        const playerId = _data.playerId;
        const bid = _data.bid;
        
        // 验证玩家是否在游戏中
        if (socket.data.playerId !== playerId) {
          throw new Error("非法的玩家ID");
        }
        
        // 处理竞价
        const result = await this.gameManager.handleBid(gameId, playerId, bid);
        
        if (!result) {
          throw new Error("无效的竞价");
        }
        
        // 获取最新的游戏状态
        const gameState = this.gameManager.getGameState(gameId);
        
        // 广播竞价更新
        this.io.to(gameState.roomId).emit("game:bid_update", {
          gameId,
          playerId,
          bid
        });
        
        // 广播游戏状态更新
        this.broadcastGameState(gameId);
      } catch (error) {
        console.error("处理竞价失败:", error);
        socket.emit("game:error", {
          type: "bid_error",
          message: error instanceof Error ? error.message : "处理竞价失败"
        });
      }
    });
    
    // 玩家质疑
    socket.on("game:challenge", async (_data) => {
      try {
        const gameId = _data.gameId;
        const playerId = _data.playerId;
        
        // 验证玩家是否在游戏中
        if (socket.data.playerId !== playerId) {
          throw new Error("非法的玩家ID");
        }
        
        // 处理质疑
        const result = await this.gameManager.handleChallenge(gameId, playerId);
        
        // 获取最新的游戏状态
        const gameState = this.gameManager.getGameState(gameId);
        
        // 广播质疑结果
        this.io.to(gameState.roomId).emit("game:challenge_result", {
          gameId,
          challengerId: playerId,
          valid: result.valid,
          totalCount: result.totalCount,
          winner: result.winner || null
        });
        
        // 如果游戏结束，发送游戏结束事件
        if (gameState.status === "finished") {
          this.io.to(gameState.roomId).emit("game:game_end", {
            gameId,
            winner: gameState.winner,
            status: "completed" // 客户端使用completed，服务器用finished
          });
          
          // 更新房间状态
          this.roomManager.updateRoomStatus(gameState.roomId, "waiting");
          
          // 广播房间更新
          this.broadcastRoomUpdate(gameState.roomId);
        } else {
          // 广播游戏状态更新
          this.broadcastGameState(gameId);
        }
      } catch (error) {
        console.error("处理质疑失败:", error);
        socket.emit("game:error", {
          type: "challenge_error",
          message: error instanceof Error ? error.message : "处理质疑失败"
        });
      }
    });
    
    // 玩家即时喊（Spot On）
    socket.on("game:spot_on", async (_data) => {
      try {
        const gameId = _data.gameId;
        const playerId = _data.playerId;
        
        // 验证玩家是否在游戏中
        if (socket.data.playerId !== playerId) {
          throw new Error("非法的玩家ID");
        }
        
        // 处理即时喊
        const result = await this.gameManager.handleSpotOn(gameId, playerId);
        
        // 获取最新的游戏状态
        const gameState = this.gameManager.getGameState(gameId);
        
        // 广播即时喊结果
        this.io.to(gameState.roomId).emit("game:spot_on_result", {
          gameId,
          playerId,
          valid: result.valid,
          totalCount: result.totalCount,
          winner: result.winner || null
        });
        
        // 广播游戏状态更新
        this.broadcastGameState(gameId);
      } catch (error) {
        console.error("处理即时喊失败:", error);
        socket.emit("game:error", {
          type: "spot_on_error",
          message: error instanceof Error ? error.message : "处理即时喊失败"
        });
      }
    });
  }

  /**
   * 处理测试相关事件
   * 这些事件主要用于测试目的，不应该在生产环境中使用
   */
  private handleTestEvents(socket: Socket): void {
    // Echo事件 - 简单地将接收到的数据返回给客户端
    socket.on("echo", (data, callback) => {
      try {
        console.log(`[测试] 收到Echo请求，数据:`, JSON.stringify(data).substring(0, 100));
        
        // 验证数据格式
        if (data === undefined || data === null) {
          console.warn(`[测试] Echo请求数据为空`);
          data = { message: "无数据" };
        }
        
        // 如果提供了回调函数，返回相同的数据
        if (callback && typeof callback === 'function') {
          const response = {
            success: true,
            message: "Echo响应成功",
            data: data,
            originalData: JSON.parse(JSON.stringify(data)), // 深拷贝原始数据
            socketId: socket.id,
            timestamp: Date.now()
          };
          
          console.log(`[测试] 发送Echo响应:`, JSON.stringify(response).substring(0, 100));
          callback(response);
        } else {
          console.warn(`[测试] Echo请求未提供回调函数`);
          // 即使没有回调，也使用emit回复消息
          socket.emit("echoResponse", {
            success: true,
            message: "Echo单向响应",
            data: data,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.error(`[测试] Echo处理错误:`, error);
        // 如果有回调，返回错误信息
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error instanceof Error ? error.message : "Echo处理失败",
            timestamp: Date.now()
          });
        }
      }
    });
  }

  /**
   * 处理客户端断开连接
   */
  private handleDisconnect(socket: Socket): void {
    try {
      const playerId = socket.data.playerId;
      const roomId = socket.data.roomId;

      if (roomId && playerId) {
        console.log(`[断开连接] 尝试离开房间, ID: "${roomId}", 玩家: ${playerId}`);
        
        // 先检查房间是否存在
        try {
          const room = this.roomManager.getRoom(roomId);
          if (room) {
            // 房间存在时才执行离开操作
            this.roomManager.leaveRoom(roomId, playerId);
            
            // 尝试获取更新后的房间信息
            try {
              const updatedRoom = this.roomManager.getRoom(roomId);
              if (updatedRoom) {
                // 如果房间还存在，广播更新
                this.broadcastRoomUpdate(roomId);
              }
            } catch (error) {
              // 房间可能已被删除，这是正常的
              console.log(`[断开连接] 房间可能已被删除: ${roomId}`);
            }
          } else {
            console.log(`[断开连接] 房间不存在，无需执行离开操作: ${roomId}`);
          }
        } catch (error) {
          // 记录错误但不抛出，避免影响其他清理操作
          console.log('[断开连接] 检查房间出错:', error);
        }
      }
    } catch (error) {
      // 记录错误但不抛出，避免影响其他清理操作
      console.error("[断开连接] 处理断开连接发生错误:", error);
    }
  }

  /**
   * 广播房间更新消息
   * @param roomId 房间ID
   */
  private broadcastRoomUpdate(roomId: string): void {
    try {
      // 获取最新的房间信息
      const room = this.roomManager.getRoom(roomId);
      if (!room) {
        console.log(`[Socket服务器] 广播房间更新：房间 ${roomId} 不存在，无法广播`);
        return;
      }
      
      // 向房间内所有客户端广播最新房间信息
      const sharedRoom = this.roomManager.convertToSharedRoom(room);
      this.io.to(roomId).emit("roomUpdated", { room: sharedRoom });
      console.log(`[Socket服务器] 已广播房间 ${roomId} 更新，当前玩家数: ${room.players.length}`);
    } catch (error) {
      console.error(`[Socket服务器] 广播房间更新失败:`, error);
    }
  }

  /**
   * 广播游戏状态更新
   */
  private broadcastGameState(gameId: string): void {
    try {
      const gameState = this.gameManager.getGameState(gameId);
      if (gameState && gameState.roomId) {
        // 发送给房间所有玩家
        this.io.to(gameState.roomId).emit("game:state_update", {
          gameId: gameState.gameId,
          players: gameState.players,
          activePlayers: gameState.activePlayers,
          currentPlayerIndex: gameState.currentPlayerIndex,
          currentBid: gameState.currentBid,
          roundNumber: gameState.roundNumber,
          moveNumber: gameState.moveNumber,
          status: gameState.status
        });
      }
    } catch (error) {
      console.error("广播游戏状态失败:", error);
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
    }, 8000); // 每8秒发送一次心跳
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

  /**
   * 通过玩家ID获取Socket ID
   */
  private getSocketIdByPlayerId(playerId: string): string | undefined {
    for (const [socketId, socket] of this.io.sockets.sockets.entries()) {
      if (socket.data.playerId === playerId) {
        return socketId;
      }
    }
    return undefined;
  }
}
