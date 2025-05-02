import { _decorator, Component, Node, Label, Color, Sprite } from 'cc';
import { NetworkManager, NetworkStatus } from '../core/network';

const { ccclass, property } = _decorator;

/**
 * 网络连接状态UI组件
 */
@ccclass('ConnectionStatus')
export class ConnectionStatus extends Component {
    @property(Label)
    private statusLabel: Label | null = null;
    
    @property(Sprite)
    private statusIcon: Sprite | null = null;
    
    @property(Node)
    private reconnectButton: Node | null = null;
    
    @property(Color)
    private connectedColor: Color = new Color(0, 255, 0);
    
    @property(Color)
    private connectingColor: Color = new Color(255, 165, 0);
    
    @property(Color)
    private disconnectedColor: Color = new Color(255, 0, 0);
    
    @property(Color)
    private reconnectingColor: Color = new Color(0, 191, 255);
    
    private isManualDisconnect: boolean = false;
    
    start() {
        // 注册网络事件监听器
        this.registerNetworkEvents();
        
        // 初始化UI状态
        this.updateConnectionStatus(NetworkManager.getInstance().status);
        
        // 设置重连按钮点击事件
        if (this.reconnectButton) {
            this.reconnectButton.on(Node.EventType.TOUCH_END, this.onReconnectClick, this);
        }
    }
    
    onDestroy() {
        // 移除事件监听器
        this.unregisterNetworkEvents();
        
        // 移除按钮点击事件
        if (this.reconnectButton) {
            this.reconnectButton.off(Node.EventType.TOUCH_END, this.onReconnectClick, this);
        }
    }
    
    /**
     * 注册网络事件监听器
     */
    private registerNetworkEvents(): void {
        NetworkManager.getInstance().on('connected', () => this.onConnected());
        NetworkManager.getInstance().on('connecting', () => this.onConnecting());
        NetworkManager.getInstance().on('disconnected', () => this.onDisconnected());
        NetworkManager.getInstance().on('status', (status: NetworkStatus) => this.onStatusChange(status));
        NetworkManager.getInstance().on('error', (error: any) => this.onNetworkError(error));
        NetworkManager.getInstance().on('reconnect_failed', () => this.onReconnectFailed());
    }
    
    /**
     * 移除网络事件监听器
     */
    private unregisterNetworkEvents(): void {
        // 由于SocketAdapter要求同样的回调引用，我们需要重新创建之前注册的匿名函数的空白处理程序
        NetworkManager.getInstance().off('connected', () => {});
        NetworkManager.getInstance().off('connecting', () => {});
        NetworkManager.getInstance().off('disconnected', () => {});
        NetworkManager.getInstance().off('status', () => {});
        NetworkManager.getInstance().off('error', () => {});
        NetworkManager.getInstance().off('reconnect_failed', () => {});
    }
    
    /**
     * 连接成功事件处理
     */
    private onConnected(): void {
        this.updateConnectionStatus(NetworkStatus.CONNECTED);
        this.isManualDisconnect = false;
    }
    
    /**
     * 连接中事件处理
     */
    private onConnecting(): void {
        this.updateConnectionStatus(NetworkStatus.CONNECTING);
    }
    
    /**
     * 断开连接事件处理
     */
    private onDisconnected(): void {
        this.updateConnectionStatus(NetworkStatus.DISCONNECTED);
    }
    
    /**
     * 状态变化事件处理
     */
    private onStatusChange(status: NetworkStatus): void {
        this.updateConnectionStatus(status);
    }
    
    /**
     * 网络错误事件处理
     */
    private onNetworkError(error: any): void {
        console.error('[ConnectionStatus] 网络错误:', error);
        
        // 更新UI显示错误消息
        if (this.statusLabel) {
            this.statusLabel.string = `连接错误: ${error.message}`;
            this.statusLabel.color = this.disconnectedColor;
        }
        
        // 显示重连按钮
        if (this.reconnectButton && !this.isManualDisconnect) {
            this.reconnectButton.active = true;
        }
    }
    
    /**
     * 重连失败事件处理
     */
    private onReconnectFailed(): void {
        console.error('[ConnectionStatus] 重连失败，已达到最大重试次数');
        
        // 更新UI显示重连失败消息
        if (this.statusLabel) {
            this.statusLabel.string = '重连失败，请手动重连';
            this.statusLabel.color = this.disconnectedColor;
        }
        
        // 显示重连按钮
        if (this.reconnectButton) {
            this.reconnectButton.active = true;
        }
    }
    
    /**
     * 更新连接状态UI
     */
    private updateConnectionStatus(status: NetworkStatus): void {
        if (!this.statusLabel || !this.statusIcon) return;
        
        let statusText = '';
        let statusColor = this.disconnectedColor;
        let showReconnectButton = false;
        
        switch (status) {
            case NetworkStatus.CONNECTED:
                statusText = '已连接';
                statusColor = this.connectedColor;
                showReconnectButton = false;
                break;
            case NetworkStatus.CONNECTING:
                statusText = '连接中...';
                statusColor = this.connectingColor;
                showReconnectButton = false;
                break;
            case NetworkStatus.RECONNECTING:
                statusText = '重新连接中...';
                statusColor = this.reconnectingColor;
                showReconnectButton = false;
                break;
            case NetworkStatus.DISCONNECTED:
                statusText = '未连接';
                statusColor = this.disconnectedColor;
                showReconnectButton = !this.isManualDisconnect;
                break;
            default:
                statusText = '未知状态';
                statusColor = this.disconnectedColor;
                showReconnectButton = true;
                break;
        }
        
        // 更新状态文本和颜色
        this.statusLabel.string = statusText;
        this.statusLabel.color = statusColor;
        
        // 更新状态图标颜色
        this.statusIcon.color = statusColor;
        
        // 显示/隐藏重连按钮
        if (this.reconnectButton) {
            this.reconnectButton.active = showReconnectButton;
        }
    }
    
    /**
     * 重连按钮点击处理
     */
    private onReconnectClick(): void {
        console.log('[ConnectionStatus] 手动重连');
        
        // 更新UI状态
        if (this.statusLabel) {
            this.statusLabel.string = '连接中...';
            this.statusLabel.color = this.connectingColor;
        }
        
        // 隐藏重连按钮
        if (this.reconnectButton) {
            this.reconnectButton.active = false;
        }
        
        // 尝试重新连接
        // 注意：NetworkManager 不需要 connect 方法，它在需要时会自动初始化和连接
        NetworkManager.getInstance();
    }
    
    /**
     * 断开连接（用于外部调用）
     */
    public disconnect(): void {
        this.isManualDisconnect = true;
        NetworkManager.getInstance().disconnect();
    }
    
    /**
     * 连接（用于外部调用）
     */
    public connect(): void {
        this.isManualDisconnect = false;
        // NetworkManager 不需要 connect 方法，它在需要时会自动初始化和连接
        NetworkManager.getInstance();
    }
}
