好的，这是一份根据你描述的当前项目状态和待办事项整理的、适合 AI 代码编辑器理解的开发任务文档。

---

## 项目开发状态与后续任务 v1.1(AI 助手指南)

**1. 文档目标**

本文档旨在明确多人在线吹牛骰子项目的当前完成状态，并列出后续需要开发的功能，为 AI 代码助手提供清晰的任务指令和上下文。

**2. 当前项目状态 (已完成)**

* **前端 (Cocos Creator - `client/assets/scripts/`)**
    * **场景:** 登录 (`LoginScene`)、大厅 (`LobbyScene`)、房间 (`RoomScene`)、游戏 (`GameScene`) 四个基本场景已创建。
    * **核心 UI 控制器:** `LoginUI`, `LobbyController`, `RoomUI`, `GameUI` 存在，并处理部分场景逻辑。
    * **网络通信:** `NetworkManager` 和 `SocketAdapter` 实现基础的 Socket.IO 通信。
    * **核心游戏显示:** `PlayerDisplayController`, `DiceDisplayController`, `BidController`, `GameHistoryPanel`, `GameResultPanel` 等基础 UI 组件存在。
    * **状态管理:** `GameStateManager` 用于管理部分客户端游戏状态。
* **后端 (游戏服务器 - `server/src/modules/`)**
    * **网络层:** `socket-server.ts` 处理客户端连接、基础事件 (登录、心跳、部分房间/游戏事件)。
    * **房间管理:** `room-manager.ts` (内存版) 实现房间创建、加入、离开、状态管理、玩家准备状态。
    * **游戏逻辑:** `game-manager.ts` (内存版) 实现核心吹牛骰子游戏规则（包括万能点'1'规则、叫价验证、质疑结算、玩家淘汰、回合轮转、新加的“跳开质疑”规则也应在此实现或验证）。
    * **基础 AI 集成:** 支持 AI 玩家加入房间 (`isAI` 标志)，并在游戏状态中存在。
* **后端 (AI 微服务 - `ai-service/`)**
    * **基础服务:** 已搭建基础的 HTTP 服务框架 (如 Express)。
    * **决策接口:** 实现 `/decideAction` 接口。
    * **LLM 调用:** 接口内部通过构造简单 Prompt 调用外部 LLM API (如 OpenAI/Gemini) 获取初步的游戏决策 (叫价/质疑)。
* **整体效果:** 玩家可以登录、创建/加入房间，与**简单决策能力**的 AI 角色进行一局基础的吹牛骰子游戏。

**3. 后续开发任务 (待完成)**

以下是按优先级建议的后续开发任务列表：

**优先级 1：核心游戏体验增强**

* **任务 1.1: 实现跳开质疑 (Jump Challenge)**
    * **前端 (`GameUI.ts`, `BidController.ts`):**
        * 在游戏界面添加“跳开”按钮。
        * 实现按钮的显隐逻辑：非叫价者和非当前轮次玩家可见；叫价后 3 秒保护期内禁用；保护期后且当前轮次玩家未行动时启用。
        * 按钮点击后，发送 `game:jump_challenge` 事件给服务器。
    * **后端 (`socket-server.ts`, `game-manager.ts`):**
        * `socket-server.ts`: 添加 `game:jump_challenge` 事件监听器，验证发起者资格（非叫价者、非当前玩家、时机合适），调用 `gameManager.handleJumpChallenge`。
        * `game-manager.ts`: 实现 `handleJumpChallenge` 方法，处理跳开质疑逻辑（立即结算、特殊惩罚：质疑失败扣 2 骰子），更新游戏状态并广播。*(注意：需参考 `Game Rules for AI v1.1` 文档)*
* **任务 1.2: 实现游戏内基础聊天 UI**
    * **前端 (`GameUI.ts`, `prefabs/ChatItem.ts`):**
        * 完善游戏场景中的聊天显示区域 (`ScrollView` + `Layout` + `ChatItem` Prefab 实例)。
        * 添加聊天输入框 (`EditBox`) 和发送按钮 (`Button`)。
        * 实现发送按钮逻辑：获取输入内容，调用 `network.sendChatMessage()` (需在 `NetworkManager` 中实现或确认已有)。
        * 实现接收 `chatMessage` 事件逻辑：实例化 `ChatItem` 并添加到显示区域，自动滚动到底部。
    * **后端 (`socket-server.ts`):**
        * 确保 `chatMessage` 事件处理器能正确将游戏内聊天消息广播给房间内所有玩家（包括发送者）。
