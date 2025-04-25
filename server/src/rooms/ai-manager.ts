import { Clock } from "@colyseus/core";
import { LiarDiceRoom } from "./LiarDiceRoom"; // Import Room type for context
import { LiarDiceRoomState } from "./schema/LiarDiceState";
import { AIServiceClient } from "./ai-service-client";
import { Face, AIActionDecision } from './types/game-types';

/**
 * Manages AI player actions and decisions within a LiarDiceRoom.
 */
export class AIManager {
    private room: LiarDiceRoom;
    private state: LiarDiceRoomState;
    private aiClient: AIServiceClient;
    private clock: Clock;

    constructor(room: LiarDiceRoom, aiClient: AIServiceClient) {
        this.room = room;
        this.state = room.state; // Reference to the room's state
        this.aiClient = aiClient;
        this.clock = room.clock;
    }

    /**
     * Checks if the current player is AI and schedules their decision process.
     */
    public checkAndTriggerAI(): void {
        if (this.state.status !== "playing") return;
        if (this.state.activePlayerIds.length === 0) return;

        const currentPlayerSessionId = this.state.activePlayerIds[this.state.currentPlayerIndex];
        const currentPlayer = this.state.players.get(currentPlayerSessionId);

        if (currentPlayer && currentPlayer.isAI) {
            console.log(`[AIManager][${this.room.roomId}] Current player is AI: ${currentPlayer.name}. Scheduling decision...`);
            // Add a delay to simulate thinking
            this.clock.setTimeout(() => {
                // Check status again before triggering, in case game ended/changed
                if (this.state.status === "playing" && this.state.activePlayerIds[this.state.currentPlayerIndex] === currentPlayerSessionId) {
                   this.triggerAIDecision(currentPlayerSessionId);
                } else {
                    console.log(`[AIManager][${this.room.roomId}] AI ${currentPlayer.name}'s turn skipped due to state change during delay.`);
                }
            }, 1000 + Math.random() * 1500); // 1-2.5 second delay
        }
    }

    /**
     * Fetches and applies the decision for a specific AI player.
     * @param aiSessionId The session ID of the AI player.
     */
    private async triggerAIDecision(aiSessionId: string): Promise<void> {
        if (this.state.status !== "playing" || this.state.activePlayerIds[this.state.currentPlayerIndex] !== aiSessionId) {
            console.log(`[AIManager][${this.room.roomId}] AI ${aiSessionId} decision cancelled due to state change.`);
            return;
        }
        const aiPlayer = this.state.players.get(aiSessionId);
        if (!aiPlayer || !aiPlayer.isAI) {
            console.error(`[AIManager][${this.room.roomId}] triggerAIDecision called for non-AI player ${aiSessionId}?`);
            return;
        }

        console.log(`[AIManager][${this.room.roomId}] AI ${aiPlayer.name} preparing decision...`);
        const aiDices = this.room.internalDiceRolls.get(aiSessionId) || []; // Access dice via room

        try {
            const decision = await this.aiClient.getAIDecision(
                this.state,
                aiSessionId,
                aiDices,
                this.room.internalDiceRolls // Pass the full dice map
            );

            // Apply decision (re-check state)
            if (this.state.status === "playing" && this.state.activePlayerIds[this.state.currentPlayerIndex] === aiSessionId) {
                this.applyAIDecision(aiSessionId, decision);
            } else {
                console.warn(`[AIManager][${this.room.roomId}] Game state changed while waiting for AI ${aiPlayer.name} response. Discarding decision.`);
            }
        } catch (error) {
            console.error(`[AIManager][${this.room.roomId}] Error getting AI decision for ${aiPlayer.name}:`, error instanceof Error ? error.message : error);
            // Apply fallback if fetching failed
             if (this.state.status === "playing" && this.state.activePlayerIds[this.state.currentPlayerIndex] === aiSessionId) {
                console.log(`[AIManager][${this.room.roomId}] Applying fallback due to error for AI ${aiPlayer.name}.`);
                const fallback = this.getFallbackAIAction(aiSessionId);
                this.applyAIDecision(aiSessionId, fallback);
             }
        }
    }

