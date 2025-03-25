import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { DiceSocketServer } from '../src/modules/network/socket-server';

// 测试配置
const PORT = 3001;
const SERVER_URL = `http://localhost:${PORT}`;
const TIMEOUT = 20000;  // 增加到20秒超时
const WAIT_TIME = 8000; // 增加到8秒等待时间
const STABILIZE_TIME = 5000; // 连接稳定期
const CLEANUP_DELAY = 3000; // 清理前延迟

// 简单休眠函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 最小化测试 - 仅测试基础连接和echo功能
 * 使用详细的调试日志输出
 */
(async function() {
  console.log('======= 开始最小化网络测试 =======');
  console.log('版本: 1.1.0 - 增强稳定性和错误处理');
  
  let server: DiceSocketServer | null = null;
  let client: Socket | undefined;
  
  // 添加一层额外检查，确保任何错误都被捕获并记录
  try {
    // 1. 启动服务器
    console.log('\n[步骤1] 启动测试服务器...');
    try {
      server = new DiceSocketServer(PORT);
      console.log('[服务器] 服务器已成功启动');
    } catch (error: any) {
      console.error('[服务器] 启动失败:', error.message);
      throw new Error('服务器启动失败');
    }
    
    // 2. 等待服务器初始化
    console.log(`\n[步骤2] 等待服务器初始化 (${WAIT_TIME/1000}秒)...`);
    await sleep(WAIT_TIME);
    console.log('[服务器] 初始化等待完成');
    
    // 3. 创建客户端
    console.log('\n[步骤3] 创建Socket.IO客户端...');
    try {
      client = io(SERVER_URL, {
        transports: ['websocket'],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: TIMEOUT
      });
      
      // 确保client不为undefined
      if (!client) {
        throw new Error('客户端创建返回undefined');
      }
      console.log('[客户端] 客户端实例已创建');
    } catch (error: any) {
      console.error('[客户端] 创建失败:', error.message);
      throw new Error('客户端创建失败');
    }
    
    // 4. 监听事件
    console.log('\n[步骤4] 设置客户端事件监听器...');
    
    client.on('connect', () => {
      console.log(`[客户端] 已连接! Socket ID: ${client!.id}`);
    });
    
    client.on('connect_error', (error) => {
      console.error(`[客户端] 连接错误:`, error.message);
    });
    
    client.on('disconnect', (reason) => {
      console.log(`[客户端] 断开连接, 原因:`, reason);
    });
    
    client.onAny((event, ...args) => {
      try {
        console.log(`[客户端] 收到事件: ${event}`, 
          args.length > 0 ? JSON.stringify(args).substring(0, 80) + '...' : '<无数据>');
      } catch (e) {
        console.log(`[客户端] 收到事件: ${event} (数据无法序列化)`);
      }
    });
    
    // 5. 等待连接建立
    console.log('\n[步骤5] 等待客户端连接...');
    await new Promise<void>((resolve, reject) => {
      const connectionTimer = setTimeout(() => {
        reject(new Error('连接超时 - 服务器可能未正确响应'));
      }, TIMEOUT);
      
      if (client!.connected) {
        console.log('[客户端] 已经连接，无需等待');
        clearTimeout(connectionTimer);
        resolve();
        return;
      }
      
      client!.once('connect', () => {
        console.log('[客户端] 连接事件触发');
        clearTimeout(connectionTimer);
        resolve();
      });
    });
    
    // 6. 等待连接稳定
    console.log('\n[步骤6] 等待连接稳定期...');
    console.log(`[客户端] 等待 ${STABILIZE_TIME/1000} 秒...`);
    await sleep(STABILIZE_TIME);
    console.log('[客户端] 连接已稳定，可以进行测试');
    
    // 7. 测试Echo功能
    console.log('\n[步骤7] 测试Echo功能...');
    const testMessage = { message: `测试消息-${Date.now()}` };
    console.log(`[客户端] 发送Echo请求:`, JSON.stringify(testMessage));
    
    const echoResult = await new Promise<any>((resolve, reject) => {
      const echoTimer = setTimeout(() => {
        reject(new Error('Echo请求超时 - 服务器可能未处理Echo事件'));
      }, TIMEOUT);
      
      try {
        client!.emit('echo', testMessage, (response: any) => {
          clearTimeout(echoTimer);
          if (response && response.success) {
            resolve(response);
          } else {
            reject(new Error('Echo响应无效: ' + JSON.stringify(response)));
          }
        });
      } catch (err: any) {
        clearTimeout(echoTimer);
        reject(new Error(`发送Echo事件失败: ${err.message}`));
      }
    });
    
    console.log('[客户端] 收到Echo响应:', JSON.stringify(echoResult).substring(0, 100) + '...');
    console.log('[测试] Echo测试成功!');
    await sleep(1000); // 短暂暂停，让打印完成
    
    // 8. 测试创建房间功能
    console.log('\n[步骤8] 测试创建房间功能...');
    const createRoomData = { 
      playerName: `测试玩家-${Math.floor(Math.random() * 1000)}` 
    };
    console.log(`[客户端] 发送createRoom请求:`, JSON.stringify(createRoomData));
    
    const roomResult = await new Promise<any>((resolve, reject) => {
      const roomTimer = setTimeout(() => {
        reject(new Error('创建房间请求超时'));
      }, TIMEOUT);
      
      try {
        client!.emit('createRoom', createRoomData, (response: any) => {
          clearTimeout(roomTimer);
          if (response && response.success) {
            resolve(response);
          } else {
            reject(new Error('创建房间响应无效: ' + JSON.stringify(response)));
          }
        });
      } catch (err: any) {
        clearTimeout(roomTimer);
        reject(new Error(`发送createRoom事件失败: ${err.message}`));
      }
    });
    
    console.log('[客户端] 收到创建房间响应:', JSON.stringify(roomResult).substring(0, 100) + '...');
    console.log('[测试] 创建房间测试成功!');
    console.log(`  - 房间ID: ${roomResult.roomId}`);
    console.log(`  - 玩家ID: ${roomResult.playerId}`);
    
    // 测试通过
    console.log('\n======= 网络测试全部通过! =======');
    // 保持一段时间，确保所有输出完成
    await sleep(2000);
    
  } catch (error: any) {
    console.error('\n[测试] 错误:', error.message);
    if (error.stack) {
      console.error('[测试] 错误堆栈:', error.stack.split('\n').slice(0, 3).join('\n'));
    }
    console.log('\n======= 网络测试失败! =======');
    // 保持一段时间，确保所有输出完成
    await sleep(2000);
  } finally {
    // 延迟清理资源，确保日志能够完整显示
    console.log('\n开始清理测试环境...');
    console.log(`[清理] 等待 ${CLEANUP_DELAY/1000} 秒后开始关闭连接...`);
    await sleep(CLEANUP_DELAY);
    
    // 安全地检查client是否存在
    if (client !== undefined) {
      console.log('[客户端] 断开连接...');
      try {
        client.disconnect();
        await sleep(1000); // 给断开连接一些时间
        console.log('[客户端] 已断开连接');
      } catch (err: any) {
        console.error('[客户端] 断开连接失败:', err.message);
      }
    } else {
      console.log('[客户端] 客户端未创建，无需断开');
    }
    
    // 延迟关闭服务器，确保客户端断开连接后再关闭
    await sleep(2000);
    
    if (server) {
      console.log('[服务器] 关闭中...');
      try {
        await server.close();
        await sleep(1000); // 给服务器关闭一些时间
        console.log('[服务器] 已成功关闭');
      } catch (err: any) {
        console.error('[服务器] 关闭失败:', err instanceof Error ? err.message : String(err));
      }
    } else {
      console.log('[服务器] 服务器未创建，无需关闭');
    }
    
    console.log('测试环境已清理完成');
  }
})().catch(error => {
  console.error('[测试] 未捕获的异常:', error);
});
