# Cline Rules for liars_dice_demo project

# Preferred Language
By default, all responses must be in Chinese.

# WORKSPACE RULES (D:\editors\liars_dice_demo)

## 核心指令
1. 项目路径：
   - 绝对路径：D:\editors\liars_dice_demo
   - 代码组织结构遵循PRD的模块化设计

2. 技术栈强制要求：
   - TypeScript严格模式（tsconfig.json）
   - Node.js >=20.9.0
   - Cocos Creator 3.8.2
   - 必须使用Zod进行数据验证
   - 必须使用yarn管理依赖
   - 当前终端为Windows PowerShell，禁止使用"&"和"&&"来连接命令。
   - 禁止修改.scene文件。

3. 目录结构规范：
   liars_dice_demo/
   ├── client/       # Cocos工程
   ├── server/       # Node.js后端
   ├── shared/       # 类型定义
   └── tools/        # 生成脚本

4. 关键约束：
   - 房间管理使用Colyseus，产品文档地址：https://0-14-x.docs.colyseus.io/zh_cn/colyseus
   - AI决策必须通过AgentService类路由
   - cocos无法构建client文件夹以外的文件，所以禁止在客户端直接引用外部文件
   - 禁止使用任何全局变量
   - 必须通过EnvChecker处理多平台适配
   - 禁止修改.scene文件。
   - 新建文件时，时刻注意抽象和单例，避免重复创建实例。单个文件如超过500行，需要考虑是否可以拆分。

5. 代码生成规则：
   - 文件名采用kebab-case
   - 类型定义使用.d.ts后缀
   - 配置类文件放在/config
   - 日志格式：`[模块名][级别] 消息`

6. 依赖白名单：
   - 必要依赖：express, socket.io, zod, openai, pg
   - 禁止依赖：webpack, react, vue
   By default, all responses must be in Chinese.


## 文件/目录忽略规则 (File/Directory Ignore Rules)
# 防止 Cline 读取或上传这些文件/模式
# Prevent Cline from reading or uploading these files/patterns

# Cocos Creator 特定文件 (Cocos Creator specific)
client/assets/**/*.meta
client/library/

# 图像资源 (Image Assets)
client/assets/resources/**/*.png
client/assets/resources/**/*.jpg
client/assets/resources/**/*.jpeg
client/assets/resources/**/*.gif

# 编译后的 JavaScript (当存在 TS 源码时) (Compiled JavaScript (when TS source exists))
!client/assets/scripts/**/*.js
!client/assets/scripts/**/*.js.map
!server/src/**/*.js
!server/src/**/*.js.map
!shared/**/*.js
!shared/**/*.js.map

# 依赖目录 (Dependencies)
node_modules/
**/node_modules/ # 确保所有层级的 node_modules 都被忽略

# 构建产物和日志 (Build artifacts & Logs)
!server/coverage/
!*.log

# 环境特定文件 (Environment specific)
!.env
!ai-service/.env

# 其他可能不需要的文件 (Other potentially unneeded files)
# 如有需要，可在此添加其他特定文件或模式
# Add other specific files or patterns if needed
