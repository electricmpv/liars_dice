
-----

## 产品需求文档：吹牛骰子 AI 角色完整功能

**1. 项目目标**

在现有的多人在线吹牛骰子游戏中，集成一个功能完善、具备个性化交互能力的 AI 角色。该 AI 不仅能作为对手参与游戏，还能与玩家进行聊天、建立（模拟的）关系，并根据记忆进行个性化互动和主动发起交互。

**2. 目标受众**

AI 代码助手 (例如 GitHub Copilot, Cursor, etc.)

**3. 整体架构**

采用**游戏服务器 (`server/`) + 独立 AI 微服务 (`ai-service/`) + 外部/本地模型 + 数据库**的架构。

  * **游戏服务器:** 负责核心游戏逻辑、玩家连接管理、实时状态同步、转发客户端与 AI 服务间的必要通信。
  * **AI 微服务 (需新建):** 承载 AI 的核心智能，包括：
      * 游戏决策逻辑 (调用模型)
      * 聊天内容生成 (调用模型)
      * 记忆管理 (读写数据库)
      * 主动行为触发逻辑
  * **AI 模型:**
      * **初期:** 调用外部 LLM API (如 OpenAI GPT, Google Gemini)。
      * **后期目标:** 迁移到自托管的**微调后的小模型** (Fine-tuned Small Model)，以优化性能、成本和一致性。
  * **数据库 (持久化):** 使用 **Supabase (PostgreSQL)** 存储 AI 与玩家的交互历史和关系数据。

**4. AI 角色设定 (Persona)**

  * **初始角色:** "胆小鬼 AI"
      * **核心特征:** 谨慎、风险规避。
      * **游戏决策:** 倾向于安全出价（基于自己手牌计算概率），非必要不冒险叫高，感觉风险大时倾向于质疑。仅在特定受迫情境下可能尝试 bluff 或超出常规的叫价。
      * **聊天风格 (未来):** 可能略带犹豫、不太自信、有时会为自己的“烂牌”或“糟糕的决策”找借口。
  * **未来扩展:** 架构应支持轻松添加具有不同性格、策略和聊天风格的 AI 角色 (例如：“激进型 AI”、“新手 AI”等)，可能通过不同的 `aiType` 或独立的 persona 配置实现。

**5. 功能需求详解**

**5.1. 核心 Gameplay 集成 (MVP 基础 - 需优先实现)**

*(AI 编码器注意：此部分基于之前的 MVP PRD，代码修改点请参考之前的详细分析)*

  * **AI 玩家创建与加入:**
      * 服务器 `room-manager.ts` 需支持通过 `addAIPlayer` 方法创建 AI 玩家实例 (标记 `isAI: true`, 设置 `aiType`, 自动 `isReady: true`)。
      * 客户端 `RoomUI.ts` 需要添加“快速邀请 AI”按钮，触发调用服务器的 `quickInviteAI` 接口。
      * (可选) 支持通过模拟的好友列表邀请预设的 AI ID 加入房间。
  * **AI 玩家表示:**
      * 共享协议 (`shared/protocols/`) 中的 `Player` 数据结构需包含 `isAI: boolean` 和 `aiType?: string`。
      * 服务器所有广播事件 (`roomUpdate`, `game:state_update`) 中包含玩家的 `isAI` 状态。
      * 客户端 `PlayerItem.ts` / `PlayerDisplayController.ts` 需要根据 `isAI` 状态显示不同的视觉效果（如 AI 图标）。
  * **AI 游戏决策 (`/decideAction` 接口):**
      * `game-manager.ts` 在轮到 AI 时 (`nextTurn` 检测到 `isAI`)，**异步调用** `ai-service` 的 `/decideAction` 接口。
      * `ai-service` 接收包含游戏状态 (`GameState` 子集，**必须包含 AI 自身骰子 `aiPlayerDice`**) 和 AI 角色信息 (`aiPersonality`) 的 Payload。
      * `ai-service` 调用 **AI 模型** (初期为 LLM API) 获取决策 (`{action: 'bid'/'challenge'/'spot_on', value?, count?}`)。
          * **Prompt 构建:** 需包含清晰的游戏规则（参考 `Game Rules for AI` 文档）、当前状态、AI 角色设定。
          * **模型调用:** 处理 API Key，处理超时和错误。
          * **响应验证与兜底:** 验证 LLM 返回格式和内容（特别是 bid 是否合法），若失败则执行预设的兜底策略（如“能挑战就挑战，不能就叫最小有效价”）。
      * `game-manager.ts` 接收到决策后，验证其在**当前时刻**的合法性，然后通过添加了 `isAIAction: true` 标志的 `handleBid`/`handleChallenge`/`handleSpotOn` 方法执行该决策。
  * **游戏规则:** AI 决策必须严格遵守 `Game Rules for AI v1.1` 文档中定义的规则，包括万能点 '1' 的变化规则和“跳开质疑”规则（虽然 AI 主动发起跳开质疑可能较少见，但它需要能理解并应对其他玩家发起的跳开质疑）。

