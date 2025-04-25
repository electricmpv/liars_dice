import { _decorator, Component, Node, Button, Label, tween, Vec3, UIOpacity } from 'cc';
import { PlayerItem } from './player-item';
const { ccclass, property } = _decorator;

/**
 * 好友请求预制体
 * 功能：
 * 1. 显示发送请求的玩家信息
 * 2. 提供接受和拒绝按钮
 * 3. 支持请求动画显示和消失
 * 4. 区分不同类型的请求来源
 */

// 请求类型枚举
enum RequestType {
    FRIEND_REQUEST = 'friend',     // 好友申请
    ROOM_INVITE = 'room',          // 房间邀请
    TEAM_INVITE = 'team',          // 组队邀请
    GAME_INVITE = 'game'           // 游戏邀请
}

@ccclass('FriendRequest')
export class FriendRequest extends Component {
    @property(PlayerItem)
    playerInfo: PlayerItem = null!;
    
    @property(Button)
    acceptButton: Button = null!;
    
    @property(Button)
    rejectButton: Button = null!;

    @property(Label)
    requestMessage: Label = null!;

    @property(Label)
    timerLabel: Label = null!;

    @property(Label)
    requestTypeLabel: Label = null!;  // 显示请求类型的标签

    @property(Node)
    friendRequestIcon: Node = null!;  // 好友请求图标

    @property(Node)
    roomInviteIcon: Node = null!;     // 房间邀请图标

    @property(Node)
    teamInviteIcon: Node = null!;     // 组队邀请图标

    @property(Node)
    gameInviteIcon: Node = null!;     // 游戏邀请图标

    private _requestId: string = '';
    private _senderId: string = '';
    private _requestTime: number = 0;
    private _expirationTime: number = 300; // 请求过期时间（秒）
    private _requestType: RequestType = RequestType.FRIEND_REQUEST; // 请求类型
    private _roomId: string = ''; // 房间ID（针对房间邀请）
    private _countdownTimer: any = null;
    private _originalPosition: Vec3 = new Vec3();
    private _isVisible: boolean = false;

    onLoad() {
        this._originalPosition = this.node.position.clone();
        this.node.active = false;
    }

    start() {
        // 注册按钮点击事件
        if (this.acceptButton) {
            this.acceptButton.node.on('click', this.onAcceptButtonClicked, this);
        }
        
        if (this.rejectButton) {
            this.rejectButton.node.on('click', this.onRejectButtonClicked, this);
        }
    }

    onDestroy() {
        // 移除事件监听
        if (this.acceptButton) {
            this.acceptButton.node.off('click', this.onAcceptButtonClicked, this);
        }
        
        if (this.rejectButton) {
            this.rejectButton.node.off('click', this.onRejectButtonClicked, this);
        }
        
        // 清除定时器
        this.clearCountdownTimer();
    }

    /**
     * 显示好友请求
     * @param requestInfo 请求信息
     */
    public show(requestInfo: {
        requestId: string;
        senderId: string;
        senderName: string;
        message?: string;
        expirationTime?: number;
        requestType?: RequestType | string;
        roomId?: string;
        teamId?: string;
        gameId?: string;
    }): void {
        if (this._isVisible) {
            this.hideImmediately();
        }
        
        // 保存请求信息
        this._requestId = requestInfo.requestId;
        this._senderId = requestInfo.senderId;
        this._requestTime = Date.now();
        
        if (requestInfo.expirationTime) {
            this._expirationTime = requestInfo.expirationTime;
        }
        
        // 设置请求类型
        if (requestInfo.requestType) {
            this._requestType = requestInfo.requestType as RequestType;
        } else {
            this._requestType = RequestType.FRIEND_REQUEST;
        }
        
        // 保存额外信息
        if (requestInfo.roomId) {
            this._roomId = requestInfo.roomId;
        }
        
        // 设置玩家信息
        if (this.playerInfo) {
            this.playerInfo.setPlayerId(requestInfo.senderId);
            this.playerInfo.setPlayerName(requestInfo.senderName);
        }
        
        // 设置请求消息
        if (this.requestMessage) {
            if (requestInfo.message) {
                this.requestMessage.string = requestInfo.message;
            } else {
                // 根据请求类型生成默认消息
                switch (this._requestType) {
                    case RequestType.FRIEND_REQUEST:
                        this.requestMessage.string = `${requestInfo.senderName} 请求添加您为好友`;
                        break;
                    case RequestType.ROOM_INVITE:
                        this.requestMessage.string = `${requestInfo.senderName} 邀请您加入房间 ${this._roomId}`;
                        break;
                    case RequestType.TEAM_INVITE:
                        this.requestMessage.string = `${requestInfo.senderName} 邀请您加入队伍`;
                        break;
                    case RequestType.GAME_INVITE:
                        this.requestMessage.string = `${requestInfo.senderName} 邀请您一起游戏`;
                        break;
                }
            }
        }
        
        // 设置请求类型标签
        if (this.requestTypeLabel) {
            switch (this._requestType) {
                case RequestType.FRIEND_REQUEST:
                    this.requestTypeLabel.string = "好友申请";
                    break;
                case RequestType.ROOM_INVITE:
                    this.requestTypeLabel.string = "房间邀请";
                    break;
                case RequestType.TEAM_INVITE:
                    this.requestTypeLabel.string = "组队邀请";
                    break;
                case RequestType.GAME_INVITE:
                    this.requestTypeLabel.string = "游戏邀请";
                    break;
            }
        }
        
        // 更新图标显示
        this.updateRequestTypeIcon();
        
        // 显示请求窗口
        this.node.active = true;
        this._isVisible = true;
        
        // 开始倒计时
        this.startCountdown();
        
        // 播放显示动画
        this.playShowAnimation();
    }

