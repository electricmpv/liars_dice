import { LiarDiceRoomState, PlayerState } from "../../../shared/schemas/LiarDiceState";
import { Face, Bid, EmptyBid } from './types/game-types';

export class GameLogic {

    constructor() {
        // Constructor might be needed later for dependencies
    }

    /**
     * Starts the game, setting initial state.
     * Called by LiarDiceRoom when the 'startGame' message is received and validated.
     * @param state The current room state to modify.
     * @returns True if the game started successfully, false otherwise.
     */
    public startGame(state: LiarDiceRoomState): boolean {
        if (state.status !== "waiting") {
            console.warn(`[GameLogic] startGame called in non-waiting state: ${state.status}`);
            return false;
        }

        // Determine participating players (must be ready, connected, and have dice > 0)
        const readyPlayers = Array.from(state.players.values())
                                 .filter(p => p.isReady && p.isConnected && p.diceCount > 0);

        if (readyPlayers.length < 2) {
            console.warn(`[GameLogic] Not enough ready players (${readyPlayers.length}) to start.`);
            // LiarDiceRoom should handle broadcasting the error message
            return false;
        }

        console.log(`[GameLogic] Starting game with players: ${readyPlayers.map(p => p.name).join(', ')}`);
        state.status = "playing";
        state.roundNumber = 0; // Initialize round number

        // Set the list of active player session IDs for the game
        state.activePlayerIds.clear();
        readyPlayers.forEach(p => state.activePlayerIds.push(p.sessionId));

        // Randomize the starting player index
        state.currentPlayerIndex = Math.floor(Math.random() * state.activePlayerIds.length);

        // Indicate success, LiarDiceRoom will handle broadcasting and scheduling the first round
        return true;
    }

    /**
     * Starts a new round of the game.
     * @param state The room state to modify.
     * @param internalDiceRolls A Map to store the rolled dice (managed by LiarDiceRoom).
     * @returns An object containing the sessionId of the current player and the dice rolled for each player, or null if the round couldn't start.
     */
    public startNewRound(state: LiarDiceRoomState, internalDiceRolls: Map<string, Face[]>): { currentPlayerSessionId: string, rolledDice: Map<string, Face[]> } | null {
        if (state.status !== "playing" && state.status !== "roundOver") {
            console.warn(`[GameLogic] Cannot start new round in state: ${state.status}`);
            return null;
        }

        // 1. Re-evaluate active players (remove those with 0 dice)
        const currentActiveIds = state.activePlayerIds.toArray();
        const nextActivePlayerIds = currentActiveIds.filter(sessionId => {
            const player = state.players.get(sessionId);
            const isActive = player && player.isConnected && player.diceCount > 0;
            if (!isActive) {
                console.log(`[GameLogic] Player ${player?.name || sessionId} removed from active players for new round (Connected: ${player?.isConnected}, Dice: ${player?.diceCount})`);
            }
            return isActive;
        });

        // Update the actual state ArraySchema
        state.activePlayerIds.clear();
        nextActivePlayerIds.forEach(id => state.activePlayerIds.push(id));

        // 2. Check if game ends due to insufficient players
        if (state.activePlayerIds.length < 2) {
             console.log(`[GameLogic] Active players (${state.activePlayerIds.length}) less than 2, game should end.`);
             // Let LiarDiceRoom handle the endGame call based on this outcome
             state.status = "finished"; // Mark state as finished
             return null; // Indicate round didn't start, game should end
        }

        // 3. Reset round-specific state
        state.roundNumber++;
        console.log(`[GameLogic] Starting round ${state.roundNumber}`);
        state.status = "playing";
        state.currentBidCount = 0;
        state.currentBidValue = 0;
        state.lastBidderSessionId = "";
        state.moveNumber = 0;
        state.roundResult = "";
        state.isOneCalledThisRound = false;

        // Adjust currentPlayerIndex (e.g., loser starts or based on removal)
        // Ensure index is valid for the potentially smaller activePlayerIds array.
        state.currentPlayerIndex %= state.activePlayerIds.length;

        // 4. Roll dice for all active players
        internalDiceRolls.clear(); // Clear rolls from the previous round
        const rolledDiceForClients = new Map<string, Face[]>();
        state.activePlayerIds.forEach(sessionId => {
            const player = state.players.get(sessionId);
            if (player && player.diceCount > 0) {
                const dices = this.rollPlayerDice(player.diceCount);
                internalDiceRolls.set(sessionId, dices); // Store internally in the map passed from LiarDiceRoom
                rolledDiceForClients.set(sessionId, dices); // Prepare for return value
                // LiarDiceRoom will be responsible for sending dice to individual clients
            }
        });

        const currentPlayerSessionId = state.activePlayerIds[state.currentPlayerIndex];
        // Add check for undefined currentPlayerSessionId
        if (!currentPlayerSessionId) {
            console.error(`[GameLogic] startNewRound: Could not determine current player at index ${state.currentPlayerIndex}. Active players: ${state.activePlayerIds.length}`);
            return null; // Indicate round couldn't start properly
        }
        // Log before potentially accessing name which might be undefined too
        console.log(`[GameLogic] New round ${state.roundNumber} started. Current player ID: ${currentPlayerSessionId}, Name: ${state.players.get(currentPlayerSessionId)?.name}`);

        // Ensure the returned sessionId is definitely a string
        return { currentPlayerSessionId: currentPlayerSessionId, rolledDice: rolledDiceForClients };
    }

