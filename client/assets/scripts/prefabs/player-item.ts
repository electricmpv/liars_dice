import { _decorator, Component, Node, Label, Sprite, SpriteFrame, UITransform, Color, tween, Vec3, sys, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 玩家列表项预制体
 * 功能：
 * 1. 显示玩家头像、名称、状态
 * 2. 当前玩家/轮到玩家高亮显示
 * 3. 支持玩家状态变化动画
 */
@ccclass('PlayerItem')
export class PlayerItem extends Component {
    @property(Sprite)
    private avatar: Sprite = null!;

    @property(Label)
    private nameLabel: Label = null!;

    @property(Label)
    private statusLabel: Label = null!;

    // Removed currentPlayerIndicator property

    @property(Node)
    private readyIndicator: Node = null!;

    // Removed activeIndicator property

    @property(Node)
    private offlineIndicator: Node = null!;

    // Removed diceContainer property
    // Removed diceCountLabel property

    @property(SpriteFrame)
    private defaultAvatar: SpriteFrame = null!;

    @property([SpriteFrame])
    private aiAvatars: SpriteFrame[] = [];

    @property(Node)
    private aiIcon: Node | null = null; // 新增：用于显示 AI 图标的节点

    private _playerId: string = '';
    private _playerName: string = '';
    // Removed _isCurrentPlayer state
    // Removed _isActivePlayer state
    private _isReady: boolean = false;
    private _isOnline: boolean = true;
    private _isAI: boolean = false;
    private _aiType: number = -1;
    // Removed _diceCount state
    private _originalScale: Vec3 = new Vec3(1, 1, 1);

    // 颜色常量
    private readonly ACTIVE_COLOR: Color = new Color(255, 204, 0, 255);
    private readonly INACTIVE_COLOR: Color = new Color(255, 255, 255, 255);
    private readonly OFFLINE_COLOR: Color = new Color(150, 150, 150, 255);

    onLoad() {
        this._originalScale = this.node.scale.clone();
        this.updateIndicators();
    }

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onPlayerItemClicked, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onPlayerItemClicked, this);
    }

    /**
     * 设置玩家ID
     */
    public setPlayerId(id: string): void {
        this._playerId = id;
    }

    /**
     * 获取玩家ID
     */
    public getPlayerId(): string {
        return this._playerId;
    }

    /**
     * 设置玩家名称
     */
    public setPlayerName(name: string): void {
        this._playerName = name;
        if (this.nameLabel) {
            this.nameLabel.string = name;
        }
    }

    /**
     * 获取玩家名称
     */
    public getPlayerName(): string {
        return this._playerName;
    }

    /**
     * 设置玩家头像
     */
    public setAvatar(spriteFrame: SpriteFrame): void {
        if (this.avatar && spriteFrame) {
            this.avatar.spriteFrame = spriteFrame;
        }
    }

    /**
     * 设置是否为AI玩家
     */
    public setIsAI(isAI: boolean, aiType: number = 0): void {
        this._isAI = isAI;
        this._aiType = aiType;
        
        // 如果是AI，设置AI头像
        if (isAI && this.aiAvatars && this.aiAvatars.length > 0) {
            const avatarIndex = aiType % this.aiAvatars.length;
            this.setAvatar(this.aiAvatars[avatarIndex]);
        } else if (this.defaultAvatar) {
            // 否则设置默认头像
            this.setAvatar(this.defaultAvatar);
        }

        // 控制 AI 图标的显隐
        if (this.aiIcon) {
            this.aiIcon.active = isAI;
        }
        
        this.updateStatusLabel();
    }

    // Removed setIsCurrentPlayer method

    // Removed setIsActivePlayer method

    /**
     * 设置玩家准备状态
     */
    public setIsReady(isReady: boolean): void {
        // 如果状态发生变化
        if (this._isReady !== isReady) {
            if (isReady) {
                this.playReadyAnimation();
            }
        }
        
        this._isReady = isReady;
        this.updateIndicators();
        this.updateStatusLabel();
    }

    /**
     * 设置玩家在线状态
     */
    public setIsOnline(isOnline: boolean): void {
        // 如果状态从在线变为离线
        if (this._isOnline && !isOnline) {
            this.playOfflineAnimation();
        } else if (!this._isOnline && isOnline) {
            // 如果状态从离线变为在线
            this.playOnlineAnimation();
        }
        
        this._isOnline = isOnline;
        this.updateIndicators();
        this.updateStatusLabel();
    }

    // Removed setDiceCount method

    /**
     * 更新状态标签
     */
    private updateStatusLabel(): void {
        if (!this.statusLabel) return;
        
        if (!this._isOnline) {
            this.statusLabel.string = '离线';
            this.statusLabel.color = this.OFFLINE_COLOR;
        } else if (this._isAI) {
            this.statusLabel.string = 'AI玩家';
            this.statusLabel.color = new Color(66, 133, 244, 255);
        } else if (this._isReady) {
            this.statusLabel.string = '已准备';
            this.statusLabel.color = new Color(76, 217, 100, 255);
        } else {
            this.statusLabel.string = '未准备';
            this.statusLabel.color = new Color(255, 59, 48, 255);
        }
    }

    /**
     * 更新指示器状态
     */
    private updateIndicators(): void {
        // 当前玩家指示器 (Removed)
        // if (this.currentPlayerIndicator) {
        //     this.currentPlayerIndicator.active = this._isCurrentPlayer;
        // }

        // 准备指示器
        if (this.readyIndicator) {
            this.readyIndicator.active = this._isReady && this._isOnline;
        }

        // 活跃玩家指示器 (Removed)
        // if (this.activeIndicator) {
        //     this.activeIndicator.active = this._isActivePlayer && this._isOnline;
        // }

        // 离线指示器
        if (this.offlineIndicator) {
            this.offlineIndicator.active = !this._isOnline;
        }
        
        // 更新颜色
        if (this.avatar) {
            if (!this._isOnline) {
                this.avatar.color = this.OFFLINE_COLOR;
            // Removed active player color logic
            // } else if (this._isActivePlayer) {
            //     this.avatar.color = this.ACTIVE_COLOR;
            } else {
                this.avatar.color = this.INACTIVE_COLOR;
            }
        }
    }

    /**
     * 玩家项被点击的事件处理
     */
    private onPlayerItemClicked(): void {
        // 播放点击反馈动画
        this.playClickFeedback();
        
        // 发出玩家被点击的事件
        this.node.emit('player-clicked', {
            playerId: this._playerId,
            playerName: this._playerName,
            isAI: this._isAI
            // Removed isCurrentPlayer from event data
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
     * 播放激活动画（轮到该玩家操作） (Removed)
     */
    // private playActivateAnimation(): void { ... }

    /**
     * 播放准备动画
     */
    private playReadyAnimation(): void {
        if (!this._isOnline) return;
        
        // 显示准备指示器
        if (this.readyIndicator) {
            this.readyIndicator.active = true;
            this.readyIndicator.scale = new Vec3(0, 0, 1);
            
            // 缩放动画
            tween(this.readyIndicator)
                .to(0.3, { 
                    scale: new Vec3(1.2, 1.2, 1)
                })
                .to(0.2, { 
                    scale: new Vec3(1, 1, 1)
                })
                .start();
        }
    }

    /**
     * 播放离线动画
     */
    private playOfflineAnimation(): void {
        // 灰度动画
        if (this.avatar) {
            tween(this.avatar)
                .to(0.5, { 
                    color: this.OFFLINE_COLOR
                })
                .start();
        }
        
        // 显示离线指示器
        if (this.offlineIndicator) {
            this.offlineIndicator.active = true;
            const uiOpacity = this.offlineIndicator.getComponent(UIOpacity) || this.offlineIndicator.addComponent(UIOpacity);
            uiOpacity.opacity = 0;
            
            tween(uiOpacity)
                .to(0.5, { 
                    opacity: 255
                })
                .start();
        }
    }

    /**
     * 播放上线动画
     */
    private playOnlineAnimation(): void {
        // 恢复颜色
        if (this.avatar) {
            tween(this.avatar)
                .to(0.5, {
                    // Removed active player color logic
                    color: this.INACTIVE_COLOR
                })
                .start();
        }

        // 隐藏离线指示器
        if (this.offlineIndicator) {
            const uiOpacity = this.offlineIndicator.getComponent(UIOpacity) || this.offlineIndicator.addComponent(UIOpacity);
            
            tween(uiOpacity)
                .to(0.5, { 
                    opacity: 0
                })
                .call(() => {
                    this.offlineIndicator.active = false;
                })
                .start();
        }
    }

    /**
     * 播放骰子减少动画 (Removed)
     */
    // private playDiceReduceAnimation(count: number): void { ... }
}
