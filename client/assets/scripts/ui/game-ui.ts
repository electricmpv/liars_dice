import { _decorator, Component, Node, Label, Button, Color, Prefab, instantiate, Layout, UITransform, Sprite } from 'cc';
import { network } from '../core/network';
import { DiceAnimationController } from '../core/dice-animation-controller';
import { Bid, Face } from '../../../../shared/protocols/game-types.d';

const { ccclass, property } = _decorator;

/**
 * 游戏UI组件
 */
@ccclass('GameUI')
export class GameUI extends Component {
    @property(Node)
    private gamePanel: Node | null = null;

    @property(Label)
    private gameStatusLabel: Label | null = null;

    @property(Node)
    private playerInfoContainer: Node | null = null;

    @property(Prefab)
    private playerInfoPrefab: Prefab | null = null;

    @property(DiceAnimationController)
    private diceAnimationController: DiceAnimationController | null = null;

    @property(Node)
    private bidPanel: Node | null = null;

    @property(Button)
    private bidButton: Button | null = null;

    @property(Button)
    private challengeButton: Button | null = null;

    @property(Button)
    private spotOnButton: Button | null = null;

    @property(Node)
    private bidValueSelector: Node | null = null;

    @property(Node)
    private bidCountSelector: Node | null = null;

    @property(Node)
    private gameResultPanel: Node | null = null;
    
    @property(Label)
    private winnerLabel: Label | null = null;
    
    @property(Label)
    private finalScoreLabel: Label | null = null;

    @property(Node)
    private historyPanel: Node | null = null;
    
    @property(Node)
    private historyContent: Node | null = null;
    
    @property(Prefab)
    private historyItemPrefab: Prefab | null = null;
    
    @property(Node)
    private gameProgressBar: Node | null = null;
    
    @property(Label)
    private roundLabel: Label | null = null;

    private _gameId: string = '';
    private _playerId: string = '';
    private _playerDices: Face[] = [];
    private _currentBid: [Face, number] = [1, 0];
    private _isMyTurn: boolean = false;
    private _selectedBidValue: Face = 1;
    private _selectedBidCount: number = 1;
    private _playerInfoNodes: Map<string, Node> = new Map();
    
    /**
     * 组件启动时
     */
    start() {
        // 初始化界面
        this.initUI();

        // 监听游戏事件
        this.listenToGameEvents();
    }

    /**
     * 初始化游戏UI
     */
    private initUI(): void {
        if (this.gamePanel) {
            this.gamePanel.active = false;
        }

        if (this.bidPanel) {
            this.bidPanel.active = false;
        }
        
        if (this.historyPanel) {
            this.historyPanel.active = true;
            
            // 清空历史记录
            if (this.historyContent) {
                this.historyContent.removeAllChildren();
            }
        }
        
        if (this.gameResultPanel) {
            this.gameResultPanel.active = false;
        }

        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "等待游戏开始...";
        }
        
        if (this.roundLabel) {
            this.roundLabel.string = "回合: 0";
        }
        
