import { _decorator, Component, Node, Label, Prefab, instantiate, Color } from 'cc';
// 移除不再需要的 PlayerItem 导入，除非 PlayerData 仍然依赖它（但看起来不依赖）
// import { PlayerItem } from '../prefabs/player-item';

const { ccclass, property } = _decorator;

// Import the shared Player type which includes isAI
import type { Player as SharedPlayer } from '../../shared/protocols/room-protocol';
// Use the shared Player type or define a local one that includes isAI
// Export the interface so it can be imported by other modules
export interface PlayerData extends SharedPlayer { // Extend or redefine to include isAI
    // id, name, isReady, isAI, aiType? are inherited or defined in SharedPlayer
    diceCount: number; // Add game-specific fields if needed
    // Add other potential fields needed for display, like isOnline, isActive?
    // isOnline?: boolean;
    // isActive?: boolean;
}

@ccclass('PlayerDisplayController')
export class PlayerDisplayController extends Component {

    @property(Node)
    private playerInfoContainer: Node | null = null;

    @property(Prefab)
    private playerInfoPrefab: Prefab | null = null;

    private _playerInfoNodes: Map<string, Node> = new Map();
    private _myPlayerId: string = '';

    /**
     * 初始化玩家显示控制器
     * @param myPlayerId 当前玩家的ID
     */
    public initialize(myPlayerId: string): void {
        this._myPlayerId = myPlayerId;
        if (this.playerInfoContainer) {
            this.playerInfoContainer.removeAllChildren();
            this._playerInfoNodes.clear();
        } else {
            console.error("[PlayerDisplayController] playerInfoContainer is not set!");
        }
    }

    /**
     * 更新所有玩家的显示信息
     * @param players 玩家数据列表
     * @param currentPlayerId 当前回合玩家ID (可选，用于高亮)
     */
    public updatePlayerDisplays(players: PlayerData[], currentPlayerId?: string): void {
        if (!this.playerInfoContainer || !this.playerInfoPrefab) {
            console.error("[PlayerDisplayController] Container or Prefab not set!");
            return;
        }

        // 暂存旧节点，稍后移除未更新的
        const oldNodes = new Map(this._playerInfoNodes);
        this._playerInfoNodes.clear();

        players.forEach(player => {
            let playerNode = oldNodes.get(player.id);

            // 如果节点不存在，则创建新的
            if (!playerNode || !playerNode.isValid) {
                playerNode = instantiate(this.playerInfoPrefab!);
                if (!playerNode) {
                    console.error("[PlayerDisplayController] Failed to instantiate player info prefab for player:", player.id);
                    return;
                }
                this.playerInfoContainer!.addChild(playerNode);
            } else {
                // 从旧节点中移除，表示此节点已更新
                oldNodes.delete(player.id);
            }

            this._playerInfoNodes.set(player.id, playerNode);

            // 更新节点内容
            this.updateSinglePlayerDisplay(playerNode, player, currentPlayerId);
        });

        // 移除不再存在的玩家节点
        oldNodes.forEach(node => {
            if (node && node.isValid) {
                node.destroy();
            }
        });
    }

