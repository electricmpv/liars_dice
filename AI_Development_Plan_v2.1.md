

## 项目开发状态与后续任务 v2.1 (AI 助手指南 - Colyseus 优先)

**1. 文档目标**

本文档旨在明确多人在线吹牛骰子项目的当前完成状态，并列出后续需要开发的功能，**重点是将现有服务器的房间和网络管理替换为 Colyseus 框架**，并规划后续 AI 及其他功能的开发。本文档为 AI 代码助手提供清晰的任务指令和上下文。

**2. 当前项目状态 (待替换部分高亮)**

* **前端 (Cocos Creator - `client/assets/scripts/`)**
    * **场景:** 登录、大厅、房间、游戏场景已创建。
    * **核心 UI 控制器:** `LoginUI`, `LobbyController`, `RoomUI`, `GameUI` 等存在。
    * **网络通信:** **`NetworkManager` 和 `SocketAdapter` 基于 Socket.IO 实现 (将被 Colyseus Client SDK 替代)。**
    * **核心游戏显示:** 基础 UI 组件存在。
    * **状态管理:** `GameStateManager` 用于客户端状态。
* **后端 (游戏服务器 - `server/src/modules/`)**
    * **网络层:** **`socket-server.ts` 基于 Socket.IO 处理连接和事件 (将被 Colyseus Server 替代)。**
    * **房间管理:** **`room-manager.ts` 基于内存 Map 实现 (将被 Colyseus Room 替代)。**
    * **游戏逻辑:** `game-manager.ts` 实现核心游戏规则 (逻辑需迁移到 Colyseus Room)。
    * **基础 AI 集成:** 支持 AI 玩家概念 (`isAI` 标志)。
* **后端 (AI 微服务 - `ai-service/`)**
    * **基础服务:** 已搭建基础 HTTP 服务。
    * **决策接口:** `/decideAction` 通过简单 Prompt 调用 LLM API。
* **整体效果:** 玩家可进行基础游戏，但网络和房间管理部分**待替换为 Colyseus**。

**3. 后续开发任务 (待完成 - Colyseus 迁移优先)**

**优先级 0: Colyseus 框架迁移 (核心重构)**

