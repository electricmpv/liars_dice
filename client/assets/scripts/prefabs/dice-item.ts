import { _decorator, Component, Node, Label, Sprite, Animation, SpriteFrame, math, tween, Vec3, UITransform, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 骰子预制体组件
 * 功能：
 * 1. 显示骰子点数
 * 2. 骰子摇动动画
 * 3. 骰子选中/未选中状态
 */
@ccclass('DiceItem')
export class DiceItem extends Component {
    @property(Sprite)
    private background: Sprite = null!;

    @property(Label)
    private valueLabel: Label = null!;

    @property(Node)
    private highlightNode: Node = null!;

    @property(Animation)
    private animation: Animation = null!;

    @property([SpriteFrame])
    private diceFaces: SpriteFrame[] = [];

    @property(Sprite)
    private faceSprite: Sprite = null!;

    private _value: number = 1;
    private _isSelected: boolean = false;
    private _isRolling: boolean = false;
    private _originalScale: Vec3 = new Vec3(1, 1, 1);
    private _originalPosition: Vec3 = new Vec3(0, 0, 0);
    
    // 颜色常量
    private readonly NORMAL_COLOR: Color = new Color(255, 255, 255, 255);
    private readonly SELECTED_COLOR: Color = new Color(255, 204, 0, 255);
    private readonly HIGHLIGHT_COLOR: Color = new Color(66, 133, 244, 255);

    onLoad() {
        this._originalScale = this.node.scale.clone();
        this._originalPosition = this.node.position.clone();
        this.highlightNode.active = false;
    }

    start() {
        // 注册点击事件
        this.node.on(Node.EventType.TOUCH_END, this.onDiceClicked, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onDiceClicked, this);
    }

    /**
     * 设置骰子的值
     * @param value 骰子点数 (1-6)
     */
    public setValue(value: number): void {
        if (value < 1 || value > 6) {
            console.error('骰子值必须在1到6之间');
            return;
        }

        this._value = value;
        this.updateDisplay();
    }

    /**
     * 获取骰子当前值
     */
    public getValue(): number {
        return this._value;
    }

    /**
     * 设置骰子选中状态
     * @param selected 是否选中
     */
    public setSelected(selected: boolean): void {
        this._isSelected = selected;
        this.updateDisplay();
    }

    /**
     * 获取骰子当前选中状态
     */
    public isSelected(): boolean {
        return this._isSelected;
    }

    /**
     * 更新骰子显示
     */
    private updateDisplay(): void {
        // 更新骰子面显示
        if (this.diceFaces && this.diceFaces.length >= 6) {
            this.faceSprite.spriteFrame = this.diceFaces[this._value - 1];
        }

        // 更新数字标签
        if (this.valueLabel) {
            this.valueLabel.string = this._value.toString();
        }

        // 更新选中状态
        if (this.highlightNode) {
            this.highlightNode.active = this._isSelected;
        }

        // 更新颜色
        if (this.background) {
            this.background.color = this._isSelected ? this.SELECTED_COLOR : this.NORMAL_COLOR;
        }
    }

    /**
     * 骰子点击事件处理
     */
    private onDiceClicked(): void {
        if (this._isRolling) return;
        
        // 切换选中状态
        this._isSelected = !this._isSelected;
        this.updateDisplay();
        
        // 播放点击反馈动画
        this.playClickFeedback();
        
        // 触发选中事件
        this.node.emit('dice-selected', {
            diceId: this.node.uuid,
            value: this._value,
            selected: this._isSelected
        });
    }

    /**
     * 播放点击反馈动画
     */
    private playClickFeedback(): void {
        // 缩放动画
        tween(this.node)
            .to(0.1, { scale: new Vec3(this._originalScale.x * 0.9, this._originalScale.y * 0.9, 1) })
            .to(0.1, { scale: this._originalScale })
            .start();
    }

    /**
     * 播放骰子摇动动画
     * @param duration 动画持续时间
     * @param callback 动画结束回调
     */
    public playRollAnimation(duration: number = 1.0, callback?: Function): void {
        if (this._isRolling) return;
        
        this._isRolling = true;
        
        // 保存原始状态
        const originalValue = this._value;
        const originalSelected = this._isSelected;
        
        // 重置选中状态
        this.setSelected(false);
        
        // 创建摇动动画序列
        const rollSequence = () => {
            const shakeOffset = 8;
            const shakeTime = 0.05;
            const shakeCount = Math.floor(duration / shakeTime / 2);
            
            const shakeTween = tween(this.node);
            
            // 添加多次摇动
            for (let i = 0; i < shakeCount; i++) {
                // 随机方向摇动
                const xOffset = (Math.random() - 0.5) * 2 * shakeOffset;
                const yOffset = (Math.random() - 0.5) * 2 * shakeOffset;
                
                shakeTween.to(shakeTime, { 
                    position: new Vec3(
                        this._originalPosition.x + xOffset, 
                        this._originalPosition.y + yOffset, 
                        this._originalPosition.z
                    )
                });
                
                // 随机骰子值
                shakeTween.call(() => {
                    const randomValue = Math.floor(Math.random() * 6) + 1;
                    this.setValue(randomValue);
                });
            }
            
            // 回到原始位置
            shakeTween.to(shakeTime, { position: this._originalPosition });
            
            return shakeTween;
        };
        
        // 执行动画
        tween(this.node)
            .to(0.15, { scale: new Vec3(this._originalScale.x * 1.2, this._originalScale.y * 1.2, 1) })
            .to(0.15, { scale: this._originalScale })
            .then(rollSequence())
            .call(() => {
                this._isRolling = false;
                
                // 如果有提供回调，则调用
                if (callback) {
                    callback(this._value);
                }
            })
            .start();
    }

    /**
     * 设置最终骰子值并播放动画
     * @param finalValue 最终的骰子值 (1-6)
     * @param duration 动画持续时间
     * @param callback 动画结束回调
     */
    public rollToValue(finalValue: number, duration: number = 1.0, callback?: Function): void {
        if (finalValue < 1 || finalValue > 6) {
            console.error('骰子值必须在1到6之间');
            return;
        }
        
        this.playRollAnimation(duration, () => {
            this.setValue(finalValue);
            if (callback) {
                callback(finalValue);
            }
        });
    }

    /**
     * 播放高亮动画
     * @param duration 高亮持续时间
     */
    public playHighlightAnimation(duration: number = 0.5): void {
        // 显示高亮节点
        this.highlightNode.active = true;
        
        // 创建呼吸效果
        tween(this.highlightNode)
            .to(duration / 2, { scale: new Vec3(1.2, 1.2, 1) })
            .to(duration / 2, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeat(3)
            .call(() => {
                // 结束后设置为当前选中状态
                this.highlightNode.active = this._isSelected;
            })
            .start();
    }
}
