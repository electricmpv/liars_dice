import { Server, Socket } from "socket.io";
import { z } from "zod"; // 导入 Zod
import { RoomManager } from "../room/room-manager";
import {
  ChatMessageSchema,
  HeartbeatSchema,
  CreateRoomRequestSchema, // 导入房间相关 Schema
  JoinRoomRequestSchema,
  // LeaveRoomRequestSchema, // leaveRoom 不直接接收客户端数据
  GetRoomInfoRequestSchema
} from "../../../../shared/protocols/room-protocol";
import type { ChatMessage, Heartbeat } from "../../../../shared/protocols/room-protocol";
import {
  RollDiceRequestSchema, // 导入游戏相关 Schema
  BidRequestSchema,
  ChallengeRequestSchema,
  SpotOnRequestSchema,
  GetInitialGameStateRequestSchema // 添加新的 Schema 导入
} from "../../../../shared/protocols/game-protocol";
import { GameRoundManager } from "../game/game-manager";


// 创建单例房间管理器
const globalRoomManager = new RoomManager();
// 注意：移除了全局游戏管理器实例，将在构造函数中创建

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
   * @param gameManager 游戏管理器 (可选，如果未提供则内部创建)
   */
  constructor(private port: number, roomManager?: RoomManager, gameManager?: GameRoundManager) {
    // 使用全局房间管理器或传入的房间管理器
    this.roomManager = roomManager || globalRoomManager;

    // 初始化Socket.IO服务器
    this.io = new Server(port, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ["websocket", "polling"]
    });

    // 使用传入的游戏管理器或创建新的实例，并传入io和roomManager
    this.gameManager = gameManager || new GameRoundManager(this.io, this.roomManager);

    // 监听 RoomManager 事件以触发大厅更新
    this.roomManager.on('roomStatusChanged', ({ roomId, oldStatus, newStatus }) => {
      console.log(`[Socket服务器] 检测到房间 ${roomId} 状态变更 (${oldStatus} -> ${newStatus})，触发大厅广播`);
      this.broadcastLobbyUpdate();
    });
    this.roomManager.on('roomClosed', (roomId) => {
      console.log(`[Socket服务器] 检测到房间 ${roomId} 关闭，触发大厅广播`);
      this.broadcastLobbyUpdate();
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
        this.handleDisconnect(socket); // 注意：handleDisconnect 是 async
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
        // 不向客户端发送错误，只在服务器记录
        if (error instanceof z.ZodError) {
          console.error(`[心跳验证失败] Socket ID: ${socket.id}, 错误:`, error.errors);
        } else {
          console.error(`[心跳处理错误] Socket ID: ${socket.id}, 错误:`, error);
        }
      }
    });

    // 处理登录请求
    socket.on("login", (data, callback) => {
      try {
        // 这里简化处理，实际项目中应该验证用户名和密码
        const { username, password } = data;
        console.log(`[Socket服务器] 收到登录请求: 用户名=${username}`);

        // 模拟登录成功
        const playerId = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        socket.data.playerId = playerId;
        socket.data.username = username;

        console.log(`[Socket服务器] 登录成功: 用户名=${username}, 玩家ID=${playerId}`);
        callback({ success: true, playerId, username });
      } catch (error: any) {
        console.error(`[Socket服务器] 登录异常:`, error);
        callback({ success: false, error: error.message || "登录失败" });
      }
    });

    // 处理游客登录请求
    socket.on("guestLogin", (data, callback) => {
      try {
        console.log(`[Socket服务器] 收到游客登录请求 from socket: ${socket.id}`);

        // 检查此 socket 是否已经登录
        if (socket.data.playerId && socket.data.username) {
            console.log(`[Socket服务器] 此连接已登录为: ${socket.data.username} (${socket.data.playerId})，直接返回现有信息。`);
            callback({ success: true, playerId: socket.data.playerId, username: socket.data.username });
            return; // 阻止创建新游客
        }

        // 如果未登录，则生成新的游客ID和名称
        const guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const guestName = `游客${Math.floor(Math.random() * 10000)}`;

        // 保存到socket数据
        socket.data.playerId = guestId;
        socket.data.username = guestName;

        console.log(`[Socket服务器] 游客登录成功: 游客名=${guestName}, 玩家ID=${guestId}`);
        callback({ success: true, playerId: guestId, username: guestName });
      } catch (error: any) {
        console.error(`[Socket服务器] 游客登录异常:`, error);
        callback({ success: false, error: error.message || "游客登录失败" });
      }
    });

    // 处理错误
    socket.on("error", (error) => {
      console.error(`Socket错误: ${socket.id}`, error);
    });

    // 快速邀请 AI (新增)
    socket.on("quickInviteAI", async (_data, callback) => {
      try {
        // 验证请求数据 (只需要 roomId)
        const QuickInviteAISchema = z.object({ roomId: z.string() });
        const validatedData = QuickInviteAISchema.parse(_data);
        const roomId = validatedData.roomId;

        // 验证发起请求的玩家是否在该房间内
        if (socket.data.roomId !== roomId) {
          throw new Error("您不在此房间中，无法邀请 AI");
        }
        if (!socket.data.playerId) {
            throw new Error("无法识别您的玩家身份");
        }

        console.log(`[Socket服务器] 收到快速邀请 AI 请求: 房间=${roomId}, 发起者=${socket.data.playerId}`);

        // 调用 RoomManager 添加 AI
        const result = await this.roomManager.addAIPlayer(roomId); // 使用默认 'coward' 类型

        if (result.success && result.data) {
          console.log(`[Socket服务器] AI 玩家 ${result.data.playerId} 已成功添加到房间 ${roomId}`);

          // 广播房间更新给所有玩家
          await this.broadcastRoomUpdate(roomId);
          // 广播大厅更新
          this.broadcastLobbyUpdate();

          // 回调确认成功
          if (callback) callback({ success: true, aiPlayerId: result.data.playerId });

        } else {
          // 添加 AI 失败
          throw new Error(result.error || "邀请 AI 失败");
        }

      } catch (error: any) {
        console.error(`[Socket服务器] 处理快速邀请 AI 请求异常:`, error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的邀请 AI 数据"
          : error.message || "邀请 AI 时发生错误";
        if (callback) callback({ success: false, error: errorMessage });
      }
    });
  }

  /**
   * 处理房间相关事件
   */
  private handleRoomEvents(socket: Socket): void {
    // 创建房间
    socket.on("createRoom", async (_data, callback) => {
      try {
        // Zod 验证
        const validatedData = CreateRoomRequestSchema.parse(_data);
        console.log(`[Socket服务器] 收到创建房间请求: ${JSON.stringify(validatedData)}`);

        const result = await this.roomManager.createRoom(validatedData.playerName);

        if (result.success && result.data) {
          // 创建房间成功
          // 从新的返回结构中获取 playerId 和 room 对象
          const { playerId, room } = result.data;
          const roomId = room.id; // 获取 roomId

          // 保存玩家ID和房间ID到socket数据
          socket.data.playerId = playerId;
          socket.data.roomId = roomId;

          // 加入Socket.IO房间（用于广播消息）
          socket.join(roomId);

          socket.join(roomId); // 确保加入房间

          socket.join(roomId); // 确保加入房间

          console.log(`[Socket服务器] 创建房间成功: 房间ID=${roomId}, 玩家ID=${playerId}`);
          // 再次确认：返回包含 data 字段和 room 对象的结构
          const sharedRoom = await this.roomManager.convertToSharedRoom(roomId);
          const responseData = { success: true, data: { playerId: playerId, room: sharedRoom } }; // 构建响应数据
          console.log(`[Socket服务器] 发送 createRoom 响应: ${JSON.stringify(responseData)}`); // 打印将要发送的数据
          // 使用 callback 发送正确结构的响应
          callback(responseData);

          // 广播大厅更新
          this.broadcastLobbyUpdate(); // <--- 添加调用

        } else {
          // 创建房间失败
          console.error(`[Socket服务器] 创建房间失败: ${result.error}`);
          callback({ success: false, error: result.error || "创建房间失败" });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 创建房间异常:`, error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的创建房间数据"
          : error.message || "创建房间时发生错误";
        callback({ success: false, error: errorMessage });
      }
    });

    // 加入房间
    socket.on("joinRoom", async (_data, callback) => {
      try {
        // Zod 验证
        const validatedData = JoinRoomRequestSchema.parse(_data);
        console.log(`[Socket服务器] 收到加入房间请求: ${JSON.stringify(validatedData)}`);

        const result = await this.roomManager.joinRoom(validatedData.roomId, validatedData.playerName);

        if (result.success && result.data) {
          // 加入房间成功
          const { playerId, room } = result.data;

          // 保存玩家ID和房间ID到socket数据
          socket.data.playerId = playerId;
          socket.data.roomId = room.id;

          // 加入Socket.IO房间（用于广播消息）
          socket.join(room.id);

          // 发送房间更新事件给房间内所有人
          const sharedRoom = await this.roomManager.convertToSharedRoom(room.id);
          // 向房间内所有人广播更新 (包括刚加入的玩家)
          this.io.to(room.id).emit("roomUpdate", { room: sharedRoom }); 
          console.log(`[Socket服务器] 已广播房间 ${room.id} 更新`);

          console.log(`[Socket服务器] 加入房间成功: 房间ID=${room.id}, 玩家ID=${playerId}`);
          callback({
            success: true,
            playerId: playerId, // <--- 添加 playerId 到响应中
            room: sharedRoom // 返回给加入者
          });

          // 广播大厅更新 (因为玩家数量变化)
          this.broadcastLobbyUpdate(); // <--- 添加调用

        } else {
          // 加入房间失败
          console.error(`[Socket服务器] 加入房间失败: ${result.error}`);
          callback({ success: false, error: result.error || "加入房间失败" });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 加入房间异常:`, error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的加入房间数据"
          : error.message || "加入房间时发生错误";
        callback({ success: false, error: errorMessage });
      }
    });

    // 离开房间 - 注意：此事件通常不直接接收客户端数据，而是依赖 socket.data
    socket.on("leaveRoom", async (_data, callback) => { // _data 未使用
      try {
        // 检查socket数据
        if (!socket.data.roomId || !socket.data.playerId) {
          callback({ success: false, error: "您当前不在任何房间中" });
          return;
        }

        const roomId = socket.data.roomId as string;
        const playerId = socket.data.playerId as string;

        // 获取房间信息（用于通知其他玩家）
        const roomBeforeLeave = await this.roomManager.getRoom(roomId); // 确保这里有 await

        // 离开房间
        const result = await this.roomManager.leaveRoom(roomId, playerId);

        if (result.success) {
          // socket离开房间
          socket.leave(roomId);

          // 清理socket数据
          delete socket.data.roomId;
          delete socket.data.playerId;

          // 如果房间还存在，通知其他玩家有人离开
          if (roomBeforeLeave) { // 现在判断的是 Room | null
            const updatedRoom = await this.roomManager.getRoom(roomId); // 添加 await
            if (updatedRoom) { // 现在判断的是 Room | null
              const sharedRoom = await this.roomManager.convertToSharedRoom(roomId); // 确保这里有 await
              socket.to(roomId).emit("roomUpdate", { room: sharedRoom }); // Renamed event
            }
          }

          console.log(`[Socket服务器] 离开房间成功: 玩家ID=${playerId} 离开了房间 ${roomId}`);
          callback({ success: true });

          // 广播大厅更新 (因为玩家数量变化或房间关闭)
          // RoomManager 的 roomClosed 事件会处理关闭的情况，但玩家数量变化也需要广播
          this.broadcastLobbyUpdate(); // <--- 添加调用

        } else {
          // 离开房间失败
          console.error(`[Socket服务器] 离开房间失败: ${result.error}`);
          callback({ success: false, error: result.error || "离开房间失败" });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 离开房间异常:`, error);
        callback({ success: false, error: error.message || "离开房间时发生错误" });
      }
    });

    // 获取房间信息 (修正：确保在 handleRoomEvents 内部)
    // 注意：这个监听器之前已经存在，这里只是确认其逻辑
    // 修正：确保 callback 被正确调用
    socket.on("getRoomInfo", async (_data, callback) => {
      try {
        // Zod 验证
        const validatedData = GetRoomInfoRequestSchema.parse(_data);
        const roomId = validatedData.roomId;
        console.log(`[Socket服务器] 收到获取房间信息请求: 房间ID=${roomId}`);

        const room = await this.roomManager.getRoom(roomId);

        if (room) {
          const sharedRoom = await this.roomManager.convertToSharedRoom(room.id);
          callback({ success: true, room: sharedRoom });
        } else {
          callback({ success: false, error: "房间不存在" });
        }
      } catch (error: any) {
        console.error(`[Socket服务器] 获取房间信息异常:`, error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的获取房间信息数据"
          : error.message || "获取房间信息时发生错误";
        callback({ success: false, error: errorMessage });
      }
    });

    // 获取活跃房间列表
    socket.on("getActiveRooms", async (_data, callback) => { // _data 未使用
      try {
        console.log(`[Socket服务器] 收到获取活跃房间列表请求`);

        const rooms = await this.roomManager.getActiveRooms();
        const sharedRooms = await Promise.all(rooms.map(room => this.roomManager.convertToSharedRoom(room.id)));

        callback({ success: true, rooms: sharedRooms });
      } catch (error: any) {
        console.error(`[Socket服务器] 获取活跃房间列表异常:`, error);
        callback({ success: false, error: error.message || "获取活跃房间列表时发生错误" });
      }
    });

    // 设置玩家准备状态
    socket.on("setReady", async (_data, callback) => {
      try {
        // 验证数据 (假设客户端发送 { ready: boolean })
        const SetReadySchema = z.object({ ready: z.boolean() });
        const validatedData = SetReadySchema.parse(_data);
        const isReady = validatedData.ready;

        // 检查 socket 数据
        if (!socket.data.roomId || !socket.data.playerId) {
          throw new Error("玩家未在房间中或身份无法识别");
        }
        const roomId = socket.data.roomId as string;
        const playerId = socket.data.playerId as string;

        console.log(`[Socket服务器] 收到设置准备状态请求: 房间=${roomId}, 玩家=${playerId}, 状态=${isReady}`);

        // 更新 RoomManager 中的状态
        const result = await this.roomManager.setPlayerReadyState(playerId, isReady);

        if (result.success) {
          // 向客户端发送成功确认
          if (callback) callback({ success: true });

          // 向房间内所有客户端广播状态变更 (包括自己)
          this.io.to(roomId).emit('playerReadyStateChanged', { playerId, isReady });
          console.log(`[Socket服务器] 已广播玩家 ${playerId} 准备状态变更`);

          // 额外广播完整的房间更新，确保所有客户端状态同步
          await this.broadcastRoomUpdate(roomId);
          console.log(`[Socket服务器] 已广播房间 ${roomId} 的完整更新`);

        } else {
          // 更新失败
          throw new Error(result.error || "设置准备状态失败");
        }

      } catch (error: any) {
        console.error(`[Socket服务器] 设置准备状态异常:`, error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的准备状态数据"
          : error.message || "设置准备状态时发生错误";
        if (callback) callback({ success: false, error: errorMessage });
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
        this.io.to(roomId).emit("chatMessage", { // Renamed event
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
        const errorMessage = error instanceof z.ZodError
          ? "无效的聊天消息数据"
          : error instanceof Error ? error.message : "发送消息失败";

        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: errorMessage
          });
        } else {
          // 如果没有回调，可以考虑给发送者发送一个错误事件
          socket.emit("error", { type: "chat_error", message: errorMessage });
        }
      }
    });
  }

  /**
   * 广播大厅更新消息 (向所有连接的客户端)
   */
  private async broadcastLobbyUpdate(): Promise<void> {
    try {
      const activeRooms = await this.roomManager.getActiveRooms();
      const sharedRooms = await Promise.all(activeRooms.map(room => this.roomManager.convertToSharedRoom(room.id)));
      // 使用 io.emit 向所有连接的客户端广播
      this.io.emit('lobbyUpdate', { rooms: sharedRooms });
      console.log(`[Socket服务器] 已向所有客户端广播 lobbyUpdate`);
    } catch (error) {
      console.error(`[Socket服务器] 广播大厅更新失败:`, error);
    }
  }

  /**
   * 处理游戏事件
   */
  private handleGameEvents(socket: Socket): void {
    // 获取初始游戏状态 (新增)
    socket.on("getInitialGameState", async (_data, callback) => {
      try {
        console.log(`[Socket服务器] 收到 getInitialGameState 请求:`, _data);
        const validatedData = GetInitialGameStateRequestSchema.parse(_data);
        const gameId = validatedData.gameId;

        if (!socket.data.playerId) {
          throw new Error("无法识别玩家身份");
        }
        const playerId = socket.data.playerId as string;

        const gameState = this.gameManager.getGameState(gameId);
        if (!gameState) {
          throw new Error("游戏不存在或已结束");
        }

        // 确保请求的玩家确实在该游戏中
        const playerInGame = gameState.players.find(p => p.id === playerId);
        if (!playerInGame) {
            throw new Error("玩家不在该游戏中");
        }

        // 获取玩家的骰子信息 (GameManager 需要提供类似 getPlayerDices 的方法)
        const playerDices = this.gameManager.getPlayerDices(gameId, playerId);
        if (!playerDices) {
            // 可能游戏刚开始，骰子还未生成？或者出现错误
            console.warn(`[Socket服务器] getInitialGameState: 无法获取玩家 ${playerId} 在游戏 ${gameId} 中的骰子`);
            // 根据游戏逻辑决定是否返回错误，或者返回空数组
            // throw new Error("无法获取玩家骰子信息");
        }

        console.log(`[Socket服务器] 发送 getInitialGameState 响应给 ${playerId}`);
        callback({
          success: true,
          state: { // 发送完整的游戏状态给客户端处理
            gameId: gameState.gameId,
            players: gameState.players,
            activePlayers: gameState.activePlayers,
            currentPlayerIndex: gameState.currentPlayerIndex,
            currentBid: gameState.currentBid,
            roundNumber: gameState.roundNumber,
            moveNumber: gameState.moveNumber,
            status: gameState.status
            // 注意：这里不应包含所有玩家的骰子
          },
          dices: playerDices || [] // 只发送请求玩家自己的骰子
        });

      } catch (error: any) {
        console.error("[Socket服务器] 处理 getInitialGameState 异常:", error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的请求数据"
          : error.message || "获取初始游戏状态失败";
        if (callback) callback({ success: false, error: errorMessage });
      }
    });

    // 开始游戏 - 通常由房主发起，不需要客户端发送数据，依赖 socket.data.roomId
    socket.on("startGame", async (_data, callback) => { // _data 未使用
      try {
        if (!socket.data.roomId) {
          throw new Error("玩家未在房间中");
        }
        if (!socket.data.playerId) {
            throw new Error("无法识别玩家身份");
        }

        const roomId = socket.data.roomId as string;
        const playerId = socket.data.playerId as string; // 发起开始游戏的玩家

        // TODO: 验证发起者是否是房主（如果需要）
        // const room = await this.roomManager.getRoom(roomId);
        // if (!room || room.players[0] !== playerId) { // 假设房主是第一个加入的玩家
        //   throw new Error("只有房主才能开始游戏");
        // }

        const room = await this.roomManager.getRoom(roomId);
        if (!room) {
          throw new Error("房间不存在");
        }

        // 获取完整的玩家数据列表 (包含 isAI, aiType 等)
        const fullPlayerDataList = await Promise.all(
          room.players.map(async (pId) => {
            const player = await this.roomManager.getPlayer(pId);
            if (!player) {
              console.error(`[严重错误] startGame: 找不到房间 ${roomId} 中的玩家 ${pId}`);
              throw new Error(`找不到玩家：${pId}`);
            }
            // 附加当前的 socketId (如果存在)
            player.socketId = this.getSocketIdByPlayerId(pId);
            return player; // 返回 RoomManager 中的完整 Player 对象
          })
        );

        // 创建游戏，传递完整的玩家数据列表
        const gameState = await this.gameManager.createGame(roomId, fullPlayerDataList);

        // 更新房间状态
        await this.roomManager.updateRoomStatus(roomId, "gaming");

        // 广播游戏开始 (GameRoundManager 内部会广播初始状态)
        // this.io.to(roomId).emit("gameStart", {
        //   gameId: gameState.gameId,
        //   players: gameState.players // 初始玩家列表
        // });
        // 触发 GameManager 开始游戏逻辑，它会负责广播初始状态
        await this.gameManager.startGame(gameState.gameId);

        // 添加这行来通知所有客户端切换场景
        this.io.to(roomId).emit("gameStarted", { gameId: gameState.gameId });
        console.log(`[Socket服务器] 已向房间 ${roomId} 广播 gameStarted 事件`); // 添加日志确认

        // 广播大厅更新 (因为房间状态变为 gaming)
        this.broadcastLobbyUpdate(); // <--- 添加调用

        if (callback) {
          callback({ success: true, gameId: gameState.gameId });
        }
      } catch (error: any) {
        console.error("开始游戏失败:", error);
        if (callback) {
          callback({
            success: false,
            error: error.message || "开始游戏失败"
          });
        }
      }
    });

    // 骰子摇动请求
    socket.on("game:roll_dice", async (_data, callback) => {
      try {
        // Zod 验证
        const validatedData = RollDiceRequestSchema.parse(_data);
        const gameId = validatedData.gameId;
        // const count = validatedData.count || 5; // count 不应由客户端决定，由服务器根据玩家状态决定

        if (!socket.data.playerId) {
          throw new Error("玩家ID不存在");
        }
        const playerId = socket.data.playerId as string;

        // 获取玩家当前骰子数
        const gameState = this.gameManager.getGameState(gameId);
        const player = gameState?.players.find(p => p.id === playerId);
        if (!player) {
            throw new Error("玩家不在该游戏中");
        }
        const count = player.diceCount;


        // 摇骰子并生成结果
        const result = await this.gameManager.rollDice(gameId, playerId, count);

        // 回调函数返回骰子结果 (只返回给请求者)
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            dices: result.dices,
            seed: result.seed // 如果需要种子
          });
        }

        // 只给请求的玩家发送骰子结果 (GameManager 内部已处理)
        // socket.emit("game:dice_roll", {
        //   gameId,
        //   playerId: socket.data.playerId,
        //   dices: result.dices
        // });
      } catch (error: any) {
        console.error("摇骰子失败:", error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的摇骰子数据"
          : error.message || "摇骰子失败";
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: errorMessage
          });
        }
      }
    });

    // 玩家竞价
    socket.on("game:bid", async (_data, ack) => { // 添加 ack 回调参数
      let errorMessage = "处理竞价失败"; // Default error message
      try {
        // Zod 验证
        const validatedData = BidRequestSchema.parse(_data);
        const gameId = validatedData.gameId;
        const playerId = validatedData.playerId;
        const bid = validatedData.bid;

        // 验证玩家是否是发送请求的玩家
        if (socket.data.playerId !== playerId) {
          throw new Error("非法的玩家ID");
        }

        // 处理竞价 (GameRoundManager 内部会验证是否轮到该玩家)
        const result = await this.gameManager.handleBid(gameId, playerId, bid);

        if (!result) {
          // handleBid 内部验证失败（例如不是该玩家的回合，或叫价无效）
          // GameManager 应该已经处理了错误情况，这里可以不额外发送错误
          // 但为了明确，可以发送一个通用错误
           // 如果 handleBid 返回 false，也视为错误
           throw new Error("无效的竞价或操作");
        }

        // GameRoundManager 内部会处理广播

        // 成功处理，调用 ack
        if (ack) ack({ success: true });

      } catch (error: any) {
        console.error("处理竞价失败:", error);
        errorMessage = error instanceof z.ZodError
          ? "无效的竞价数据"
          : error.message || "处理竞价失败";
        // 移除旧的 game:error emit，改用 ack 回调
        // socket.emit("game:error", {
        //   type: "bid_error",
        //   message: errorMessage,
        // });

        // 失败时调用 ack
        if (ack) ack({ success: false, error: errorMessage });
      }
    });

    // 玩家质疑
    socket.on("game:challenge", async (_data, ack) => { // 添加 ack 回调参数
      let errorMessage = "处理质疑失败"; // Default error message
      try {
        // Zod 验证
        const validatedData = ChallengeRequestSchema.parse(_data);
        const gameId = validatedData.gameId;
        const playerId = validatedData.playerId;

        // 验证玩家是否是发送请求的玩家
        if (socket.data.playerId !== playerId) {
          throw new Error("非法的玩家ID");
        }

        // 处理质疑 (GameRoundManager 内部会验证是否轮到该玩家)
        await this.gameManager.handleChallenge(gameId, playerId);

        // GameRoundManager 内部会处理广播

        // 成功处理，调用 ack
        if (ack) ack({ success: true });

      } catch (error: any) {
        console.error("处理质疑失败:", error);
        errorMessage = error instanceof z.ZodError // Assign to existing variable
          ? "无效的质疑数据"
          : error.message || "处理质疑失败";
        // 移除旧的 game:error emit，改用 ack 回调
        // socket.emit("game:error", {
        //   type: "challenge_error",
        //   message: errorMessage,
        // });

        // 失败时调用 ack
        if (ack) ack({ success: false, error: errorMessage });
      }
    });

    // 玩家即时喊（Spot On）
    socket.on("game:spot_on", async (_data) => {
      try {
        // Zod 验证
        const validatedData = SpotOnRequestSchema.parse(_data);
        const gameId = validatedData.gameId;
        const playerId = validatedData.playerId;

        // 验证玩家是否是发送请求的玩家
        if (socket.data.playerId !== playerId) {
          throw new Error("非法的玩家ID");
        }

        // 处理即时喊 (GameRoundManager 内部会验证是否轮到该玩家)
        await this.gameManager.handleSpotOn(gameId, playerId);

        // GameRoundManager 内部会处理广播

      } catch (error: any) {
        console.error("处理即时喊失败:", error);
        const errorMessage = error instanceof z.ZodError
          ? "无效的即时喊数据"
          : error.message || "处理即时喊失败";
        socket.emit("game:error", {
          type: "spot_on_error",
          message: errorMessage,
          // details: error instanceof z.ZodError ? error.errors : undefined
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

        // 验证数据格式 (可选，因为是测试事件)
        // if (data === undefined || data === null) {
        //   console.warn(`[测试] Echo请求数据为空`);
        //   data = { message: "无数据" };
        // }

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
      } catch (error: any) {
        console.error(`[测试] Echo处理错误:`, error);
        // 如果有回调，返回错误信息
        if (callback && typeof callback === 'function') {
          callback({
            success: false,
            error: error.message || "Echo处理失败",
            timestamp: Date.now()
          });
        }
      }
    });
  }

  /**
   * 处理客户端断开连接
   */
  private async handleDisconnect(socket: Socket): Promise<void> { // 添加 async 和 Promise<void>
    try {
      const playerId = socket.data.playerId;
      const roomId = socket.data.roomId;

      if (roomId && playerId) {
        console.log(`[断开连接] 尝试离开房间, ID: "${roomId}", 玩家: ${playerId}`);

        // 先检查房间是否存在
        try {
          const room = await this.roomManager.getRoom(roomId); // 添加 await
          if (room) { // 现在判断的是 Room | null
            // 房间存在时才执行离开操作
            await this.roomManager.leaveRoom(roomId, playerId); // 添加 await

            // 尝试获取更新后的房间信息
            try {
              const updatedRoom = await this.roomManager.getRoom(roomId); // 添加 await
              if (updatedRoom) { // 现在判断的是 Room | null
                // 如果房间还存在，广播更新
                await this.broadcastRoomUpdate(roomId); // 添加 await
              } else {
               // 房间可能因为最后一人离开而被删除
               console.log(`[断开连接] 房间 ${roomId} 在玩家 ${playerId} 离开后被删除`);
               // RoomManager 的 roomClosed 事件会处理广播
              }
            } catch (error) {
              // 获取更新后房间信息时出错
              console.error(`[断开连接] 获取更新后房间 ${roomId} 信息时出错:`, error);
            }
          } else {
            console.log(`[断开连接] 房间 ${roomId} 不存在，无需执行离开操作`);
          }
        } catch (error) {
          // 记录错误但不抛出，避免影响其他清理操作
          console.error(`[断开连接] 处理玩家 ${playerId} 离开房间 ${roomId} 时出错:`, error);
        }

        // 无论房间是否关闭，只要玩家离开，都可能影响大厅列表（玩家数），触发广播
        // RoomManager 的事件监听器会处理状态变更和关闭，这里确保 player count 变化也被广播
        this.broadcastLobbyUpdate(); // <--- 添加调用

      } else {
          console.log(`[断开连接] Socket ${socket.id} 未关联玩家或房间`);
      }
    } catch (error) {
      // 记录错误但不抛出，避免影响其他清理操作
      console.error(`[断开连接] 处理断开连接发生未知错误 (Socket ID: ${socket.id}):`, error);
    }
  }

  /**
   * 广播房间更新消息
   * @param roomId 房间ID
   */
  private async broadcastRoomUpdate(roomId: string): Promise<void> {
    try {
      // 获取最新的房间信息
      const room = await this.roomManager.getRoom(roomId); // 已经有 await
      if (!room) { // 判断 Room | null
        // 房间可能已被删除，这是正常情况
        console.log(`[Socket服务器] 广播房间更新：房间 ${roomId} 不存在或已被删除，无法广播`);
        return;
      }

      // 向房间内所有客户端广播最新房间信息
      const sharedRoom = await this.roomManager.convertToSharedRoom(room.id);
      const eventData = { room: sharedRoom }; // Explicitly create the data object
      console.log(`[Socket服务器] Broadcasting roomUpdate to room ${roomId} with data:`, JSON.stringify(eventData).substring(0, 500)); // Log data before emitting
      this.io.to(roomId).emit("roomUpdate", eventData); // Send the object
      console.log(`[Socket服务器] 已广播房间 ${roomId} 更新，当前玩家数: ${room.players.length}`);
    } catch (error) {
      console.error(`[Socket服务器] 广播房间 ${roomId} 更新失败:`, error);
    }
  }

  /**
   * 广播游戏状态更新 (此方法可能不再需要，因为 GameManager 内部处理广播)
   * @param gameId 游戏ID
   */
  private broadcastGameState(gameId: string): void {
    console.warn("[弃用警告] broadcastGameState 在 SocketServer 中被调用，但 GameManager 应负责状态广播。");
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
      console.error(`广播游戏状态 ${gameId} 失败:`, error);
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

    this.io.close((err) => {
        if (err) {
            console.error("关闭 Socket.IO 服务器时出错:", err);
        } else {
            console.log("骰子游戏Socket服务器已关闭");
        }
    });
  }

  /**
   * 通过玩家ID获取Socket ID
   */
  private getSocketIdByPlayerId(playerId: string): string | undefined {
    // 优化：如果玩家断线重连，可能需要更可靠的方式查找 socket
    for (const [socketId, socket] of this.io.sockets.sockets.entries()) {
      if (socket.data.playerId === playerId) {
        return socketId;
      }
    }
    return undefined;
  }
}
