好的，这是一份为 AI 代码编辑器（如 GitHub Copilot、Cursor 等）准备的产品需求文档 (PRD)，旨在指导其协助你完成“胆小鬼”AI 角色的集成工作。

---

## 产品需求文档：多人在线吹牛骰子 AI 玩家集成 (MVP)

**1. 项目目标**

在现有的多人在线吹牛骰子游戏（Cocos Creator 客户端 + Node.js/Go 服务器）中，集成一个基础的 AI 玩家角色。首个 AI 角色定位为“胆小鬼”性格，能够被玩家邀请加入房间、参与游戏流程，并基于 LLM API 进行初步的决策。

**2. 核心功能：AI 玩家集成 (MVP)**

**2.1. AI 角色设定 (Persona)**

* **名称:** 胆小鬼 AI
* **核心行为:**
    * **谨慎:** 倾向于做出风险较低的决策。
    * **保守叫价:** 叫价时，尽量确保叫的数量不超过自己手中实际拥有的对应点数（包括万能点 '1'，除非 '1' 本回合已被叫过）。
    * **有限冒险:** 在特定情况下（例如，感觉当前叫价极不可能，或者自己被逼到绝境时），可能进行一次超出常规的叫价（Bluff）或发起挑战。
    * **自动准备:** 加入房间后自动进入准备状态。

**2.2. 技术架构**

采用“游戏服务器 + 独立 AI 微服务 + LLM API”的架构。

* **游戏服务器 (`game-server`)**: 处理核心游戏逻辑、玩家连接、状态同步。当轮到 AI 时，调用 AI 微服务获取决策。
* **AI 微服务 (`ai-service`)**: (需新建) 接收游戏服务器的状态信息，构建 Prompt 调用 LLM API，处理 LLM 响应，实现兜底逻辑，返回决策给游戏服务器。
* **LLM API**: (外部依赖) 提供基于 Prompt 的决策生成能力。

**2.3. 后端修改 (游戏服务器)**

请根据以下要求修改现有服务器代码：

**2.3.1. 文件: `room-manager.ts`**

* **接口 `Player`**:
    * 添加字段 `isAI: boolean;`
    * 添加可选字段 `aiType?: string;`
* **方法 `createRoom` 和 `joinRoom`**:
    * 在创建 `Player` 对象时，设置 `isAI: false`。
* **新方法 `addAIPlayer`**:
    * 签名: `async addAIPlayer(roomId: string, aiType: string = 'coward'): Promise<{ success: boolean; data?: { playerId: string; room: Room }; error?: string }>`
    * 功能:
        * 检查房间存在、状态（非 gaming/closed）、人数。
        * 生成唯一的 AI `playerId` (例如: `ai_${aiType}_${uuid()}`)。
        * 创建 `Player` 对象，设置 `isAI: true`, `aiType`, `name` (例如: "胆小鬼 AI"), `isReady: true`。
        * 将 AI 添加到 `room.players` 和 `this.players` Map 中。
        * 更新 `room.playerCount` 和 `room.updatedAt`。
        * 返回成功信息，包含 AI 的 `playerId` 和更新后的 `room` 对象。
* **方法 `convertToSharedRoom`**:
    * 在 `detailedPlayers` 映射中，确保返回的玩家对象包含 `isAI` 字段。

**2.3.2. 文件: `game-manager.ts`**

* **接口 `PlayerData`**:
    * 添加字段 `isAI: boolean;`
* **方法 `createGame`**:
    * 修改输入参数 `playerDataFromRoom` 的类型，使其包含 `isAI`。
    * 在内部创建 `gamePlayerData` 时，从输入的 `playerDataFromRoom` 中复制 `isAI` 标志。
* **方法 `rollDicesForAllPlayers`**:
    * 在 `this.io.to(player.socketId).emit("game:dice_roll", ...)` 之前，添加判断 `!player.isAI`。AI 不需要通过 Socket 接收自己的骰子。
