import { Room, Client, Clock } from "@colyseus/core";
import { MapSchema, ArraySchema } from "@colyseus/schema";
import { LiarDiceRoomState, PlayerState } from "../../../shared/schemas/LiarDiceState";
import { v4 as uuid } from "uuid";
import { GameLogic } from "./game-logic";
import { AIServiceClient } from "./ai-service-client";
import { MessageHandler } from "./message-handler";
import { AIManager } from "./ai-manager";
// Assuming game-types are now correctly defined/exported from a shared or local types file
import { Face, Bid, EmptyBid, AIActionDecision } from './types/game-types'; // Adjust path if necessary
import { debugSchema, fixPlayerState, initializeSchemaMetadata } from "../debug-schema";

export class LiarDiceRoom extends Room<LiarDiceRoomState> {

  // --- Member Variables ---
  public gameLogic!: GameLogic; // Public for MessageHandler/AIManager access, initialized in onCreate
  private aiClient!: AIServiceClient; // Private as only AIManager needs it, initialized in onCreate
  private messageHandler!: MessageHandler; // Initialized in onCreate
  public aiManager!: AIManager; // Public for MessageHandler/internal access, initialized in onCreate
  // Internal storage for current round's dice rolls (NOT reflected in state)
  public internalDiceRolls = new Map<string, Face[]>(); // Public for AIManager/GameLogic access

  // --- Colyseus Lifecycle Methods ---

  onCreate(options: any) {
    try {
      console.log(`[LiarDiceRoom ${this.roomId}] Creating room...`, options);

      // 创建一个新的状态实例
      const state = new LiarDiceRoomState();
      
      // 使用 setState 方法设置状态
      this.setState(state);
      
      // 初始化 Schema 元数据，确保所有属性都正确初始化
      initializeSchemaMetadata(this.state);
      
      // 调试状态Schema
      console.log(`[LiarDiceRoom ${this.roomId}] 调试房间状态Schema`);
      debugSchema(this.state, "LiarDiceRoomState");
      
      // 设置房间属性
      this.maxClients = 6; // 最大玩家数

      // 初始化游戏逻辑和管理类
      this.gameLogic = new GameLogic();
      this.aiClient = new AIServiceClient();
      this.aiManager = new AIManager(this, this.aiClient); // 传递房间实例和 AI 客户端
      this.messageHandler = new MessageHandler(this); // 传递房间实例

      // 注册消息处理程序
      this.messageHandler.registerHandlers();

      // 设置定时器，定期检查房间状态
      this.setSimulationInterval(() => {
        // 检查房间状态，如果需要可以在这里添加逻辑
      }, 1000);

      console.log(`[LiarDiceRoom ${this.roomId}] Room created and waiting for players.`);
    } catch (error) {
      console.error(`[LiarDiceRoom ${this.roomId}] Error creating room:`, error);
      throw error; // 重新抛出错误，让 Colyseus 处理
    }
  }

  // (可选) 玩家加入前的验证逻辑 - 现在处理游客和未来注册用户
  onAuth(client: Client, options: any, _request: any): { playerId: string, playerName: string } {
    console.log(`[LiarDiceRoom ${this.roomId}] Auth attempt: sessionId=${client.sessionId}, options=`, options);

    // TODO: Implement database/token based authentication for registered users
    if (options.token) {
        // Example: Verify token, fetch user data
        // const userData = await verifyTokenAndGetUser(options.token);
        // if (!userData) {
        //     throw new Error("Invalid token");
        // }
        // console.log(`[LiarDiceRoom ${this.roomId}] Registered user authenticated: ${userData.username}`);
        // return { playerId: userData.id, playerName: userData.username };
        console.warn(`[LiarDiceRoom ${this.roomId}] Token authentication not yet implemented.`);
        // For now, let token users proceed as guests for testing
    }

    // Guest Login Logic
    console.log(`[LiarDiceRoom ${this.roomId}] Handling as Guest Login for ${client.sessionId}`);
    const guestId = `guest_${uuid().substring(0, 8)}`;
    const guestName = `游客_${guestId.substring(6)}`; // Use part of the ID for name
    return { playerId: guestId, playerName: guestName };
  }

