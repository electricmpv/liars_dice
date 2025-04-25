import { _decorator, Component, Node, Prefab, instantiate, Label, ScrollView, Color } from 'cc';
import { GameStateManager, HistoryItem } from '../core/game-state-manager';

const { ccclass, property } = _decorator;

/**
 * 游戏历史记录面板
 * 负责显示游戏历史记录
 */
@ccclass('GameHistoryPanel')
export class GameHistoryPanel extends Component {
    @property(Node)
    private historyContent: Node | null = null;

    @property(Prefab)
    private historyItemPrefab: Prefab | null = null;
    
    @property(ScrollView)
    private scrollView: ScrollView | null = null;

    private gameStateManager: GameStateManager = GameStateManager.instance;
    private _onHistoryUpdatedCallback = (data: { items: HistoryItem[] }) => this.handleHistoryUpdated(data);

    onLoad() {
        // 监听历史记录更新事件
        this.gameStateManager.on('history-updated', this._onHistoryUpdatedCallback);
        
        console.log("[GameHistoryPanel] onLoad完成，已注册历史记录监听");
        
        // 添加一条初始历史记录，测试面板是否工作
        this.scheduleOnce(() => {
            this.gameStateManager.addHistoryItem({
                id: `init_history_${Date.now()}`,
                text: `游戏历史记录面板已初始化`,
                timestamp: Date.now(),
                type: 'system'
            });
        }, 1);
    }

    onDestroy() {
        // 移除事件监听
        this.gameStateManager.off('history-updated', this._onHistoryUpdatedCallback);
    }

    /**
     * 处理历史记录更新事件
     * @param data 事件数据 { items: HistoryItem[] }
     */
    private handleHistoryUpdated(data: { items: HistoryItem[] }): void {
        console.log("[GameHistoryPanel] handleHistoryUpdated called. Items count:", data.items.length);
        // 确保 historyContent 和 historyItemPrefab 都已设置
        if (!this.historyContent || !this.historyItemPrefab) {
            console.error("[GameHistoryPanel] historyContent or historyItemPrefab is not set!");
            return;
        }

        // 从控制台输出所有历史项，便于调试
        console.log("[GameHistoryPanel] 所有历史记录项:", JSON.stringify(data.items.map(item => item.text)));
        
        this.historyContent.removeAllChildren(); // 清空现有历史

        data.items.forEach(item => {
            // 在实例化之前，再次确认 Prefab 不为 null
            if (!this.historyItemPrefab) {
                console.error("[GameHistoryPanel] historyItemPrefab is null inside loop!");
                return; // 如果 Prefab 为空，则无法继续处理此项
            }
            // 实例化 Prefab 得到 Node，并显式转换为 Node 类型
            const historyNodeInstance = instantiate(this.historyItemPrefab) as Node;
            if (!historyNodeInstance) {
                console.error("[GameHistoryPanel] Failed to instantiate historyItemPrefab!");
                return; // 跳过这个 item
            }

            // 在实例化的 Node 上查找 Label
            const labelNode = historyNodeInstance.getChildByName("HistoryLabel");
            const label = labelNode?.getComponent(Label);
            if (label) {
                label.string = item.text; // 使用 HistoryItem 的文本
                
                // 根据记录类型设置颜色
                switch (item.type) {
                    case 'system':
                        label.color = new Color(150, 150, 150, 255); // 灰色
                        break;
                    case 'bid':
                        label.color = new Color(255, 255, 255, 255); // 白色
                        break;
                    case 'challenge':
                        label.color = new Color(255, 100, 100, 255); // 红色
                        break;
                    case 'spot_on':
                        label.color = new Color(100, 255, 100, 255); // 绿色
                        break;
                    default:
                        label.color = new Color(255, 255, 255, 255); // 默认白色
                }
            } else {
                console.error("[GameHistoryPanel] Failed to get Label component from instantiated history item's child 'HistoryLabel'!");
            }
            // 将实例化的 Node 添加到容器中
            if (this.historyContent) { // 再次检查 historyContent 是否有效
                this.historyContent.addChild(historyNodeInstance);
            }
        });

        // 滚动到底部，显示最新的历史记录
        // 延迟到下一帧执行，确保布局已完全更新
        this.scheduleOnce(() => {
            if (this.scrollView) {
                console.log("[GameHistoryPanel] 尝试滚动到底部 (下一帧)");
                this.scrollView.scrollToBottom(0.1); // 0.1秒动画时间
            } else {
                console.log("[GameHistoryPanel] scrollView不存在，无法滚动到底部");
                // 尝试从父节点获取ScrollView (备用逻辑，以防万一)
                const parentScrollView = this.node.getComponent(ScrollView) || this.node.getParent()?.getComponent(ScrollView);
                if (parentScrollView) {
                    console.log("[GameHistoryPanel] 从父节点找到scrollView，尝试滚动到底部 (下一帧)");
                    parentScrollView.scrollToBottom(0.1);
                }
            }
        }, 0); // 延迟0帧，即下一帧执行
    }

    /**
     * 清空历史记录
     */
    public clearHistory(): void {
        if (this.historyContent) {
            this.historyContent.removeAllChildren();
        }
    }
}
