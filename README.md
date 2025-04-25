在线AI吹牛游戏-20250324
多人在线吹牛骰子游戏PRD v1.2
一、核心架构设计
1. 技术栈组合方案：
● 前端：Cocos Creator 3.8 + TypeScript + WebSocket
● 后端：Node.js 20 + Express/Socket.IO + PostgreSQL
● AI层：AgentScope（简化版）+ OpenAI GPT-3.5-turbo
● 部署：Vercel（前端）+ Railway（后端）+ Supabase（DB）
2. 模块化拆分：
├── Core/
│   ├── GameLogic
│   ├── AIEngine
│   ├── Network
├── Features/
│   ├── RoomSystem
│   ├── SocialSystem
│   ├── Ranking
└── Shared/
    ├── ProtocolDef
    ├── Utils
二、详细功能规格（补充关键细节）
1. 房间系统（需实现）
● 容量控制：采用动态扩容机制，当房间人数达6人时自动锁定
● 状态同步：设计5种房间状态（等待/游戏中/结算/销毁中/异常）
● 断线重连：保留玩家状态15分钟，AI自动托管策略：
interface AITakeoverPolicy {
  minDisconnectTime: 60 // 秒
  strategy: 'conservative' | 'aggressive' 
}
2. AI角色实现方案（含关键技术点）
● 记忆系统：使用Supabase的pg_vector扩展存储聊天记录
● 策略模板：
class AIPersona {
  constructor(
    public strategyType: 'coward' | 'liar' | 'diviner',
    public memory: VectorStore,
    public hintSystem: HintProtocol
  ) {}
  
  makeDecision(context: GameContext): Action {
    // 使用OpenAI函数调用返回结构化数据
  }
}
● 暗语系统：采用HMAC-SHA256生成动态暗号，有效期=对局时长
3. 游戏规则增强（补充关键逻辑）
● 喊数验证：实现数值比较算法
function isValidBid(current: Bid, previous?: Bid): boolean {
  if (!previous) return current.count >= 1
  return current.count > previous.count || 
        (current.count === previous.count && current.value > previous.value)
}
● 队伍模式：支持动态队伍切换，实现队伍状态机：
TeamState {
  ACTIVE,
  ELIMINATED,
  MERGED // 当其他队伍淘汰时可能合并
}
4. 反作弊基础方案
● 输入验证层：所有客户端输入经过Zod校验
● 状态校验：每3回合全量状态哈希校验
● 日志审计：记录关键操作时间线（保留7天）
三、美术资源生产流程
1. UI生成策略：
● 使用ImageFX生成512x512基础元件
● 通过RunwayML进行风格迁移生成统一画风
● 九宫格切片处理适配多分辨率
2. 角色设计：
● 生成提示词模板：
"pixel art style game character front view, liars dice theme, {strategy_type} personality, vibrant colors --niji 6"
四、开发里程碑计划（含风险控制）
第一周 MVP冲刺（核心路径）
Day 1-3：
- 移植基础游戏逻辑（复用70%开源代码）
- 实现单房间WebSocket通信
- 基础AI框架搭建

Day 4-5：
- 完成核心游戏循环
- 实现基础喊数/质疑流程
- 部署测试环境

Day 6-7：
- 压力测试（使用k6工具）
- 修复同步问题
- MVP部署至Vercel
风险应对方案：
1. AI集成延迟：
● 准备离线决策树作为fallback
● 限制GPT调用频率（免费账号限制）
2. 同步问题：
● 采用确定性锁步协议
● 使用colyseus的state synchronization
3. 美术资源延迟：
● 优先使用开源CC0素材
● 准备应急简约UI方案
五、技术决策备忘
1. 放弃技术清单：
● 原生APP打包
● 实时语音聊天
● 复杂3D动画
2. 关键技术选型原因：
● AgentScope：相比LangChain更轻量，适合游戏场景
● Supabase：免费层含15K次/天AI调用额度
● Colyseus：已验证的Cocos网络方案
六、测试计划要点
1. 关键测试场景：
● 网络抖动测试（使用Clumsy工具模拟）
● AI压力测试：同时50个AI对局
● 跨设备同步测试（iOS/Android/PC）
2. 自动化测试策略：
● 使用Cypress进行端到端测试
● 核心算法100%单元测试覆盖率
七、部署检查清单
1. 必需服务配置：
● Cloudflare防火墙规则（防DDoS）
● Supabase行级安全策略（RLS）
● Vercel自动回滚机制
2. 监控方案：
● 使用UptimeRobot基础监控
● 实现健康检查端点：
/api/health?level=full
下一步行动建议：
1. 立即开始types.ts的适配改造
2. 建立每日构建验证机制
3. 优先完成房间系统的原型开发