  // 玩家成功加入房间时调用 - 使用 onAuth 返回的数据 (Colyseus 0.15.x signature)
  onJoin(client: Client, options?: any, auth?: { playerId: string, playerName: string }) {
    try {
      // Handle cases where onAuth might fail or not return data (though unlikely with current guest logic)
      const playerId = auth?.playerId || `guest_${Date.now()}`;
      const playerName = options?.playerName || auth?.playerName || `游客_${playerId.substring(6)}`;

      console.log(`[LiarDiceRoom ${this.roomId}] Player joined: sessionId=${client.sessionId}, Name=${playerName}, ID=${playerId}`);

      // 创建玩家状态实例 - 使用来自 onAuth 的数据 (或备用值)
      const player = new PlayerState();
      
      // 手动设置每个属性，避免使用assign方法
      player.id = playerId;
      player.sessionId = client.sessionId;
      player.name = playerName;
      player.diceCount = 5;
      player.isReady = false;
      player.isConnected = true;
      player.isAI = false; // Human players are not AI
      
      // 调试玩家Schema
      console.log(`[LiarDiceRoom ${this.roomId}] 调试玩家Schema`);
      debugSchema(player, "PlayerState");
      
      // 确保currentDices被正确初始化
      fixPlayerState(player);
      
      // 添加到状态中
      this.state.players.set(client.sessionId, player);

      // 如果是第一个加入的玩家，设为房主
      if (this.state.players.size === 1) {
        this.state.hostId = client.sessionId;
        console.log(`[LiarDiceRoom ${this.roomId}] Player ${playerName} is now the host.`);
      }
      
      // 检查状态是否正确同步
      const playerCount = this.state.players.size;
      const playerList = Array.from(this.state.players.entries()).map(([id, p]) => ({ id, name: p.name }));
      console.log(`[LiarDiceRoom ${this.roomId}] Total players: ${playerCount}, Players: ${JSON.stringify(playerList)}, Host: ${this.state.hostId}`);
      
      // 再次调试整个房间状态
      console.log(`[LiarDiceRoom ${this.roomId}] 调试更新后的房间状态Schema`);
      debugSchema(this.state, "LiarDiceRoomState");
      
      // 强制广播状态更新
      this.broadcast("stateSync", { 
        playerCount, 
        hostId: this.state.hostId,
        players: Array.from(this.state.players.entries()).map(([id, p]) => ({
          id: id,
          name: p.name,
          isReady: p.isReady,
          isAI: p.isAI,
          diceCount: p.diceCount
        }))
      });
      
      // 尝试直接发送玩家数据给客户端
      client.send("playerData", {
        id: client.sessionId,
        name: playerName,
        isHost: this.state.hostId === client.sessionId,
        playerList: Array.from(this.state.players.entries()).map(([id, p]) => ({
          id: id,
          name: p.name,
          isReady: p.isReady,
          isAI: p.isAI,
          diceCount: p.diceCount
        }))
      });
      
      // 延迟一下再次广播，确保客户端收到状态
      this.clock.setTimeout(() => {
        if (this.state.players.has(client.sessionId)) {
          console.log(`[LiarDiceRoom ${this.roomId}] Sending delayed state update for ${client.sessionId}`);
          
          // 广播当前房间状态
          this.broadcast("fullRoomState", {
            playerCount: this.state.players.size,
            hostId: this.state.hostId,
            status: this.state.status || "waiting",
            players: Array.from(this.state.players.entries()).map(([id, p]) => ({
              id: id,
              name: p.name,
              isReady: p.isReady,
              isAI: p.isAI,
              diceCount: p.diceCount
            }))
          });
          
          // 尝试直接发送玩家数据给该客户端
          client.send("playerData", {
            id: client.sessionId,
            name: playerName,
            isHost: this.state.hostId === client.sessionId,
            playerList: Array.from(this.state.players.entries()).map(([id, p]) => ({
              id: id,
              name: p.name,
              isReady: p.isReady,
              isAI: p.isAI,
              diceCount: p.diceCount
            }))
          });
        }
      }, 1000);
      
    } catch (error) {
      console.error(`[LiarDiceRoom ${this.roomId}] Error in onJoin:`, error);
    }
  }

  async onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    console.log(`[LiarDiceRoom ${this.roomId}] Player left: ${player?.name || client.sessionId}, consented=${consented}`);

