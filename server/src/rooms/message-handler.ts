import { Client } from "@colyseus/core";
import { LiarDiceRoom } from "./LiarDiceRoom"; // Import the Room type

/**
 * Handles incoming client messages for the LiarDiceRoom.
 */
export class MessageHandler {
    private room: LiarDiceRoom;

    constructor(room: LiarDiceRoom) {
        this.room = room;
    }

    /**
     * Registers all message handlers for the room.
     */
    public registerHandlers(): void {
        console.log(`[MessageHandler][${this.room.roomId}] Registering handlers...`);

        this.room.onMessage("setReady", (client, message) => {
            this._handleSetReady(client, message);
        });

        this.room.onMessage("startGame", (client) => {
            this._handleStartGame(client);
        });

        this.room.onMessage("bid", (client, message) => {
            this._handleBid(client, message);
        });

        this.room.onMessage("challenge", (client) => {
            this._handleChallenge(client);
        });

        this.room.onMessage("chatMessage", (client, message) => {
            this._handleChatMessage(client, message);
        });

        this.room.onMessage("addAI", (client, message) => {
            this._handleAddAI(client, message);
        });

        this.room.onMessage("kickPlayer", (client, message) => {
            this._handleKickPlayer(client, message);
        });

        // TODO: Add handlers for jumpChallenge etc. based on v2.1 plan
         console.log(`[MessageHandler][${this.room.roomId}] Handlers registered.`);
    }

    // --- Private Handler Implementations ---

    private _handleSetReady(client: Client, message: { ready: boolean }): void {
        const player = this.room.state.players.get(client.sessionId);
        if (player && this.room.state.status === "waiting") {
            player.isReady = message.ready;
            console.log(`[MessageHandler][${this.room.roomId}] Player ${player.name} (${client.sessionId}) set ready: ${player.isReady}`);
            // Call the room's method to check readiness (needs to be public or passed)
            this.room.checkAllPlayersReady();
        } else {
            console.warn(`[MessageHandler][${this.room.roomId}] Invalid setReady: Player ${client.sessionId} not found or status not waiting`);
            client.send("error", `无法设置准备状态 (玩家不存在或游戏已开始)`);
        }
    }

    private _handleStartGame(client: Client): void {
        if (client.sessionId !== this.room.state.hostId) {
            console.warn(`[MessageHandler][${this.room.roomId}] Non-host ${client.sessionId} tried to start game`);
            client.send("error", "只有房主才能开始游戏");
            return;
        }
        if (this.room.state.status !== "waiting") {
            console.warn(`[MessageHandler][${this.room.roomId}] Tried to start game in non-waiting state (${this.room.state.status})`);
            client.send("error", `游戏已开始或已结束`);
            return;
        }

        console.log(`[MessageHandler][${this.room.roomId}] Host ${client.sessionId} requested start game...`);
        // Call the room's startGame method (needs to be public or passed)
        this.room.startGame(); // startGame now handles broadcasting errors internally
    }

    private _handleBid(client: Client, message: { value: number, count: number }): void {
        console.log(`[MessageHandler][${this.room.roomId}] Received bid from ${client.sessionId}:`, message);
        // Call the room's handlePlayerBid method (needs to be public or passed)
        this.room.handlePlayerBid(client, message.value, message.count);
    }

    private _handleChallenge(client: Client): void {
        console.log(`[MessageHandler][${this.room.roomId}] Received challenge from ${client.sessionId}`);
        // Call the room's handlePlayerChallenge method (needs to be public or passed)
        this.room.handlePlayerChallenge(client);
    }

    private _handleChatMessage(client: Client, message: { content: string }): void {
        const player = this.room.state.players.get(client.sessionId);
        if (player && message.content) {
            const sanitizedContent = message.content.trim().substring(0, 100);
            if (!sanitizedContent) return;

            const chatData = {
                senderName: player.name,
                senderId: player.id,
                content: sanitizedContent,
                timestamp: Date.now()
            };
            console.log(`[MessageHandler][${this.room.roomId}] Broadcasting chat:`, chatData);
            this.room.broadcast("chatMessage", chatData, { except: client });
            client.send("chatMessage", chatData);
        }
    }

    private _handleAddAI(client: Client, message: { aiType?: string }): void {
        if (client.sessionId !== this.room.state.hostId) {
            console.warn(`[MessageHandler][${this.room.roomId}] Non-host ${client.sessionId} tried to add AI`);
            client.send("error", "只有房主才能添加 AI");
            return;
        }
        if (this.room.state.status !== "waiting") {
             console.warn(`[MessageHandler][${this.room.roomId}] Tried to add AI in non-waiting state`);
             client.send("error", "游戏进行中，无法添加 AI");
             return;
         }
        if (this.room.state.players.size >= this.room.maxClients) {
            console.warn(`[MessageHandler][${this.room.roomId}] Room full, cannot add AI`);
            client.send("error", "房间已满");
            return;
        }
        const aiType = message.aiType || 'simple_random';
        console.log(`[MessageHandler][${this.room.roomId}] Host requested add AI, type: ${aiType}`);
        // Call the room's addAIPlayerInternal method (needs to be public or passed)
        this.room.addAIPlayerInternal(aiType);
    }

    private _handleKickPlayer(client: Client, message: { targetSessionId: string }): void {
        if (client.sessionId !== this.room.state.hostId) {
            client.send("error", "只有房主才能踢人");
            return;
        }
        const targetClient = this.room.clients.find(c => c.sessionId === message.targetSessionId);
        if (!targetClient) {
            client.send("error", "找不到要踢出的玩家");
            return;
        }
        if (targetClient.sessionId === client.sessionId) {
            client.send("error", "不能踢自己");
            return;
        }
        console.log(`[MessageHandler][${this.room.roomId}] Host ${client.sessionId} kicking ${message.targetSessionId}`);
        targetClient.leave(); // Colyseus triggers onLeave
        this.room.broadcast("playerKicked", { kickedSessionId: message.targetSessionId, hostSessionId: client.sessionId });
    }
}
