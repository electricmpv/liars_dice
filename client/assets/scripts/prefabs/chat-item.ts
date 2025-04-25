import { _decorator, Component, Node, Label, Sprite, RichText, Color, UITransform, tween, Vec3, Widget, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 聊天消息预制体
 * 功能：
 * 1. 支持不同类型消息（玩家消息、系统消息、公告等）
 * 2. 显示发送者头像、名称、消息内容和时间
 * 3. 支持消息动画效果
 * 4. 适配不同长度的消息内容
 */

// 消息类型枚举
enum MessageType {
    SELF,       // 自己发送的消息
    OTHER,      // 其他玩家发送的消息
    SYSTEM,     // 系统消息
    GAME,       // 游戏消息
    NOTICE      // 公告信息
}

@ccclass('ChatItem')
export class ChatItem extends Component {
    @property(Node)
    private selfMessageNode: Node = null!;

    @property(Node)
    private otherMessageNode: Node = null!;

    @property(Node)
    private systemMessageNode: Node = null!;

    @property(Sprite)
    private avatarSprite: Sprite = null!;

    @property(Label)
    private senderNameLabel: Label = null!;

    @property(RichText)
    private messageText: RichText = null!;

    @property(Label)
    private timeLabel: Label = null!;

    @property(Node)
    private messageContainer: Node = null!;

    // 消息数据
    private _messageData = {
        id: '',
        type: MessageType.OTHER,
        senderId: '',
        senderName: '',
        content: '',
        timestamp: 0,
        isRead: false
    };

    private _originalScale: Vec3 = new Vec3(1, 1, 1);

    // 颜色常量
    private readonly SELF_MSG_COLOR = new Color(220, 248, 198, 255);  // 浅绿色
    private readonly OTHER_MSG_COLOR = new Color(255, 255, 255, 255); // 白色
    private readonly SYSTEM_MSG_COLOR = new Color(200, 200, 200, 255); // 浅灰色
    private readonly GAME_MSG_COLOR = new Color(255, 236, 217, 255);  // 浅黄色
    private readonly NOTICE_MSG_COLOR = new Color(217, 237, 255, 255); // 浅蓝色

    onLoad() {
        this._originalScale = this.node.scale.clone();
    }

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onChatItemClicked, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onChatItemClicked, this);
    }

    /**
     * 设置消息数据
     */
    public setMessageData(data: {
        id: string,
        type: MessageType,
        senderId: string,
        senderName: string,
        content: string,
        timestamp: number,
        isRead?: boolean
    }): void {
        this._messageData = {
            ...data,
            isRead: data.isRead !== undefined ? data.isRead : false
        };
        
        this.updateMessageDisplay();
    }

    /**
     * 获取消息ID
     */
    public getMessageId(): string {
        return this._messageData.id;
    }

    /**
     * 获取发送者ID
     */
    public getSenderId(): string {
        return this._messageData.senderId;
    }

    /**
     * 设置消息类型
     */
    public setMessageType(type: MessageType): void {
        this._messageData.type = type;
        this.updateMessageNodeVisibility();
        this.updateMessageColor();
    }

    /**
     * 设置消息内容
     */
    public setMessageContent(content: string): void {
        this._messageData.content = content;
        if (this.messageText) {
            this.messageText.string = this.formatMessageContent(content);
        }
        this.updateMessageSize();
    }

    /**
     * 设置发送者名称
     */
    public setSenderName(name: string): void {
        this._messageData.senderName = name;
        if (this.senderNameLabel) {
            this.senderNameLabel.string = name;
        }
    }

    /**
     * 设置消息时间
     * @param timestamp 时间戳
     */
    public setMessageTime(timestamp: number): void {
        this._messageData.timestamp = timestamp;
        if (this.timeLabel) {
            this.timeLabel.string = this.formatTime(timestamp);
        }
    }

    /**
     * 设置消息已读状态
     */
    public setIsRead(isRead: boolean): void {
        this._messageData.isRead = isRead;
    }

    /**
     * 设置发送者头像
     */
    public setAvatar(spriteFrame: any): void {
        if (this.avatarSprite && spriteFrame) {
            this.avatarSprite.spriteFrame = spriteFrame;
        }
    }

    /**
     * 更新消息显示
     */
    private updateMessageDisplay(): void {
        this.updateMessageNodeVisibility();
        
        if (this.senderNameLabel) {
            this.senderNameLabel.string = this._messageData.senderName;
        }
        
        if (this.messageText) {
            this.messageText.string = this.formatMessageContent(this._messageData.content);
        }
        
        if (this.timeLabel) {
            this.timeLabel.string = this.formatTime(this._messageData.timestamp);
        }
        
        this.updateMessageColor();
        this.updateMessageSize();
    }

    /**
     * 更新消息节点可见性
     */
    private updateMessageNodeVisibility(): void {
        if (this.selfMessageNode) {
            this.selfMessageNode.active = this._messageData.type === MessageType.SELF;
        }
        
        if (this.otherMessageNode) {
            this.otherMessageNode.active = this._messageData.type === MessageType.OTHER;
        }
        
        if (this.systemMessageNode) {
            this.systemMessageNode.active = this._messageData.type === MessageType.SYSTEM 
                                         || this._messageData.type === MessageType.GAME
                                         || this._messageData.type === MessageType.NOTICE;
        }
    }

    /**
     * 更新消息颜色
     */
    private updateMessageColor(): void {
        if (!this.messageContainer) return;
        
        const sprite = this.messageContainer.getComponent(Sprite);
        if (!sprite) return;
        
        // 根据消息类型设置不同颜色
        switch (this._messageData.type) {
            case MessageType.SELF:
                sprite.color = this.SELF_MSG_COLOR;
                break;
                
            case MessageType.OTHER:
                sprite.color = this.OTHER_MSG_COLOR;
                break;
                
            case MessageType.SYSTEM:
                sprite.color = this.SYSTEM_MSG_COLOR;
                break;
                
            case MessageType.GAME:
                sprite.color = this.GAME_MSG_COLOR;
                break;
                
            case MessageType.NOTICE:
                sprite.color = this.NOTICE_MSG_COLOR;
                break;
        }
    }

    /**
     * 根据内容更新消息大小
     */
    private updateMessageSize(): void {
        if (!this.messageText || !this.messageContainer) return;
        
        // 获取富文本内容大小
        const textSize = this.messageText.node.getComponent(UITransform)?.contentSize;
        if (!textSize) return;
        
        // 设置消息容器的最小宽度和高度（考虑内边距）
        const padding = 20; // 左右内边距
        const minWidth = 60; // 最小宽度
        const maxWidth = 240; // 最大宽度（避免消息过宽）
        
        // 根据文本大小调整容器宽度，并确保在最小和最大宽度之间
        let newWidth = Math.max(minWidth, textSize.width + padding * 2);
        newWidth = Math.min(newWidth, maxWidth);
        
        // 更新容器大小
        const containerTransform = this.messageContainer.getComponent(UITransform);
        if (containerTransform) {
            containerTransform.width = newWidth;
            
            // 强制重新布局
            const widget = this.messageContainer.getComponent(Widget);
            if (widget) {
                widget.updateAlignment();
            }
        }
    }

    /**
     * 格式化消息内容
     * @param content 原始消息内容
     * @returns 格式化后的富文本内容
     */
    private formatMessageContent(content: string): string {
        // 处理表情符号
        content = content.replace(/:([\w]+):/g, (match, p1) => {
            return `<img src="emoji_${p1}" width=24 height=24 />`;
        });
        
        // 处理URL链接
        content = content.replace(/(https?:\/\/[^\s]+)/g, (url) => {
            return `<color=#0000ff><u>${url}</u></color>`;
        });
        
        return content;
    }

    /**
     * 格式化时间
     * @param timestamp 时间戳（毫秒）
     * @returns 格式化的时间字符串
     */
    private formatTime(timestamp: number): string {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const now = new Date();
        
        // 如果是今天的消息，只显示时间
        if (date.toDateString() === now.toDateString()) {
            return this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
        }
        
        // 如果是昨天的消息
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return '昨天 ' + this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
        }
        
        // 如果是今年的消息
        if (date.getFullYear() === now.getFullYear()) {
            return (date.getMonth() + 1) + '月' + date.getDate() + '日 ' 
                 + this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
        }
        
        // 其他情况显示完整日期
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' 
             + this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
    }

    /**
     * 数字补零
     */
    private padZero(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }

    /**
     * 消息项被点击的事件处理
     */
    private onChatItemClicked(): void {
        // 播放点击反馈动画
        this.playClickFeedback();
        
        // 发出消息被点击的事件
        this.node.emit('chat-item-clicked', {
            messageId: this._messageData.id,
            senderId: this._messageData.senderId,
            senderName: this._messageData.senderName,
            content: this._messageData.content
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
     * 播放新消息动画（从下方滑入）
     */
    public playNewMessageAnimation(): void {
        const originalPos = this.node.position.clone();
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        
        // 设置初始位置在下方
        this.node.position = new Vec3(originalPos.x, originalPos.y - 50, originalPos.z);
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
     * 播放消息高亮动画（用于提醒用户查看）
     */
    public playHighlightAnimation(): void {
        const originalColor = this.messageContainer?.getComponent(Sprite)?.color.clone();
        if (!originalColor || !this.messageContainer) return;
        
        // 高亮色
        const highlightColor = new Color(255, 242, 204, 255);
        
        const sprite = this.messageContainer.getComponent(Sprite);
        if (!sprite) return;
        
        // 播放颜色变换动画
        tween(sprite)
            .to(0.3, { color: highlightColor })
            .to(0.3, { color: originalColor })
            .union()
            .repeat(2)
            .start();
    }

    /**
     * 播放删除动画（消息被撤回）
     * @param callback 动画完成后回调
     */
    public playRemoveAnimation(callback?: Function): void {
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        
        tween(this.node)
            .to(0.3, { scale: new Vec3(0.5, 0.5, 1) })
            .start();
            
        tween(uiOpacity)
            .to(0.3, { opacity: 0 })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }
}
