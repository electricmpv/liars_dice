import { _decorator, Component, Label, Color } from 'cc';
import { network, ConnectionStatus as NetworkStatus } from '../core/network';

const { ccclass, property } = _decorator;

/**
 * 连接状态指示器组件
 */
@ccclass('ConnectionStatusIndicator')
export class ConnectionStatusIndicator extends Component {
    @property(Label)
    private statusLabel: Label | null = null;

    start() {
        // 初始化状态显示
        this.updateConnectionStatus(network.getConnectionStatus());

        // 监听连接状态变化
        network.on('connected', () => {
            this.updateConnectionStatus(NetworkStatus.CONNECTED);
        });

        network.on('disconnected', () => {
            this.updateConnectionStatus(NetworkStatus.DISCONNECTED);
        });

        network.on('connectionError', () => {
            this.updateConnectionStatus(NetworkStatus.ERROR);
        });
    }

    /**
     * 更新连接状态显示
     * @param status 连接状态
     */
    private updateConnectionStatus(status: NetworkStatus): void {
        if (!this.statusLabel) return;

        switch (status) {
            case NetworkStatus.CONNECTED:
                this.statusLabel.string = "已连接";
                this.statusLabel.color = new Color(0, 255, 0, 255);
                break;
            case NetworkStatus.CONNECTING:
                this.statusLabel.string = "连接中...";
                this.statusLabel.color = new Color(255, 255, 0, 255);
                break;
            case NetworkStatus.DISCONNECTED:
                this.statusLabel.string = "未连接";
                this.statusLabel.color = new Color(255, 0, 0, 255);
                break;
            case NetworkStatus.ERROR:
                this.statusLabel.string = "连接错误";
                this.statusLabel.color = new Color(255, 0, 0, 255);
                break;
        }
    }
}
