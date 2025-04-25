import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Use Service Role Key

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase URL or Key not found in environment variables.");
  // Consider throwing an error or exiting in a real application
  // throw new Error("Supabase URL or Key not found in environment variables.");
}

// Initialize Supabase client only if URL and Key are present
// This prevents errors during testing or if env vars are missing temporarily
export let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized.");
} else {
    console.warn("Supabase client not initialized due to missing environment variables.");
}


// Define the structure for interaction data (adjust as needed based on your table)
interface InteractionData {
    ai_player_id: string;
    human_player_id: string;
    interaction_type: string; // e.g., 'chat_message', 'game_result', 'direct_invite', 'room_join'
    game_id?: string | null;
    chat_content?: string | null;
    game_outcome?: string | null; // e.g., 'ai_won', 'human_won', 'draw'
    metadata?: Record<string, any> | null;
}

/**
 * Stores an interaction record in the Supabase database.
 * @param interactionData - The data for the interaction to store.
 */
export async function storeInteraction(interactionData: InteractionData): Promise<{ success: boolean; error?: any }> {
    if (!supabase) {
        console.error("Supabase client not initialized. Cannot store interaction.");
        return { success: false, error: "Supabase client not initialized." };
    }

    try {
        const { error } = await supabase
            .from('ai_player_interactions') // Make sure this table name matches your Supabase table
            .insert([interactionData]);

        if (error) {
            console.error('Error storing interaction:', error);
            return { success: false, error };
        }

        console.log('Interaction stored successfully:', interactionData);
        return { success: true };
    } catch (err) {
        console.error('Unexpected error storing interaction:', err);
        return { success: false, error: err };
    }
}

/**
 * Retrieves recent interaction records between a human player and an AI player.
 * @param humanPlayerId - The ID of the human player.
 * @param aiPlayerId - The ID of the AI player.
 * @param limit - The maximum number of records to retrieve (default: 10).
 * @returns An array of interaction records or an empty array if none found or error occurs.
 */
export async function retrieveInteractions(humanPlayerId: string, aiPlayerId: string, limit: number = 10): Promise<any[]> {
     if (!supabase) {
        console.error("Supabase client not initialized. Cannot retrieve interactions.");
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('ai_player_interactions')
            .select('*')
            .eq('human_player_id', humanPlayerId)
            .eq('ai_player_id', aiPlayerId)
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error retrieving interactions:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error retrieving interactions:', err);
        return [];
    }
}

// You can add more database interaction functions here as needed.