    /**
     * 更新单个玩家的显示信息
     * @param playerNode 玩家对应的UI节点
     * @param playerData 玩家数据
     * @param currentPlayerId 当前回合玩家ID (可选)
     */
    private updateSinglePlayerDisplay(playerNode: Node, playerData: PlayerData, currentPlayerId?: string): void {
        // 不再获取 PlayerItem 组件，因为 PlayerInfo prefab 没有挂载它

        const nameLabel = playerNode.getChildByName('NameLabel')?.getComponent(Label);
        // 修正查找路径：PlayerInfo -> DiceInfo -> DiceCountLabel
        const diceInfoNode = playerNode.getChildByName('DiceInfo');
        const diceCountLabel = diceInfoNode?.getChildByName('DiceCountLabel')?.getComponent(Label);
        // const background = playerNode.getChildByName('Background'); // 用于高亮

        // 更新名字和颜色
        if (nameLabel) {
            nameLabel.string = playerData.id === this._myPlayerId ? `${playerData.name} (你)` : playerData.name;
            nameLabel.color = playerData.id === this._myPlayerId ? new Color(255, 215, 0, 255) : Color.WHITE; // 自己金色，他人白色
        }

        // 更新骰子数量
        if (diceCountLabel) {
            diceCountLabel.string = `骰子: ${playerData.diceCount}`;
        }

        // 更新高亮状态 (可选)
        // const isCurrent = playerData.id === currentPlayerId;
        // if (background) {
        //     const sprite = background.getComponent(Sprite); // 或者其他表示高亮的组件
        //     if (sprite) {
        //         sprite.color = isCurrent ? new Color(100, 149, 237, 255) : new Color(50, 50, 50, 255); // 示例颜色
        //     }
        // }

        // --- 新增：直接控制 PlayerInfo 内部的子节点 ---

        // 控制 AI 图标 (假设 PlayerInfo prefab 内有一个名为 'AiIcon' 的节点)
        const aiIconNode = playerNode.getChildByName('AiIcon');
        if (aiIconNode) {
            aiIconNode.active = playerData.isAI;
        } else {
            // 首次运行时可能 prefab 还没更新，打印警告
            // console.warn(`[PlayerDisplayController] 'AiIcon' node not found in PlayerInfo for player ${playerData.id}`);
        }

        // 控制当前玩家指示器 (假设 PlayerInfo prefab 内有一个名为 'CurrentPlayerIndicator' 的节点)
        const currentPlayerIndicatorNode = playerNode.getChildByName('CurrentPlayerIndicator');
        if (currentPlayerIndicatorNode) {
            currentPlayerIndicatorNode.active = playerData.id === currentPlayerId;
        } else {
            // console.warn(`[PlayerDisplayController] 'CurrentPlayerIndicator' node not found in PlayerInfo for player ${playerData.id}`);
        }

        // 控制活跃玩家指示器 (假设 PlayerInfo prefab 内有一个名为 'ActiveIndicator' 的节点)
        // 注意：playerData 中目前没有 isActive 字段，需要从 GameState 或其他地方获取此信息
        // const isActivePlayer = ...; // 需要逻辑来判断玩家是否活跃
        // const activeIndicatorNode = playerNode.getChildByName('ActiveIndicator');
        // if (activeIndicatorNode) {
        //     activeIndicatorNode.active = isActivePlayer;
        // } else {
        //     // console.warn(`[PlayerDisplayController] 'ActiveIndicator' node not found in PlayerInfo for player ${playerData.id}`);
        // }

        // 控制离线指示器 (假设 PlayerInfo prefab 内有一个名为 'OfflineIndicator' 的节点)
        // 注意：playerData 中目前没有 isOnline 字段，需要从 GameState 或其他地方获取此信息
        // const isOnline = ...; // 需要逻辑来判断玩家是否在线
        // const offlineIndicatorNode = playerNode.getChildByName('OfflineIndicator');
        // if (offlineIndicatorNode) {
        //     offlineIndicatorNode.active = !isOnline;
        // } else {
        //     // console.warn(`[PlayerDisplayController] 'OfflineIndicator' node not found in PlayerInfo for player ${playerData.id}`);
        // }
    }

    /**
     * 根据玩家ID获取玩家名字（带"(你)"标识）
     * @param playerId 玩家ID
     * @returns 玩家名字字符串，如果找不到返回ID本身
     */
    public getPlayerNameWithAlias(playerId: string): string {
        const playerNode = this._playerInfoNodes.get(playerId);
        if (playerNode && playerNode.isValid) {
            const nameLabel = playerNode.getChildByName('NameLabel')?.getComponent(Label);
            if (nameLabel) {
                return nameLabel.string; // 直接返回 Label 的内容，因为它已经包含了 "(你)"
            }
        }
        // Fallback: 如果节点或 Label 找不到，返回原始 ID
        return playerId;
    }
}