    /**
     * Applies the received (or fallback) AI decision to the game state.
     * @param aiSessionId The AI player's session ID.
     * @param decision The decision object from the AI service or fallback.
     */
    private applyAIDecision(aiSessionId: string, decision: AIActionDecision | any): void {
         try {
            switch (decision?.action) {
                case 'bid':
                    const rawBidValue = decision.value;
                    const rawBidCount = decision.count;
                    // Basic validation of AI bid data
                    if (typeof rawBidValue !== 'number' || rawBidValue < 1 || rawBidValue > 6 || !Number.isInteger(rawBidValue) ||
                        typeof rawBidCount !== 'number' || rawBidCount <= 0 || !Number.isInteger(rawBidCount)) {
                         console.error(`[AIManager][${this.room.roomId}] AI ${aiSessionId} returned malformed bid data. Applying fallback.`);
                         const fallback = this.getFallbackAIAction(aiSessionId);
                         this.applyAIDecision(aiSessionId, fallback);
                         return;
                    }
                    const aiBidValue = rawBidValue as Face;
                    const aiBidCount = rawBidCount;

                    // Use room's gameLogic instance to validate the bid
                    if (this.room.gameLogic.validateBid(this.state, aiBidValue, aiBidCount)) {
                        console.log(`[AIManager][${this.room.roomId}] AI ${aiSessionId} applying valid bid: ${aiBidCount}x ${aiBidValue}`);
                        // Let GameLogic process the bid to update state and advance turn
                        this.room.gameLogic.processBid(this.state, aiSessionId, aiBidValue, aiBidCount);
                        // Broadcast the bid event from the room after processing
                        this.room.broadcast("playerBid", { sessionId: aiSessionId, value: aiBidValue, count: aiBidCount }, { afterNextPatch: true });
                        // Note: nextTurn and subsequent AI check are handled within gameLogic.processBid -> room.nextTurn
                    } else {
                         console.error(`[AIManager][${this.room.roomId}] AI ${aiSessionId} returned invalid bid. Applying fallback.`);
                        this.state.currentBidCount = aiBidCount;
                        this.state.lastBidderSessionId = aiSessionId;
                        this.state.moveNumber++;
                        if (aiBidValue === 1) {
                            this.state.isOneCalledThisRound = true;
                        }
                        this.room.nextTurn(); // Call room's nextTurn
                    } else {
                         console.error(`[AIManager][${this.room.roomId}] AI ${aiSessionId} returned invalid bid. Applying fallback.`);
                         const fallback = this.getFallbackAIAction(aiSessionId);
                         this.applyAIDecision(aiSessionId, fallback);
                    }
                    break;
                case 'challenge':
                    console.log(`[AIManager][${this.room.roomId}] AI ${aiSessionId} applying challenge.`);
                    // Call room's handlePlayerChallenge. Need to simulate a Client object slightly.
                    // Casting is okay here as handlePlayerChallenge only uses sessionId.
                    this.room.handlePlayerChallenge({ sessionId: aiSessionId } as any);
                    break;
                // TODO: Handle 'spot_on' if implemented
                default:
                    console.error(`[AIManager][${this.room.roomId}] AI ${aiSessionId} returned unknown action. Applying fallback.`);
                    const fallback = this.getFallbackAIAction(aiSessionId);
                    this.applyAIDecision(aiSessionId, fallback);
            }
        } catch (e) {
             console.error(`[AIManager][${this.room.roomId}] Error applying AI ${aiSessionId} decision (${decision?.action}):`, e);
             // Consider a final, robust fallback if application fails?
        }
    }

    /**
     * Gets a fallback action using the AIServiceClient's logic.
     * @param aiSessionId The AI player's session ID.
     * @returns A fallback AI decision.
     */
    private getFallbackAIAction(aiSessionId: string): AIActionDecision {
        console.warn(`[AIManager][${this.room.roomId}] Requesting fallback action for ${aiSessionId}`);
        return this.aiClient.getFallbackAIAction(this.state, aiSessionId); // Delegate to client
    }

    /**
     * Generates a name for an AI player based on its type.
     * @param aiType The type of the AI.
     * @returns A generated name string.
     */
    public static generateAIName(aiType: string): string {
        // Simple name generation based on type (Static method as it doesn't depend on instance state)
        const randomNum = Math.floor(Math.random() * 100);
        switch(aiType.toLowerCase()) {
            case 'simple_random': return `随机AI ${randomNum}`;
            case 'coward': return `胆小鬼 ${randomNum}`;
            case 'aggressive': return `激进派 ${randomNum}`;
            default: return `普通AI ${randomNum}`;
        }
    }
}