    /**
     * Rolls a specified number of dice.
     * @param count The number of dice to roll.
     * @returns An array of dice faces.
     */
    public rollPlayerDice(count: number): Face[] {
        const dices: Face[] = [];
        for (let i = 0; i < count; i++) {
            dices.push(Math.floor(Math.random() * 6) + 1 as Face);
        }
        return dices;
    }

    /**
    * Validates a bid based on the current game state.
    * @param state The current room state.
    * @param value The value of the dice being bid.
    * @param count The number of dice being bid.
    * @returns True if the bid is valid, false otherwise.
    */
    public validateBid(state: LiarDiceRoomState, value: number, count: number): boolean {
        // Basic validation: Ensure value is within 1-6 and count is positive integer
        if (value < 1 || value > 6 || count <= 0 || !Number.isInteger(value) || !Number.isInteger(count)) {
            console.warn(`[GameLogic-ValidateBid] Basic validation failed: value=${value}, count=${count}`);
            return false;
        }
        const bidValue = value as Face; // Cast validated value to Face type

        const currentValue = state.currentBidValue as Face | 0;
        const currentCount = state.currentBidCount;

        // If it's the first bid of the round
        if (currentCount === 0) {
            // First bid must be at least one die.
            const isValid = count >= 1;
            if (!isValid) console.warn(`[ValidateBid] First bid must have count >= 1`);
            return isValid;
        }

        // --- Apply Liar's Dice Bid Rules (incorporating rules for '1' from old game-manager) ---

        // Rule 1: Comparing non-'1' to non-'1'
        if (bidValue !== 1 && currentValue !== 1) {
            if (count > currentCount) return true; // Higher count is always valid
            if (count === currentCount && bidValue > currentValue) return true; // Same count, higher value is valid
            console.warn(`[ValidateBid] Invalid non-'1' bid: ${count}x${bidValue} vs ${currentCount}x${currentValue}`);
            return false;
        }

        // Rule 2: Bidding '1' (aces)
        if (bidValue === 1) {
            if (currentValue === 1) { // Previous bid was also '1'
                const isValid = count > currentCount; // Must increase count
                if (!isValid) console.warn(`[ValidateBid] Invalid '1' bid: Count ${count} not > current ${currentCount}`);
                return isValid;
            } else { // Previous bid was not '1'
                const requiredCount = Math.ceil(currentCount / 2);
                const isValid = count >= requiredCount; // Must be at least half (rounded up)
                if (!isValid) console.warn(`[ValidateBid] Invalid '1' bid: Count ${count} < required ${requiredCount} (from ${currentCount}x${currentValue})`);
                return isValid;
            }
        }

        // Rule 3: Bidding non-'1' after '1'
        if (currentValue === 1) {
            const requiredCount = currentCount * 2 + 1;
            const isValid = count >= requiredCount; // Must be at least double plus one
            if (!isValid) console.warn(`[ValidateBid] Invalid non-'1' after '1': Count ${count} < required ${requiredCount}`);
            return isValid;
        }

        // Should not be reachable if all cases covered, but acts as a safety false
        console.error(`[ValidateBid] Reached unexpected state: Bid ${count}x${bidValue}, Current ${currentCount}x${currentValue}`);
        return false;
    }

     /**
      * Processes a valid bid, updating the game state.
      * @param state The room state to modify.
      * @param sessionId The ID of the player making the bid.
      * @param value The value of the dice bid.
      * @param count The count of the dice bid.
      */
     public processBid(state: LiarDiceRoomState, sessionId: string, value: Face, count: number): void {
        state.currentBidValue = value;
        state.currentBidCount = count;
        state.lastBidderSessionId = sessionId;
        state.moveNumber++;
        if (value === 1) {
            state.isOneCalledThisRound = true;
        }
        this.nextTurn(state); // Advance the turn
     }


    /**
     * Calculates the actual count of a specific dice value across all active players' dice.
     * @param state The current room state.
     * @param internalDiceRolls The map containing dice for the current round.
     * @param bidValue The face value being counted.
     * @returns An object containing the actual count and whether '1's were used as wilds.
     */
    public calculateActualBidCount(state: LiarDiceRoomState, internalDiceRolls: Map<string, Face[]>, bidValue: Face): { actualCount: number, useWildOnes: boolean } {
        let actualCount = 0;
        const targetValue = bidValue;
        const useWildOnes = !state.isOneCalledThisRound;

        internalDiceRolls.forEach((dices, sessionId) => {
            if (state.activePlayerIds.includes(sessionId)) {
                dices.forEach(dice => {
                    if (dice === targetValue || (useWildOnes && dice === 1)) {
                        actualCount++;
                    }
                });
            }
        });
        return { actualCount, useWildOnes };
    }

