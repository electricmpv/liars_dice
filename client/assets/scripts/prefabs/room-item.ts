import { _decorator, Component, Node, Label, Sprite, Button, Color, tween, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 房间列表项预制体
 * 功能：
 * 1. 显示房间信息（ID、名称、玩家数、状态）
 * 2. 支持点击加入房间
 * 3. 根据房间状态显示不同样式
 */

import type { RoomStatus as SharedRoomStatus } from "../../../../shared/protocols/room-protocol";

@ccclass('RoomItem')
export class RoomItem extends Component {
    @property(Label)
    private roomIdLabel: Label = null!;

    @property(Label)
    private roomNameLabel: Label = null!;

    @property(Label)
    private playerCountLabel: Label = null!;

    @property(Label)
    private statusLabel: Label = null!;

    @property(Sprite)
    private backgroundSprite: Sprite = null!;

    @property(Button)
    private joinButton: Button = null!;

    @property(Node)
    private lockedIcon: Node = null!;

    @property(Node)
    private privateIcon: Node = null!;

    @property(Node)
    private playingIcon: Node = null!;

    @property(Node)
    private friendsIcon: Node = null!;

    // 房间信息
    private _roomId: string = '';
    private _roomName: string = '';
    private _playerCount: number = 0;
    private _maxPlayers: number = 6;
    private _status: SharedRoomStatus = "waiting";
    private _hasPassword: boolean = false;
    private _isPrivate: boolean = false;
    private _hasFriends: boolean = false;
    private _originalScale: Vec3 = new Vec3(1, 1, 1);

    // 颜色常量
    private readonly WAITING_COLOR: Color = new Color(76, 217, 100, 255);
    private readonly PLAYING_COLOR: Color = new Color(255, 59, 48, 255);
    private readonly FULL_COLOR: Color = new Color(142, 142, 147, 255);

    onLoad(): void {
        this._originalScale = this.node.scale.clone();
        this.updateRoomDisplay();
    }

    start(): void {
        // 注册点击事件
        this.node.on(Node.EventType.TOUCH_END, this.onRoomItemClicked, this);
        
        if (this.joinButton) {
            this.joinButton.node.on('click', this.onJoinButtonClicked, this);
        }
    }

    onDestroy(): void {
        // 在移除监听器前检查节点是否有效，避免在销毁阶段访问无效节点
        if (this.node && this.node.isValid) {
            this.node.off(Node.EventType.TOUCH_END, this.onRoomItemClicked, this);
        }
        
        if (this.joinButton && this.joinButton.isValid && this.joinButton.node && this.joinButton.node.isValid) {
            this.joinButton.node.off('click', this.onJoinButtonClicked, this);
        }
    }

    /**
     * 设置房间信息
     */
    public setRoomInfo(info: {
        roomId: string;
        roomName: string;
        playerCount: number;
        maxPlayers: number;
        status: SharedRoomStatus;
        hasPassword: boolean;
        isPrivate: boolean;
        hasFriends: boolean;
    }): void {
        this._roomId = info.roomId;
        this._roomName = info.roomName;
        this._playerCount = info.playerCount;
        this._maxPlayers = info.maxPlayers;
        this._status = info.status;
        this._hasPassword = info.hasPassword;
        this._isPrivate = info.isPrivate;
        this._hasFriends = info.hasFriends;
        
        this.updateRoomDisplay();
    }

    /**
     * 设置房间ID
     */
    public setRoomId(id: string): void {
        this._roomId = id;
        if (this.roomIdLabel) {
            this.roomIdLabel.string = `#${id}`;
        }
    }

    /**
     * 设置房间名称
     */
    public setRoomName(name: string): void {
        this._roomName = name;
        if (this.roomNameLabel) {
            this.roomNameLabel.string = name;
        }
    }

    /**
     * 设置房间玩家数量
     */
    public setPlayerCount(current: number, max: number): void {
        this._playerCount = current;
        this._maxPlayers = max;
        
        if (this.playerCountLabel) {
            this.playerCountLabel.string = `${current}/${max}`;
        }
        
        // 如果房间满了，更新状态
        if (current >= max && this._status !== "gaming") {
            this._status = "closed";
            this.updateStatusDisplay();
        } else if (current < max && this._status === "closed") {
            this._status = "waiting";
            this.updateStatusDisplay();
        }
    }

    /**
     * 设置房间状态
     */
    public setStatus(status: SharedRoomStatus): void {
        this._status = status;
        this.updateStatusDisplay();
    }

    /**
     * 设置房间是否有密码
     */
    public setHasPassword(hasPassword: boolean): void {
        this._hasPassword = hasPassword;
        if (this.lockedIcon) {
            this.lockedIcon.active = hasPassword;
        }
    }

    /**
     * 设置房间是否为私人房间
     */
    public setIsPrivate(isPrivate: boolean): void {
        this._isPrivate = isPrivate;
        if (this.privateIcon) {
            this.privateIcon.active = isPrivate;
        }
    }

    /**
     * 设置房间是否有好友
     */
    public setHasFriends(hasFriends: boolean): void {
        this._hasFriends = hasFriends;
        if (this.friendsIcon) {
            this.friendsIcon.active = hasFriends;
        }
    }

    /**
     * 更新房间显示
     */
    private updateRoomDisplay(): void {
        if (this.roomIdLabel) {
            this.roomIdLabel.string = `#${this._roomId}`;
        }
        
        if (this.roomNameLabel) {
            this.roomNameLabel.string = this._roomName;
        }
        
        if (this.playerCountLabel) {
            this.playerCountLabel.string = `${this._playerCount}/${this._maxPlayers}`;
        }
        
        this.updateStatusDisplay();
        
        if (this.lockedIcon) {
            this.lockedIcon.active = this._hasPassword;
        }
        
        if (this.privateIcon) {
            this.privateIcon.active = this._isPrivate;
        }
        
        if (this.friendsIcon) {
            this.friendsIcon.active = this._hasFriends;
        }
    }

    /**
     * 更新状态显示
     */
    private updateStatusDisplay(): void {
        // 更新状态文本
        if (this.statusLabel) {
            switch (this._status) {
                case "waiting":
                    this.statusLabel.string = '等待中';
                    this.statusLabel.color = this.WAITING_COLOR;
                    break;
                    
                case "gaming":
                    this.statusLabel.string = '游戏中';
                    this.statusLabel.color = this.PLAYING_COLOR;
                    break;
                    
                case "closed":
                    this.statusLabel.string = '已满';
                    this.statusLabel.color = this.FULL_COLOR;
                    break;
            }
        }
        
        // 更新游戏中图标
        if (this.playingIcon) {
            this.playingIcon.active = this._status === "gaming";
        }
        
        // 更新加入按钮状态
        if (this.joinButton) {
            this.joinButton.interactable = this._status !== "closed";
        }
    }

    /**
     * 房间列表项被点击事件处理
     */
    private onRoomItemClicked(): void {
        // 播放点击反馈动画
        this.playClickFeedback();
        
        // 发出房间被点击的事件
        this.node.emit('room-item-clicked', {
            roomId: this._roomId,
            roomName: this._roomName,
            hasPassword: this._hasPassword
        });
    }

    /**
     * 加入按钮被点击事件处理
     */
    private onJoinButtonClicked(): void {
        console.log(`[RoomItem] Join button clicked for room: ${this._roomId}`); // 添加日志
        // 播放点击反馈动画
        this.playClickFeedback();

        // 发出加入房间的事件
        console.log(`[RoomItem] Emitting join-room event for room: ${this._roomId}`); // 添加日志
        this.node.emit('join-room', {
            roomId: this._roomId,
            roomName: this._roomName,
            hasPassword: this._hasPassword
        });
    }

    /**
     * 播放点击反馈动画
     */
    private playClickFeedback(): void {
        tween(this.node)
            .to(0.1, { scale: new Vec3(this._originalScale.x * 0.95, this._originalScale.y * 0.95, 1) })
            .to(0.1, { scale: this._originalScale })
            .start();
    }

    /**
     * 播放新房间动画
     */
    public playNewItemAnimation(): void {
        const originalPos = this.node.position.clone();
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        
        // 设置初始位置和透明度
        this.node.position = new Vec3(originalPos.x - 50, originalPos.y, originalPos.z);
        uiOpacity.opacity = 0;
        
        // 播放动画
        tween(this.node)
            .to(0.3, { position: originalPos })
            .start();
            
        tween(uiOpacity)
            .to(0.3, { opacity: 255 })
            .start();
    }

    /**
     * 播放高亮动画
     */
    public playHighlightAnimation(): void {
        // 记录原始颜色
        const originalColor = this.backgroundSprite?.color?.clone();
        if (!originalColor || !this.backgroundSprite) return;
        
        // 高亮色
        const highlightColor = new Color(255, 238, 196, 255);
        
        // 播放颜色变换动画
        tween(this.backgroundSprite)
            .to(0.3, { color: highlightColor })
            .to(0.3, { color: originalColor })
            .union()
            .repeat(2)
            .start();
    }

    /**
     * 播放删除动画
     */
    public playRemoveAnimation(callback?: Function): void {
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        
        tween(this.node)
            .to(0.3, { scale: new Vec3(0, this._originalScale.y, 1) })
            .start();
            
        tween(uiOpacity)
            .to(0.3, { opacity: 0 })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }
}
