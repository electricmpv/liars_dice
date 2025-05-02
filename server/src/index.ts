import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cors from 'cors';
// 最简单的服务器配置，避免使用任何 Redis 相关功能
import { Server, matchMaker } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';

import { LiarDiceRoom } from './rooms/LiarDiceRoom'; // Import our game room

// 服务器配置
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// 全局变量记录服务器状态
let isShuttingDown = false;
let gameServer: Server;

/**
 * 初始化并启动 Colyseus 服务器
 */
async function startServer() {
  try {
    console.log(`[服务器][信息] 准备启动 Colyseus 吹牛骰子游戏服务器，端口: ${PORT}`);

    const app = express();
    
    // 启用 CORS，明确允许Cocos开发服务器的来源
    app.use(cors({
      origin: ['http://localhost:7456', 'http://127.0.0.1:7456'], // 明确指定Cocos开发服务器
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      credentials: false, // 不使用凭证，避免 CORS 限制
      optionsSuccessStatus: 204 // 预检请求成功状态码
    }));
    
    // 添加一个简单的测试端点
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // 添加错误处理中间件
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('[服务器][错误] Express 错误:', err);
      res.status(500).json({ error: err.message || '服务器内部错误' });
    });
    
    // 解析 JSON 请求体
    app.use(express.json());

    // 创建 HTTP 服务器
    const server = http.createServer(app);

    // 创建 Colyseus 游戏服务器实例
    gameServer = new Server({
      transport: new WebSocketTransport({
        server: server, // 正确使用 transport 配置
      })
      // 不指定 presence，使用默认的 LocalPresence
    });

    // 定义游戏房间
    gameServer.define('liar_dice', LiarDiceRoom);

    // 注册简单的状态检查端点
    app.get('/status', (req, res) => {
      res.json({
        status: 'ok',
        uptime: process.uptime()
      });
    });

    // 添加健康检查端点
    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

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

    // 启动监听
    await gameServer.listen(PORT);
    console.log(`[服务器][信息] Colyseus 服务器已启动，监听端口: ${PORT}`);

    // 处理进程终止信号
    setupShutdownHandlers();

    return gameServer;

  } catch (error) {
    console.error('[服务器][错误] Colyseus 服务器启动失败:', error);
    process.exit(1);
  }
}

/**
 * 设置关闭处理程序
 */
function setupShutdownHandlers() {
  // 处理 SIGINT 信号（Ctrl+C）
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // 处理 SIGTERM 信号（系统终止）
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  
  // 处理未捕获的异常
  process.on('uncaughtException', (error) => {
    console.error('[服务器][错误] 未捕获的异常:', error);
    gracefulShutdown('uncaughtException');
  });
}

/**
 * 优雅关闭服务器
 */
async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    console.log(`[服务器][信息] 已经在关闭中，忽略信号: ${signal}`);
    return;
  }
  
  isShuttingDown = true;
  console.log(`[服务器][信息] 接收到终止信号 ${signal}，正在关闭服务器...`);
  
  try {
    if (gameServer) {
      // 给客户端一些时间处理断开连接
      console.log('[服务器][信息] 开始优雅关闭服务器...');
      await gameServer.gracefullyShutdown(true);
      console.log('[服务器][信息] Colyseus 服务器已关闭');
    }
    
    // 给一些时间完成最后的操作
    setTimeout(() => {
      console.log('[服务器][信息] 进程安全退出');
      process.exit(0);
    }, 1000);
    
  } catch (error) {
    console.error('[服务器][错误] 关闭服务器时出错:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer().catch(error => {
  console.error('[服务器][错误] 未处理的异常:', error);
  process.exit(1);
});