* **目标:** 使用 Colyseus 替换现有的 `socket-server.ts` 和 `room-manager.ts`，并重构客户端网络层。
* **任务 0.1: 后端 - Colyseus 服务器搭建 (`server/src`)**
    * **依赖安装:** `npm install colyseus @colyseus/schema` (或 `yarn add ...`)。
    * **服务器入口:** 修改 `server/src/index.ts` (或新建 `app.ts`)：
        * 导入 `colyseus`。
        * 创建 `colyseus.Server` 实例，可绑定到 Node.js `http` 服务器 (或 Colyseus 内建 Express)。
        * 定义 Colyseus 游戏房间路由 (例如: `gameServer.define("liar_dice_room", LiarDiceRoom);`)。
        * 启动服务器 `gameServer.listen(PORT);`。
    * **状态定义 (新建 `rooms/schema/LiarDiceState.ts`):**
        * 使用 `@colyseus/schema` 定义 `PlayerState` Schema，包含字段：`id: string`, `name: string`, `diceCount: number`, `isReady: boolean`, `isAI: boolean`, `sessionId: string` (Colyseus 客户端标识)。
        * 定义 `LiarDiceRoomState` Schema，包含字段：`players: MapSchema<PlayerState>`, `activePlayerIds: ArraySchema<string>`, `currentPlayerIndex: number`, `currentBidValue: number`, `currentBidCount: number`, `roundNumber: number`, `status: string` (`waiting`, `playing`, `finished`), `hostId: string`, `isOneCalledThisRound: boolean` 等游戏核心状态。
    * **房间逻辑实现 (新建 `rooms/LiarDiceRoom.ts`):**
        * 创建 `class LiarDiceRoom extends Room<LiarDiceRoomState>`。
        * **`onCreate(options)`:** 初始化 `this.state` (创建 `LiarDiceRoomState` 实例)，设置房间选项，启动游戏循环/逻辑（如果适用）。
        * **`onAuth(client, options)`:** (可选) 实现玩家加入前的身份验证逻辑。
        * **`onJoin(client, options)`:**
            * 创建新的 `PlayerState` 实例，设置 `isAI: false`，从 `options` 获取玩家名，分配初始骰子数。
            * 将新玩家添加到 `this.state.players` (使用 `client.sessionId` 作为 Key)。
            * 设置 `this.state.hostId` (如果是第一个加入的玩家)。
            * 更新 `activePlayerIds` (如果游戏未开始)。
            * **AI 加入:** 需要一个机制（如房间选项 `options.aiPlayerCount` 或自定义消息 `this.onMessage("addAI", ...)`）来在此处或稍后添加 AI PlayerState（标记 `isAI: true`, `isReady: true`，生成假 `sessionId` 或特殊 ID）。
        * **`onLeave(client, consented)`:**
            * 从 `this.state.players` 移除玩家。
            * 更新 `activePlayerIds`。
            * 处理房主离开的逻辑（选举新房主或关闭房间）。
            * 如果房间为空，调用 `this.disconnect()`。
        * **`onDispose()`:** 清理资源。
        * **游戏逻辑迁移:** 将 `game-manager.ts` 中的核心逻辑（如 `rollDices`, `validateBid`, `checkBidValidity`, `handlePlayerLoss`, `nextTurn` 等）**迁移或重构**到 `LiarDiceRoom` 类的方法中。
            * 状态更新直接修改 `this.state` 的属性 (例如 `this.state.currentBidValue = ...`)，Colyseus 会自动同步。
            * 移除原 `GameManager` 中的 `broadcast...` 方法调用。
        * **AI 回合处理 (新):** 在房间的游戏循环/回合逻辑中判断当前 `this.state.players[this.state.activePlayerIds[this.state.currentPlayerIndex]]` 是否为 AI。如果是，则调用 `ai-service` 的 `/decideAction`（需要实现 http/gRPC 调用），获取决策后更新 `this.state`。
        * **自定义消息处理:** 使用 `this.onMessage("eventName", (client, message) => {})` 替换原 `socket-server.ts` 中的大部分事件处理器：
            * `onMessage("setReady", ...)`: 更新 `this.state.players[client.sessionId].isReady`。
            * `onMessage("startGame", ...)`: 验证发起者是否为 `this.state.hostId`，开始游戏逻辑。
            * `onMessage("bid", ...)`: 验证是否轮到该 `client`，验证 `message` 中的叫价，更新 `this.state`。
            * `onMessage("challenge", ...)`: 验证时机，执行质疑逻辑，更新 `this.state`。
            * `onMessage("jumpChallenge", ...)`: 实现跳开质疑逻辑。
            * `onMessage("kickPlayer", ...)`: 验证房主，执行踢人逻辑 (`this.clients.getById(targetSessionId)?.leave()`)。
            * `onMessage("chatMessage", ...)`: 将聊天消息广播给房间内其他客户端 (`this.broadcast("chatMessage", message, { except: client });`)。
    * **移除旧代码:** 删除 `server/src/modules/room/room-manager.ts` 和 `server/src/modules/network/socket-server.ts`。调整或删除 `server/src/modules/game/game-manager.ts` (其逻辑被整合)。
* **任务 0.2: 前端 - Colyseus 客户端集成 (`client/assets/scripts/`)**
    * **依赖安装:** `npm install colyseus.js` (或 `yarn add ...`)。
    * **重构网络层 (`core/NetworkManager.ts`, 移除 `core/SocketAdapter.ts`):**
        * 引入 `colyseus.js`。
        * 创建 `Colyseus.Client` 实例，连接到 Colyseus 服务器地址 (例如 `ws://localhost:3000`)。
        * **替换连接逻辑:** 使用 `client.joinOrCreate("liar_dice_room", { playerName: "..." })` 或 `client.joinById(roomId, { ... })` 来加入房间，这将返回一个 `Room` 对象。保存此 `room` 对象。
        * **替换事件监听:**
            * 使用 `room.onStateChange.once((state) => { /* 初始状态处理 */ })` 获取初始状态。
            * 使用 `room.onStateChange((state) => { /* 处理状态更新 */ })` 监听后续所有状态变化。**这是核心变化**，UI 更新逻辑需要基于此回调中的 `state` 对象进行。
            * 使用 `room.onMessage("eventName", (message) => { /* 处理服务器广播的特定消息 */ })` 接收聊天、踢出通知等非状态信息。
            * 使用 `room.onError((code, message) => {})` 和 `room.onLeave((code) => {})` 处理错误和离开房间事件。
        * **替换事件发送:** 使用 `room.send("eventName", data)` 发送玩家操作 (如 `room.send("setReady", { ready: true })`, `room.send("bid", { value: 4, count: 5 })`)。
    * **重构 UI 控制器 (`LobbyController`, `RoomUI`, `GameUI`, etc.):**
        * 修改 UI 控制器，使其不再监听旧的 Socket.IO 事件。
        * UI 更新的触发点改为 `NetworkManager` 中处理 `room.onStateChange` 的回调。例如，`GameUI` 的 `updateGameState` 方法现在应该由 `onStateChange` 回调触发，并直接接收 Colyseus 的 `state` 对象作为参数。
        * 发送玩家操作的地方，改为调用 `NetworkManager` 中封装的 `room.send()` 方法。

