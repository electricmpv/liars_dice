import { _decorator, Component, Node, Animation, Label } from 'cc';
import { Face } from '../../shared/protocols/game-types.d';

const { ccclass, property } = _decorator;

/**
 * 骰子动画控制器
 * 负责管理骰子的动画效果
 */
@ccclass('DiceAnimationController')
export class DiceAnimationController extends Component {
    @property([Node])
    private diceNodes: Node[] = [];
    
    @property([Animation])
    private diceAnimations: Animation[] = [];
    
    @property([Label])
    private diceLabels: Label[] = [];
    
    @property(Animation)
    private shakeAnimation: Animation | null = null;
    
    @property
    private animationDuration: number = 1.5;
    
    /**
     * 播放骰子动画
     * @param type 动画类型 'shake' | 'roll'
     * @param options 动画选项
     * @returns Promise
     */
    public playAnimation(type: 'shake' | 'roll', options: { values?: Face[] } | null): Promise<void> {
        switch (type) {
            case 'shake':
                return this.playShakeAnimation();
            case 'roll':
                return this.playRollAnimation(options?.values || []);
            default:
                return Promise.resolve();
        }
    }
    
    /**
     * 播放摇骰子动画
     * @returns Promise
     */
    private playShakeAnimation(): Promise<void> {
        return new Promise<void>((resolve) => {
            // 显示所有骰子
            this.diceNodes.forEach(node => {
                if (node) {
                    node.active = true;
                }
            });
            
            // 隐藏骰子点数
            this.diceLabels.forEach(label => {
                if (label) {
                    label.node.active = false;
                }
            });
            
            // 播放容器的摇动动画
            if (this.shakeAnimation) {
                this.shakeAnimation.play();
            }
            
            // 播放每个骰子的动画
            this.diceAnimations.forEach(anim => {
                if (anim) {
                    anim.play('dice_roll');
                }
            });
            
            // 动画结束后回调
            setTimeout(() => {
                resolve();
            }, this.animationDuration * 1000);
        });
    }
    
    /**
     * 播放骰子结果动画
     * @param values 骰子值
     * @returns Promise
     */
    private playRollAnimation(values: Face[]): Promise<void> {
        return new Promise<void>((resolve) => {
            // 先隐藏所有骰子
            this.diceNodes.forEach((node, index) => {
                if (node) {
                    node.active = index < values.length;
                }
            });
            
            // 显示结果
            for (let i = 0; i < values.length && i < this.diceLabels.length; i++) {
                if (this.diceLabels[i]) {
                    this.diceLabels[i].string = values[i].toString();
                    this.diceLabels[i].node.active = true;
                }
            }
            
            // 停止所有骰子动画
            this.diceAnimations.forEach(anim => {
                if (anim) {
                    anim.stop();
                }
            });
            
            // 动画结束后回调
            setTimeout(() => {
                resolve();
            }, 500); // 短暂延迟，让玩家看清骰子结果
        });
    }
    
    /**
     * 隐藏所有骰子
     */
    public hideAllDice(): void {
        this.diceNodes.forEach(node => {
            if (node) {
                node.active = false;
            }
        });
    }
    
    /**
     * 显示指定数量的骰子
     * @param count 骰子数量
     */
    public showDice(count: number): void {
        this.diceNodes.forEach((node, index) => {
            if (node) {
                node.active = index < count;
            }
        });
        
        // 隐藏骰子点数，等待摇骰子
        this.diceLabels.forEach(label => {
            if (label) {
                label.node.active = false;
            }
        });
    }
}
