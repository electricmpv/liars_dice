import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { z, ZodError } from 'zod';
// Import Supabase client (even if not fully used in MVP routes yet)
import { supabase, storeInteraction, retrieveInteractions } from './supabaseClient';
// Import LLM client functions
import { buildPrompt, callLLM, isValidBid, getFallbackDecision } from './llm-client';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic logging middleware (optional but helpful)
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Define the expected schema for the /decideAction request body using Zod
// This should align with the `aiServicePayload` structure defined in the PRD
const decideActionPayloadSchema = z.object({
    aiPlayerId: z.string(),
    aiPlayerDice: z.array(z.number().min(1).max(6)), // Array of dice faces (1-6)
    // Allow [0, 0] for currentBid to represent the start of a round
    currentBid: z.tuple([z.number().min(0).max(6), z.number().min(0)]), // [value, count]
    totalDiceInGame: z.number().min(1),
    activePlayerIds: z.array(z.string()),
    isOneCalledThisRound: z.boolean(),
    aiType: z.string().optional().default('coward'), // AI personality/type
    // Add any other necessary fields from the game state
});

// Define the expected schema for the response from /decideAction
const aiDecisionSchema = z.union([
    z.object({
        action: z.literal('bid'),
        value: z.number().min(1).max(6),
        count: z.number().min(1),
    }),
    z.object({
        action: z.literal('challenge'),
    }),
    z.object({
        action: z.literal('spot_on'), // Assuming spot_on is also a possible action
    }),
]);

// POST /decideAction Endpoint
app.post('/decideAction', async (req: Request, res: Response) => {
    try {
        // 1. Validate request body against the schema
        const payload = decideActionPayloadSchema.parse(req.body);
        console.log("Received valid payload for /decideAction:", payload);

        // 2. 构建提示
        const prompt = buildPrompt(payload);
        console.log("Generated prompt:", prompt);

        let decision: z.infer<typeof aiDecisionSchema>;

        try {
            // 3. 调用LLM API
            console.log("Calling LLM API...");
            const llmResponse = await callLLM(prompt);
            console.log("LLM response:", llmResponse);

            // 4. 验证LLM响应
            if (llmResponse.action === 'bid') {
                // 检查叫价是否有效
                if (!llmResponse.value || !llmResponse.count ||
                    llmResponse.value < 1 || llmResponse.value > 6 ||
                    llmResponse.count < 1) {
                    throw new Error('LLM返回的叫价无效');
                }

                // 检查叫价是否高于当前叫价
                if (payload.currentBid && !isValidBid([llmResponse.value, llmResponse.count], payload.currentBid)) {
                    throw new Error('LLM返回的叫价不高于当前叫价');
                }

                decision = {
                    action: 'bid',
                    value: llmResponse.value,
                    count: llmResponse.count
                };
            } else if (llmResponse.action === 'challenge' || llmResponse.action === 'spot_on') {
                decision = { action: llmResponse.action };
            } else {
                throw new Error(`LLM返回了无效的action: ${llmResponse.action}`);
            }
        } catch (llmError) {
            // 5. LLM调用失败或响应无效，使用兜底逻辑
            console.error('LLM处理错误，使用兜底逻辑:', llmError);
            decision = getFallbackDecision(payload);
            console.log("Fallback decision:", decision);
        }

        // 6. 验证决策符合模式并返回
        const validatedDecision = aiDecisionSchema.parse(decision);

        // 7. 可选：记录交互（如果需要）
        try {
            if (supabase && payload.aiPlayerId && payload.activePlayerIds.includes(payload.aiPlayerId)) {
                const humanPlayerId = payload.activePlayerIds.find(id => id !== payload.aiPlayerId);
                if (humanPlayerId) {
                    await storeInteraction({
                        ai_player_id: payload.aiPlayerId,
                        human_player_id: humanPlayerId,
                        interaction_type: 'game_decision',
                        metadata: {
                            decision: validatedDecision,
                            game_state: {
                                currentBid: payload.currentBid,
                                totalDiceInGame: payload.totalDiceInGame,
                                isOneCalledThisRound: payload.isOneCalledThisRound
                            }
                        }
                    }); // Correctly close storeInteraction call
                } // Correctly close 'if (humanPlayerId)'
            } // Correctly close 'if (supabase ...)'
        } catch (dbError) { // Correctly placed catch block for Supabase errors
            // 数据库错误不应影响API响应
            console.error('存储交互记录时出错:', dbError instanceof Error ? dbError.message : dbError);
            // Log the full error object for more details if needed
            console.error('Full Supabase error object:', dbError);
        }

        // Send response after Supabase attempt (success or caught error)
        res.status(200).json(validatedDecision);

    } catch (error) { // Outer catch for ZodError or other errors before Supabase call
        if (error instanceof ZodError) {
            // Handle validation errors
            console.error('Validation Error:', error.errors);
            res.status(400).json({ error: 'Invalid request payload', details: error.errors });
        } else {
            // Handle other errors (e.g., LLM API call failure, unexpected issues)
            console.error('Error in /decideAction:', error);

            // 尝试返回兜底决策
            try {
                const fallbackDecision = getFallbackDecision(req.body);
                const validatedFallback = aiDecisionSchema.parse(fallbackDecision);
                console.log('返回兜底决策:', validatedFallback);
                res.status(200).json(validatedFallback);
            } catch (fallbackError) {
                // 如果兜底决策也失败，返回通用错误
                console.error('兜底决策也失败:', fallbackError);
                res.status(500).json({ error: 'Internal server error processing AI action' });
            }
        }
    }
});

// Basic health check endpoint (optional)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('AI Service is running');
});

// Global error handler (optional but good practice)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`AI Service listening on port ${port}`);
    if (!supabase) {
         console.warn("Reminder: Supabase client is not initialized (check .env variables). Database features will be unavailable.");
    }
});