**5.2. 聊天能力 (Phase 2)**

  * **AI 发送游戏内聊天:**
      * 触发时机：可在某些游戏事件后（如赢得/输掉一回合、做出关键决策后），或由 AI 模型根据当前情绪/状态决定发送。
      * 实现：`ai-service` 生成聊天内容 -\> 发送给 `game-server` -\> `game-server` 将带有 AI Player ID 的消息广播到房间 (`chatMessage` 事件)。
  * **AI 响应游戏内聊天:**
      * `game-server` 需要判断聊天消息是否需要 AI 响应（例如 @AI 或包含特定关键词），并将消息内容及上下文（如发送者 ID、近期聊天记录）转发给 `ai-service` 的 `/generateChat` 接口。
      * `ai-service` 调用 **AI 模型** (需要结合记忆) 生成回复 -\> 返回给 `game-server` -\> `game-server` 广播。
  * **AI 私聊:**
      * 玩家可通过好友系统向 AI 发送私聊消息。
      * `game-server` 将私聊消息及上下文转发给 `ai-service` 的 `/generateChat` 接口。
      * `ai-service` 调用 **AI 模型** (结合与该玩家的记忆) 生成回复 -\> 返回给 `game-server` -\> `game-server` 将回复定向发送给该玩家。
  * **`/generateChat` 接口 (AI 服务):**
      * 接收参数：`humanPlayerId`, `aiPlayerId`, `chatHistory` (近期对话), `context` (场景：'in\_game'/'private'), `triggerEvent?` (可选，触发聊天事件)。
      * 处理逻辑：结合记忆 (RAG) + 调用 AI 模型生成符合角色和上下文的回复。
      * 返回参数：`{ replyContent: string }`。

**5.3. 记忆系统 (Phase 2 - 基础需在 MVP 搭建)**

  * **目标:** 使 AI 能够记住与特定玩家的交互历史，用于个性化响应和决策。
  * **数据库:** 使用 **Supabase (PostgreSQL)**。
  * **数据表:** `ai_player_interactions` (结构参考之前 PRD 补充说明)。
  * **数据存储 (`storeInteraction`):**
      * 触发时机：聊天消息（双向）、游戏结束（记录与每个玩家的对局结果）、好友操作（添加/删除）、重要交互事件等。
      * 实现：`ai-service` 提供 `/storeMemory` 接口或内部调用数据库模块的 `storeInteraction` 函数，将交互数据写入数据库。`game-server` 在适当的时候调用此接口或通知 `ai-service` 记录。
  * **数据检索 (`retrieveInteractions`):**
      * 触发时机：在 AI 需要生成个性化聊天回复或（高级功能）进行个性化决策之前。
      * 实现：`ai-service` 内部调用数据库模块的 `retrieveInteractions` 函数，获取与特定 `humanPlayerId` 的相关历史记录。
  * **检索增强生成 (RAG):**
      * 在调用 `/generateChat` 或 `/decideAction` 的 **AI 模型** 时，将检索到的相关记忆片段**整合**到 Prompt 中，为模型提供历史上下文。

