import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { DiceSocketServer } from '../src/modules/network/socket-server';

// 测试配置
const PORT = 3001;
const SERVER_URL = `http://localhost:${PORT}`;
const TIMEOUT = 20000; // 20秒超时
const WAIT_TIME = 8000; // 8秒等待时间
const CLEANUP_DELAY = 3000; // 清理前延迟

// 简单休眠函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 测试数据
const TEST_PLAYER_NAMES = [
  `测试玩家A-${Math.floor(Math.random() * 1000)}`,
  `测试玩家B-${Math.floor(Math.random() * 1000)}`
];

/**
 * 网络API测试套件
 * 测试Socket.IO连接、创建房间、加入房间和开始游戏
 * 
 * 版本: 3.0.0 - 适配重构后的RoomManager事务机制
 */
(async function() {
  console.log('======= 开始网络API测试 =======');
  console.log('版本: 3.0.0 - 适配RoomManager事务机制');
  
  let server: DiceSocketServer | null = null;
  let client1: Socket | null = null;
  let client2: Socket | null = null;
  
  // 测试数据
  let roomId: string | null = null;
  let player1Id: string | null = null;
  let player2Id: string | null = null;
  
  try {
    // 1. 启动服务器
    console.log('\n[步骤1] 启动测试服务器...');
    server = new DiceSocketServer(PORT);
    console.log('[服务器] 服务器已启动');
    
    // 2. 等待服务器初始化
    console.log(`\n[步骤2] 等待服务器初始化 (${WAIT_TIME/1000}秒)...`);
    await sleep(WAIT_TIME);
    console.log('[服务器] 初始化等待完成');
    
    // 3. 创建第一个客户端 (房主)
    console.log('\n[步骤3] 创建第一个Socket.IO客户端 (房主)...');
    client1 = io(SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
      reconnection: true,
      timeout: TIMEOUT
    });
    
    if (!client1) {
      throw new Error('客户端1创建失败，返回了null');
    }
    
    // 设置客户端1的事件监听
    setupClientListeners(client1, '客户端1');
    
    // 4. 等待客户端1连接
    console.log('\n[步骤4] 等待客户端1连接...');
    await waitForConnection(client1, '客户端1');
    
    // 5. 测试创建房间
    console.log('\n[步骤5] 测试创建房间...');
    const createRoomResult = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('创建房间请求超时'));
      }, TIMEOUT);
      
      client1?.emit('createRoom', { playerName: TEST_PLAYER_NAMES[0] }, (response: any) => {
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(`创建房间失败: ${response.error || JSON.stringify(response)}`));
        }
      });
    });
    
    console.log('[客户端1] 创建房间结果:', createRoomResult);
    roomId = createRoomResult.roomId;
    player1Id = createRoomResult.playerId;
    console.log(`[测试] 房间创建成功，ID: ${roomId}, 玩家ID: ${player1Id}`);
    
    // 5.1 测试获取房间信息
    console.log('\n[步骤5.1] 测试获取房间信息...');
    const getRoomInfoResult = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('获取房间信息请求超时'));
      }, TIMEOUT);
      
      client1?.emit('getRoomInfo', { roomId }, (response: any) => {
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(`获取房间信息失败: ${response.error || JSON.stringify(response)}`));
        }
      });
    });
    
    console.log('[客户端1] 获取房间信息结果:', getRoomInfoResult);
    console.log(`[测试] 房间信息获取成功，房间状态: ${getRoomInfoResult.room.status}`);
    
    // 6. 创建第二个客户端（参与者）
    console.log('\n[步骤6] 创建第二个Socket.IO客户端 (参与者)...');
    client2 = io(SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
      reconnection: true,
      timeout: TIMEOUT
    });
    
    if (!client2) {
      throw new Error('客户端2创建失败，返回了null');
    }
    
    // 设置客户端2的事件监听
    setupClientListeners(client2, '客户端2');
    
    // 7. 等待客户端2连接
    console.log('\n[步骤7] 等待客户端2连接...');
    await waitForConnection(client2, '客户端2');
    
    // 8. 加入房间
    console.log('\n[步骤8] 测试加入房间...');
    if (!roomId) {
      throw new Error('没有可用的房间ID');
    }
    
    const joinRoomResult = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('加入房间请求超时'));
      }, TIMEOUT);
      
      client2?.emit('joinRoom', { 
        roomId: roomId, 
        playerName: TEST_PLAYER_NAMES[1] 
      }, (response: any) => {
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(`加入房间失败: ${response.error || JSON.stringify(response)}`));
        }
      });
    });
    
    console.log('[客户端2] 加入房间结果:', joinRoomResult);
    player2Id = joinRoomResult.playerId;
    console.log(`[测试] 成功加入房间，玩家ID: ${player2Id}`);
    
    // 8.1 测试获取活跃房间列表
    console.log('\n[步骤8.1] 测试获取活跃房间列表...');
    const getActiveRoomsResult = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('获取活跃房间列表请求超时'));
      }, TIMEOUT);
      
      client2?.emit('getActiveRooms', {}, (response: any) => {
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(`获取活跃房间列表失败: ${response.error || JSON.stringify(response)}`));
        }
      });
    });
    
    console.log('[客户端2] 获取活跃房间列表结果:', getActiveRoomsResult);
    console.log(`[测试] 活跃房间数量: ${getActiveRoomsResult.rooms.length}`);
    
    // 9. 测试开始游戏
    console.log('\n[步骤9] 测试开始游戏...');
    if (!roomId || !player1Id) {
      throw new Error('缺少房间ID或玩家ID');
    }
    
    const startGameResult = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('开始游戏请求超时'));
      }, TIMEOUT);
      
      client1?.emit('startGame', { 
        roomId: roomId, 
        playerId: player1Id 
      }, (response: any) => {
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(`开始游戏失败: ${response.error || JSON.stringify(response)}`));
        }
      });
    });
    
    console.log('[客户端1] 开始游戏结果:', startGameResult);
    console.log(`[测试] 游戏开始成功，游戏ID: ${startGameResult.gameId}`);
    
    // 10. 睡眠一段时间，保证事件传播
    console.log('\n[步骤10] 等待事件传播...');
    await sleep(3000);
    
    // 11. 测试离开房间
    console.log('\n[步骤11] 测试离开房间...');
    const leaveRoomResult = await new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('离开房间请求超时'));
      }, TIMEOUT);
      
      client2?.emit('leaveRoom', { 
        roomId: roomId, 
        playerId: player2Id 
      }, (response: any) => {
        clearTimeout(timer);
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(`离开房间失败: ${response.error || JSON.stringify(response)}`));
        }
      });
    });
    
    console.log('[客户端2] 离开房间结果:', leaveRoomResult);
    console.log(`[测试] 成功离开房间`);
    
    // 测试成功
    console.log('\n======= 网络API测试成功 =======');
    
  } catch (error: any) {
    console.error('\n[测试] 错误:', error.message);
    if (error.stack) {
      console.error('[测试] 错误堆栈:', error.stack.split('\n').slice(0, 3).join('\n'));
    }
    console.log('\n======= 网络API测试失败 =======');
  } finally {
    console.log('\n正在清理测试环境...');
    
    // 延迟清理以保证所有事件都已传播
    await sleep(CLEANUP_DELAY);
    
    // 依次断开连接
    await disconnectClient(client2, '客户端2');
    await sleep(1000);
    await disconnectClient(client1, '客户端1');
    await sleep(1000);
    
    // 关闭服务器
    if (server) {
      console.log('[服务器] 正在关闭...');
      try {
        await server.close();
        console.log('[服务器] 已关闭');
      } catch (err: any) {
        console.error('[服务器] 关闭失败:', err.message);
      }
    }
    
    console.log('\n======= 测试环境清理完成 =======');
  }
})().catch(error => {
  console.error('[测试] 未捕获的异常:', error);
});