    if (player) {
      player.isConnected = false; // Mark as disconnected immediately

      try {
        if (consented) {
          // Player left intentionally, remove immediately
          this.state.players.delete(client.sessionId);
        } else {
          // Player disconnected, allow time for reconnection
          console.log(`[LiarDiceRoom ${this.roomId}] Player ${player.name} disconnected, allowing reconnection...`);
          await this.allowReconnection(client, 15); // Wait 15 seconds
          const reconnectedPlayer = this.state.players.get(client.sessionId);
          if (reconnectedPlayer?.isConnected) {
            console.log(`[LiarDiceRoom ${this.roomId}] Player ${player.name} reconnected.`);
            // No need to re-add, just ensure isConnected is true (already done by Colyseus)
          } else {
             // If still not connected or player gone, remove them
            if(this.state.players.has(client.sessionId)) {
                 this.state.players.delete(client.sessionId);
                 console.log(`[LiarDiceRoom ${this.roomId}] Player ${player.name} reconnection timed out, removed.`);
            } else {
                 console.log(`[LiarDiceRoom ${this.roomId}] Player ${player.name} already removed during reconnection wait.`);
            }
          }
        }
      } catch (e) {
         console.error(`[LiarDiceRoom ${this.roomId}] Error during reconnection handling for ${client.sessionId}:`, e);
         // Ensure removal on error
         if (this.state.players.has(client.sessionId)) {
             this.state.players.delete(client.sessionId);
         }
      } finally {
         // Perform cleanup if player was actually removed from state
         if (!this.state.players.has(client.sessionId)) {
             this.handlePlayerRemovalCleanup(client.sessionId);
         }
      }
    }
  }

  onDispose() {
    console.log(`[LiarDiceRoom ${this.roomId}] Disposing room...`);
    this.clock.clear(); // Clear any pending timers/intervals
  }

  // --- Game Flow Methods ---

  /** Starts the game. Called by MessageHandler. */
  public startGame() {
    if (this.gameLogic.startGame(this.state)) { // Delegate validation & initial state change
      this.broadcast("gameStarted", { gameId: this.roomId });
      console.log(`[LiarDiceRoom ${this.roomId}] Broadcasted 'gameStarted'`);
      this.clock.setTimeout(() => { // Schedule first round
        if (this.state.status === "playing") this.startNewRound();
      }, 1500);
    } else {
       const hostClient = this.clients.find(c => c.sessionId === this.state.hostId);
       const readyCount = Array.from(this.state.players.values()).filter(p => p.isReady && p.isConnected && p.diceCount > 0).length;
       if(hostClient) hostClient.send("error", `开始游戏失败: 准备好的玩家不足 (${readyCount}/2)`);
       console.warn(`[LiarDiceRoom ${this.roomId}] Start game failed by GameLogic.`);
    }
  }

  /** Starts a new round, delegates logic, handles results. */
  private startNewRound() {
    console.log(`[LiarDiceRoom ${this.roomId}] Starting new round (Current Status: ${this.state.status})`);
    const roundStartResult = this.gameLogic.startNewRound(this.state, this.internalDiceRolls);

    if (!roundStartResult) { // Game ended or failed to start round
      if (this.state.status === "finished") this.endGame();
      else console.warn(`[LiarDiceRoom ${this.roomId}] startNewRound failed, status: ${this.state.status}.`);
      return;
    }

    const { currentPlayerSessionId, rolledDice } = roundStartResult;

    // Send dice individually
    rolledDice.forEach((dices, sessionId) => {
      const client = this.clients.find(c => c.sessionId === sessionId);
      if (client) client.send("yourDices", { dices });
      else if (!this.state.players.get(sessionId)?.isAI) console.warn(`[LiarDiceRoom ${this.roomId}] Client not found for ${sessionId}`);
    });

    // Broadcast round info
    this.broadcast("newRound", {
      roundNumber: this.state.roundNumber,
      activePlayerIds: this.state.activePlayerIds.toArray(),
      currentPlayerSessionId: currentPlayerSessionId,
      diceCounts: Object.fromEntries(this.state.activePlayerIds.map(id => [id, this.state.players.get(id)?.diceCount ?? 0]))
    });
    console.log(`[LiarDiceRoom ${this.roomId}] Broadcasted newRound ${this.state.roundNumber}. Turn: ${this.state.players.get(currentPlayerSessionId)?.name}`);

    // Trigger AI if needed
    this.aiManager.checkAndTriggerAI();
  }

 /** Advances the turn, broadcasts, and triggers AI check. Called by GameLogic or AIManager. */
 public nextTurn() {
    // GameLogic should be called first to update the index *before* we use it here
    // Assuming GameLogic.nextTurn ONLY updates the index and potentially status
    this.gameLogic.nextTurn(this.state);

    if (this.state.status === 'finished') {
        this.endGame();
        return;
    }

    if (this.state.activePlayerIds.length > 0) {
      // Get the NEW current player ID after GameLogic updated the index
      const nextPlayerId = this.state.activePlayerIds[this.state.currentPlayerIndex];
      // Add check for undefined nextPlayerId
      if (!nextPlayerId) {
          console.error(`[LiarDiceRoom ${this.roomId}] nextTurn: Could not determine next player at index ${this.state.currentPlayerIndex}. Active players: ${this.state.activePlayerIds.length}`);
          // Game might end here, consider calling endGame? For now, just log.
      } else {
          this.broadcast("nextTurn", { currentPlayerSessionId: nextPlayerId });
          // Log before potentially accessing name
          console.log(`[LiarDiceRoom ${this.roomId}] Turn passed to ID: ${nextPlayerId}, Name: ${this.state.players.get(nextPlayerId)?.name}`);
          // Trigger AI check for the *new* current player
          this.aiManager.checkAndTriggerAI();
      }
    } else {
       console.error(`[LiarDiceRoom ${this.roomId}] nextTurn: No active players left! Ending game.`);
       this.endGame();
    }
  }

  /** Finalizes the game, broadcasts winner, and schedules disconnect. */
  private endGame(explicitWinnerSessionId?: string) {
    if (this.state.status === "finished") return; // Prevent double execution

    let winner: PlayerState | undefined;
    if (explicitWinnerSessionId) {
      winner = this.state.players.get(explicitWinnerSessionId);
    } else {
      // If no explicit winner, let GameLogic check based on current state
      winner = this.gameLogic.checkEndGame(this.state);
    }
    this.state.status = "finished"; // Ensure status is set

    const winnerName = winner?.name || "无 (平局?)";
    const resultMessage = `游戏结束！胜利者: ${winnerName}`;
    this.state.roundResult = resultMessage;

    console.log(`[LiarDiceRoom ${this.roomId}] ${resultMessage}`);
    this.broadcast("gameFinished", { winnerSessionId: winner?.sessionId, winnerName });

    // Schedule room disconnect
    this.clock.setTimeout(() => {
        console.log(`[LiarDiceRoom ${this.roomId}] Disconnecting room after game end.`);
        this.disconnect();
    }, 10000);
  }


  // --- Action Handling (Called by MessageHandler) ---

  public handlePlayerBid(client: Client, value: number, count: number): void {
    const sessionId = client.sessionId;
    // Basic turn/state validation
    if (this.state.status !== "playing" || this.state.activePlayerIds[this.state.currentPlayerIndex] !== sessionId) {
      return client.send("error", "现在不是你的回合或无法叫价。");
    }
    // Delegate bid validation to GameLogic
    if (!this.gameLogic.validateBid(this.state, value, count)) {
      return client.send("error", `无效的叫价 (${count}个${value})`);
    }

    console.log(`[LiarDiceRoom ${this.roomId}] Player ${this.state.players.get(sessionId)?.name} bids: ${count}x ${value}`);
    // Delegate bid processing to GameLogic (updates state + calls this.nextTurn)
    this.gameLogic.processBid(this.state, sessionId, value as Face, count);
    // Broadcast the bid event itself
    this.broadcast("playerBid", { sessionId, value, count }, { afterNextPatch: true });
    // nextTurn (and subsequent AI check) is called within processBid's call structure
  }

  public handlePlayerChallenge(client: Client): void {
    const challengerSessionId = client.sessionId;
    // Basic turn/state validation
    if (this.state.status !== "playing" || this.state.activePlayerIds[this.state.currentPlayerIndex] !== challengerSessionId) {
      return client.send("error", "现在不是你的回合或无法质疑。");
    }
    if (this.state.moveNumber === 0 || !this.state.lastBidderSessionId) {
      return client.send("error", "还没有叫价，无法质疑。");
    }

    const lastBidderSessionId = this.state.lastBidderSessionId;
    const bidValue = this.state.currentBidValue as Face;
    const bidCount = this.state.currentBidCount;
    console.log(`[LiarDiceRoom ${this.roomId}] ${this.state.players.get(challengerSessionId)?.name} challenges ${this.state.players.get(lastBidderSessionId)?.name}'s bid (${bidCount}x ${bidValue})`);
    this.state.status = "challenging";

    // Delegate challenge processing to GameLogic
    const challengeResult = this.gameLogic.processChallenge(this.state, this.internalDiceRolls, challengerSessionId);

    if (!challengeResult) {
      console.error(`[LiarDiceRoom ${this.roomId}] processChallenge failed.`);
      this.state.status = "playing"; // Revert status?
      return client.send("error", "处理质疑时发生错误");
    }

    const { loserId, actualCount, bidCorrect } = challengeResult;
    const useWildOnes = !this.state.isOneCalledThisRound; // Get state *before* GameLogic might have reset it

    // Prepare reveal data (only players involved in the round)
    const allDiceReveal: { [sessionId: string]: Face[] } = {};
    this.internalDiceRolls.forEach((dices, sessionId) => {
         // Only reveal dice of players currently listed as active *or* the last bidder/challenger if they were just eliminated
         if (this.state.activePlayerIds.includes(sessionId) || sessionId === lastBidderSessionId || sessionId === challengerSessionId) {
             if(this.state.players.has(sessionId)) { // Ensure player still exists conceptually
                 allDiceReveal[sessionId] = dices || [];
             }
         }
    });

    // Broadcast results
    this.broadcast("challengeReveal", {
      challengerId: challengerSessionId, lastBidderId: lastBidderSessionId,
      bidValue, bidCount, allDice: allDiceReveal, actualCount, useWildOnes, bidCorrect, loserId
    });
    console.log(`[LiarDiceRoom ${this.roomId}] Challenge result: Bid ${bidCount}x${bidValue}, Actual ${actualCount}. Loser: ${this.state.players.get(loserId)?.name}`);

    // Check game end or schedule next round
    const winner = this.gameLogic.checkEndGame(this.state);
    if (winner !== undefined || this.state.status === "finished") {
      this.endGame(winner?.sessionId);
    } else {
      console.log(`[LiarDiceRoom ${this.roomId}] Scheduling next round...`);
      this.clock.setTimeout(() => {
        if (this.state.status === "roundOver") this.startNewRound();
        else console.warn(`[LiarDiceRoom ${this.roomId}] Status changed during challenge delay: ${this.state.status}`);
      }, 3000);
    }
  }

  // --- AI Related ---

  /** Internal method to add AI players, called by MessageHandler. */
  public addAIPlayerInternal(aiType: string) {
      const aiSessionId = `ai_${uuid()}`;
      const aiId = `ai_player_${aiType}_${uuid()}`;
      const aiName = AIManager.generateAIName(aiType);

      const player = new PlayerState().assign({
          id: aiId, sessionId: aiSessionId, name: aiName, diceCount: 5,
          isReady: true, isConnected: true, isAI: true, aiType: aiType
      });

      this.state.players.set(aiSessionId, player);
      console.log(`[LiarDiceRoom ${this.roomId}] AI Player ${aiName} added.`);
      this.checkAllPlayersReady();
  }

  // --- Other Helpers ---

  /** Checks if all connected human players are ready. */
  public checkAllPlayersReady() {
      if (this.state.status !== "waiting") return;
      const connectedPlayers = Array.from(this.state.players.values()).filter(p => p.isConnected);
      // Need at least 2 connected players total to start
      if (connectedPlayers.length < 2) return;

      const allHumansReady = connectedPlayers.filter(p => !p.isAI).every(p => p.isReady);

      // Start if all connected humans are ready AND there are >= 2 players total
      if (allHumansReady && connectedPlayers.length >= 2) {
          console.log(`[LiarDiceRoom ${this.roomId}] All humans ready & enough players, starting game automatically...`);
          this.clock.setTimeout(() => {
              if (this.state.status === 'waiting') {
                 const stillAllHumansReady = Array.from(this.state.players.values())
                                          .filter(p => !p.isAI && p.isConnected)
                                          .every(p => p.isReady);
                 const currentReadyPlayers = Array.from(this.state.players.values())
                                        .filter(p => p.isReady && p.isConnected && p.diceCount > 0).length;

                 if (stillAllHumansReady && currentReadyPlayers >= 2) {
                    this.startGame();
                 } else {
                    console.log(`[LiarDiceRoom ${this.roomId}] Auto-start cancelled.`);
                 }
              }
          }, 1500);
      }
  }

   /** Finds the winner if only one player remains. */
   private findWinner(): PlayerState | undefined {
       // Delegate finding winner logic to GameLogic
       return this.gameLogic.checkEndGame(this.state);
   }

   /** Cleanup logic after a player is confirmed removed from the room state. */
   private handlePlayerRemovalCleanup(removedSessionId: string) {
        console.log(`[LiarDiceRoom ${this.roomId}] Cleaning up after player removal: ${removedSessionId}`);
        const activeIndex = this.state.activePlayerIds.findIndex(id => id === removedSessionId);

        let wasCurrentPlayer = false;
        let oldIndex = -1;
        if (activeIndex !== -1) {
            oldIndex = this.state.currentPlayerIndex;
            wasCurrentPlayer = activeIndex === oldIndex;
            this.state.activePlayerIds.splice(activeIndex, 1);
            console.log(`[LiarDiceRoom ${this.roomId}] Removed ${removedSessionId} from active players.`);
        }

        // Adjust turn index if the removed player affected the order
        if (this.state.activePlayerIds.length > 0 && this.state.status === "playing" && activeIndex !== -1) {
            if (activeIndex < oldIndex) { // If removed player was before the current player
                this.state.currentPlayerIndex = (oldIndex - 1 + this.state.activePlayerIds.length) % this.state.activePlayerIds.length;
            } else { // Removed player was at or after the current player
                 this.state.currentPlayerIndex %= this.state.activePlayerIds.length; // Ensure index stays within bounds
            }
             // If the player who left *was* the current player, immediately advance turn
             if (wasCurrentPlayer) {
                 console.log(`[LiarDiceRoom ${this.roomId}] Current player left, advancing turn.`);
                 this.nextTurn(); // This will broadcast and check AI
                 return; // Exit early as nextTurn handles the rest
             } else {
                // Log the new current player if it wasn't the one who left
                console.log(`[LiarDiceRoom ${this.roomId}] Player left, new current player index: ${this.state.currentPlayerIndex}, player: ${this.state.activePlayerIds[this.state.currentPlayerIndex]}`);
             }
        } else if (this.state.activePlayerIds.length < 2 && this.state.status === "playing") {
             console.log(`[LiarDiceRoom ${this.roomId}] Not enough players remaining, ending game.`);
             this.endGame();
        }


        // Handle host leaving
        if (this.state.hostId === removedSessionId) {
             this.electNewHost();
        }

        // If room becomes empty, Colyseus handles disposal automatically
   }

   /** Elects a new host if the current host leaves. */
   private electNewHost() {
        if (this.state.players.size > 0) {
            // Prefer first active player if game is ongoing, otherwise first player in map
            let newHost: PlayerState | undefined;
            if (this.state.activePlayerIds.length > 0) {
                const firstActiveId = this.state.activePlayerIds[0];
                // Add check for undefined firstActiveId (though unlikely if length > 0)
                if (firstActiveId) {
                    newHost = this.state.players.get(firstActiveId);
                } else {
                    console.warn(`[LiarDiceRoom ${this.roomId}] electNewHost: activePlayerIds has length > 0 but first element is undefined?`);
                }
            } else {
                 // Use iterator to get the first player in the players map
                 const firstPlayerEntry = this.state.players.entries().next();
                 if (!firstPlayerEntry.done) {
                     newHost = firstPlayerEntry.value[1]; // [key, value]
                 }
            }

            if (newHost) {
                this.state.hostId = newHost.sessionId;
                console.log(`[LiarDiceRoom ${this.roomId}] Host left, new host: ${newHost.name}`);
                this.broadcast("hostChanged", { newHostId: newHost.sessionId, newHostName: newHost.name });
            } else {
                 this.state.hostId = "";
                 console.warn(`[LiarDiceRoom ${this.roomId}] Host left, but couldn't find new host!`);
            }
        } else {
            this.state.hostId = "";
            console.log(`[LiarDiceRoom ${this.roomId}] Host left, room empty.`);
        }
   }


   // Provide accessors needed by other managers/logic classes
   public getInternalDiceRolls(): Map<string, Face[]> { return this.internalDiceRolls; }
   public getGameLogic(): GameLogic { return this.gameLogic; }

}