    /**
     * Processes a challenge, determines the loser, and updates their dice count.
     * @param state The room state to modify.
     * @param internalDiceRolls The map containing dice for the current round.
     * @param challengerSessionId The ID of the player making the challenge.
     * @returns An object containing the loser's sessionId, the actual count, and whether the bid was correct.
     */
    public processChallenge(state: LiarDiceRoomState, internalDiceRolls: Map<string, Face[]>, challengerSessionId: string): { loserId: string, actualCount: number, bidCorrect: boolean } | null {
        if (state.moveNumber === 0 || !state.lastBidderSessionId) {
            console.warn(`[GameLogic] Invalid challenge: No previous bid.`);
            return null; // Or throw error
        }

        const lastBidderSessionId = state.lastBidderSessionId;
        const bidValue = state.currentBidValue as Face; // Should be valid Face if moveNumber > 0
        const bidCount = state.currentBidCount;

        const { actualCount } = this.calculateActualBidCount(state, internalDiceRolls, bidValue);
        const bidCorrect = actualCount >= bidCount;

        const loserId = bidCorrect ? challengerSessionId : lastBidderSessionId;
        const loserPlayer = state.players.get(loserId);

        if (loserPlayer) {
            loserPlayer.diceCount--;
            console.log(`[GameLogic] Player ${loserPlayer.name} lost a die, remaining: ${loserPlayer.diceCount}`);
            state.roundResult = `${loserPlayer.name} 输掉了 1 个骰子${loserPlayer.diceCount <= 0 ? ' (已被淘汰!)' : ''}`;

            // Set next turn starter (loser, if still active)
            const loserIndex = state.activePlayerIds.findIndex(id => id === loserId);
            if (loserIndex !== -1 && loserPlayer.diceCount > 0) {
                state.currentPlayerIndex = loserIndex;
            } else {
                 // Simplified: Start with challenger if active, else 0
                 const challengerIndex = state.activePlayerIds.findIndex(id => id === challengerSessionId);
                 if (challengerIndex !== -1 && (state.players.get(challengerSessionId)?.diceCount ?? 0) > 0){
                     state.currentPlayerIndex = challengerIndex;
                 } else {
                     state.currentPlayerIndex = 0;
                 }
            }
             // Ensure index validity after potential eliminations handled in startNewRound
            if(state.activePlayerIds.length > 0) {
                 state.currentPlayerIndex %= state.activePlayerIds.length;
            } else {
                state.currentPlayerIndex = 0;
            }


        } else {
            console.error(`[GameLogic] Critical error: Could not find loser player ${loserId}`);
            // Handle error case - maybe invalidate round?
        }

        state.status = "roundOver"; // Mark round as over
        return { loserId, actualCount, bidCorrect };
    }


    /**
     * Advances the turn to the next active player.
     * @param state The room state to modify.
     */
    public nextTurn(state: LiarDiceRoomState): void {
        if (state.activePlayerIds.length === 0) {
            console.error(`[GameLogic] nextTurn called with no active players!`);
            state.status = "finished"; // Should end game
            return;
        }
        state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.activePlayerIds.length;
        const nextPlayerId = state.activePlayerIds[state.currentPlayerIndex];
        // Add check for undefined nextPlayerId
        if (!nextPlayerId) {
            console.error(`[GameLogic] nextTurn: Could not determine next player at index ${state.currentPlayerIndex}. Active players: ${state.activePlayerIds.length}`);
            // This case might indicate the game should end, but let the calling context handle it for now.
        } else {
             // Log before potentially accessing name
             console.log(`[GameLogic] Turn passes to ID: ${nextPlayerId}, Name: ${state.players.get(nextPlayerId)?.name}`);
        }
        // LiarDiceRoom will handle broadcasting and checking for AI
    }

    /**
     * Checks if the game should end and finds the winner.
     * @param state The current room state.
     * @returns The winning PlayerState if the game has ended, otherwise undefined.
     */
    public checkEndGame(state: LiarDiceRoomState): PlayerState | undefined {
         const activePlayersWithDice = state.activePlayerIds.filter(id => (state.players.get(id)?.diceCount ?? 0) > 0);
         if (activePlayersWithDice.length < 2 && state.status !== 'waiting') { // Ensure game has started
             state.status = "finished"; // Mark state as finished
             if (activePlayersWithDice.length === 1) {
                 return state.players.get(activePlayersWithDice[0]);
             }
             return undefined; // Draw or error?
         }
         return undefined; // Game continues
    }

}