/**
 * 设置客户端事件监听器
 */
function setupClientListeners(client: Socket, label: string): void {
  if (!client) return;
  
  // 连接事件
  client.on('connect', () => {
    console.log(`[${label}] 已连接到服务器`);
  });
  
  client.on('disconnect', (reason) => {
    console.log(`[${label}] 已断开连接，原因: ${reason}`);
  });
  
  client.on('connect_error', (error) => {
    console.error(`[${label}] 连接错误:`, error.message);
  });
  
  // 房间事件
  client.on('roomUpdate', (data) => {
    console.log(`[${label}] 房间更新:`, data);
  });
  
  // 游戏事件
  client.on('gameUpdate', (data) => {
    console.log(`[${label}] 游戏更新:`, data);
  });
  
  client.on('gameStart', (data) => {
    console.log(`[${label}] 游戏开始:`, data);
  });
  
  client.on('turnChange', (data) => {
    console.log(`[${label}] 回合变更:`, data);
  });
  
  client.on('gameError', (data) => {
    console.error(`[${label}] 游戏错误:`, data);
  });
}

/**
 * 等待连接建立
 */
async function waitForConnection(client: Socket | null, label: string): Promise<void> {
  if (!client) {
    throw new Error(`${label}为null，无法等待连接`);
  }
  
  const maxRetryTime = 10000; // 最大重试时间：10秒
  const retryInterval = 500; // 重试间隔：0.5秒
  let elapsed = 0;
  
  while (!client.connected && elapsed < maxRetryTime) {
    await sleep(retryInterval);
    elapsed += retryInterval;
    console.log(`[${label}] 等待连接中... (${elapsed/1000}秒)`);
  }
  
  if (!client.connected) {
    throw new Error(`${label} 连接超时`);
  }
  
  console.log(`[${label}] 连接成功完成`);
}

/**
 * 断开客户端连接
 */
async function disconnectClient(client: Socket | null, label: string): Promise<void> {
  if (!client) {
    console.log(`[${label}] 为null，不需要断开连接`);
    return;
  }
  
  if (client.connected) {
    console.log(`[${label}] 正在断开连接...`);
    client.disconnect();
    await sleep(1000);
    console.log(`[${label}] 已断开连接`);
  } else {
    console.log(`[${label}] 已经处于断开状态`);
  }
}