* **引入 AI 服务通信**:
    * 定义 `AI_SERVICE_URL` (例如: `'http://localhost:3001'`)。
    * 添加 `private async getAIAction(gameState: GameState, aiPlayerId: string): Promise<any>` 方法：
        * 查找 AI 玩家数据和骰子 (`gameState.playerDices.get(aiPlayerId)`)。
        * 构建 `aiServicePayload` JSON 对象，包含必要的游戏状态（**必须包含 AI 自己的骰子 `aiPlayerDice`**、当前叫价、总骰子数、玩家列表、AI 性格等）。
        * 使用 `Workspace` (或 `node-fetch`) 异步调用 AI 服务的 `/decideAction` POST 接口。
        * 处理响应：解析返回的决策 JSON。
        * 处理错误/超时：调用 `getFallbackAIAction` 获取兜底决策。
    * 添加 `private getFallbackAIAction(gameState: GameState, aiPlayerId: string): any` 方法：
        * 实现简单的兜底逻辑（例如：能挑战就挑战，否则叫最低有效价 1个1）。
* **修改方法 `nextTurn`**:
    * 标记方法为 `async`。
    * 在确定下一个玩家 `nextPlayer` 后，检查 `nextPlayer.isAI`。
    * 如果是 AI，**异步调用** `this.triggerAITurn(game.gameId)` (不需要 `await`)。
* **新方法 `triggerAITurn`**:
    * 签名: `private async triggerAITurn(gameId: string): Promise<void>`
    * 功能:
        * 获取当前游戏 `game`。检查游戏状态是否为 `playing`，当前玩家是否为预期的 AI。
        * （可选但推荐）添加短暂延时 (`await new Promise(...)`) 模拟思考。
        * **重新获取**当前游戏状态 `currentGame` 并再次检查状态和当前玩家，防止延迟期间状态变化。
        * 调用 `this.getAIAction(currentGame, aiPlayerId)` 获取 AI 决策。
        * **再次检查**游戏状态 `finalCheckGame` 和当前玩家。
        * 根据 `aiDecision.action` 调用相应的处理函数 (`handleBid`, `handleChallenge`, `handleSpotOn`)，并**传递 `isAIAction = true`**。
        * 处理 `getAIAction` 或动作执行过程中的异常，可以尝试执行兜底策略。
* **重构方法 `handleBid`, `handleChallenge`, `handleSpotOn`**:
    * 为每个方法添加 `isAIAction: boolean = false` 参数。
    * 修改方法开头的玩家回合检查逻辑：
        * 如果 `!isAIAction`，则执行原有的检查 (`game.activePlayers[game.currentPlayerIndex] !== playerId`)，失败则 `throw new Error("不是你的回合")`。
        * 如果 `isAIAction`，则跳过此检查，或添加一个额外的安全检查 (`game.activePlayers[game.currentPlayerIndex] === playerId`)，失败则 `throw new Error("AI 行动时序错误")`。
    * 确保这些方法内部调用 `nextTurn`, `startNewRound`, `endGame` 时，正确处理 `async/await`。

**2.3.3. 文件: `socket-server.ts`**

* **添加事件处理器 `quickInviteAI`**:
    * 监听 `quickInviteAI` 事件。
    * 从客户端获取 `roomId`。
    * 验证 `socket.data.roomId` 是否匹配。
    * 调用 `this.roomManager.addAIPlayer(roomId)`。
    * 如果成功，调用 `this.broadcastRoomUpdate(roomId)` 和 `this.broadcastLobbyUpdate()`，并通过 `callback` 返回成功信息。
    * 处理错误并返回失败信息。
* **修改事件处理器 `startGame`**:
    * 在调用 `this.gameManager.createGame` 之前，从 `RoomManager` 获取玩家列表时，确保包含了 `isAI` 标志。
    * 将包含 `isAI` 的 `playerDataList` 传递给 `gameManager.createGame`。
