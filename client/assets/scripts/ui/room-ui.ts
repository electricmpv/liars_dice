import { _decorator, Component, Node, EditBox, Label, Button, Color, director } from 'cc';
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

    // 将只读属性改为私有变量
    private _roomId: string = '';
    private _playerId: string = '';
    private _room: any = null;  // 根据实际Room类型调整

    // 添加getter和setter
    public get roomId(): string {
        return this._roomId;
    }

    public get playerId(): string {
        return this._playerId;
    }

    public get room(): any {
        return this._room;
    }

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
    private async onCreateRoomClick() {
        if (this.isDebounced()) return;

        const playerName = this.playerNameInput?.string || '';
        if (!playerName) {
            this.showError('请输入玩家名称');
            return;
        }

        try {
            const result = await network.createRoom(playerName);
            if (result.success) {
                this._roomId = result.roomId;  // 使用私有变量
                this._playerId = result.playerId;
                this.updateUI();
            }
        } catch (error) {
            this.showError(`创建房间失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }

    /**
     * 加入房间
     */
    private async onJoinRoomClick() {
        if (this.isDebounced()) return;

        const roomId = this.roomIdInput?.string || '';
        const playerName = this.playerNameInput?.string || '';

        if (!roomId || !playerName) {
            this.showError('请输入房间号和玩家名称');
            return;
        }

        try {
            const result = await network.joinRoom(roomId, playerName);
            if (result.success) {
                this._roomId = roomId;  // 使用私有变量
                this._playerId = result.playerId;
                this._room = result.room;
                this.updateUI();
            }
        } catch (error) {
            this.showError(`加入房间失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
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
     * 更新UI状态
     * 根据当前房间状态更新界面显示
     */
    private updateUI() {
        // 显示房间面板
        this.showRoomPanel();

        // 清除错误信息
        this.clearError();

        // 显示房间信息
        if (this._roomId && this._playerId) {
            this.showSuccess(`成功${this._room ? '加入' : '创建'}房间：${this._roomId}`);
            
            // 更新房间内玩家列表等信息
            // ...这里可以根据实际需要添加更多UI更新逻辑
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

    // 添加游戏相关方法
    public onStartGameClick() {
      if (this.isDebounced()) return;
    
      network.startGame().then(() => {
        console.log('[游戏][信息] 游戏开始');
        // 这里可以切换到游戏场景
        director.loadScene('GameScene');
      }).catch(error => {
        this.showError(`开始游戏失败: ${error.message}`);
      });
    }
}
