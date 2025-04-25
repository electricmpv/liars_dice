import { v4 as uuid } from "uuid";
import { RoomManager, Player as RoomPlayer } from "../room/room-manager"; // Import RoomPlayer if needed for createGame input
import { Face, Bid, EmptyBid } from "../../../../shared/protocols/game-types.d";
import { Server, Socket } from "socket.io";
import axios from 'axios'; // For calling AI service
import dotenv from 'dotenv'; // For environment variables

// Load environment variables for AI Service URL
dotenv.config();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3001'; // Default if not set

/**
 * 竞价数据接口
 */
interface BidData {
  playerId: string;
  bid: Bid;
}

/**
 * 骰子结果接口
 */
interface DiceResult {
  dices: Face[];
  seed: string;
}

/**
 * 玩家数据接口
 */
// This interface represents the player data *within* the game state
interface PlayerData {
  id: string;
  name: string;
  diceCount: number;
  isAI: boolean; // Added based on shared protocol
  aiType?: string; // Added based on shared protocol
  socketId?: string; // Keep optional socketId for human players
}

/**
 * 游戏状态接口
 */
interface GameState {
  gameId: string;
  roomId: string;
  players: PlayerData[];
  activePlayers: string[];
  currentPlayerIndex: number;
  currentBid: Bid | EmptyBid;
  roundNumber: number;
  moveNumber: number;
  status: "waiting" | "playing" | "finished";
  winner?: string;
  playerDices?: Map<string, Face[]>;
  isOneCalledThisRound?: boolean; // 新增：标记本回合是否有人叫过 '1'
}

/**
 * 游戏回合管理器
 */
// 添加状态快照和恢复机制
export class GameRoundManager {
  private games = new Map<string, GameState>();
  private stateSnapshots = new Map<string, GameState[]>();
  private io: Server | null = null;
  private roomManager: RoomManager | null = null;

  /**
   * 构造函数
   * @param io Socket.IO服务器实例
   * @param roomManager 房间管理器
   */
  constructor(io?: Server, roomManager?: RoomManager) {
    if (io) this.io = io;
    if (roomManager) this.roomManager = roomManager;
  }

  /**
   * 创建新游戏
   * @param roomId 房间ID
   * @param playerDataFromRoom 玩家数据列表 (应包含 isAI, aiType 等从 RoomManager 获取的完整信息)
   * @returns 游戏状态
   */
  // Update input parameter type to reflect the richer data coming from RoomManager
  async createGame(roomId: string, playerDataFromRoom: RoomPlayer[]): Promise<GameState> {
    const gameId = uuid();

    // Map the input player data to the internal PlayerData structure for the game state
    const gamePlayerData: PlayerData[] = playerDataFromRoom.map(p => ({
      id: p.id,
      name: p.name,
      diceCount: 5, // Standard starting dice count
      isAI: p.isAI,
      aiType: p.aiType,
      socketId: p.socketId // Pass socketId if available
    }));

    const gameState: GameState = {
      gameId,
      roomId,
      players: gamePlayerData, // Use the mapped data
      activePlayers: gamePlayerData.map(p => p.id),
      currentPlayerIndex: 0, // Typically randomized or starts with host, adjust as needed
      currentBid: [0, 0],
      roundNumber: 0,
      moveNumber: 0,
      status: "waiting",
      playerDices: new Map(),
      isOneCalledThisRound: false // 初始化状态
    };
    
    this.games.set(gameId, gameState);
    
    // Use the length of the processed gamePlayerData array for the log message
    console.log(`[游戏][信息] 游戏已创建: ${gameId}, 房间: ${roomId}, 玩家数: ${gamePlayerData.length}`);
    return gameState;
  }

  /**
   * 开始游戏
   * @param gameId 游戏ID
   */
  async startGame(gameId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    
    game.status = "playing";
    await this.startNewRound(gameId);
    
    // 广播游戏开始 (startNewRound 内部会广播状态)
    // this.broadcastGameState(gameId); // Redundant call removed
    console.log(`[游戏][信息] 游戏已开始: ${gameId}`);
  }

