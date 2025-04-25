import { _decorator, Component, Node, Prefab, instantiate, Sprite, Label, Color, resources, SpriteFrame } from 'cc';
import { Face } from '../../../../shared/protocols/game-types.d';

const { ccclass, property } = _decorator;

/**
 * 骰子显示控制器
 * 负责显示玩家的骰子
 */
@ccclass('DiceDisplayController')
export class DiceDisplayController extends Component {
    @property(Node)
    private dicesContainer: Node | null = null;

    @property(Prefab)
    private diceSpritePrefab: Prefab | null = null;

    /**
     * 显示骰子
     * @param dices 骰子数组
     */
    public displayDices(dices: Face[]): void {
        console.log("[DiceDisplayController] displayDices called. Dices:", JSON.stringify(dices));
        if (!this.diceSpritePrefab) {
            console.error("[DiceDisplayController] Dice sprite prefab is not set!");
            return;
        }
        if (!this.dicesContainer) {
            console.warn("[DiceDisplayController] Dice container is not set.");
            return;
        }

        this.dicesContainer.removeAllChildren();

        dices.forEach(faceValue => {
            const diceNode = instantiate(this.diceSpritePrefab);
            if (!diceNode || !(diceNode instanceof Node)) {
                console.error(`[DiceDisplayController] Failed to instantiate dice prefab for value: ${faceValue}`);
                return;
            }

            let sprite = diceNode.getComponent(Sprite);
            if (sprite) {
                const dirPath = 'textures/dice';
                const spriteFrameName = `dice_${faceValue}`;
                resources.loadDir(dirPath, SpriteFrame, (err, spriteFrames) => {
                    if (!diceNode || !diceNode.isValid || !sprite || !sprite.isValid) return;
                    if (err) {
                        console.error(`[DiceDisplayController] Failed to load dice directory: ${dirPath}`, err);
                        sprite.spriteFrame = null; return;
                    }
                    const spriteFrame = spriteFrames.find(sf => sf.name === spriteFrameName);
                    if (!spriteFrame) {
                        console.warn(`[DiceDisplayController] SpriteFrame '${spriteFrameName}' not found in '${dirPath}'`);
                        sprite.spriteFrame = null; return;
                    }
                    sprite.spriteFrame = spriteFrame;
                });
            } else {
                console.warn(`[DiceDisplayController] Dice prefab is missing Sprite component.`);
                let label = diceNode.getComponent(Label) || diceNode.addComponent(Label);
                label.string = `${faceValue}`;
                label.color = Color.BLACK;
                label.fontSize = 20;
                label.horizontalAlign = Label.HorizontalAlign.CENTER;
                label.verticalAlign = Label.VerticalAlign.CENTER;
            }

            if (this.dicesContainer && diceNode.isValid) {
                this.dicesContainer.addChild(diceNode);
            } else if (diceNode && !diceNode.isValid) {
                diceNode.destroy();
            }
        });
    }

    /**
     * 清空骰子显示
     */
    public clearDices(): void {
        if (this.dicesContainer) {
            this.dicesContainer.removeAllChildren();
        }
    }
}