* **确保广播包含 `isAI`**:
    * 检查 `broadcastRoomUpdate` (通过 `convertToSharedRoom` 应该已包含)。
    * 检查 `GameManager` 中构建 `game:state_update` 事件负载的地方，确保 `players` 数组中的每个对象都包含 `isAI` 字段。

**2.4. AI 微服务 (新建)**

* **技术栈:** Node.js + Express 或 Go + Gin (或其他你熟悉的技术)。
* **API 端点 `/decideAction` (POST):**
    * **Request Body:** 接收 `aiServicePayload` JSON 对象（包含游戏状态、AI 自身骰子、性格等）。
    * **处理逻辑:**
        1.  **构建 Prompt:** 根据接收到的信息和 AI 角色设定 ("胆小鬼") 生成结构化的 Prompt。
            * **示例 Prompt 结构:**
                ```text
                You are playing Liar's Dice. Your persona is 'cowardly': cautious, risk-averse.
                Game Context:
                - Your Dice: [${aiPlayerDice}] (Count: ${aiPlayerDiceCount})
                - Current Highest Bid: ${currentBid[1]}x ${getFaceLabel(currentBid[0])} (Value: ${currentBid[0]}, Count: ${currentBid[1]})
                - Total Dice in Game: ${totalDiceInGame}
                - Active Players: [${activePlayerIds.join(', ')}] (Your ID: ${aiPlayerId})
                - Was '1' called this round?: ${isOneCalledThisRound} ('1' is wild: ${!isOneCalledThisRound})

                Task: Decide your next action (bid or challenge/spot_on). Prioritize safety. Only bid higher if confident or cornered. If challenging seems safer than bidding, challenge.

                Output your decision in JSON format ONLY:
                {"action": "bid", "value": <1-6>, "count": <number>}
                OR
                {"action": "challenge"}
                OR
                {"action": "spot_on"}
                ```
        2.  **调用 LLM API:** 向配置的 LLM API (如 OpenAI, Gemini) 发送请求。处理 API Key。
        3.  **解析响应:** 解析 LLM 返回的 JSON。
        4.  **验证与兜底:**
            * 验证响应格式是否正确 (`action` 是否为 'bid', 'challenge', 'spot_on'；如果是 'bid'，`value` 和 `count` 是否有效）。
            * **非常重要:** 验证 AI 返回的 `bid` 是否**高于** `currentBid` (使用 `BidValidator` 逻辑)。如果低于或等于，视为无效响应。
            * 如果 LLM 响应无效、超时或格式错误，执行兜底逻辑 (`getFallbackAIAction` 的逻辑，例如挑战或叫 1个1)。
        5.  **返回决策:** 将最终（经过验证或兜底的）决策 JSON 返回给游戏服务器。
    * **Response Body:** 返回决策 JSON，例如 `{"action": "challenge"}` 或 `{"action": "bid", "value": 4, "count": 5}`。

**2.5. 前端修改 (Cocos Creator 客户端)**

请根据以下要求修改现有客户端代码：

* **文件: `scripts/ui/RoomUI.ts`**:
    * 添加 `@property` 引用 "邀请 AI" 按钮 (`inviteAIButton`)。
    * 在 `onLoad` 或 `start` 中为此按钮绑定 `onQuickInviteAI` 点击回调。
    * 实现 `onQuickInviteAI` 方法，调用 `network.request('quickInviteAI', { roomId: this._roomId })`。处理响应和按钮状态。
    * 修改 `updatePlayerList` 方法，接收包含 `isAI` 的 `playerData`，并调用 `playerComp.setIsAI(playerData.isAI)`。
* **文件: `scripts/prefabs/PlayerItem.ts`**:
    * 添加 `@property` 引用 AI 图标节点 (`aiIcon`)。
    * 添加 `_isAI` 内部状态。
    * 实现 `setIsAI(isAI: boolean)` 方法，控制 `aiIcon` 的显隐，并可选择性调整其他样式。
* **文件: `scripts/ui/PlayerDisplayController.ts`**:
    * 修改 `updateSinglePlayerDisplay` 方法，从 `playerData` 读取 `isAI` 并传递给 `playerComp.setIsAI()`。
* **文件: `scripts/core/NetworkManager.ts`**:
    * 如果尚未有通用的 `request` 方法，需要添加；如果已有，确保它可以调用 `quickInviteAI`。
    * 确保 `roomUpdate` 和 `game:state_update` 事件的处理器能正确解析包含 `isAI` 的玩家列表数据。

**3. 未来考虑 (Post-MVP)**

* **AI 聊天集成:**
    * AI 服务添加 `/generateChat` 接口，处理聊天生成（可能需要 RAG）。
    * 游戏服务器转发聊天消息给 AI 服务，并将 AI 回复广播给客户端。
    * 客户端 `ChatItem.ts` 正确显示 AI 消息。
* **AI 记忆与个性化:**
    * 引入数据库 (PostgreSQL, Redis 等)。
    * AI 服务实现 `/storeMemory` 接口。
    * 在 `/generateChat` 和 `/decideAction` 中实现 RAG，从数据库检索并使用记忆。
* **AgentScope 框架:** 当 AI 逻辑变得更复杂（需要多步思考、工具调用、复杂记忆管理）时，可以考虑在 AI 服务中引入 AgentScope。
* **本地小模型部署:** 进行模型微调和部署，AI 服务切换调用目标 API。

**4. 关键接口/数据结构**

* **`Player` (room-manager.ts):** 需添加 `isAI`, `aiType?`。
* **`PlayerData` (game-manager.ts):** 需添加 `isAI`。
* **`aiServicePayload` (game-manager.ts -> ai-service):** 需包含游戏状态、AI 骰子、性格等。
* **AI Service Response (ai-service -> game-manager):** 需为 `{ action: 'bid'|'challenge'|'spot_on', value?: Face, count?: number }` 格式。


好的，这是为 AI 代码编辑器准备的关于 Supabase 集成的补充说明，你可以将其添加到之前的 PRD 文档中：

---

**5. Supabase 数据库集成 (用于 AI 记忆)**

**5.1. 目标**

为了实现 AI 的长期记忆能力（例如，记住与特定玩家的聊天记录、过往游戏结果），从而支持更个性化的交互（如不同的聊天回复、主动邀请玩家等），我们将使用 Supabase 提供的 PostgreSQL 数据库进行数据持久化。

**5.2. 选型**

* **数据库:** 使用项目已有的免费 Supabase 账户提供的云 PostgreSQL 数据库。
* **客户端库 (AI 服务):** 推荐在 Node.js AI 微服务中使用官方的 `@supabase/supabase-js`库来简化数据库交互。备选方案是使用标准的 `pg` 库。

**5.3. 范围与数据模型 (初步)**

* **核心目的:** 存储 AI 与人类玩家之间的交互记录。
* **主要数据表:** `ai_player_interactions`
* **表结构 (建议):**
    ```sql
    CREATE TABLE ai_player_interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 交互记录唯一 ID
        ai_player_id TEXT NOT NULL,                     -- 交互涉及的 AI Player ID (例如 ai_coward_xxx)
        human_player_id TEXT NOT NULL,                  -- 交互涉及的人类 Player ID (来自 RoomManager/GameManager)
        timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),   -- 交互发生时间
        interaction_type TEXT NOT NULL,                 -- 交互类型 (例如: 'chat_message', 'game_result', 'direct_invite', 'room_join')
        game_id TEXT NULL,                              -- 如果与游戏相关，记录游戏 ID
        chat_content TEXT NULL,                         -- 如果是聊天，记录聊天内容
        game_outcome TEXT NULL,                         -- 如果是游戏结果，记录结果 (例如: 'ai_won', 'human_won', 'draw')
        metadata JSONB NULL                             -- 用于存储其他相关信息的 JSON 对象 (例如，游戏得分、聊天情感等)
    );

    -- 建议索引 (提高查询效率)
    CREATE INDEX idx_ai_player_interactions_human_ai ON ai_player_interactions (human_player_id, ai_player_id, timestamp DESC);
    CREATE INDEX idx_ai_player_interactions_timestamp ON ai_player_interactions (timestamp DESC);
    ```
    * *(AI 编码器注意：请根据需要创建或调整此表结构)*

**5.4. 实现阶段**

* 虽然完整的聊天和记忆功能属于 **Phase 2 (聊天与记忆)**，但 AI 微服务的**基础数据库连接和配置**应在 **MVP 阶段搭建**。
* AI 代码编辑器在编写 `ai-service` 代码时，需要**包含数据库连接模块**和**基础的存储/检索函数框架**，即使这些函数在 MVP 阶段可能尚未被完全调用。

**5.5. 配置要求**

* AI 微服务需要从**环境变量**中读取 Supabase 连接信息。
* 请确保 `ai-service` 的 `.env` 文件 (或等效配置) 中包含以下变量：
    * `SUPABASE_URL`: 你的 Supabase 项目 URL。
    * `SUPABASE_KEY`: 你的 Supabase **Service Role Key** (因为这是后端服务，需要更高权限来写入数据，而不是 Anon Key)。*请注意保护好此密钥。*
* 在 `ai-service` 代码中，使用 `dotenv` 库加载这些环境变量。

**5.6. 技术实现 (AI 服务)**

* **文件位置:** 在 `ai-service` 项目中创建数据库交互模块 (例如: `src/supabaseClient.ts` 或 `src/database.ts`)。
* **初始化:** 在该模块中，使用 `@supabase/supabase-js` 库和环境变量 `SUPABASE_URL`, `SUPABASE_KEY` 初始化 Supabase 客户端。
    ```typescript
    // Example in src/supabaseClient.ts
    import { createClient } from '@supabase/supabase-js';
    import dotenv from 'dotenv';

    dotenv.config(); // Load .env file

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY; // Use Service Role Key

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL or Key not found in environment variables.");
    }

    export const supabase = createClient(supabaseUrl, supabaseKey);
    ```
* **核心函数 (框架):** 在数据库模块中，定义并导出用于操作 `ai_player_interactions` 表的函数框架：
    * `async function storeInteraction(interactionData: { ai_player_id: string, human_player_id: string, interaction_type: string, /* other fields */ }): Promise<void>`
        * 功能：接收交互数据，并将其插入到 `ai_player_interactions` 表中。
    * `async function retrieveInteractions(humanPlayerId: string, aiPlayerId: string, limit: number = 10): Promise<any[]>`
        * 功能：根据 `human_player_id` 和 `ai_player_id` 查询最近的 `limit` 条交互记录，按 `timestamp` 降序排列。用于 RAG。

**5.7. 给 AI 代码编辑器的指令总结**

* 在 `ai-service` 中，使用 `@supabase/supabase-js` 库。
* 创建数据库连接模块 (`supabaseClient.ts` 或类似)，使用环境变量 (`SUPABASE_URL`, `SUPABASE_KEY`) 初始化客户端。
* 实现 `storeInteraction` 和 `retrieveInteractions` 函数的基本框架，用于读写 `ai_player_interactions` 表（表结构见 5.3）。
* 在需要进行数据库操作的地方（未来实现聊天记忆、RAG 时），调用这些函数。

---

将这部分内容添加到之前的 PRD 文档中，AI 代码编辑器就能理解使用 Supabase 的具体要求了。
---

这份 PRD 应该能为你的 AI 代码编辑器提供足够清晰的指令和上下文，以协助你完成代码的修改和新功能的添加。祝编码顺利！