import http from 'http';
import express from 'express';
import { Server } from '@colyseus/core';
import { monitor } from '@colyseus/monitor'; // Optional: for monitoring dashboard
// import { WebSocketTransport } from "@colyseus/ws-transport"; // Optional: Default transport

import { LiarDiceRoom } from './rooms/LiarDiceRoom'; // Import our game room

// 服务器配置
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

/**
 * 初始化并启动 Colyseus 服务器
 */
async function startServer() {
  try {
    console.log(`[服务器][信息] 准备启动 Colyseus 吹牛骰子游戏服务器，端口: ${PORT}`);

    const app = express();
    app.use(express.json());

    // Create HTTP server
    const server = http.createServer(app);

    // Create Colyseus Game Server instance
    const gameServer = new Server({
      server: server,
      // transport: new WebSocketTransport(), // Specify transport if not default
    });

    // Define the game room
    gameServer.define('liar_dice_room', LiarDiceRoom)
      // Register room handlers or options if needed
      // .enableRealtimeListing(); // Example: Enable listing rooms

    // Optional: Register @colyseus/monitor dashboard
    // Note: Requires installing @colyseus/monitor: yarn add @colyseus/monitor
    // Make sure to import 'monitor' above
    app.use('/colyseus', monitor()); // Access dashboard at http://localhost:3000/colyseus

    // Start listening
    await gameServer.listen(PORT);
    console.log(`[服务器][信息] Colyseus 服务器已启动，监听端口: ${PORT}`);

    // Handle process termination signals
    process.on('SIGINT', async () => {
      console.log('[服务器][信息] 接收到终止信号，正在关闭服务器...');
      try {
        await gameServer.gracefullyShutdown();
        console.log('[服务器][信息] Colyseus 服务器已关闭');
        process.exit(0);
      } catch (e) {
        console.error('[服务器][错误] 关闭服务器时出错:', e);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('[服务器][错误] Colyseus 服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer().catch(error => {
  console.error('[服务器][错误] 未处理的异常:', error);
  process.exit(1);
});
