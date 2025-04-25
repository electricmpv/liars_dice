import { _decorator, Component, Node, Label, Sprite, Color, tween, Vec3, UIOpacity, SpriteFrame, Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 系统通知预制体
 * 功能：
 * 1. 显示系统通知内容和图标
 * 2. 支持不同类型通知显示（信息、警告、错误）
 * 3. 支持自动隐藏和动画效果
 * 4. 支持持久化通知（需要用户确认）
 */

// 通知类型
enum NoticeType {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success'
}

@ccclass('SystemNotice')
export class SystemNotice extends Component {
    @property(Label)
    content: Label = null!;
    
    @property(Sprite)
    icon: Sprite = null!;
    
    @property(Node)
    background: Node = null!;

    @property([SpriteFrame])
    iconFrames: SpriteFrame[] = [];

    @property
    private autoHideDuration: number = 3; // 自动隐藏的时间（秒）

    @property(Button)
    confirmButton: Button = null!; // 确认按钮

    @property(Label)
    confirmButtonLabel: Label = null!; // 确认按钮文本

    @property(Node)
    persistentDecoration: Node = null!; // 持久化通知的装饰（边框等）

    @property
    persistent: boolean = false; // 是否为持久化通知（需要用户确认）

    // 颜色常量
    private readonly INFO_COLOR: Color = new Color(42, 130, 228, 255); // 蓝色
    private readonly WARNING_COLOR: Color = new Color(245, 166, 35, 255); // 橙色
    private readonly ERROR_COLOR: Color = new Color(231, 76, 60, 255); // 红色
    private readonly SUCCESS_COLOR: Color = new Color(46, 204, 113, 255); // 绿色
    
    private _hideTimeout: any = null;
    private _originalPosition: Vec3 = new Vec3();
    private _isVisible: boolean = false;
    private _noticeId: string = ''; // 通知唯一ID
    private _noticeData: any = null; // 通知携带的数据

    onLoad() {
        // 初始隐藏
        this._originalPosition = this.node.position.clone();
        this.node.active = false;

        // 注册确认按钮事件
        if (this.confirmButton) {
            this.confirmButton.node.on('click', this.onConfirmButtonClicked, this);
        }
    }

    onDestroy() {
        // 清除可能存在的定时器
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
        }

        // 移除事件监听，并检查节点有效性
        if (this.confirmButton && this.confirmButton.isValid && this.confirmButton.node && this.confirmButton.node.isValid) {
            this.confirmButton.node.off('click', this.onConfirmButtonClicked, this);
        }
    }

    /**
     * 设置通知ID
     */
    public setNoticeId(id: string): void {
        this._noticeId = id;
    }

    /**
     * 获取通知ID
     */
    public getNoticeId(): string {
        return this._noticeId;
    }

    /**
     * 设置通知数据
     */
    public setNoticeData(data: any): void {
        this._noticeData = data;
    }

    /**
     * 获取通知数据
     */
    public getNoticeData(): any {
        return this._noticeData;
    }

    /**
     * 显示系统通知
     * @param text 通知内容
     * @param type 通知类型
     * @param duration 显示时长（秒），设为0则不自动隐藏
     * @param isPersistent 是否为持久化通知（需要用户确认）
     * @param confirmText 确认按钮文本
     * @param noticeId 通知唯一ID
     * @param noticeData 通知携带的数据
     */
    public show(
        text: string, 
        type: 'info' | 'warning' | 'error' | 'success' = 'info', 
        duration?: number,
        isPersistent: boolean = false,
        confirmText: string = '确认',
        noticeId: string = '',
        noticeData: any = null
    ): void {
        // 如果已经在显示，先隐藏当前的
        if (this._isVisible) {
            this.hideImmediately();
        }
        
        // 设置通知ID和数据
        this._noticeId = noticeId;
        this._noticeData = noticeData;

        // 设置持久化状态
        this.persistent = isPersistent;
        
        // 设置内容
        if (this.content) {
            this.content.string = text;
        }
        
        // 设置图标
        if (this.icon && this.iconFrames.length > 0) {
            let iconIndex = 0;
            switch (type) {
                case NoticeType.INFO:
                    iconIndex = 0;
                    break;
                case NoticeType.WARNING:
                    iconIndex = 1;
                    break;
                case NoticeType.ERROR:
                    iconIndex = 2;
                    break;
                case NoticeType.SUCCESS:
                    iconIndex = 3;
                    break;
            }
            
            // 确保索引在有效范围内
            if (iconIndex < this.iconFrames.length) {
                this.icon.spriteFrame = this.iconFrames[iconIndex];
            }
        }
        
        // 设置背景颜色
        const bgSprite = this.background?.getComponent(Sprite);
        if (bgSprite) {
            switch (type) {
                case NoticeType.INFO:
                    bgSprite.color = this.INFO_COLOR;
                    break;
                case NoticeType.WARNING:
                    bgSprite.color = this.WARNING_COLOR;
                    break;
                case NoticeType.ERROR:
                    bgSprite.color = this.ERROR_COLOR;
                    break;
                case NoticeType.SUCCESS:
                    bgSprite.color = this.SUCCESS_COLOR;
                    break;
            }
        }

        // 配置确认按钮
        if (this.confirmButton) {
            this.confirmButton.node.active = this.persistent;
            
            if (this.confirmButtonLabel && this.persistent) {
                this.confirmButtonLabel.string = confirmText;
            }
        }

        // 设置持久化装饰
        if (this.persistentDecoration) {
            this.persistentDecoration.active = this.persistent;
        }
        
        // 显示通知
        this.node.active = true;
        this._isVisible = true;
        
        // 播放显示动画
        this.playShowAnimation();
        
        // 设置自动隐藏（仅非持久化通知）
        if (!this.persistent) {
            const hideTime = duration !== undefined ? duration : this.autoHideDuration;
            if (hideTime > 0) {
                // 清除可能存在的旧定时器
                if (this._hideTimeout) {
                    clearTimeout(this._hideTimeout);
                }
                
                // 设置新的定时器
                this._hideTimeout = setTimeout(() => {
                    // 在定时器回调中检查节点是否仍然有效
                    if (this.node && this.node.isValid) {
                        this.hide();
                    }
                    this._hideTimeout = null; // 无论如何都清除 timeout 引用
                }, hideTime * 1000);
            }
        }
    }

    /**
     * 确认按钮点击处理
     */
    private onConfirmButtonClicked(): void {
        // 发送确认事件
        this.node.emit('notice-confirmed', {
            noticeId: this._noticeId,
            noticeData: this._noticeData
        });
        
        // 隐藏通知
        this.hide();
    }

    /**
     * 隐藏通知（带动画）
     */
    public hide(): void {
        if (!this._isVisible) return;
        
        this.playHideAnimation();
    }

    /**
     * 立即隐藏通知（无动画）
     */
    public hideImmediately(): void {
        if (!this._isVisible) return;
        
        this._isVisible = false;
        this.node.active = false;
        
        // 重置位置
        this.node.position = this._originalPosition.clone();
        
        // 清除可能存在的定时器
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
        }
    }

    /**
     * 播放显示动画
     */
    private playShowAnimation(): void {
        // 重置位置和透明度
        this.node.position = new Vec3(this._originalPosition.x, this._originalPosition.y - 50, this._originalPosition.z);
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        uiOpacity.opacity = 0;
        
        // 从下方滑入并淡入
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
        // 在动画开始前检查节点有效性
        if (!this.node || !this.node.isValid) {
            console.warn('[SystemNotice] playHideAnimation called on an invalid node.');
            return;
        }

        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        
        // 向上滑出并淡出
        tween(this.node) // 此时 node 保证有效
            .to(0.3, { position: new Vec3(this._originalPosition.x, this._originalPosition.y + 50, this._originalPosition.z) })
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
