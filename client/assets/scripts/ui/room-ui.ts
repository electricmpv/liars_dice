import { _decorator, Component, Node, EditBox, Label, Button, Color } from 'cc';
import { network } from '../core/network';
import { NetworkErrorHandler } from '../core/error-handler';

const { ccclass, property } = _decorator;

/**
 * 房间UI组件
 */
@ccclass('RoomUI')
export class RoomUI extends Component {
    @property(EditBox)
    private roomIdInput: EditBox | null = null;

    @property(EditBox)
    private playerNameInput: EditBox | null = null;

    @property(Label)
    private statusLabel: Label | null = null;

    @property(Button)
    private connectButton: Button | null = null;

    @property(Node)
    private connectionPanel: Node | null = null;

    @property(Node)
    private roomPanel: Node | null = null;

    @property(Label)
    private errorMessageLabel: Label | null = null;

    private isConnecting: boolean = false;
    private lastActionTime: number = 0;
    private debounceTime: number = 300; // 防抖时间300ms

    start() {
        // 初始化状态标签
        if (this.statusLabel) {
            NetworkErrorHandler.initStatusLabel(this.statusLabel);
        }

        // 显示连接面板
        this.showConnectionPanel();

        // 监听网络连接事件
        network.on('connected', () => {
            this.onNetworkConnected();
        });

        network.on('disconnected', () => {
            this.onNetworkDisconnected();
        });

        network.on('connectionError', (error) => {
            this.showError(`连接错误: ${error.message}`);
        });

        network.on('roomUpdate', (room) => {
            console.log('[房间][信息] 房间更新:', room);
            // 这里可以更新房间界面
        });
    }

    /**
     * 连接到服务器
     */
    public onConnectClick() {
        if (this.isDebounced()) return;

        this.clearError();
        this.isConnecting = true;

        if (this.connectButton) {
            this.connectButton.interactable = false;
        }

        network.connect().then(() => {
            this.showRoomPanel();
        }).catch(error => {
            NetworkErrorHandler.handleConnectionError(error);
        }).finally(() => {
            this.isConnecting = false;
            if (this.connectButton) {
                this.connectButton.interactable = true;
            }
        });
    }

    /**
     * 创建房间
     */
    public onCreateRoomClick() {
        if (this.isDebounced()) return;

        this.clearError();

        const playerName = this.playerNameInput?.string;
        if (!playerName) {
            this.showError('请输入玩家名称');
            return;
        }

        network.createRoom(playerName).then(({ roomId, playerId }) => {
            console.log('[房间][信息] 房间创建成功:', roomId, playerId);
            // 保存房间ID和玩家ID
            network.roomId = roomId;
            network.playerId = playerId;
            
            // 显示成功消息
            this.showSuccess(`房间创建成功，房间ID: ${roomId}`);
            
            // 这里可以跳转到游戏准备界面
        }).catch(error => {
            this.showError(`创建房间失败: ${error.message}`);
        });
    }

    /**
     * 加入房间
     */
    public onJoinRoomClick() {
        if (this.isDebounced()) return;

        this.clearError();

        const roomId = this.roomIdInput?.string;
        const playerName = this.playerNameInput?.string;

        if (!roomId) {
            this.showError('请输入房间ID');
            return;
        }

        if (!playerName) {
            this.showError('请输入玩家名称');
            return;
        }

        network.joinRoom(roomId, playerName).then(({ playerId, room }) => {
            console.log('[房间][信息] 加入房间成功:', playerId, room);
            
            // 保存房间ID和玩家ID
            network.roomId = roomId;
            network.playerId = playerId;
            network.room = room;
            
            // 显示成功消息
            this.showSuccess('加入房间成功');
            
            // 这里可以跳转到游戏准备界面
        }).catch(error => {
            this.showError(`加入房间失败: ${error.message}`);
        });
    }

    /**
     * 断开连接
     */
    public onDisconnectClick() {
        if (this.isDebounced()) return;

        network.disconnect();
        this.showConnectionPanel();
    }

    /**
     * 网络连接成功回调
     */
    private onNetworkConnected() {
        this.showRoomPanel();
    }

    /**
     * 网络断开连接回调
     */
    private onNetworkDisconnected() {
        this.showConnectionPanel();
    }

    /**
     * 显示连接面板
     */
    private showConnectionPanel() {
        if (this.connectionPanel) {
            this.connectionPanel.active = true;
        }
        
        if (this.roomPanel) {
            this.roomPanel.active = false;
        }
    }

    /**
     * 显示房间面板
     */
    private showRoomPanel() {
        if (this.connectionPanel) {
            this.connectionPanel.active = false;
        }
        
        if (this.roomPanel) {
            this.roomPanel.active = true;
        }
    }

    /**
     * 显示错误消息
     * @param message 错误消息
     */
    private showError(message: string) {
        if (this.errorMessageLabel) {
            this.errorMessageLabel.string = message;
            this.errorMessageLabel.color = new Color(255, 0, 0, 255);
            this.errorMessageLabel.node.active = true;
        }
    }

    /**
     * 显示成功消息
     * @param message 成功消息
     */
    private showSuccess(message: string) {
        if (this.errorMessageLabel) {
            this.errorMessageLabel.string = message;
            this.errorMessageLabel.color = new Color(0, 255, 0, 255);
            this.errorMessageLabel.node.active = true;
        }
    }

    /**
     * 清除错误消息
     */
    private clearError() {
        if (this.errorMessageLabel) {
            this.errorMessageLabel.node.active = false;
        }
    }

    /**
     * 检查防抖
     * @returns 是否防抖中
     */
    private isDebounced(): boolean {
        const now = Date.now();
        if (now - this.lastActionTime < this.debounceTime) {
            return true;
        }
        this.lastActionTime = now;
        return false;
    }

    /**
     * 测试连接（调试用）
     */
    public onTestConnect() {
        console.log('[调试][信息] 测试连接');
        network.connect().catch(error => {
            NetworkErrorHandler.handleConnectionError(error);
        });
    }
}
