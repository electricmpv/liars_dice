import { _decorator, Component, Node, Label, Button } from 'cc';
import { loadColyseusClient, isColyseusLoaded } from '../libs/colyseus-loader';
import { NetworkManager } from '../core/network';
import { LoginManager } from '../core/login-manager';

const { ccclass, property } = _decorator;

/**
 * Colyseus测试工具
 * 用于测试Colyseus连接和房间加入
 */
@ccclass('ColyseusTestTool')
export class ColyseusTestTool extends Component {
    @property(Label)
    statusLabel: Label | null = null;

    @property(Button)
    testButton: Button | null = null;

    @property(Button)
    clearButton: Button | null = null;

    @property
    serverUrl: string = "ws://localhost:3000";

    private _logs: string[] = [];
    private _maxLogs: number = 20;

    start() {
        this.updateStatus('准备测试Colyseus连接');
        
        // 设置按钮事件
        if (this.testButton) {
            this.testButton.node.on(Button.EventType.CLICK, this.onTestButtonClick, this);
        }
        
        if (this.clearButton) {
            this.clearButton.node.on(Button.EventType.CLICK, this.onClearButtonClick, this);
        }
    }

    onDestroy() {
        // 清理按钮事件
        if (this.testButton) {
            this.testButton.node.off(Button.EventType.CLICK, this.onTestButtonClick, this);
        }
        
        if (this.clearButton) {
            this.clearButton.node.off(Button.EventType.CLICK, this.onClearButtonClick, this);
        }
    }

    /**
     * 测试按钮点击事件
     */
    async onTestButtonClick() {
        this.log('开始测试Colyseus连接...');
        
        try {
            // 1. 测试Colyseus客户端加载
            this.log('1. 测试Colyseus客户端加载');
            if (!isColyseusLoaded()) {
                this.log('Colyseus客户端未加载，正在加载...');
                await loadColyseusClient();
                this.log('Colyseus客户端加载成功');
            } else {
                this.log('Colyseus客户端已加载');
            }
            
            // 2. 测试网络管理器初始化
            this.log('2. 测试网络管理器初始化');
            // NetworkManager 不需要显式初始化，它在需要时会自动初始化
            this.log('网络管理器初始化成功');
            
            // 3. 测试加入房间
            this.log('3. 测试加入房间');
            const playerName = `测试用户_${Math.floor(Math.random() * 10000)}`;
            LoginManager.playerName = playerName;
            this.log(`使用玩家名称: ${playerName}`);
            
            const room = await NetworkManager.getInstance().joinLiarDiceRoom({
                playerName: playerName,
                create: true
            });
            
            this.log(`房间加入成功: ${room.roomId}`);
            this.log(`会话ID: ${room.sessionId}`);
            this.log(`房间名称: ${room.name}`);
            
            // 4. 测试发送消息
            this.log('4. 测试发送消息');
            NetworkManager.getInstance().send('test_message', { content: '这是一条测试消息' });
            this.log('测试消息已发送');
            
            // 5. 等待3秒后离开房间
            this.log('5. 等待3秒后离开房间');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            await NetworkManager.getInstance().leaveRoom();
            this.log('已离开房间');
            
            this.log('测试完成，所有步骤成功');
        } catch (error) {
            this.log(`测试失败: ${error instanceof Error ? error.message : String(error)}`);
            console.error('Colyseus测试失败:', error);
        }
    }
    
    /**
     * 清除按钮点击事件
     */
    onClearButtonClick() {
        this._logs = [];
        this.updateStatus('日志已清除');
    }
    
    /**
     * 添加日志
     * @param message 日志消息
     */
    private log(message: string) {
        console.log(`[ColyseusTest] ${message}`);
        this._logs.push(`${new Date().toLocaleTimeString()}: ${message}`);
        
        // 限制日志数量
        if (this._logs.length > this._maxLogs) {
            this._logs.shift();
        }
        
        this.updateStatus(this._logs.join('\n'));
    }
    
    /**
     * 更新状态标签
     * @param status 状态文本
     */
    private updateStatus(status: string) {
        if (this.statusLabel) {
            this.statusLabel.string = status;
        }
    }
}
