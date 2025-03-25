import { Server } from 'socket.io';
import { Socket as ClientSocket, io } from 'socket.io-client';
import * as http from 'http';

/**
 * Socket.IO 诊断测试
 * 用于验证基本的Socket.IO通信是否正常工作
 */
(async () => {
  console.log('======= 开始Socket.IO诊断测试 =======');
  
  // 创建简单的HTTP服务器
  const httpServer = http.createServer();
  const PORT = 3002; // 使用不同端口避免冲突
  
  // 创建Socket.IO服务器
  const io_server = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  let client: ClientSocket | null = null;
  
  try {
    // 配置Socket.IO服务器
    io_server.on('connection', (socket) => {
      console.log(`客户端已连接: ${socket.id}`);
      
      // 监听基本测试事件
      socket.on('test:echo', (data, callback) => {
        console.log(`服务器收到echo请求: ${JSON.stringify(data)}`);
        callback({ success: true, echo: data });
      });
      
      // 监听房间测试事件 (模拟游戏服务器的room:create事件)
      socket.on('room:create', (data, callback) => {
        console.log(`服务器收到创建房间请求: ${JSON.stringify(data)}`);
        const mockResponse = {
          success: true,
          roomId: `room_${Date.now()}`,
          playerId: `player_${socket.id}`
        };
        console.log(`服务器发送创建房间响应: ${JSON.stringify(mockResponse)}`);
        callback(mockResponse);
      });
    });
    
    // 启动服务器
    await new Promise<void>((resolve) => {
      httpServer.listen(PORT, () => {
        console.log(`诊断服务器已启动，端口: ${PORT}`);
        resolve();
      });
    });
    
    // 等待服务器完全启动
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 创建客户端
    console.log('创建客户端...');
    client = io(`http://localhost:${PORT}`, {
      transports: ['websocket'],
      reconnectionDelay: 0,
      forceNew: true
    });
    
    // 等待连接
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('客户端连接超时'));
      }, 5000);
      
      client!.on('connect', () => {
        clearTimeout(timeout);
        console.log(`客户端已连接，ID: ${client!.id}`);
        resolve();
      });
      
      client!.on('connect_error', (err) => {
        clearTimeout(timeout);
        console.error('连接错误:', err);
        reject(err);
      });
    });
    
    // 测试简单的echo功能
    console.log('\n测试Echo功能...');
    const echoResult = await new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Echo请求超时'));
      }, 5000);
      
      client!.emit('test:echo', { message: '你好，服务器' }, (response: any) => {
        clearTimeout(timeout);
        console.log('收到Echo响应:', response);
        resolve(response);
      });
    });
    
    console.log('Echo测试结果:', echoResult);
    
    // 测试创建房间功能 (与游戏服务器相同的API)
    console.log('\n测试创建房间功能...');
    const roomResult = await new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('创建房间请求超时'));
      }, 5000);
      
      client!.emit('room:create', { playerName: '测试玩家' }, (response: any) => {
        clearTimeout(timeout);
        console.log('收到创建房间响应:', response);
        resolve(response);
      });
    });
    
    console.log('创建房间测试结果:', roomResult);
    
    console.log('\n======= Socket.IO诊断测试通过 =======');
    
  } catch (error) {
    console.error('诊断测试失败:', error);
  } finally {
    // 清理资源
    console.log('\n清理测试环境...');
    
    if (client) {
      client.disconnect();
      console.log('客户端已断开连接');
    }
    
    io_server.close();
    httpServer.close();
    console.log('服务器已关闭');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('测试环境已清理');
  }
})();