**5.4. 主动行为 (Phase 3)**

  * **目标:** 让 AI 能够基于内部逻辑或记忆主动发起交互。
  * **触发器:**
      * 定时任务 (e.g., "AI 检查其好友列表，如果发现某好友在线但最近 X 小时未互动，则...")。
      * 事件驱动 (e.g., "当某个好友上线时...", "当 AI 连续输给某玩家 3 次后...")。
  * **主动动作:**
      * 发起私聊: `ai-service` 生成问候语 -\> 调用 `game-server` 的发送私聊接口。
      * 发起游戏邀请: `ai-service` 决定邀请 -\> 调用 `game-server` 的创建房间并邀请好友接口（需实现）。
  * **实现:**
      * `ai-service` 需要实现触发器逻辑和动作决策逻辑。
      * `game-server` 需要提供相应的 API 供 `ai-service` 调用以执行动作（如发送私聊、创建房间并邀请）。

**5.5. 好感度/关系系统 (可选 Phase 3)**

  * **目标:** 模拟 AI 与玩家之间的关系深度，影响交互。
  * **存储:** 可在 `ai_player_interactions` 的 `metadata` 中记录，或创建单独的 `ai_relationships` 表，存储 `(ai_player_id, human_player_id, affinity_score, status)`。
  * **逻辑:**
      * 定义好感度增减规则（如：聊天积极回复+1，游戏胜利+2，拒绝邀请-1 等）。
      * 在 `storeInteraction` 时更新好感度分数。
      * 在生成聊天 (`/generateChat`) 或执行主动行为时，将好感度分数作为上下文输入给 AI 模型，影响其语气、用词或决策。

**5.6. 组队功能 (待澄清)**

  * 当前理解为 AI 可以作为“好友”被邀请加入同一个游戏房间一起玩（由 5.1 和 5.3 支持）。
  * 如果“组队”指代更复杂的、跨房间的持久化队伍系统，则需要单独的详细需求文档。

**6. 技术实施细节**

  * **AI 服务 API 定义:**
      * `POST /decideAction`: { Request Body: `aiServicePayload`, Response Body: `{ action: '...', ... }` }
      * `POST /generateChat`: { Request Body: `{ humanPlayerId, aiPlayerId, chatHistory, context, ... }`, Response Body: `{ replyContent: string }` }
      * `POST /storeMemory`: { Request Body: `InteractionData` } (返回成功/失败)
      * (可能需要) `POST /handlePlayerEvent`: { Request Body: `{ eventType: 'login'/'logout'/..., playerId: string }` } (用于触发主动行为)
  * **Game Server \<\> AI Service 通信:** 推荐使用健壮的 HTTP (基于 `Workspace` 或 `axios`) 或 gRPC。需要处理好请求超时和错误重试。
  * **数据库模块 (ai-service):**
      * 位置: `ai-service/src/supabaseClient.ts` (或 `db.ts`)。
      * 功能: 初始化 Supabase Client, 实现 `storeInteraction`, `retrieveInteractions`。
  * **配置管理:** 严格使用环境变量管理所有密钥和 URL (`.env` 文件 + `dotenv` 库)。
      * `AI_SERVICE_URL` (供 game-server 使用)
      * `SUPABASE_URL`, `SUPABASE_KEY` (供 ai-service 使用)
      * `LLM_API_KEY`, `LLM_ENDPOINT` (供 ai-service 使用)

**7. 未来技术演进路径**

  * **Agent Framework (AgentScope):** 当聊天、记忆、主动行为、工具调用逻辑变得复杂时，可在 `ai-service` 中引入 AgentScope 来更好地组织和管理这些流程。
  * **微调与本地部署:** 当对性能、成本、一致性有更高要求时，按照之前讨论的方法进行模型微调和本地部署，替换掉对外部 LLM API 的调用。

**8. 参考文档**

  * [游戏规则说明：吹牛骰子 v1.1 (供 AI 理解 - 含跳开质疑)]D:\editors\liars_dice_demo\gamerule.md*(请替换为实际链接或包含其内容)*

-----

这份文档整合了从 MVP 到完整功能的所有需求，希望能为 AI 代码编辑器提供清晰的指导。在实施过程中，建议按照 MVP -\> Phase 2 -\> Phase 3 的顺序逐步进行，并充分测试每个阶段的功能。