* **任务 1.3: 完善游戏历史记录显示**
    * **前端 (`GameHistoryPanel.ts`):**
        * 确保 `ScrollView` 滚动功能正常，新记录添加后能自动滚动到底部。
        * (可选) 区分不同类型的历史记录（系统消息、玩家叫价、质疑/开点结果、聊天消息）并使用不同样式（颜色、图标、缩进等）显示。考虑添加筛选/频道切换按钮（如“只看叫价”、“只看聊天”）。
* **任务 1.4: 完善 AI 决策系统 (AI 服务 - `ai-service/`)**
    * **Prompt 工程:** 根据 `Game Rules for AI v1.1` 和 "胆小鬼" Persona，**详细构建和优化**发送给 LLM 的 Prompt，使其包含更完整的上下文和更精确的指令。
    * **类型定义:** 为 AI 服务中的核心数据结构（如 `aiServicePayload`, `AI_Decision`) 添加明确的 TypeScript 类型定义。
    * **行为验证:** 在收到 LLM 响应后，**严格验证**其决策是否符合当前游戏规则（例如，叫价是否高于当前叫价），若不符合则必须触发**兜底逻辑 (`getFallbackAIAction`)**。
    * **AI 玩家管理 (基础):** 确保 `/decideAction` 能正确处理针对不同 `aiPlayerId` (或 `aiType`) 的请求（为未来支持多 AI 类型做准备）。
    * **监控与日志:** 添加基础的日志记录，追踪 AI 服务的请求、响应、LLM 调用耗时、错误情况等。

**优先级 2：社交功能**

* **任务 2.1: 好友系统 (核心)**
    * **后端 (Game Server - 新模块/或整合进 RoomManager/UserManager):**
        * 设计并实现好友关系的数据模型（可能需要数据库，可用 Supabase）。
        * 实现 API：添加好友请求、接受/拒绝请求、删除好友、获取好友列表（包含在线状态、游戏状态）。
    * **前端 (`LobbyController.ts`, `RoomUI.ts`, 新建 `FriendPanel.ts`?):**
        * 创建好友列表 UI 面板。
        * 实现 UI 逻辑：显示好友列表、在线状态、发起好友请求、处理好友请求通知、删除好友。
        * 调用后端好友系统 API。
* **任务 2.2: 好友邀请游戏**
    * **前端 (FriendPanel?, PlayerItem?):** 在好友列表项中添加“邀请游戏”按钮。
    * **后端 (Game Server):** 实现邀请逻辑（发送邀请通知、被邀请者接受/拒绝、接受后自动加入房间或创建新房间）。
* **任务 2.3: 好友私聊**
    * **前端 (FriendPanel?, 新建 `ChatPanel.ts`?):** 实现私聊界面 UI 和逻辑。
    * **后端 (Game Server):** 处理私聊消息路由。如果聊天对象是 AI，将消息转发给 `ai-service` 的 `/generateChat` 接口。
    * **后端 (AI Service):** 实现 `/generateChat` 接口（调用 LLM，未来结合记忆）。
* **任务 2.4: 结算页面加好友**
    * **前端 (`GameResultPanel.ts`):** 在玩家列表旁添加“加好友”按钮。
    * **后端 (Game Server):** 实现从结算页面发起好友请求的 API。
* **任务 2.5: 好友列表显示 AI**
    * **后端 (Game Server):** 定义预设的 AI "好友" ID 列表。在获取好友列表 API 中，可以将这些 AI 返回给客户端。
    * **前端 (FriendPanel?, `PlayerItem.ts`):** 在好友列表中区分显示 AI 角色。

**优先级 3：排行榜与房间管理**

