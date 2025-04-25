import { _decorator, Component, Label, Button, Color, Event, Node } from 'cc'; // Import Event and Node (Remove EventCustom)

const { ccclass, property } = _decorator;

@ccclass('CountListItem')
export class CountListItem extends Component {
    @property(Label)
    label: Label | null = null;

    // 添加一个属性来关联 Button 组件
    @property(Button)
    buttonComponent: Button | null = null;

    private _count: number = 0;
    private _handlerTarget: Component | null = null; // Store the target component

    /** Public getter for the count value */
    public get countValue(): number {
        return this._count;
    }

    /**
     * 初始化列表项
     * @param count 该项代表的数量
     * @param handlerTarget 接收 'count-selected' 事件的目标组件 (e.g., BidController)
     */
    setup(count: number, handlerTarget: Component) {
        this._count = count;
        this._handlerTarget = handlerTarget; // Store the target
        if (this.label) {
            this.label.string = count.toString();
        }

        // 使用关联的 buttonComponent 属性
        if (this.buttonComponent) {
             // 清除旧的监听器 (更安全地针对特定节点)
             this.buttonComponent.node.off(Button.EventType.CLICK, this.onClick, this);
             // 不建议在代码中清除编辑器事件 (button.clickEvents = [])
             // 请依赖在编辑器中手动移除错误配置

             // 直接用 node.on 添加监听器
             this.buttonComponent.node.on(Button.EventType.CLICK, this.onClick, this);
        } else {
            // 更新警告信息
            console.warn(`[CountListItem] Button component property 'buttonComponent' not linked in the editor for node of count ${this._count}`);
        }
    }

    /**
     * 处理按钮点击事件
     */
    onClick() {
        // 在发射事件前检查按钮是否可交互
        if (this.buttonComponent && !this.buttonComponent.interactable) {
            console.log(`[CountListItem] onClick ignored: Button not interactable for count ${this._count}`);
            return;
        }
        console.log(`[CountListItem] onClick: Calling handler on target for count: ${this._count} from node: ${this.node.name}`);
        console.log(`[CountListItem] Handler target: ${this._handlerTarget?.name}, Target valid: ${this._handlerTarget?.isValid}`); // Log target info

        // Check if the target and method exist
        const handlerExists = this._handlerTarget && typeof (this._handlerTarget as any).handleCountSelection === 'function';
        console.log(`[CountListItem] handleCountSelection exists on target: ${handlerExists}`);

        if (handlerExists) {
             try {
                 (this._handlerTarget as any).handleCountSelection({
                     count: this._count,
                     node: this.node
                 });
                 console.log(`[CountListItem] handleCountSelection called successfully.`);
             } catch (error) {
                 console.error(`[CountListItem] Error calling handleCountSelection:`, error);
             }
        } else {
            console.error(`[CountListItem] Handler target or handleCountSelection method not found for count ${this._count}`);
        }
    }

    /**
     * 设置按钮的可交互状态和视觉效果
     * @param interactable 是否可交互
     */
    setInteractable(interactable: boolean) {
        // 使用关联的 buttonComponent 属性
        if (this.buttonComponent) {
            this.buttonComponent.interactable = interactable;
        }
         if (this.label) {
             // 根据可交互状态改变标签颜色（示例）
             this.label.color = interactable ? Color.WHITE : Color.GRAY;
         }
    }
}
