# Colyseus 集成指南

## 文档信息
- **创建日期**: 2025-05-02
- **最后更新**: 2025-05-02
- **版本**: 1.0

## 目录
1. [项目概述](#项目概述)
2. [Colyseus 简介](#colyseus-简介)
3. [集成问题与解决方案](#集成问题与解决方案)
4. [正确的使用方式](#正确的使用方式)
5. [常见问题](#常见问题)
6. [参考资料](#参考资料)

## 项目概述

本项目使用 Colyseus 框架作为多人游戏的房间管理和实时通信解决方案。Colyseus 与 Cocos Creator 的集成需要特别注意，本文档记录了集成过程中遇到的问题和解决方案。

## Colyseus 简介

Colyseus 是一个专为多人游戏设计的 Node.js 框架，提供了房间管理、状态同步和实时通信功能。官方文档：[https://docs.colyseus.io/](https://docs.colyseus.io/)

### 主要特性
- 房间管理和匹配
- 状态同步
- 自动序列化和反序列化
- 客户端预测和插值

## 集成问题与解决方案

### 问题1: Client 构造函数错误

**问题描述**:
在初始化 Colyseus 客户端时，遇到 "Client is not a constructor" 错误。

**原因分析**:
导入方式与使用方式不匹配。具体来说：
1. 使用了默认导入方式 `import Colyseus from '../colyseus-cocos-creator.js'`
2. 但在代码中使用了 `new Colyseus(this.serverUrl)` 来初始化客户端
3. 默认导入的 Colyseus 对象本身并不是一个构造函数

**解决方案**:
有两种正确的使用方式：

1. **命名空间导入方式**（推荐）:
```typescript
// 导入
import * as Colyseus from '../colyseus-cocos-creator.js';

// 使用
this.colyseusClient = new Colyseus.Client(this.serverUrl);
```

2. **解构导入方式**:
```typescript
// 导入
import { Client } from '../colyseus-cocos-creator.js';

// 使用
this.colyseusClient = new Client(this.serverUrl);
```

### 问题2: 服务端依赖问题

**问题描述**:
服务端启动时报错，缺少 Redis 相关依赖。

**原因分析**:
默认配置使用了 Redis 作为 presence 提供者，但项目中未安装相关依赖。

**解决方案**:
修改服务端配置，移除 Redis 相关配置：

```typescript
// 修改前
gameServer = new Server({
    transport: new WebSocketTransport({ server: server }),
    presence: new RedisPresence()
});

// 修改后
gameServer = new Server({
    transport: new WebSocketTransport({ server: server })
});
```

## 正确的使用方式

### 客户端初始化

```typescript
// 1. 导入
import * as Colyseus from '../colyseus-cocos-creator.js';

// 2. 初始化客户端
this.colyseusClient = new Colyseus.Client(this.serverUrl);

// 3. 加入或创建房间
this.colyseusClient.joinOrCreate<LiarDiceRoomState>("liar_dice_room", {
    playerName: playerName,
    userId: userId
}).then(room => {
    this.currentRoom = room;
    // 设置房间事件监听
    this.setupRoomEvents(room);
    resolve(room);
}).catch(error => {
    console.error(`[网络] 加入房间失败: ${error}`);
    reject(this.handleRoomError(error));
});
```

### 房间事件监听

```typescript
private setupRoomEvents(room: Colyseus.Room<LiarDiceRoomState>) {
    // 状态变化
    room.onStateChange((state) => {
        console.log(`[网络] 房间状态更新:`, state);
        // 处理状态更新
    });

    // 接收服务器消息
    room.onMessage("gameAction", (message) => {
        console.log(`[网络] 收到游戏动作:`, message);
        // 处理消息
    });

    // 错误处理
    room.onError((code, message) => {
        console.error(`[网络] 房间错误: ${code} - ${message}`);
        // 处理错误
    });

    // 离开房间
    room.onLeave((code) => {
        console.log(`[网络] 离开房间: ${code}`);
        this.currentRoom = null;
        // 处理离开事件
    });
}
```

### 服务端房间定义

```typescript
// 注册房间
gameServer.define("liar_dice_room", LiarDiceRoom);

// 房间实现
export class LiarDiceRoom extends Room<LiarDiceRoomState> {
    onCreate(options: any) {
        this.setState(new LiarDiceRoomState());
        // 设置房间逻辑
    }

    onJoin(client: Client, options: any) {
        // 处理玩家加入
    }

    onLeave(client: Client, consented: boolean) {
        // 处理玩家离开
    }

    onDispose() {
        // 房间销毁时的清理工作
    }
}
```

## Colyseus 0.16 版本 API 变更

### 1. getAvailableRooms() 方法已被移除

**问题**:
在 Colyseus 0.16 版本中，`getAvailableRooms()` 方法已被完全移除。如果使用该方法，将会收到错误：`TypeError: _this3.colyseusClient.getAvailableRooms is not a function`。

**原因**:
官方文档说明，移除该方法是出于安全考虑，因为它会向任何客户端暴露所有房间列表。

**解决方案**:

1. 服务端添加 HTTP 端点来安全地提供房间列表：
```typescript
// 添加获取可用房间列表的端点
app.get('/rooms/:roomName?', async (req, res) => {
  try {
    const { roomName } = req.params;
    const conditions: any = {
      locked: false,
      private: false,
    };
    
    if (roomName) {
      conditions.name = roomName;
    }
    
    const rooms = await matchMaker.query(conditions);
    res.json(rooms);
  } catch (error) {
    console.error('[服务器][错误] 获取房间列表失败:', error);
    res.status(500).json({ error: '获取房间列表失败' });
  }
});
```

2. 客户端使用 `client.http.get()` 方法获取房间列表：
```typescript
public async getAvailableRooms(roomName?: string): Promise<any[]> {
  // ...
  try {
    // 使用 HTTP API 获取房间列表，替代已移除的 getAvailableRooms 方法
    const path = roomName ? `/rooms/${roomName}` : '/rooms';
    const response = await this.colyseusClient!.http.get(path);
    
    // 处理响应数据，确保返回数组
    const rooms = Array.isArray(response) ? response : [];
    
    return rooms;
  } catch (error) {
    // 错误处理...
  }
}
```

3. 注意：需要在服务端配置 CORS 以允许跨域请求：
```typescript
// 安装 cors 中间件
// yarn add cors @types/cors

import cors from 'cors';

// 在 Express 应用中启用 CORS，并指定允许的来源
app.use(cors({
  origin: 'http://localhost:7456', // Cocos Creator 预览服务器地址
  credentials: true // 允许发送凭证
}));
```

这个配置是必要的，因为 Colyseus 客户端的 HTTP 请求默认设置了 `withCredentials: true`，当请求包含凭证时，CORS 配置不能使用通配符 `*`，必须指定具体的域名。

### 2. Room.id 属性变更为 Room.roomId

**问题**:
在 Colyseus 0.16 版本中，Room 类的房间 ID 属性名从 `id` 变更为 `roomId`。如果使用 `room.id`，将会收到错误：`类型"Room<LiarDiceRoomState>"上不存在属性"id"`。

**解决方案**:
将代码中所有使用 `room.id` 的地方改为使用 `room.roomId`：

```typescript
// 修改前
this._roomId = this.colyseusRoom.id;

// 修改后
this._roomId = this.colyseusRoom.roomId;
```

## 常见问题

### 1. Schema 版本兼容性问题

**问题**: 
Colyseus 0.15/0.16 版本将 Schema 从 v1 升级到了 v3，导致客户端与服务端之间可能出现兼容性问题。常见错误包括：
- `TypeError: Cannot read properties of undefined (reading 'Symbol(Symbol.metadata)')`
- `@colyseus/schema v2 compatibility currently missing (reach out if you need it)`

**解决方案**:

1. 确保服务端使用的 `@colyseus/schema` 版本与客户端兼容：
```json
// package.json
{
  "dependencies": {
    "@colyseus/schema": "^3.0.35"
  }
}
```

2. 在客户端代码中添加类型检查，防止访问不存在的方法：
```typescript
// 检查 players 是否是 Map 类型
if (room.state.players && typeof room.state.players.forEach === 'function') {
  room.state.players.forEach((player, sessionId) => {
    // 安全地访问 player 属性
  });
} else {
  console.log('无法遍历玩家列表，可能是 Schema 版本不兼容');
}
```

3. 对于客户端使用自定义 Schema 类的情况，确保它们的结构与服务端的 Schema 定义一致。

### 2. 类型定义问题

**问题**: TypeScript 报错，找不到 Colyseus 的类型定义。

**解决方案**:
- 使用 `// @ts-ignore` 暂时忽略类型检查
- 或创建一个 `colyseus.d.ts` 文件提供类型定义

### 2. 构建问题

**问题**: Cocos Creator 构建时无法处理 Colyseus 的导入。

**解决方案**:
- 确保 Colyseus 客户端库已正确导入为插件
- 将 colyseus.js 放在 assets/scripts/external 目录下
- 在 Cocos Creator 中将其设置为插件并设置作用域为顶层

### 3. 状态同步问题

**问题**: 客户端无法正确接收或解析服务端的状态更新。

**解决方案**:
- 确保客户端和服务端的 Schema 定义一致
- 使用 Colyseus Schema 生成工具生成客户端代码
- 检查序列化和反序列化逻辑

### 4. 路径问题

**问题**: 前后端需要共享的文件路径问题。

**解决方案**:
- 客户端的共享文件放在 client/assets/shared 目录
- 服务端的共享文件放在项目根目录的 shared 文件夹
- 确保导入路径正确

### 5. 插件问题

**问题**: Colyseus 插件加载问题。

**解决方案**:
- 已下载 colyseus-cocos-creator.js  并放置在 client\assets\scripts目录
- 在 Cocos Creator 中将其导入为插件并设置作用域为顶层
- 确保导入路径正确

### 6. Schema 元数据问题

**问题**: 在使用 Colyseus Schema 时出现 `Symbol(Symbol.metadata)` 相关错误。

**错误信息**:
```
TypeError: Cannot read properties of undefined (reading 'Symbol(Symbol.metadata)')
```

**原因**:
Colyseus 在序列化 Schema 对象时，无法获取某个属性的装饰器元数据信息，导致无法正确编码该属性。这通常是由以下几个原因造成的：
1. `reflect-metadata` 没有正确加载或者没有在最顶部导入
2. TypeScript 配置中的装饰器设置不正确
3. Schema 类定义中有属性缺少 `@type()` 装饰器
4. Schema 类的初始化方式不正确

**解决方案**:

1. **确保 `reflect-metadata` 在入口文件最顶部导入**
   ```typescript
   // server/src/index.ts 的第一行
   import 'reflect-metadata';
   // 其他导入放在下面
   ```

2. **检查 `tsconfig.json` 配置**
   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     }
   }
   ```

3. **正确定义 Schema 类**
   - 每个需要同步的属性都必须有 `@type()` 装饰器
   - 装饰器要与属性类型匹配
   - 对于集合类型，使用正确的装饰器格式：
     - 数组：`@type([ElementType])`
     - 映射：`@type({ map: ValueType })`

   ```typescript
   import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';

   export class MyState extends Schema {
     // 基本类型
     @type("string")
     name: string = "";

     // 数组
     @type(["string"])
     messages = new ArraySchema<string>();

     // 映射
     @type({ map: PlayerState })
     players = new MapSchema<PlayerState>();

     // 嵌套 Schema
     @type(NestedState)
     nestedState = new NestedState();

     constructor() {
       super();
       // 初始化代码放在 super() 之后
     }
   }
   ```

4. **正确初始化 Schema 实例**
   ```typescript
   // 在 Room 的 onCreate 方法中
   onCreate() {
     // 创建一个新的 Schema 实例
     const state = new MyState();
     
     // 使用 setState 方法设置状态
     this.setState(state);
   }
   ```

5. **调试技巧**
   - 使用环境变量开启 Colyseus 序列化器的调试日志：
   ```bash
   DEBUG=colyseus:serializer node dist/server/src/index.js
   ```
   - 这将帮助你找出具体是哪个字段缺少元数据

## 参考资料

1. [Colyseus 官方文档](https://docs.colyseus.io/)
2. [Colyseus JavaScript 客户端](https://docs.colyseus.io/getting-started/javascript-client/)
3. [Colyseus Schema](https://docs.colyseus.io/state/schema)
4. [Colyseus GitHub 仓库](https://github.com/colyseus/colyseus)
5. [Colyseus Schema 装饰器指南](https://docs.colyseus.io/state/schema/#available-types)

---

> 注意: 本文档将持续更新，记录项目中遇到的 Colyseus 相关问题和解决方案。如有新的问题和解决方案，请及时更新本文档。
