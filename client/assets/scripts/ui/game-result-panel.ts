import { _decorator, Component, Node, Label, Color, Button } from 'cc';
import { PlayerDisplayController } from './player-display-controller';

const { ccclass, property } = _decorator;

/**
 * 游戏结果面板
 * 负责显示游戏结束结果
 */
@ccclass('GameResultPanel')
export class GameResultPanel extends Component {
    @property(Label)
    private winnerLabel: Label | null = null;

    @property(Label)
    private finalScoreLabel: Label | null = null;

    @property(Button)
    private backToLobbyButton: Button | null = null;

    @property(PlayerDisplayController)
    private playerDisplayController: PlayerDisplayController | null = null;

    onLoad() {
        // 初始隐藏面板
        this.node.active = false;

        // 设置返回大厅按钮点击事件
        if (this.backToLobbyButton) {
            this.backToLobbyButton.node.on('click', this.onBackToLobbyClick, this);
        }
    }

    onDestroy() {
        // // 移除按钮点击事件
        // if (this.backToLobbyButton) {
        //     this.backToLobbyButton.node.off('click', this.onBackToLobbyClick, this);
        // }
        // 移除按钮点击事件，防止访问已销毁的节点
        const btnNode = this.backToLobbyButton?.node;
        if (btnNode) {
            btnNode.off('click', this.onBackToLobbyClick, this);
        }
    }

    /**
     * 显示游戏结果
     * @param data 游戏结束数据 { winner, players }
     */
    public showResult(data: { winner: string, players: any[] }): void {
        console.log("[GameResultPanel] showResult called with data:", JSON.stringify(data));

        // 显示面板
        console.log(`[GameResultPanel] Setting node active: true. Current active state: ${this.node.active}`);
        this.node.active = true;
        console.log(`[GameResultPanel] Node active state after setting: ${this.node.active}`);
        console.log(`[GameResultPanel] Node activeInHierarchy state after setting: ${this.node.activeInHierarchy}`);


        // 显示获胜者
        if (this.winnerLabel) {
            const winnerName = this.playerDisplayController?.getPlayerNameWithAlias(data.winner) || data.winner;
            this.winnerLabel.string = `${winnerName} 获胜!`;
            this.winnerLabel.color = new Color(255, 215, 0, 255);
        }

        // 计算并显示最终得分
        this.calculateAndShowFinalScore(data);
    }

    /**
     * 计算并显示最终得分
     * @param data 游戏结束数据 { winner, players }
     */
    private calculateAndShowFinalScore(data: { winner: string, players: any[] }): void {
        console.log("[GameResultPanel] calculateAndShowFinalScore called.");
        if (!this.finalScoreLabel) {
            console.error("[GameResultPanel] finalScoreLabel is not assigned!");
            return;
        }
        if (!data || !data.players || !Array.isArray(data.players)) {
            console.error("[GameResultPanel] Invalid or missing players data in calculateAndShowFinalScore:", data);
            this.finalScoreLabel.string = "错误：无法加载得分";
            return;
        }
        console.log("[GameResultPanel] Received players data:", JSON.stringify(data.players));

        let scoreText = "最终得分:\n";
        const sortedPlayers = [...data.players].sort((a, b) => {
            if (a.id === data.winner) return -1;
            if (b.id === data.winner) return 1;
            return b.diceCount - a.diceCount; // Sort by dice count descending (winner handled first)
        });
        console.log("[GameResultPanel] Sorted players data:", JSON.stringify(sortedPlayers));

        sortedPlayers.forEach((player, index) => {
            // Ensure player object and id exist
            if (!player || typeof player.id === 'undefined') {
                console.error("[GameResultPanel] Invalid player object in sortedPlayers:", player);
                scoreText += `${index + 1}. 无效玩家数据\n`;
                return; // Skip this player
            }
            const playerName = this.playerDisplayController?.getPlayerNameWithAlias(player.id) || `玩家 ${player.id.substring(0, 4)}`;
            const diceCount = typeof player.diceCount === 'number' ? player.diceCount : '?'; // Handle missing diceCount
            scoreText += `${index + 1}. ${playerName}: ${diceCount} 骰子\n`;
        });

        console.log("[GameResultPanel] Final score text:", scoreText);
        this.finalScoreLabel.string = scoreText;
    }

    /**
     * 处理返回大厅按钮点击
     */
    private onBackToLobbyClick(): void {
        console.log("[GameResultPanel] onBackToLobbyClick called.");
        // 发出事件让上层管理器处理场景切换
        this.node.emit('back-to-lobby-requested');
    }

    /**
     * 隐藏结果面板
     */
    public hidePanel(): void {
        this.node.active = false;
    }
}
