import { v4 as uuid } from "uuid";
import { RoomManager } from "../room/room-manager";
import { Face, Bid, EmptyBid } from "../../../../shared/protocols/game-types.d";
import { Server, Socket } from "socket.io";

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
interface PlayerData {
  id: string;
  name: string;
  diceCount: number;
  socketId?: string;
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
   * @param playerData 玩家数据列表
   * @returns 游戏状态
   */
  async createGame(roomId: string, playerData: PlayerData[]): Promise<GameState> {
    const gameId = uuid();
    
    const gameState: GameState = {
      gameId,
      roomId,
      players: playerData,
      activePlayers: playerData.map(p => p.id),
      currentPlayerIndex: 0,
      currentBid: [0, 0],
      roundNumber: 0,
      moveNumber: 0,
      status: "waiting",
      playerDices: new Map()
    };
    
    this.games.set(gameId, gameState);
    
    console.log(`[游戏][信息] 游戏已创建: ${gameId}, 房间: ${roomId}, 玩家数: ${playerData.length}`);
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
    
    // 广播游戏开始
    this.broadcastGameState(gameId);
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
    
    // 随机生成每个玩家的骰子
    await this.rollDicesForAllPlayers(gameId);
    
    // 广播回合开始
    this.broadcastGameState(gameId);
    console.log(`[游戏][信息] 回合开始: ${gameId}, 回合: ${game.roundNumber}`);
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
        
        // 如果有Socket.IO实例，向玩家发送骰子
        if (this.io && player.socketId) {
          this.io.to(player.socketId).emit("game:dice_roll", {
            gameId,
            playerId,
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
   * @returns 是否成功
   */
  async handleBid(gameId: string, playerId: string, bid: Bid): Promise<boolean> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    
    // 验证是否是当前玩家的回合
    const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
    if (currentPlayerId !== playerId) {
      return false;
    }
    
    // 验证竞价
    if (!this.validateBid(game, bid)) {
      return false;
    }
    
    // 更新竞价
    game.currentBid = bid;
    game.moveNumber++;
    
    // 轮到下一个玩家
    this.nextTurn(game);
    
    // 广播竞价更新
    this.broadcastBidUpdate(gameId, playerId, bid);
    
    return true;
  }

  /**
   * 验证竞价
   * @param game 游戏状态
   * @param bid 竞价
   * @returns 是否有效
   */
  private validateBid(game: GameState, bid: Bid): boolean {
    const [value, count] = bid;
    const [currentValue, currentCount] = game.currentBid;
    
    // 如果是首次竞价，任何有效竞价都可以
    if (currentValue === 0 && currentCount === 0) {
      return value >= 1 && value <= 6 && count > 0;
    }
    
    // 按照吹牛骰子规则验证竞价
    // 规则1: 数量增加，点数相同或任意
    if (count > currentCount) {
      return true;
    }
    
    // 规则2: 数量相同，点数增加
    if (count === currentCount && value > currentValue) {
      return true;
    }
    
    return false;
  }

  /**
   * 处理质疑
   * @param gameId 游戏ID
   * @param playerId 质疑玩家ID
   */
  async handleChallenge(gameId: string, playerId: string): Promise<{valid: boolean, totalCount: number, winner: string}> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    
    // 验证是否是当前玩家的回合
    const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
    if (currentPlayerId !== playerId) {
      throw new Error("不是你的回合");
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
      await this.startNewRound(gameId);
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
   */
  async handleSpotOn(gameId: string, playerId: string): Promise<{valid: boolean, totalCount: number, winner?: string}> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("游戏不存在");
    }
    
    // 验证是否是当前玩家的回合
    const currentPlayerId = game.activePlayers[game.currentPlayerIndex];
    if (currentPlayerId !== playerId) {
      throw new Error("不是你的回合");
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
      await this.startNewRound(gameId);
      
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
        await this.startNewRound(gameId);
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
   * 检查竞价有效性
   * @param game 游戏状态
   * @returns 竞价结果
   */
  private checkBidValidity(game: GameState): { valid: boolean, totalCount: number } {
    const [bidValue, bidCount] = game.currentBid;
    let totalCount = 0;
    
    // 使用保存的骰子数据而不是重新生成
    if (game.playerDices) {
      // 统计所有骰子中符合竞价值的数量
      for (const [playerId, dices] of game.playerDices.entries()) {
        for (const dice of dices) {
          if (dice === bidValue) {
            totalCount++;
          }
        }
      }
    } else {
      // 如果没有保存的骰子数据，则模拟骰子
      for (const playerId of game.activePlayers) {
        const playerIndex = game.players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          const player = game.players[playerIndex];
          const diceCount = player.diceCount;
          
          // 模拟骰子数据
          for (let i = 0; i < diceCount; i++) {
            const value = Math.ceil(Math.random() * 6) as Face;
            if (value === bidValue) {
              totalCount++;
            }
          }
        }
      }
    }
    
    return {
      valid: totalCount >= bidCount,
      totalCount
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
    
    // 如果没有骰子了，从活跃列表中移除
    if (game.players[playerIndex].diceCount <= 0) {
      const activeIndex = game.activePlayers.indexOf(playerId);
      if (activeIndex !== -1) {
        game.activePlayers.splice(activeIndex, 1);
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
    }
    
    // 广播游戏结束
    this.broadcastGameEnd(gameId);
    
    console.log(`[游戏][信息] 游戏结束: ${gameId}, 赢家: ${game.winner || "无"}`);
  }

  /**
   * 轮到下一个玩家
   * @param game 游戏状态
   */
  private nextTurn(game: GameState): void {
    // 移动到下一个玩家
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.activePlayers.length;
  }

  /**
   * 广播游戏状态
   * @param gameId 游戏ID
   */
  private broadcastGameState(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game || !this.io) return;
    
    // 向所有玩家广播游戏状态
    this.io.to(game.roomId).emit("game:state_update", {
      gameId: game.gameId,
      players: game.players,
      activePlayers: game.activePlayers,
      currentPlayerIndex: game.currentPlayerIndex,
      currentBid: game.currentBid,
      roundNumber: game.roundNumber,
      moveNumber: game.moveNumber,
      status: game.status
    });
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
    
    // 广播质疑结果
    this.io.to(game.roomId).emit("game:challenge_result", {
      gameId,
      challengerId,
      challengedId,
      valid: bidResult.valid,
      totalCount: bidResult.totalCount,
      loserId
    });
  }

  /**
   * 广播游戏结束
   * @param gameId 游戏ID
   */
  private broadcastGameEnd(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game || !this.io) return;
    
    // 广播游戏结束
    this.io.to(game.roomId).emit("game:game_end", {
      gameId,
      winner: game.winner,
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
}
