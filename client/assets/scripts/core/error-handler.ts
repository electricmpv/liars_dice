import { _decorator, Node, Label, director, Color } from 'cc';
import { network, ConnectionStatus as NetworkStatus } from './network';

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
        this.updateConnectionStatus(network.getConnectionStatus());

        // 监听连接状态变化
        network.on('connected', () => this.updateConnectionStatus(NetworkStatus.CONNECTED));
        network.on('disconnected', () => this.updateConnectionStatus(NetworkStatus.DISCONNECTED));
        network.on('connectionError', () => this.updateConnectionStatus(NetworkStatus.ERROR));
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
        if (this.retryCount < this.maxRetryCount) {
            this.retryCount++;
            console.log(`[错误处理][信息] 正在重试 (${this.retryCount}/${this.maxRetryCount})...`);
            
            setTimeout(() => {
                network.connect().catch(err => {
                    this.handleConnectionError(err);
                });
            }, this.retryDelay);
        } else {
            console.error("[错误处理][错误] 重试次数已达上限，请检查网络连接或服务器状态");
            this.retryCount = 0;
        }
    }

    /**
     * 手动重试连接
     */
    public static retryConnection(): void {
        this.retryCount = 0;
        network.connect().catch(err => {
            this.handleConnectionError(err);
        });
    }
}
