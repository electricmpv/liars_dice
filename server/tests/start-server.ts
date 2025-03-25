import { DiceSocketServer } from '../src/modules/network/socket-server';

// 测试配置
const PORT = 3001;

/**
 * 简单的服务器启动脚本
 */
async function main() {
  console.log('======= 启动骰子游戏服务器 =======');
  
  const server = new DiceSocketServer(PORT);
  
  console.log('服务器已启动，按Ctrl+C停止...');
  
  // 处理进程退出
  process.on('SIGINT', async () => {
    console.log('收到停止信号，正在关闭服务器...');
    await server.close();
    console.log('服务器已安全关闭');
    process.exit(0);
  });
}

main().catch(error => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});