--- (以下优先级在 Colyseus 迁移完成后进行) ---

**优先级 1：核心游戏体验增强 (基于 Colyseus)**

* **任务 1.1: 实现跳开质疑 (Jump Challenge):**
    * 前端：添加按钮，点击发送 `room.send("jumpChallenge")`。
    * 后端 (`LiarDiceRoom.ts`): 实现 `onMessage("jumpChallenge", ...)` 逻辑，验证条件，执行结算（含特殊惩罚），更新 `this.state`。
* **任务 1.2: 实现游戏内基础聊天:**
    * 前端：添加输入框和发送按钮，点击发送 `room.send("chatMessage", { content: "..." })`。在 `room.onMessage("chatMessage", ...)` 中显示消息。
    * 后端 (`LiarDiceRoom.ts`): 实现 `onMessage("chatMessage", ...)`，将消息广播给其他客户端 (`this.broadcast(...)`)。
* **任务 1.3: 完善游戏历史记录显示:** (前端任务，与 Colyseus 无直接关系，但信息来源可能是 state 或 message)
* **任务 1.4: 完善 AI 决策系统 (AI 服务):** (同上一版计划，但与 Colyseus Room 交互)

**优先级 2：社交功能 (基于 Colyseus)**

* **任务 2.1: 好友系统 (核心):** (后端需要独立 API 或集成到 Colyseus 服务器的 HTTP 部分，数据存 Supabase)
* **任务 2.2: 好友邀请游戏:** (后端需处理邀请，可能涉及 Colyseus 的 `client.consumeSeatReservation()` 等机制)
* **任务 2.3: 好友私聊:** (后端需要消息路由，AI 私聊需调用 AI 服务)
* **任务 2.4: 结算页面加好友:** (前端按钮 + 后端 API)
* **任务 2.5: 好友列表显示 AI:** (后端 API 返回预设 AI 信息)

**优先级 3：排行榜与房间管理 (基于 Colyseus)**

* **任务 3.1: 积分与排行榜:** (后端 API + Supabase)
* **任务 3.2: 房主踢人:**
    * 前端：添加按钮，发送 `room.send("kickPlayer", { targetSessionId: "..." })`。
    * 后端 (`LiarDiceRoom.ts`): 实现 `onMessage("kickPlayer", ...)`，验证房主，调用 `this.clients.getById(targetSessionId)?.leave()`。

**优先级 4：高级 AI 功能 (同上一版计划)**

* **任务 4.1 - 4.5:** AI 聊天生成、记忆系统 (Supabase)、RAG、主动行为、好感度、多 Persona 支持 (微调)。

**低优先级**

* **任务 5.1: 组队模式。**
* **任务 5.2: 快捷发言与表情。**

**给 AI 代码助手的指令:**

1.  **首要任务:** 执行 **优先级 0：Colyseus 框架迁移**。这是大规模重构，需要仔细进行。
    * **先后端，再前端。** 先搭建 Colyseus 服务器基础，定义 Schema，实现 `LiarDiceRoom` 框架和核心逻辑迁移。
    * 然后重构客户端 `NetworkManager` 使用 Colyseus Client SDK。
    * 最后调整各 UI 控制器以适应新的网络层和状态同步机制。
2.  完成迁移后，再按新的优先级顺序实现其他功能。
3.  所有与房间状态同步相关的功能，优先考虑通过修改 Colyseus 的 `RoomState` Schema 并直接在服务器 `LiarDiceRoom` 中修改 `this.state` 来实现。
4.  对于非房间状态的通信（如聊天、一次性通知），使用 Colyseus 的 `room.send()` 和 `room.onMessage()` / `this.broadcast()`。
5.  数据库交互（好友、排行、AI 记忆）仍需使用 Supabase。
6.  参考 Colyseus 官方文档和示例进行开发。

---

这个 v2.1 版本的计划将 Colyseus 迁移作为了最高优先级，并相应调整了后续任务的实现方式。这是一个比较大的重构，但完成后会为后续开发带来很多便利。