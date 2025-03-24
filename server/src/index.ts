import { DiceSocketServer } from './modules/network/socket-server';
import { RoomManager } from './modules/room/room-manager';

// 服务器配置
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

/**
 * 初始化并启动服务器
 */
async function startServer() {
  try {
    console.log(`[服务器][信息] 准备启动吹牛骰子游戏服务器，端口: ${PORT}`);
    
    // 创建房间管理器
    const roomManager = new RoomManager();
    
    // 创建并启动Socket服务器
    const socketServer = new DiceSocketServer(PORT, roomManager);
    
    console.log(`[服务器][信息] 吹牛骰子游戏服务器已启动，监听端口: ${PORT}`);
    
    // 处理进程终止信号
    process.on('SIGINT', () => {
      console.log('[服务器][信息] 接收到终止信号，正在关闭服务器...');
      socketServer.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('[服务器][错误] 服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer().catch(error => {
  console.error('[服务器][错误] 未处理的异常:', error);
  process.exit(1);
});