* **任务 3.1: 积分与排行榜**
    * **后端 (Game Server):**
        * 设计积分计算逻辑（基于胜负、骰子差等）。
        * 设计排行榜数据模型（需数据库，可用 Supabase）。
        * 实现 API：获取排行榜、更新玩家积分。
    * **前端 (`LobbyController.ts`, 新建 `RankPanel.ts`?):**
        * 创建排行榜 UI 面板。
        * 调用 API 显示排行榜数据。
        * （可选）在用户 Profile 处显示积分。
* **任务 3.2: 房主踢人**
    * **前端 (`RoomUI.ts`, `PlayerItem.ts`):**
        * 在玩家列表项中（非房主自己）添加“踢出”按钮（仅房主可见）。
        * 实现按钮点击逻辑，发送 `kickPlayer` 请求给服务器。
    * **后端 (`socket-server.ts`, `room-manager.ts`):**
        * `socket-server.ts`: 添加 `kickPlayer` 事件监听器，验证发起者是否为房主，调用 `roomManager.kickPlayer`。
        * `room-manager.ts`: 实现 `kickPlayer` 方法，将玩家移出房间，更新房间状态。
        * `socket-server.ts`: 向被踢出玩家发送 `kicked` 事件通知，并向房间内其他玩家广播 `roomUpdate`。

**优先级 4：高级 AI 功能 (基于 PRD v2.0)**

* **任务 4.1: AI 聊天生成:** 完整实现 `ai-service` 的 `/generateChat` 接口，调用 LLM 生成符合角色设定的聊天内容。
* **任务 4.2: AI 记忆系统:**
    * **数据库 (`ai-service`):** 使用 Supabase，完整实现 `supabaseClient.ts` 中的 `storeInteraction` 和 `retrieveInteractions` 函数。
    * **数据记录:** 在 `ai-service` 和 `game-server` 的适当位置调用 `storeInteraction` 记录关键交互。
    * **RAG 实现:** 在 `/decideAction` 和 `/generateChat` 中，调用 `retrieveInteractions` 获取记忆，并整合进 LLM Prompt。
* **任务 4.3: AI 主动行为:** 实现 `ai-service` 中的触发器和决策逻辑，以及 `game-server` 中供 AI 调用的接口（发私聊、邀请游戏）。
* **任务 4.4: 好感度系统:** 设计并实现好感度计算、存储和应用逻辑。
* **任务 4.5: 多 Persona 支持:** 架构支持加载和使用 3 个基于真实数据微调的不同 AI 模型/配置。**(注：此项依赖模型微调工作的完成)**

**低优先级**

* **任务 5.1: 组队模式:** 实现大厅切换到组队模式的 UI 和后端逻辑（需先完成玩法设计）。
* **任务 5.2: 快捷发言与表情:** 完善游戏内聊天框，添加预设快捷发言和表情选择功能。

**给 AI 代码助手的指令:**

1.  请根据上述**优先级顺序**，协助完成“待完成”列表中的任务。
2.  在实现功能时，请参考项目**现有代码结构** (`client/`, `server/`, `ai-service/`, `shared/`) 和**之前的 PRD 文档**（特别是 v2.0 和游戏规则 v1.1）。
3.  **前端任务:** 涉及 UI 修改（添加按钮、面板）、逻辑实现（事件绑定、数据处理）、调用 `NetworkManager` 发送/接收网络消息。
4.  **后端任务 (Game Server):** 涉及在 `socket-server.ts` 中添加/修改事件处理器、在 `room-manager.ts` 和 `game-manager.ts` 中实现核心业务逻辑、与数据库 (Supabase) 或 `ai-service` 进行交互。
5.  **后端任务 (AI Service):** 涉及完善 `/decideAction` 接口（Prompt、验证、兜底）、实现 `/generateChat`、`/storeMemory` 等接口、与数据库 (Supabase) 交互、与 LLM API 交互。
6.  **数据库:** 假定使用 Supabase (PostgreSQL)。在需要持久化存储的地方（好友、排行、AI 记忆），请实现相应的数据库读写逻辑。可先定义接口和基础框架。
7.  **代码风格:** 请尽量保持与项目中现有代码一致的风格和规范。
8.  **明确性:** 如果任务描述不够清晰，请随时提问。

---

这份文档清晰地划分了已完成和未完成的工作，并按优先级排列了后续任务，便于你和 AI 助手协作推进项目。