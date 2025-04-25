import axios from 'axios';
import { LiarDiceRoomState } from "./schema/LiarDiceState"; // For type hints
import { AI_SERVICE_URL } from './config/env-config';
import { Face, Bid, EmptyBid, AIActionDecision } from './types/game-types';

export class AIServiceClient {

    /**
     * Fetches an action decision from the AI service.
     * @param state The current room state.
     * @param aiSessionId The session ID of the AI player.
     * @param aiDices The AI player's current dice.
     * @param internalDiceRolls Map of all dice rolls (potentially needed for advanced AI context).
     * @returns A promise resolving to the AI's decision.
     */
    public async getAIDecision(
        state: LiarDiceRoomState,
        aiSessionId: string,
        aiDices: Face[],
        internalDiceRolls: Map<string, Face[]> // Pass all dice for potential context
    ): Promise<AIActionDecision> {
        const aiPlayer = state.players.get(aiSessionId);
        if (!aiPlayer || !aiPlayer.isAI) {
            console.error(`[AIServiceClient] getAIDecision called for non-AI player ${aiSessionId}?`);
            return this.getFallbackAIAction(state, aiSessionId); // Fallback if player invalid
        }

        console.log(`[AIServiceClient] Requesting decision for AI ${aiPlayer.name}...`);

        // 1. Gather necessary state for AI service payload
        const currentBidValue = state.currentBidValue;
        const currentBidCount = state.currentBidCount;
        const totalActiveDiceCount = state.activePlayerIds.reduce((sum, id) => {
            return sum + (state.players.get(id)?.diceCount ?? 0);
        }, 0);

        const payload = {
            aiPlayerId: aiPlayer.id,
            aiPlayerDice: aiDices,
            currentBid: [currentBidValue, currentBidCount] as Bid | EmptyBid,
            totalDiceInGame: totalActiveDiceCount,
            activePlayerIds: state.activePlayerIds.toArray(),
            currentPlayerSessionId: aiSessionId,
            isOneCalledThisRound: state.isOneCalledThisRound,
            aiType: aiPlayer.aiType || 'simple_random',
            playerDiceCounts: Object.fromEntries(state.activePlayerIds.map(id => [id, state.players.get(id)?.diceCount ?? 0])),
            roundNumber: state.roundNumber,
            moveNumber: state.moveNumber,
            // Consider adding game history or other context if AI needs it
        };

        // 2. Call AI Service
        try {
            console.log(`[AIServiceClient] Sending payload to ${AI_SERVICE_URL}/decideAction:`, JSON.stringify(payload));
            const response = await axios.post(`${AI_SERVICE_URL}/decideAction`, payload, { timeout: 15000 }); // 15s timeout
            const decision = response.data;
            console.log(`[AIServiceClient] Received decision:`, decision);

            // 3. Validate AI decision structure (basic)
            if (this.isValidAIDecision(decision)) {
                // Ensure bid values are correct type if action is bid
                if (decision.action === 'bid') {
                    decision.value = decision.value as Face;
                }
                return decision as AIActionDecision;
            } else {
                console.error(`[AIServiceClient] AI service returned invalid decision structure:`, decision);
                return this.getFallbackAIAction(state, aiSessionId);
            }

        } catch (error) {
            console.error(`[AIServiceClient] Error calling AI service for ${aiPlayer.name}:`, error instanceof Error ? error.message : error);
            return this.getFallbackAIAction(state, aiSessionId);
        }
    }

    /**
     * Basic validation for the structure of the AI decision.
     */
    private isValidAIDecision(decision: any): boolean {
        if (!decision || !decision.action) return false;
        if (decision.action === 'bid') {
            return typeof decision.value === 'number' && decision.value >= 1 && decision.value <= 6 &&
                   typeof decision.count === 'number' && decision.count > 0 && Number.isInteger(decision.value) && Number.isInteger(decision.count);
        }
        return decision.action === 'challenge' || decision.action === 'spot_on'; // Allow challenge or spot_on
    }


    /**
     * Provides a simple fallback action for the AI if the AI service fails or returns invalid data.
     * Needs access to game logic (specifically validateBid) or the state.
     * @param state The current room state.
     * @param aiSessionId The ID of the AI player.
     * @returns A fallback decision object.
     */
    public getFallbackAIAction(state: LiarDiceRoomState, aiSessionId: string): AIActionDecision {
        console.warn(`[AIServiceClient] Using fallback logic for AI ${aiSessionId}`);

        // Need a temporary GameLogic instance or pass validateBid function if needed here
        // For simplicity, let's just replicate the simple logic based on state
        const canChallenge = state.moveNumber > 0 && !!state.lastBidderSessionId;

        // Priority 1: Challenge if possible
        if (canChallenge) {
            console.log("[AIServiceClient][Fallback] Decision: challenge");
            return { action: 'challenge' };
        }

        // Priority 2: Make the lowest possible valid bid (1x '2', as 1x '1' requires special rules)
        const lowestBidValue: Face = 2;
        const lowestBidCount = 1;
        // We need validateBid logic here. For now, assume 1x2 is always valid as the first bid.
        // If not the first bid, this fallback is too simple and likely invalid.
        // A better fallback might *always* be challenge if possible, otherwise maybe bid 1 more than current count?
         if (state.currentBidCount === 0) {
            console.log("[AIServiceClient][Fallback] Decision: bid 1x '2'");
            return { action: 'bid', value: 2, count: 1 };
         } else {
             // If not first bid and challenge wasn't possible, this is tricky.
             // Let's try increasing the current count by 1, keeping the value (if > 1) or setting to 2 if current was 1
             let fallbackValue = state.currentBidValue !== 1 ? state.currentBidValue as Face : 2 as Face;
             let fallbackCount = state.currentBidCount + 1;
             // A minimal validation check (doesn't use the full validateBid logic)
             if (fallbackValue >=1 && fallbackValue <= 6 && fallbackCount > 0) {
                 console.log(`[AIServiceClient][Fallback] Decision: bid ${fallbackCount}x '${fallbackValue}'`);
                 return { action: 'bid', value: fallbackValue, count: fallbackCount };
             } else {
                 // Absolute final fallback: challenge (even if invalid, might reset state)
                 console.error(`[AIServiceClient][Fallback][Critical] Could not determine valid fallback bid. Forcing challenge.`);
                 return { action: 'challenge'};
             }
         }
    }
}
