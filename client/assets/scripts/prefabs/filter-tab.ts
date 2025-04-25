import { _decorator, Component, Node, Label, Button, Color, tween, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 过滤标签预制体
 * 功能：
 * 1. 显示标签名称
 * 2. 支持选中状态显示
 * 3. 点击切换选中状态
 * 4. 支持动画效果
 * 5. 支持标签分组管理
 */
@ccclass('FilterTab')
export class FilterTab extends Component {
    @property(Label)
    tabName: Label = null!;
    
    @property(Node)
    indicator: Node = null!;
    
    @property(Button)
    button: Button = null!;

    @property
    groupId: string = "default";  // 标签所属分组ID
    
    @property
    tabIndex: number = 0;  // 标签在组内的索引

    private _isSelected: boolean = false;
    private _tabId: string = '';
    private _originalScale: Vec3 = new Vec3(1, 1, 1);
    private _groupManager: any = null; // 标签组管理器引用

    // 颜色常量
    private readonly SELECTED_COLOR: Color = new Color(255, 204, 0, 255); // 选中时标签颜色（金色）
    private readonly NORMAL_COLOR: Color = new Color(255, 255, 255, 255); // 未选中时标签颜色（白色）

    onLoad() {
        this._originalScale = this.node.scale.clone();
        
        // 初始状态
        this.updateAppearance();
    }

    start() {
        // 注册点击事件
        if (this.button) {
            this.button.node.on('click', this.onTabClicked, this);
        } else {
            this.node.on(Node.EventType.TOUCH_END, this.onTabClicked, this);
        }
    }

    onDestroy() {
        // 移除事件监听
        if (this.button) {
            this.button.node.off('click', this.onTabClicked, this);
        } else {
            this.node.off(Node.EventType.TOUCH_END, this.onTabClicked, this);
        }
    }

    /**
     * 设置标签ID
     */
    public setTabId(id: string): void {
        this._tabId = id;
    }

    /**
     * 获取标签ID
     */
    public getTabId(): string {
        return this._tabId;
    }

    /**
     * 设置标签名称
     */
    public setTabName(name: string): void {
        if (this.tabName) {
            this.tabName.string = name;
        }
    }

    /**
     * 设置分组ID
     */
    public setGroupId(id: string): void {
        this.groupId = id;
    }

    /**
     * 获取分组ID
     */
    public getGroupId(): string {
        return this.groupId;
    }

    /**
     * 设置标签在组内的索引
     */
    public setTabIndex(index: number): void {
        this.tabIndex = index;
    }

    /**
     * 获取标签在组内的索引
     */
    public getTabIndex(): number {
        return this.tabIndex;
    }

    /**
     * 设置标签组管理器
     */
    public setGroupManager(manager: any): void {
        this._groupManager = manager;
    }

    /**
     * 设置选中状态
     */
    public setSelected(selected: boolean, fireEvent: boolean = false): void {
        if (this._isSelected === selected) return;
        
        this._isSelected = selected;
        this.updateAppearance();
        
        // 播放选中/取消选中动画
        this.playSelectionAnimation();
        
        // 通知组管理器（如果存在）
        if (selected && this._groupManager) {
            this._groupManager.selectTab(this);
        }
        
        // 触发事件（如果需要）
        if (fireEvent) {
            this.node.emit('tab-selected', {
                tabId: this._tabId,
                groupId: this.groupId,
                tabIndex: this.tabIndex,
                isSelected: this._isSelected
            });
        }
    }

    /**
     * 获取选中状态
     */
    public isSelected(): boolean {
        return this._isSelected;
    }

    /**
     * 更新外观
     */
    private updateAppearance(): void {
        // 更新指示器
        if (this.indicator) {
            this.indicator.active = this._isSelected;
        }
        
        // 更新标签文字颜色
        if (this.tabName) {
            this.tabName.color = this._isSelected ? this.SELECTED_COLOR : this.NORMAL_COLOR;
        }
        
        // 更新按钮状态
        if (this.button) {
            this.button.interactable = !this._isSelected; // 已选中的标签不可再点击
        }
    }

    /**
     * 标签点击事件处理
     */
    private onTabClicked(): void {
        // 如果已选中则不处理
        if (this._isSelected) return;
        
        // 设置为选中状态
        this.setSelected(true, true);
        
        // 播放点击反馈动画
        this.playClickFeedback();
    }

    /**
     * 播放点击反馈动画
     */
    private playClickFeedback(): void {
        tween(this.node)
            .to(0.1, { scale: new Vec3(this._originalScale.x * 0.9, this._originalScale.y * 0.9, 1) })
            .to(0.1, { scale: this._originalScale })
            .start();
    }

    /**
     * 播放选中/取消选中动画
     */
    private playSelectionAnimation(): void {
        if (this._isSelected) {
            // 选中动画
            tween(this.node)
                .to(0.2, { scale: new Vec3(this._originalScale.x * 1.1, this._originalScale.y * 1.1, 1) })
                .to(0.2, { scale: this._originalScale })
                .start();
                
            // 指示器动画
            if (this.indicator) {
                this.indicator.active = true;
                const uiOpacity = this.indicator.getComponent(UIOpacity) || this.indicator.addComponent(UIOpacity);
                uiOpacity.opacity = 0;
                
                tween(uiOpacity)
                    .to(0.3, { opacity: 255 })
                    .start();
            }
        } else {
            // 取消选中动画
            if (this.indicator) {
                const uiOpacity = this.indicator.getComponent(UIOpacity) || this.indicator.addComponent(UIOpacity);
                
                tween(uiOpacity)
                    .to(0.2, { opacity: 0 })
                    .call(() => {
                        this.indicator.active = false;
                    })
                    .start();
            }
        }
    }
}