  /**
   * 开始新回合
   * @param gameId 游戏ID
   */
  async startNewRound(gameId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    
    game.roundNumber++;
    game.moveNumber = 0;
    game.currentBid = [0, 0];
    game.isOneCalledThisRound = false; // 每回合开始时重置状态
    
    // 随机生成每个玩家的骰子
    await this.rollDicesForAllPlayers(gameId);
    
    // 广播回合开始状态
    this.broadcastGameState(gameId);
    console.log(`[游戏][信息] 回合开始: ${gameId}, 回合: ${game.roundNumber}`);

    // --- 新增：检查新回合的第一个玩家是否为 AI，如果是则触发其行动 ---
    if (game.activePlayers.length > 0) {
        const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
        const currentPlayer = game.players.find(p => p.id === currentPlayerId);
        if (currentPlayer?.isAI) {
            console.log(`[游戏][信息] 新回合开始，当前玩家是 AI (${currentPlayerId})，触发 AI 回合...`);
            // 异步调用 triggerAITurn
            this.triggerAITurn(game.gameId).catch(error => {
                console.error(`[AI][严重错误] 在 startNewRound 中触发 AI 回合 (${currentPlayerId}) 时发生未捕获的错误:`, error);
            });
        } else {
            console.log(`[游戏][信息] 新回合开始，当前玩家是人类 (${currentPlayerId})`);
        }
    }
    // --- 新增结束 ---
  }

  /**
   * 为所有玩家生成骰子
   * @param gameId 游戏ID
   */
  private async rollDicesForAllPlayers(gameId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) return;
    
    // 清空现有骰子
    game.playerDices = new Map();
    