        // 重置游戏进度条
        this.updateGameProgress(0);
    }

    /**
     * 监听游戏事件
     */
    private listenToGameEvents(): void {
        // 游戏开始
        network.on('gameStart', (data: any) => {
            this._gameId = data.gameId;
            this.onGameStart(data);
        });

        // 游戏状态更新
        network.on('game:state_update', (data: any) => {
            this.updateGameState(data);
        });

        // 骰子摇动结果
        network.on('game:dice_roll', (data: any) => {
            this.onDiceRollResult(data);
        });

        // 竞价更新
        network.on('game:bid_update', (data: any) => {
            this.onBidUpdate(data);
        });

        // 质疑结果
        network.on('game:challenge_result', (data: any) => {
            this.onChallengeResult(data);
        });

        // 即时喊结果
        network.on('game:spot_on_result', (data: any) => {
            this.onSpotOnResult(data);
        });

        // 游戏结束
        network.on('game:game_end', (data: any) => {
            this.onGameEnd(data);
        });
    }

    /**
     * 初始化游戏
     * @param gameId 游戏ID
     * @param playerId 玩家ID
     */
    public initGame(gameId: string, playerId: string): void {
        this._gameId = gameId;
        this._playerId = playerId;

        // 显示游戏面板
        if (this.gamePanel) {
            this.gamePanel.active = true;
        }

        // 更新状态
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "游戏准备中...";
        }
    }

    /**
     * 游戏开始事件处理
     * @param data 游戏数据
     */
    private onGameStart(data: any): void {
        console.log("游戏开始:", data);

        // 初始化玩家信息
        this.initPlayerInfo(data.players);

        // 更新状态
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = "游戏开始！摇骰子中...";
        }

        // 请求摇骰子
        this.rollDices();
    }

    /**
     * 初始化玩家信息
     * @param players 玩家列表
     */
    private initPlayerInfo(players: any[]): void {
        // 清空现有玩家信息
        if (this.playerInfoContainer) {
            this.playerInfoContainer.removeAllChildren();
            this._playerInfoNodes.clear();
        }

        // 创建玩家信息节点
        players.forEach(player => {
            if (!this.playerInfoPrefab || !this.playerInfoContainer) return;

            // 实例化预制体
            const playerNode = instantiate(this.playerInfoPrefab);
            if (!playerNode) {
                console.error("实例化玩家信息预制体失败");
                return;
            }
            
            // 获取子节点组件
            const nameLabel = playerNode.getChildByName('NameLabel')?.getComponent(Label);
            const diceCountLabel = playerNode.getChildByName('DiceCountLabel')?.getComponent(Label);
            
            if (nameLabel) {
                nameLabel.string = player.id === this._playerId ? `${player.name} (你)` : player.name;
                
                // 为自己的名字加上特殊颜色
                if (player.id === this._playerId) {
                    nameLabel.color = new Color(255, 215, 0, 255); // 金色
                }
            }
            
            if (diceCountLabel) {
                diceCountLabel.string = `骰子: ${player.diceCount}`;
            }
            
            // 将节点添加到容器
            this.playerInfoContainer.addChild(playerNode);
            this._playerInfoNodes.set(player.id, playerNode);
        });
    }

    /**
     * 更新游戏状态
     * @param data 游戏状态数据
     */
    private updateGameState(data: any): void {
        console.log("游戏状态更新:", data);

        // 更新玩家信息
        if (data.players) {
            data.players.forEach((player: any) => {
                const playerNode = this._playerInfoNodes.get(player.id);
                if (playerNode) {
                    const diceCountLabel = playerNode.getChildByName('DiceCountLabel')?.getComponent(Label);
                    if (diceCountLabel) {
                        diceCountLabel.string = `骰子: ${player.diceCount}`;
                    }
                    
                    // 高亮当前玩家
                    const isCurrentPlayer = data.currentPlayerIndex !== undefined && 
                        data.activePlayers && 
                        data.activePlayers[data.currentPlayerIndex] === player.id;
                        
                    const background = playerNode.getChildByName('Background');
                    if (background) {
                        background.getComponent(Label)!.color = isCurrentPlayer ? 
                            new Color(100, 149, 237, 255) : // 蓝色背景
                            new Color(50, 50, 50, 255);    // 深灰色背景
                    }
                }
            });
        }

        // 更新当前回合状态
        this._isMyTurn = data.activePlayers && 
            data.currentPlayerIndex !== undefined && 
            data.activePlayers[data.currentPlayerIndex] === this._playerId;
            
        // 更新竞价面板状态
        this.updateBidPanelState();
        
        // 更新当前竞价显示
        if (data.currentBid && Array.isArray(data.currentBid) && data.currentBid.length === 2) {
            // 确保竞价值是有效的Face类型，如果不是则默认为1
            const bidValue = this.validFace(data.currentBid[0]) ? data.currentBid[0] : 1;
            this._currentBid = [bidValue, data.currentBid[1]];
        }
        this.updateCurrentBidDisplay();
        
        // 更新回合信息
        if (this.roundLabel && data.roundNumber !== undefined) {
            this.roundLabel.string = `回合: ${data.roundNumber}`;
            
            // 更新游戏进度
            if (data.totalRounds) {
                const progress = data.roundNumber / data.totalRounds;
                this.updateGameProgress(progress);
            }
        }
        
        // 更新游戏状态标签
        if (this.gameStatusLabel) {
            if (this._isMyTurn) {
                this.gameStatusLabel.string = "轮到你行动！";
                this.gameStatusLabel.color = new Color(0, 255, 0, 255);
                
                // 显示回合转换动画
                this.showTurnTransition("你");
            } else if (data.status === "playing") {
                const currentPlayerName = this.getPlayerName(data.activePlayers[data.currentPlayerIndex]);
                this.gameStatusLabel.string = `等待${currentPlayerName}行动...`;
                this.gameStatusLabel.color = new Color(255, 255, 255, 255);
                
                // 如果是玩家变更，显示回合转换动画
                if (data.playerChanged) {
                    this.showTurnTransition(currentPlayerName);
                }
            } else if (data.status === "finished") {
                const winnerName = this.getPlayerName(data.winner);
                this.gameStatusLabel.string = `游戏结束! ${winnerName}获胜!`;
                this.gameStatusLabel.color = new Color(255, 215, 0, 255);
            }
        }
    }

    /**
     * 验证值是否为有效的骰子面值
     * @param value 待验证的值
     * @returns 是否是有效的Face值
     */
    private validFace(value: number): value is Face {
        return value >= 1 && value <= 6;
    }

    /**
     * 获取玩家名称
     * @param playerId 玩家ID
     * @returns 玩家名称
     */
    private getPlayerName(playerId: string): string {
        const playerNode = this._playerInfoNodes.get(playerId);
        if (playerNode) {
            const nameLabel = playerNode.getChildByName('NameLabel')?.getComponent(Label);
            if (nameLabel) {
                return nameLabel.string;
            }
        }
        return playerId;
    }

    /**
     * 更新竞价面板状态
     */
    private updateBidPanelState(): void {
        if (!this.bidPanel || !this.bidButton || !this.challengeButton || !this.spotOnButton) return;
        
        // 显示/隐藏竞价面板
        this.bidPanel.active = this._isMyTurn;
        
        // 启用/禁用按钮
        this.bidButton.interactable = this._isMyTurn;
        
        // 只有有前一个竞价时才能质疑或即时喊
        const hasPreviousBid = this._currentBid[1] > 0;
        this.challengeButton.interactable = this._isMyTurn && hasPreviousBid;
        this.spotOnButton.interactable = this._isMyTurn && hasPreviousBid;
    }

    /**
     * 更新当前竞价显示
     */
    private updateCurrentBidDisplay(): void {
        const [value, count] = this._currentBid;
        
        if (count === 0) {
            // 没有竞价
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = "等待第一个竞价...";
            }
        } else {
            // 显示当前竞价
            const bidDisplay = this.node.getChildByName("CurrentBidLabel")?.getComponent(Label);
            if (bidDisplay) {
                bidDisplay.string = `当前竞价: ${count}个 ${this.getFaceLabel(value)}`;
            }
        }
    }

    /**
     * 获取骰子面值标签
     * @param face 骰子面值
     * @returns 骰子面值标签
     */
    private getFaceLabel(face: Face): string {
        switch(face) {
            case 1: return "一";
            case 2: return "二";
            case 3: return "三";
            case 4: return "四";
            case 5: return "五";
            case 6: return "六";
            default: return `${face}`;
        }
    }

    /**
     * 摇骰子
     */
    private async rollDices(): Promise<void> {
        try {
            if (this.diceAnimationController) {
                // 播放摇骰子动画
                await this.diceAnimationController.playAnimation('shake', null);
            }
            
            // 请求服务器摇骰子
            const result = await network.rollDice(this._gameId, this._playerId);
            
            // 保存我的骰子
            this._playerDices = result.dices;
            
            // 显示我的骰子
            if (this.diceAnimationController) {
                await this.diceAnimationController.playAnimation('roll', { values: this._playerDices });
            }
            
            console.log("我的骰子:", this._playerDices);
        } catch (error) {
            console.error("摇骰子失败:", error);
            // 显示错误
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `摇骰子失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = new Color(255, 0, 0, 255);
            }
        }
    }

    /**
     * 骰子摇动结果处理
     * @param data 骰子结果数据
     */
    private onDiceRollResult(data: any): void {
        console.log("骰子结果:", data);
        
        // 如果是我的骰子，更新显示
        if (data.playerId === this._playerId) {
            this._playerDices = data.dices;
            
            // 显示我的骰子
            if (this.diceAnimationController) {
                this.diceAnimationController.playAnimation('roll', { values: this._playerDices });
            }
        }
    }

    /**
     * 竞价处理
     */
    public async onBidClick(): Promise<void> {
        if (!this._isMyTurn) return;
        
        try {
            // 确保选择的值是有效的Face类型
            const bidValue: Face = this.validFace(this._selectedBidValue) ? 
                this._selectedBidValue : 1;
                
            // 执行竞价
            await network.placeBid(this._gameId, this._playerId, [bidValue, this._selectedBidCount]);
            
            // 更新竞价显示
            this._currentBid = [bidValue, this._selectedBidCount];
            this.updateCurrentBidDisplay();
        } catch (error) {
            console.error("竞价失败:", error);
            // 显示错误
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `竞价失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = new Color(255, 0, 0, 255);
            }
        }
    }

    /**
     * 竞价更新处理
     * @param data 竞价数据
     */
    private onBidUpdate(data: any): void {
        console.log("竞价更新:", data);
        
        // 更新当前竞价
        if (data.bid && Array.isArray(data.bid) && data.bid.length === 2) {
            // 确保竞价值是有效的Face类型
            const bidValue = this.validFace(data.bid[0]) ? data.bid[0] : 1;
            this._currentBid = [bidValue, data.bid[1]];
        }
        this.updateCurrentBidDisplay();
        
        // 获取竞价玩家名称
        const playerName = this.getPlayerName(data.playerId);
        
        // 更新游戏状态
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = `${playerName} 出价: ${data.bid[1]}个 ${this.getFaceLabel(data.bid[0] as Face)}`;
        }
        
        // 添加到历史记录
        this.addToHistory(`${playerName} 出价: ${data.bid[1]}个 ${this.getFaceLabel(data.bid[0] as Face)}`);
    }

    /**
     * 质疑处理
     */
    public async onChallengeClick(): Promise<void> {
        if (!this._isMyTurn || !this.challengeButton?.interactable) return;
        
        try {
            // 执行质疑
            await network.challenge(this._gameId, this._playerId);
            
            // 更新UI状态
            if (this.bidPanel) {
                this.bidPanel.active = false;
            }
            
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = "质疑中...";
            }
        } catch (error) {
            console.error("质疑失败:", error);
            // 显示错误
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `质疑失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = new Color(255, 0, 0, 255);
            }
        }
    }

    /**
     * 质疑结果处理
     * @param data 质疑结果数据
     */
    private onChallengeResult(data: any): void {
        console.log("质疑结果:", data);
        
        // 获取质疑者名称
        const challengerName = this.getPlayerName(data.challengerId);
        const challengedName = this.getPlayerName(data.challengedId);
        
        // 更新游戏状态
        if (this.gameStatusLabel) {
            if (data.valid) {
                this.gameStatusLabel.string = `${challengerName} 质疑正确! 骰子总数: ${data.totalCount}`;
                this.gameStatusLabel.color = new Color(0, 255, 0, 255);
            } else {
                this.gameStatusLabel.string = `${challengerName} 质疑错误! 骰子总数: ${data.totalCount}`;
                this.gameStatusLabel.color = new Color(255, 0, 0, 255);
            }
        }
        
        // 添加到历史记录
        let historyText = "";
        if (data.valid) {
            historyText = `${challengerName} 质疑 ${challengedName} 正确! 骰子总数: ${data.totalCount}`;
        } else {
            historyText = `${challengerName} 质疑 ${challengedName} 错误! 骰子总数: ${data.totalCount}`;
        }
        this.addToHistory(historyText);
        
        // 如果游戏没有结束，请求新一轮的骰子
        if (data.winner == null) {
            setTimeout(() => {
                this.rollDices();
            }, 2000);
        }
    }

    /**
     * 即时喊处理
     */
    public async onSpotOnClick(): Promise<void> {
        if (!this._isMyTurn || !this.spotOnButton?.interactable) return;
        
        try {
            // 执行即时喊
            await network.spotOn(this._gameId, this._playerId);
            
            // 更新UI状态
            if (this.bidPanel) {
                this.bidPanel.active = false;
            }
            
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = "即时喊中...";
            }
        } catch (error) {
            console.error("即时喊失败:", error);
            // 显示错误
            if (this.gameStatusLabel) {
                this.gameStatusLabel.string = `即时喊失败: ${error instanceof Error ? error.message : '未知错误'}`;
                this.gameStatusLabel.color = new Color(255, 0, 0, 255);
            }
        }
    }

    /**
     * 即时喊结果处理
     * @param data 即时喊结果数据
     */
    private onSpotOnResult(data: any): void {
        console.log("即时喊结果:", data);
        
        // 获取即时喊玩家名称
        const playerName = this.getPlayerName(data.playerId);
        
        // 更新游戏状态
        if (this.gameStatusLabel) {
            if (data.valid) {
                this.gameStatusLabel.string = `${playerName} 即时喊正确! 获得额外骰子!`;
                this.gameStatusLabel.color = new Color(0, 255, 0, 255);
            } else {
                this.gameStatusLabel.string = `${playerName} 即时喊错误! 失去一个骰子!`;
                this.gameStatusLabel.color = new Color(255, 0, 0, 255);
            }
        }
        
        // 添加到历史记录
        let historyText = "";
        if (data.valid) {
            historyText = `${playerName} 即时喊正确! 获得额外骰子!`;
        } else {
            historyText = `${playerName} 即时喊错误! 失去一个骰子!`;
        }
        this.addToHistory(historyText);
        
        // 请求新一轮的骰子
        setTimeout(() => {
            this.rollDices();
        }, 2000);
    }

    /**
     * 游戏结束处理
     * @param data 游戏结束数据
     */
    private onGameEnd(data: any): void {
        console.log("游戏结束:", data);
        
        // 隐藏竞价面板
        if (this.bidPanel) {
            this.bidPanel.active = false;
        }
        
        // 计算并显示最终得分
        this.calculateAndShowFinalScore(data);
        
        // 显示游戏结果面板
        if (this.gameResultPanel) {
            this.gameResultPanel.active = true;
            
            // 显示获胜者
            if (this.winnerLabel) {
                const winnerName = this.getPlayerName(data.winner);
                this.winnerLabel.string = `${winnerName} 获胜!`;
                this.winnerLabel.color = new Color(255, 215, 0, 255); // 金色
            }
        }
        
        // 更新游戏状态
        if (this.gameStatusLabel) {
            this.gameStatusLabel.string = `游戏结束!`;
            this.gameStatusLabel.color = new Color(255, 215, 0, 255);
        }
        
        // 显示返回大厅按钮
        const backButton = this.node.getChildByName("BackButton");
        if (backButton) {
            backButton.active = true;
        }
    }
    
    /**
     * 计算并显示最终得分
     * @param data 游戏结束数据
     */
    private calculateAndShowFinalScore(data: any): void {
        if (!this.finalScoreLabel || !data.players) return;
        
        let scoreText = "最终得分:\n";
        
        // 按剩余骰子数量排序
        const sortedPlayers = [...data.players].sort((a, b) => {
            // 获胜者排在最前面
            if (a.id === data.winner) return -1;
            if (b.id === data.winner) return 1;
            
            // 然后按剩余骰子数量排序
            return b.diceCount - a.diceCount;
        });
        
        // 生成得分文本
        sortedPlayers.forEach((player, index) => {
            const playerName = this.getPlayerName(player.id);
            const isWinner = player.id === data.winner;
            
            scoreText += `${index + 1}. ${playerName}: ${player.diceCount} 骰子`;
            
            // 为获胜者添加标记
            if (isWinner) {
                scoreText += " ";
            }
            
            scoreText += "\n";
        });
        
        // 显示得分文本
        this.finalScoreLabel.string = scoreText;
    }
    
    /**
     * 显示回合转换动画
     * @param currentPlayerName 当前玩家名称
     */
    private showTurnTransition(currentPlayerName: string): void {
        // 创建回合提示动画
        const turnLabel = new Node("TurnTransition");
        turnLabel.addComponent(Label);
        
        const label = turnLabel.getComponent(Label);
        if (label) {
            label.string = `轮到 ${currentPlayerName}`;
            label.fontSize = 40;
            label.color = new Color(255, 255, 255, 255);
            
            // 添加到场景
            this.node.addChild(turnLabel);
            
            // 居中显示
            turnLabel.setPosition(0, 0);
            
            // 3秒后自动消失
            setTimeout(() => {
                turnLabel.removeFromParent();
            }, 3000);
        }
    }

    /**
     * 返回大厅
     */
    public onBackToLobbyClick(): void {
        // 触发返回大厅事件
        this.node.emit('backToLobby');
        
        // 隐藏游戏面板
        if (this.gamePanel) {
            this.gamePanel.active = false;
        }
    }

    /**
     * 设置选择的竞价值
     * @param event 事件对象
     * @param value 竞价值
     */
    public onBidValueSelect(event: Event, value: string): void {
        const parsedValue = parseInt(value);
        // 验证是否为有效的Face类型
        if (this.validFace(parsedValue)) {
            this._selectedBidValue = parsedValue;
        }
    }

    /**
     * 设置选择的竞价数量
     * @param event 事件对象
     * @param count 竞价数量
     */
    public onBidCountSelect(event: Event, count: string): void {
        this._selectedBidCount = parseInt(count);
    }

    /**
     * 添加到历史记录
     * @param text 历史记录文本
     */
    private addToHistory(text: string): void {
        if (!this.historyContent || !this.historyItemPrefab) return;
        
        // 实例化历史记录项
        const historyItem = instantiate(this.historyItemPrefab);
        if (!historyItem) return;
        
        // 设置文本
        const label = historyItem.getComponent(Label);
        if (label) {
            label.string = text;
        }
        
        // 添加到历史记录面板
        this.historyContent.addChild(historyItem);
        
        // 滚动到底部
        const layout = this.historyContent.getComponent(Layout);
        if (layout) {
            layout.updateLayout();
        }
        
        // 如果历史记录项过多，移除最旧的
        if (this.historyContent.children.length > 50) {
            const oldestItem = this.historyContent.children[0];
            if (oldestItem) {
                oldestItem.removeFromParent();
            }
        }
    }
    
    /**
     * 更新游戏进度
     * @param progress 进度值 (0-1)
     */
    private updateGameProgress(progress: number): void {
        if (!this.gameProgressBar) return;
        
        // 限制进度值在0-1之间
        const clampedProgress = Math.max(0, Math.min(1, progress));
        
        // 获取进度条的填充子节点
        const progressFill = this.gameProgressBar.getChildByName('Fill');
        if (!progressFill) return;
        
        // 获取进度条的UI变换组件
        const barWidth = this.gameProgressBar.getComponent(UITransform)?.width || 200;
        const fillTransform = progressFill.getComponent(UITransform);
        
        if (fillTransform) {
            // 根据进度更新填充宽度
            fillTransform.width = barWidth * clampedProgress;
        }
    }
}