    /**
     * 更新请求类型图标
     */
    private updateRequestTypeIcon(): void {
        // 隐藏所有图标
        if (this.friendRequestIcon) this.friendRequestIcon.active = false;
        if (this.roomInviteIcon) this.roomInviteIcon.active = false;
        if (this.teamInviteIcon) this.teamInviteIcon.active = false;
        if (this.gameInviteIcon) this.gameInviteIcon.active = false;
        
        // 根据请求类型显示对应图标
        switch (this._requestType) {
            case RequestType.FRIEND_REQUEST:
                if (this.friendRequestIcon) this.friendRequestIcon.active = true;
                break;
            case RequestType.ROOM_INVITE:
                if (this.roomInviteIcon) this.roomInviteIcon.active = true;
                break;
            case RequestType.TEAM_INVITE:
                if (this.teamInviteIcon) this.teamInviteIcon.active = true;
                break;
            case RequestType.GAME_INVITE:
                if (this.gameInviteIcon) this.gameInviteIcon.active = true;
                break;
        }
    }

    /**
     * 隐藏请求（带动画）
     */
    public hide(): void {
        if (!this._isVisible) return;
        
        this.playHideAnimation();
    }

    /**
     * 立即隐藏请求（无动画）
     */
    public hideImmediately(): void {
        if (!this._isVisible) return;
        
        this._isVisible = false;
        this.node.active = false;
        
        // 重置位置
        this.node.position = this._originalPosition.clone();
        
        // 清除倒计时
        this.clearCountdownTimer();
    }

    /**
     * 开始倒计时
     */
    private startCountdown(): void {
        // 清除可能存在的旧定时器
        this.clearCountdownTimer();
        
        // 更新倒计时显示
        this.updateTimerDisplay();
        
        // 设置新的倒计时
        this._countdownTimer = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this._requestTime) / 1000);
            const remainingTime = this._expirationTime - elapsedTime;
            
            if (remainingTime <= 0) {
                // 请求过期，自动拒绝
                this.clearCountdownTimer();
                this.onRequestExpired();
            } else {
                // 更新倒计时显示
                this.updateTimerDisplay(remainingTime);
            }
        }, 1000);
    }

    /**
     * 清除倒计时定时器
     */
    private clearCountdownTimer(): void {
        if (this._countdownTimer) {
            clearInterval(this._countdownTimer);
            this._countdownTimer = null;
        }
    }

    /**
     * 更新倒计时显示
     */
    private updateTimerDisplay(remainingTime?: number): void {
        if (!this.timerLabel) return;
        
        if (remainingTime === undefined) {
            const elapsedTime = Math.floor((Date.now() - this._requestTime) / 1000);
            remainingTime = this._expirationTime - elapsedTime;
        }
        
        // 确保不为负数
        remainingTime = Math.max(0, remainingTime);
        
        // 格式化为分:秒
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        this.timerLabel.string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * 接受按钮点击处理
     */
    private onAcceptButtonClicked(): void {
        // 播放点击动画
        this.playButtonClickAnimation(this.acceptButton.node);
        
        // 触发接受事件
        this.node.emit('request-accepted', {
            requestId: this._requestId,
            senderId: this._senderId,
            requestType: this._requestType,
            roomId: this._roomId
        });
        
        // 隐藏请求
        this.hide();
    }

    /**
     * 拒绝按钮点击处理
     */
    private onRejectButtonClicked(): void {
        // 播放点击动画
        this.playButtonClickAnimation(this.rejectButton.node);
        
        // 触发拒绝事件
        this.node.emit('request-rejected', {
            requestId: this._requestId,
            senderId: this._senderId,
            requestType: this._requestType,
            roomId: this._roomId
        });
        
        // 隐藏请求
        this.hide();
    }

    /**
     * 请求过期处理
     */
    private onRequestExpired(): void {
        // 触发过期事件
        this.node.emit('request-expired', {
            requestId: this._requestId,
            senderId: this._senderId,
            requestType: this._requestType,
            roomId: this._roomId
        });
        
        // 隐藏请求
        this.hide();
    }

    /**
     * 播放按钮点击动画
     */
    private playButtonClickAnimation(buttonNode: Node): void {
        const originalScale = buttonNode.scale.clone();
        
        tween(buttonNode)
            .to(0.1, { scale: new Vec3(originalScale.x * 0.9, originalScale.y * 0.9, 1) })
            .to(0.1, { scale: originalScale })
            .start();
    }

    /**
     * 播放显示动画
     */
    private playShowAnimation(): void {
        // 设置初始位置（从顶部滑入）
        this.node.position = new Vec3(this._originalPosition.x, this._originalPosition.y + 100, this._originalPosition.z);
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        uiOpacity.opacity = 0;
        
        // 播放动画
        tween(this.node)
            .to(0.3, { position: this._originalPosition })
            .start();
            
        tween(uiOpacity)
            .to(0.3, { opacity: 255 })
            .start();
    }

    /**
     * 播放隐藏动画
     */
    private playHideAnimation(): void {
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        
        // 向右滑出并淡出
        tween(this.node)
            .to(0.3, { position: new Vec3(this._originalPosition.x + 100, this._originalPosition.y, this._originalPosition.z) })
            .start();
            
        tween(uiOpacity)
            .to(0.3, { opacity: 0 })
            .call(() => {
                this._isVisible = false;
                this.node.active = false;
                this.node.position = this._originalPosition.clone();
            })
            .start();
    }
}