    // 为每个活跃玩家生成骰子并发送
    for (const playerId of game.activePlayers) {
      const playerIndex = game.players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        const player = game.players[playerIndex];
        const diceCount = player.diceCount;
        
        // 生成骰子
        const result = await this.rollDice(gameId, playerId, diceCount);
        
        // 保存到游戏状态
        game.playerDices.set(playerId, result.dices);
        
        // 如果有Socket.IO实例，并且玩家不是 AI，则向玩家发送骰子
        // AI不需要通过 Socket 接收自己的骰子
        if (this.io && player.socketId && !player.isAI) {
          console.log(`[游戏][调试] 向玩家 ${playerId} (${player.socketId}) 发送骰子`);
          this.io.to(player.socketId).emit("game:dice_roll", {
            gameId,
            playerId, // Keep playerId for client-side confirmation
            dices: result.dices
          });
        }
      }
    }
  }

  /**
   * 摇骰子
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param count 骰子数量
   * @returns 骰子结果
   */
  async rollDice(gameId: string, playerId: string, count: number): Promise<DiceResult> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    
    // 检查玩家是否在游戏中
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error("玩家不在游戏中");
    }
    
    // 生成骰子
    const dices: Face[] = [];
    for (let i = 0; i < count; i++) {
      const value = Math.ceil(Math.random() * 6) as Face;
      dices.push(value);
    }
    
    // 生成随机种子
    const seed = uuid();
    
    // 保存骰子结果到游戏状态
    if (game.playerDices) {
      game.playerDices.set(playerId, dices);
    } else {
      game.playerDices = new Map();
      game.playerDices.set(playerId, dices);
    }
    
    return {
      dices,
      seed
    };
  }

  /**
   * 处理竞价
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param bid 竞价
   * @param isAIAction 是否由 AI 触发 (默认为 false)
   * @returns 是否成功
   */
  async handleBid(gameId: string, playerId: string, bid: Bid, isAIAction: boolean = false): Promise<boolean> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }

    // 验证是否是当前玩家的回合 (根据是否为 AI 动作调整)
    const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
    if (!isAIAction) {
        // Human player action: Strict check
        if (currentPlayerId !== playerId) {
            console.warn(`[游戏][警告] 玩家 ${playerId} 尝试在非自己回合叫价 (当前玩家: ${currentPlayerId})`);
            // Throw error for human players trying to act out of turn
            throw new Error("不是你的回合");
            // return false; // Or return false if you prefer not to throw
        }
    } else {
        // AI action: Less strict check, mainly for sanity/logging
        if (currentPlayerId !== playerId) {
             console.error(`[AI][严重错误] AI (${playerId}) 尝试在非自己回合 (${currentPlayerId}) 叫价！时序错误。`);
             // This indicates a potential logic error in AI turn management
             throw new Error("AI 行动时序错误");
             // return false;
        }
    }
    
    // 验证竞价
    if (!this.validateBid(game, bid)) {
      console.warn(`[游戏][警告] 玩家 ${playerId} 叫价 [${bid[0]}, ${bid[1]}] 无效 (当前叫价: [${game.currentBid[0]}, ${game.currentBid[1]}])`);
      return false; // 叫价无效
    }
    
    // 更新竞价
    game.currentBid = bid;
    game.moveNumber++;
    console.log(`[游戏][信息] 玩家 ${playerId} 叫价 [${bid[0]}, ${bid[1]}] 成功`);

    // 如果叫价是 '1'，则标记本回合 '1' 已被叫过
    if (bid[0] === 1) {
      game.isOneCalledThisRound = true;
      console.log(`[游戏][信息] 本回合 ${game.roundNumber}，玩家 ${playerId} 叫了 '1'，'1' 不再是万能点。`);
    }
    
    // 轮到下一个玩家
    this.nextTurn(game);
    console.log(`[游戏][信息] 轮到玩家: ${game.activePlayers[game.currentPlayerIndex]} (索引: ${game.currentPlayerIndex})`);
    
    // 广播竞价更新 (让客户端知道谁叫了什么)
    this.broadcastBidUpdate(gameId, playerId, bid);
    // 紧接着广播完整的游戏状态，包含更新后的 currentPlayerIndex
    this.broadcastGameState(gameId); // <--- 重新添加这一行

    return true;
  }

  /**
   * 验证竞价
   * @param game 游戏状态
   * @param bid 竞价
   * @returns 是否有效
   */
  private validateBid(game: GameState, bid: Bid): boolean {
    const [newValue, newCount] = bid;
    const [currentValue, currentCount] = game.currentBid;

    // 基础验证：点数和数量必须有效
    if (newValue < 1 || newValue > 6 || newCount <= 0) {
      return false;
    }

    // 如果是首次竞价
    if (currentValue === 0 && currentCount === 0) {
      return true; // 任何有效叫价都可以
    }

    // --- 新叫价规则 (点数层级: 2 < 3 < 4 < 5 < 6 < 1) ---

    // 1. 数量增加总是有效的
    if (newCount > currentCount) {
      return true;
    }

    // 2. 数量相同时，点数必须按新层级增加
    if (newCount === currentCount) {
      // 定义点数比较函数 (考虑 1 > 6)
      const isNewFaceHigher = (newFace: Face, currentFace: Face): boolean => {
        if (currentFace === 1) return false; // 没有点数比 1 大
        if (newFace === 1) return true;  // 1 比 2-6 都大
        // 如果都不是 1，正常比较
        return newFace > currentFace;
      };

      if (isNewFaceHigher(newValue, currentValue)) {
        return true;
      }
    }

    // 如果数量没有增加，且数量相同时点数没有按层级增加，则无效
    return false;
  }

  /**
   * 处理质疑
   * @param gameId 游戏ID
   * @param playerId 质疑玩家ID
   * @param isAIAction 是否由 AI 触发 (默认为 false)
   */
  async handleChallenge(gameId: string, playerId: string, isAIAction: boolean = false): Promise<{valid: boolean, totalCount: number, winner: string}> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }

    // 验证是否是当前玩家的回合 (根据是否为 AI 动作调整)
    const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
     if (!isAIAction) {
        // Human player action: Strict check
        if (currentPlayerId !== playerId) {
            console.warn(`[游戏][警告] 玩家 ${playerId} 尝试在非自己回合挑战 (当前玩家: ${currentPlayerId})`);
            throw new Error("不是你的回合");
        }
    } else {
        // AI action: Less strict check
        if (currentPlayerId !== playerId) {
             console.error(`[AI][严重错误] AI (${playerId}) 尝试在非自己回合 (${currentPlayerId}) 挑战！时序错误。`);
             throw new Error("AI 行动时序错误");
        }
    }
    
    // 获取上一个竞价者
    let previousBidderIndex = (game.currentPlayerIndex - 1 + game.activePlayers.length) % game.activePlayers.length;
    const previousBidderId = game.activePlayers[previousBidderIndex];
    
    // 验证竞价
    const bidResult = this.checkBidValidity(game);
    
    // 决定输家
    let loserId: string;
    if (bidResult.valid) {
      // 如果竞价有效，质疑者输
      loserId = playerId;
    } else {
      // 如果竞价无效，上一个竞价者输
      loserId = previousBidderId;
    }
    
    // 处理输家
    this.handlePlayerLoss(gameId, loserId);
    
    // 广播质疑结果
    this.broadcastChallengeResult(gameId, playerId, previousBidderId, bidResult, loserId);
    
    // 检查游戏是否结束
    if (game.activePlayers.length <= 1) {
      this.endGame(gameId);
    } else {
      // 开始新回合
      await this.startNewRound(gameId); // startNewRound 内部会广播状态
    }
    
    return {
      valid: bidResult.valid,
      totalCount: bidResult.totalCount,
      winner: game.winner || ""
    };
  }

  /**
   * 处理即时喊（Spot On）
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param isAIAction 是否由 AI 触发 (默认为 false)
   */
  async handleSpotOn(gameId: string, playerId: string, isAIAction: boolean = false): Promise<{valid: boolean, totalCount: number, winner?: string}> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }

    // 验证是否是当前玩家的回合 (根据是否为 AI 动作调整)
    const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
    if (!isAIAction) {
        // Human player action: Strict check
        if (currentPlayerId !== playerId) {
             console.warn(`[游戏][警告] 玩家 ${playerId} 尝试在非自己回合喊准 (当前玩家: ${currentPlayerId})`);
            throw new Error("不是你的回合");
        }
    } else {
        // AI action: Less strict check
        if (currentPlayerId !== playerId) {
             console.error(`[AI][严重错误] AI (${playerId}) 尝试在非自己回合 (${currentPlayerId}) 喊准！时序错误。`);
             throw new Error("AI 行动时序错误");
        }
    }
    
    // 获取当前竞价
    const [bidValue, bidCount] = game.currentBid;
    
    // 只有当有竞价时才能使用即时喊
    if (bidValue === 0 && bidCount === 0) {
      throw new Error("没有可质疑的竞价");
    }
    
    // 验证竞价
    const bidResult = this.checkBidValidity(game);
    
    // 如果竞价完全正确（Spot On）
    if (bidResult.totalCount === bidCount) {
      // 玩家获得额外的骰子（奖励）
      const playerIndex = game.players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        game.players[playerIndex].diceCount++;
      }
      
      // 开始新回合
      await this.startNewRound(gameId); // startNewRound 内部会广播状态
      
      return {
        valid: true,
        totalCount: bidResult.totalCount,
        winner: undefined
      };
    } else {
      // 即时喊错误，玩家失去一个骰子
      this.handlePlayerLoss(gameId, playerId);
      
      // 检查游戏是否结束
      if (game.activePlayers.length <= 1) {
        this.endGame(gameId);
      } else {
        // 开始新回合
        await this.startNewRound(gameId); // startNewRound 内部会广播状态
      }
      
      return {
        valid: false,
        totalCount: bidResult.totalCount,
        winner: game.winner
      };
    }
  }

  /**
   * 获取游戏状态
   * @param gameId 游戏ID
   * @returns 游戏状态
   */
  getGameState(gameId: string): GameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    return game;
  }

  /**
   * 获取指定玩家的骰子
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @returns 玩家的骰子数组或 null
   */
  getPlayerDices(gameId: string, playerId: string): Face[] | null {
    const game = this.games.get(gameId);
    if (!game || !game.playerDices) {
      return null; // 游戏不存在或骰子数据不存在
    }
    return game.playerDices.get(playerId) || null; // 返回玩家骰子或 null
  }

  /**
   * 检查竞价有效性
   * @param game 游戏状态
   * @returns 竞价结果
   */
  private checkBidValidity(game: GameState): { valid: boolean, totalCount: number } {
    const [bidValue, bidCount] = game.currentBid;
    let totalCount = 0;
    let wildCount = 0; // 统计 '1' 的数量

    // 确保有骰子数据
    if (!game.playerDices) {
        console.error(`[严重错误] 游戏 ${game.gameId} 在 checkBidValidity 时没有骰子数据!`);
        // 可以在这里抛出错误或返回一个默认无效的结果
        return { valid: false, totalCount: 0 };
    }

    // 遍历所有活跃玩家的骰子
    for (const playerId of game.activePlayers) {
        const dices = game.playerDices.get(playerId);
        if (dices) {
            for (const dice of dices) {
                if (dice === 1) {
                    wildCount++; // 统计万能点 '1'
                }
                // 如果叫价的点数不是 '1'，且当前骰子点数与叫价相同
                if (bidValue !== 1 && dice === bidValue) {
                    totalCount++;
                }
            }
        }
    }

    // --- 核心规则调整：根据本回合是否叫过 '1' 决定如何计算 ---
    const oneIsWild = !game.isOneCalledThisRound; // 如果本回合没叫过 '1'，则 '1' 是万能点

    if (bidValue === 1) {
      // 如果叫价是 '1'，只计算实际的 '1' (wildCount)
      totalCount = wildCount;
    } else {
      // 如果叫价是 2-6
      if (oneIsWild) {
        // 如果 '1' 是万能点，总数 = 实际点数 + 万能点
        totalCount += wildCount;
      }
      // 如果 '1' 不是万能点，totalCount 保持不变 (即循环中累加的实际点数)
    }

    console.log(`[游戏][调试] checkBidValidity: 叫价=[${bidValue}, ${bidCount}], 本回合是否叫过1=${game.isOneCalledThisRound}, 1是否万能=${oneIsWild}, 实际点数=${totalCount - (oneIsWild && bidValue !== 1 ? wildCount : 0)}, 万能点=${wildCount}, 计算总数=${totalCount}, 结果=${totalCount >= bidCount}`);

    return {
      valid: totalCount >= bidCount,
      totalCount // 返回实际计算的总数
    };
  }

  /**
   * 处理玩家失败
   * @param gameId 游戏ID
   * @param playerId 失败玩家ID
   */
  private handlePlayerLoss(gameId: string, playerId: string): void {
    const game = this.games.get(gameId);
    if (!game) return;
    
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    // 减少骰子数量
    game.players[playerIndex].diceCount--;
    console.log(`[游戏][信息] 玩家 ${playerId} 失去一个骰子，剩余: ${game.players[playerIndex].diceCount}`);
    
    // 如果没有骰子了，从活跃列表中移除
    if (game.players[playerIndex].diceCount <= 0) {
      const activeIndex = game.activePlayers.indexOf(playerId);
      if (activeIndex !== -1) {
        game.activePlayers.splice(activeIndex, 1);
        console.log(`[游戏][信息] 玩家 ${playerId} 已被淘汰`);
      }
      // 如果移除后当前玩家索引超出了范围，重置为0（或根据游戏逻辑调整）
      if (game.currentPlayerIndex >= game.activePlayers.length) {
          game.currentPlayerIndex = 0;
      }
    }
  }

  /**
   * 结束游戏
   * @param gameId 游戏ID
   */
  private endGame(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game) return;
    
    game.status = "finished";
    
    // 设置赢家
    if (game.activePlayers.length === 1) {
      game.winner = game.activePlayers[0];
    } else {
        console.warn(`[游戏][警告] 游戏 ${gameId} 结束时有 ${game.activePlayers.length} 个活跃玩家，无法确定唯一赢家。`);
        // 可以根据规则设置平局或不设置赢家
    }
    
    // 广播游戏结束
    this.broadcastGameEnd(gameId);

    // 更新房间状态为关闭
    if (this.roomManager) {
      this.roomManager.updateRoomStatus(game.roomId, 'closed') // 直接关闭房间
        .then(result => {
          if (result.success) {
            console.log(`[游戏][信息] 游戏 ${gameId} 结束后，房间 ${game.roomId} 状态已更新为 closed`);
            // RoomManager 的 'roomClosed' 事件会触发 SocketServer 的大厅广播
          } else {
            console.error(`[游戏][错误] 更新房间 ${game.roomId} 状态为 closed 失败: ${result.error}`);
          }
        })
        .catch(error => {
          console.error(`[游戏][严重错误] 调用 RoomManager 更新房间 ${game.roomId} 状态时异常:`, error);
        });
    } else {
      console.error(`[严重错误] GameManager 未能访问 RoomManager 实例，无法更新房间 ${game.roomId} 状态！`);
    }

    console.log(`[游戏][信息] 游戏结束: ${gameId}, 赢家: ${game.winner || "无"}`);
    // 可以在这里清理游戏数据
    // this.games.delete(gameId);
    // this.stateSnapshots.delete(gameId);
  }

  /**
   * 轮到下一个玩家
   * @param game 游戏状态
   */
  private async nextTurn(game: GameState): Promise<void> { // Mark as async
    if (game.activePlayers.length > 0) {
        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.activePlayers.length;
        const nextPlayerId = game.activePlayers[game.currentPlayerIndex];
        const nextPlayer = game.players.find(p => p.id === nextPlayerId);

        if (nextPlayer?.isAI) {
            console.log(`[游戏][信息] 下一个玩家是 AI (${nextPlayerId})，触发 AI 回合...`);
            // Call triggerAITurn asynchronously (fire and forget)
            this.triggerAITurn(game.gameId).catch(error => {
                console.error(`[AI][严重错误] 触发 AI 回合 (${nextPlayerId}) 时发生未捕获的错误:`, error);
                // Consider fallback or error handling if AI turn fails catastrophically
            });
        } else {
             console.log(`[游戏][信息] 下一个玩家是人类 (${nextPlayerId})`);
        }

    } else {
        console.error(`[严重错误] 游戏 ${game.gameId} 在 nextTurn 时没有活跃玩家!`);
        // 可能需要结束游戏或处理异常状态
        // Consider ending the game here if no active players remain
        if (game.status !== 'finished') {
            this.endGame(game.gameId);
        }
    }
  }

  /**
   * Triggers the AI logic for the current AI player's turn.
   * This method runs asynchronously and handles getting the AI decision
   * and applying it to the game state.
   * @param gameId The ID of the game.
   */
  private async triggerAITurn(gameId: string): Promise<void> {
    // Short delay to simulate thinking (optional, adjust as needed)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500)); // e.g., 1-2.5 seconds

    // --- Initial State Check ---
    let initialGame = this.games.get(gameId);
    if (!initialGame || initialGame.status !== 'playing') {
      console.warn(`[AI][警告] 游戏 ${gameId} 状态不再是 'playing' 或游戏不存在，取消 AI 回合`);
      return;
    }
    const initialAiPlayerId = initialGame.activePlayers[initialGame.currentPlayerIndex];
    const initialAiPlayer = initialGame.players.find(p => p.id === initialAiPlayerId);

    if (!initialAiPlayer?.isAI) {
        console.warn(`[AI][警告] 游戏 ${gameId} 当前玩家 (${initialAiPlayerId}) 在 AI 回合开始时不再是 AI，取消行动`);
        return;
    }
    console.log(`[AI][信息] 玩家 ${initialAiPlayerId} 开始执行 AI 回合逻辑...`);

    try {
        // --- Get AI Action ---
        // Re-fetch game state before getting action, in case of rapid changes (though less likely with delay)
        const currentGame = this.games.get(gameId);
        if (!currentGame || currentGame.status !== 'playing' || currentGame.activePlayers[currentGame.currentPlayerIndex] !== initialAiPlayerId) {
             console.warn(`[AI][警告] 游戏 ${gameId} 状态在获取 AI 行动前发生变化，取消 AI 回合`);
             return;
        }

        const aiDecision = await this.getAIAction(currentGame, initialAiPlayerId);
        console.log(`[AI][信息] 玩家 ${initialAiPlayerId} 收到 AI 决策:`, aiDecision);

        // --- Final State Check before applying action ---
        const finalCheckGame = this.games.get(gameId);
        if (!finalCheckGame || finalCheckGame.status !== 'playing' || finalCheckGame.activePlayers[finalCheckGame.currentPlayerIndex] !== initialAiPlayerId) {
            console.warn(`[AI][警告] 游戏 ${gameId} 状态在应用 AI 行动前发生变化，取消 AI 回合`);
            return;
        }

        // --- Apply AI Action ---
        console.log(`[AI][信息] 玩家 ${initialAiPlayerId} 正在应用决策: ${aiDecision.action}`);
        let actionSuccess = false;
        try {
            switch (aiDecision.action) {
                case 'bid':
                    // Validate AI bid again server-side before applying
                    if (this.validateBid(finalCheckGame, [aiDecision.value, aiDecision.count])) {
                        // Pass isAIAction = true to bypass human turn check
                        actionSuccess = await this.handleBid(gameId, initialAiPlayerId, [aiDecision.value, aiDecision.count], true);
                    } else {
                         console.error(`[AI][错误] AI ${initialAiPlayerId} 尝试无效叫价 [${aiDecision.value}, ${aiDecision.count}] (当前: [${finalCheckGame.currentBid[0]}, ${finalCheckGame.currentBid[1]}])`);
                         // Consider triggering fallback or specific error handling
                         // For now, let it fall through to the error handler below
                         throw new Error("AI returned invalid bid");
                    }
                    break;
                case 'challenge':
                    // Pass isAIAction = true
                    await this.handleChallenge(gameId, initialAiPlayerId, true);
                    actionSuccess = true; // Assume success if no error thrown
                    break;
                case 'spot_on':
                     // Pass isAIAction = true
                    await this.handleSpotOn(gameId, initialAiPlayerId, true);
                    actionSuccess = true; // Assume success if no error thrown
                    break;
                default:
                    console.error(`[AI][错误] AI ${initialAiPlayerId} 返回未知动作: ${aiDecision.action}`);
                    throw new Error("AI returned unknown action");
            }
             console.log(`[AI][信息] 玩家 ${initialAiPlayerId} 决策 ${aiDecision.action} 应用 ${actionSuccess ? '成功' : '失败'}`);

        } catch (actionError: any) {
             console.error(`[AI][错误] 应用 AI (${initialAiPlayerId}) 动作 ${aiDecision.action} 时出错: ${actionError.message}`);
             // Decide how to handle action errors, e.g., force a fallback challenge?
             // For now, just log the error. The game might be stuck if the action fails.
             // Consider adding logic here to force a simple, safe action like challenge if the primary action fails.
        }

    } catch (error) {
        console.error(`[AI][严重错误] 处理 AI 玩家 ${initialAiPlayerId} 回合时发生意外错误:`, error);
        // Consider more robust error handling, maybe try a fallback action one last time
    }
  }

  /**
   * 广播游戏状态
   * @param gameId 游戏ID
   */
  private broadcastGameState(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game || !this.io) {
        console.error(`[广播状态错误] 无法广播游戏 ${gameId}: 游戏不存在或 io 未设置。`);
        return;
    }

    const stateData = {
        gameId: game.gameId,
        players: game.players,
        activePlayers: game.activePlayers,
        currentPlayerIndex: game.currentPlayerIndex,
        currentBid: game.currentBid,
        roundNumber: game.roundNumber,
        moveNumber: game.moveNumber,
        status: game.status
    };

    console.log(`[游戏][广播] 广播 game:state_update 到房间 ${game.roomId}, 数据:`, JSON.stringify(stateData)); // 添加详细日志

    // 向所有玩家广播游戏状态
    this.io.to(game.roomId).emit("game:state_update", stateData);
  }

  /**
   * 广播竞价更新
   * @param gameId 游戏ID
   * @param playerId 玩家ID
   * @param bid 竞价
   */
  private broadcastBidUpdate(gameId: string, playerId: string, bid: Bid): void {
    const game = this.games.get(gameId);
    if (!game || !this.io) return;
    
    console.log(`[游戏][广播] 广播 game:bid_update 到房间 ${game.roomId}, 玩家: ${playerId}, 叫价: [${bid[0]}, ${bid[1]}]`); // 添加日志
    // 广播竞价更新
    this.io.to(game.roomId).emit("game:bid_update", {
      gameId,
      playerId,
      bid
    });
  }

  /**
   * 广播质疑结果
   * @param gameId 游戏ID
   * @param challengerId 质疑者ID
   * @param challengedId 被质疑者ID
   * @param bidResult 竞价结果
   * @param loserId 失败者ID
   */
  private broadcastChallengeResult(
    gameId: string,
    challengerId: string,
    challengedId: string,
    bidResult: { valid: boolean, totalCount: number },
    loserId: string
  ): void {
    const game = this.games.get(gameId);
    if (!game || !this.io) return;
    
    console.log(`[游戏][广播] 广播 game:challenge_result 到房间 ${game.roomId}`); // 添加日志
    // 广播质疑结果
    this.io.to(game.roomId).emit("game:challenge_result", {
      gameId,
      challengerId,
      challengedId,
      valid: bidResult.valid, // Note: This 'valid' means the bid was valid (challenge failed)
      totalCount: bidResult.totalCount,
      loserId,
      bid: game.currentBid // Add the bid that was challenged
    });
  }

  /**
   * 广播游戏结束
   * @param gameId 游戏ID
   */
  private broadcastGameEnd(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game || !this.io) return;
    
    console.log(`[游戏][广播] 广播 game:game_end 到房间 ${game.roomId}`); // 添加日志
    // 广播游戏结束
    this.io.to(game.roomId).emit("game:game_end", {
      gameId,
      winner: game.winner,
      players: game.players, // 添加 players 数组
      status: game.status
    });
  }

  /**
   * 保存游戏状态快照
   * @param gameId 游戏ID
   * @param state 游戏状态
   */
  private saveSnapshot(gameId: string, state: GameState): void {
    if (!this.stateSnapshots.has(gameId)) {
      this.stateSnapshots.set(gameId, []);
    }
    this.stateSnapshots.get(gameId)?.push({...state});
  }

  /**
   * Gets an action decision from the AI service.
   * @param gameState The current game state.
   * @param aiPlayerId The ID of the AI player whose turn it is.
   * @returns The AI's decision object or null if an error occurred.
   */
  private async getAIAction(gameState: GameState, aiPlayerId: string): Promise<any> {
    const aiPlayer = gameState.players.find(p => p.id === aiPlayerId);
    const aiPlayerDice = gameState.playerDices?.get(aiPlayerId);

    if (!aiPlayer || !aiPlayerDice) {
      console.error(`[AI][错误] 无法在游戏 ${gameState.gameId} 中找到 AI 玩家 ${aiPlayerId} 的数据或骰子`);
      return this.getFallbackAIAction(gameState, aiPlayerId); // Use fallback if data missing
    }

    // Construct payload for the AI service
    const aiServicePayload = {
      aiPlayerId: aiPlayer.id,
      aiPlayerDice: aiPlayerDice,
      currentBid: gameState.currentBid,
      totalDiceInGame: gameState.activePlayers.reduce((sum, pId) => {
        const pData = gameState.players.find(p => p.id === pId);
        return sum + (pData?.diceCount || 0);
      }, 0),
      activePlayerIds: gameState.activePlayers,
      isOneCalledThisRound: gameState.isOneCalledThisRound,
      aiType: aiPlayer.aiType || 'coward', // Default to coward if not specified
      // Add any other relevant game state info needed by the AI service/LLM
      // e.g., roundNumber, moveNumber, player dice counts if needed
    };

    console.log(`[AI][调试] 向 AI 服务 (${AI_SERVICE_URL}/decideAction) 发送负载:`, JSON.stringify(aiServicePayload));

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/decideAction`, aiServicePayload, {
        timeout: 15000 // Increased timeout to 15 seconds
      });

      console.log(`[AI][调试] 从 AI 服务收到响应:`, response.data);

      // Basic validation of the response structure (more robust validation should be in AI service)
      if (response.data && response.data.action) {
        // TODO: Add Zod validation here based on the expected AI decision schema
        // For now, just return the data
        return response.data;
      } else {
        console.error(`[AI][错误] AI 服务响应无效:`, response.data);
        return this.getFallbackAIAction(gameState, aiPlayerId);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(`[AI][错误] 调用 AI 服务失败 (${error.code}): ${error.message}`, error.response?.data || '');
      } else {
        console.error(`[AI][错误] 调用 AI 服务时发生未知错误:`, error);
      }
      return this.getFallbackAIAction(gameState, aiPlayerId);
    }
  }

  /**
   * Provides a simple fallback action for the AI if the AI service fails.
   * @param gameState The current game state.
   * @param aiPlayerId The ID of the AI player.
   * @returns A fallback decision object.
   */
  private getFallbackAIAction(gameState: GameState, aiPlayerId: string): any {
    console.warn(`[AI][警告] 游戏 ${gameState.gameId} 正在为玩家 ${aiPlayerId} 使用兜底 AI 决策`);

    // Simple fallback: Challenge if possible, otherwise bid 1x '1'
    if (gameState.currentBid[0] !== 0 && gameState.currentBid[1] !== 0) {
      // Check if challenging is valid (e.g., not the first move)
      if (gameState.moveNumber > 0) {
         console.log("[AI][兜底] 决策: challenge");
         return { action: 'challenge' };
      }
    }

    // Fallback to bidding the lowest possible valid bid: 1x '1'
    // Need to ensure this bid is valid compared to currentBid if it exists
    const fallbackBid: Bid = [1, 1];
    if (this.validateBid(gameState, fallbackBid)) {
        console.log("[AI][兜底] 决策: bid [1, 1]");
        return { action: 'bid', value: 1, count: 1 };
    } else {
        // This case should be rare if 1x1 is the absolute lowest bid
        // If even 1x1 is not valid, maybe challenge is the only option left?
        // Or perhaps a more complex fallback is needed. For now, default to challenge.
        console.log("[AI][兜底] 决策: 无法叫 1x1，强制 challenge");
        return { action: 'challenge' };
    }
  }
}
