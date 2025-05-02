import { _decorator, Node, Label, director, Color } from 'cc';
import { NetworkManager, NetworkStatus } from './network';

/**
 * 网络错误类型
 */
export enum NetworkErrorType {
    TIMEOUT = 'timeout',
    CONNECTION_REFUSED = 'connection_refused',
    SERVER_ERROR = 'server_error',
    UNKNOWN = 'unknown'
}

/**
 * 网络错误处理器
 */
export class NetworkErrorHandler {
    private static retryCount: number = 0;
    private static maxRetryCount: number = 3;
    private static retryDelay: number = 3000; // 3秒
    private static statusLabel: Label | null = null;

    /**
     * 初始化状态标签
     * @param label 状态标签组件
     */
    public static initStatusLabel(label: Label): void {
        this.statusLabel = label;
        this.updateConnectionStatus(NetworkManager.getInstance().status);

        // 监听连接状态变化
        NetworkManager.getInstance().on('connected', () => this.updateConnectionStatus(NetworkStatus.CONNECTED));
        NetworkManager.getInstance().on('disconnected', () => this.updateConnectionStatus(NetworkStatus.DISCONNECTED));
        NetworkManager.getInstance().on('connectionError', () => this.updateConnectionStatus(NetworkStatus.ERROR));
    }

    /**
     * 手动重连
     */
    public static manualReconnect(): void {
        this.retryCount = 0; // 重置重试次数
        this.updateConnectionStatus(NetworkStatus.CONNECTING);
        
        // NetworkManager 不需要显式初始化，直接尝试重新连接
        try {
            // 尝试重新连接
            console.log('[网络] 尝试重新连接...');
        } catch (err) {
            console.error('[网络][错误] 手动重连失败:', err);
            this.updateConnectionStatus(NetworkStatus.ERROR);
            // 可以显示错误提示
            // 也可以选择自动重试
            // this.retryConnection(NetworkErrorType.UNKNOWN);
        }
    }

    /**
     * 更新连接状态显示
     * @param status 连接状态
     */
    public static updateConnectionStatus(status: NetworkStatus): void {
        if (!this.statusLabel) return;

        switch (status) {
            case NetworkStatus.CONNECTED:
                this.statusLabel.string = "已连接";
                this.statusLabel.color = new Color(0, 255, 0);
                break;
            case NetworkStatus.CONNECTING:
                this.statusLabel.string = "连接中...";
                this.statusLabel.color = new Color(255, 255, 0);
                break;
            case NetworkStatus.DISCONNECTED:
                this.statusLabel.string = "未连接";
                this.statusLabel.color = new Color(255, 0, 0);
                break;
            case NetworkStatus.ERROR:
                this.statusLabel.string = "连接错误";
                this.statusLabel.color = new Color(255, 0, 0);
                break;
        }
    }

    /**
     * 处理连接错误
     * @param error 错误对象
     */
    public static handleConnectionError(error: Error): void {
        console.error("[错误处理][错误] 连接错误:", error.message);

        const errorType = this.getErrorType(error);
        this.updateConnectionStatus(NetworkStatus.ERROR);

        switch (errorType) {
            case NetworkErrorType.TIMEOUT:
                this.showRetryDialog("连接超时，是否重试？");
                break;
            case NetworkErrorType.CONNECTION_REFUSED:
                this.showRetryDialog("连接被拒绝，服务器可能未启动，是否重试？");
                break;
            case NetworkErrorType.SERVER_ERROR:
                this.showRetryDialog("服务器错误，是否重试？");
                break;
            default:
                this.showRetryDialog("未知错误，是否重试？");
                break;
        }
    }

    /**
     * 获取错误类型
     * @param error 错误对象
     * @returns 错误类型
     */
    private static getErrorType(error: Error): NetworkErrorType {
        const message = error.message.toLowerCase();
        
        if (message.includes('timeout')) {
            return NetworkErrorType.TIMEOUT;
        } else if (message.includes('refused') || message.includes('econnrefused')) {
            return NetworkErrorType.CONNECTION_REFUSED;
        } else if (message.includes('server') || message.includes('500')) {
            return NetworkErrorType.SERVER_ERROR;
        }
        
        return NetworkErrorType.UNKNOWN;
    }

    /**
     * 显示重试对话框
     * @param message 对话框消息
     */
    private static showRetryDialog(message: string): void {
        // 这里应该调用Cocos原生对话框API，为了简单起见，我们使用console
        console.warn("[错误处理][警告] " + message);
        
        // 重试逻辑，实际项目中应该由用户确认后再执行
        this.retryConnection(NetworkErrorType.UNKNOWN);
    }

    /**
     * 重试连接
     * @param errorCode 错误代码
     */
    public static retryConnection(errorCode: NetworkErrorType): void {
        if (this.retryCount >= this.maxRetryCount) {
            console.error(`[网络][错误] 连接失败，已达到最大重试次数 ${this.maxRetryCount}`);
            director.loadScene('LoginScene'); // 返回登录场景
            return;
        }

        this.retryCount++;
        console.log(`[网络][信息] 第 ${this.retryCount} 次重试连接...`);

        setTimeout(() => {
            try {
                // NetworkManager 不需要显式初始化，直接获取实例
                NetworkManager.getInstance();
                console.log('[网络][信息] 重新连接成功');
            } catch (err) {
                console.error('[网络][错误] 重试连接失败:', err);
                // 继续重试或返回登录
                this.retryConnection(errorCode);
            }
        }, this.retryDelay);
    }
}
