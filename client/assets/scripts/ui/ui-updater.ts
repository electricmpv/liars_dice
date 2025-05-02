import { Label, Node, Button, Prefab, instantiate, Layout, Color, director, Component } from 'cc'; // Import director and Component

import { PlayerState } from '../../shared/schemas/player-state-client';
import { LiarDiceRoomState } from '../../shared/schemas/liar-dice-room-state-client'; // 使用客户端专用类型定义
// 不再需要导入 MapSchema，改用原生 Map 类型
import { PlayerItem } from '../prefabs/player-item'; // Import PlayerItem

export class UIUpdater {
    private static instance: UIUpdater;

    private constructor() {}

    public static getInstance(): UIUpdater {
        if (!UIUpdater.instance) {
            UIUpdater.instance = new UIUpdater();
        }
        return UIUpdater.instance;
    }

    // --- Existing Methods ---
    public updateRoomIdLabel(roomIdLabel: Label | null, roomId: string): void {
        if (roomIdLabel) {
            roomIdLabel.string = `房间号: ${roomId}`;
        }
    }

    public updatePlayerCountLabel(playerCountLabel: Label | null, currentCount: number, maxCount: number): void {
        if (playerCountLabel) {
            // Corrected the label text to match the original intent if needed, or keep as is.
            // Example: playerCountLabel.string = `玩家数: ${currentCount}/${maxCount}`;
            playerCountLabel.string = `房间人数: ${currentCount}/${maxCount}`; // Keeping original text
        }
    }

    public updateInviteAIButton(inviteAIButton: Button | null, canInvite: boolean): void {
        if (inviteAIButton) {
            inviteAIButton.interactable = canInvite;
        }
    }

    // Updated updateReadyButton to only handle the label text, interactability is complex
    public updateReadyButtonLabel(readyButtonLabel: Label | null, isReady: boolean): void {
        if (readyButtonLabel) {
            readyButtonLabel.string = isReady ? '取消准备' : '准备';
        }
    }

    // Updated updateStartGameButton to handle active state and interactability based on conditions
    public updateStartGameButton(startGameButton: Button | null, isHost: boolean, canStart: boolean, isWaiting: boolean): void {
        if (!startGameButton) return;
        startGameButton.node.active = isHost && isWaiting; // Show only if host and waiting
        if (startGameButton.node.active) {
            startGameButton.interactable = canStart; // Enable only if conditions met
        } else {
            startGameButton.interactable = false; // Ensure disabled if not active
        }
    }

    // --- New Methods Moved from RoomUI ---

    public updatePlayerList(
        playerListContent: Node,
        playerItemPrefab: Prefab,
        // 接受任何类型的 players 对象
        players: any,
        currentSessionId: string,
        hostId: string
    ): void {
        console.log(`[UIUpdater] 开始更新玩家列表...`);
        
        // 检查必要组件
        if (!playerListContent || !playerItemPrefab) {
            console.error("[UIUpdater] 玩家列表容器或预制体缺失!");
            return;
        }
        
        // 检查 players 对象
        if (!players) {
            console.warn("[UIUpdater] updatePlayerList 被调用时传入了空的 players 对象");
            playerListContent.removeAllChildren(); // 清空列表
            return;
        }

        // 清空现有项目
        playerListContent.removeAllChildren();
        
        // 记录 players 对象的类型信息，用于调试
        console.log(`[UIUpdater] players 类型: ${typeof players}, 构造函数: ${players.constructor?.name || '未知'}`);
        
        // 处理不同类型的 players 对象
        try {
            // 方法1: 如果 players 有 forEach 方法 (MapSchema)
            if (typeof players.forEach === 'function') {
                console.log('[UIUpdater] 使用 forEach 方法处理 players');
                players.forEach((playerData: PlayerState, key: string) => {
                    // 使用 sessionId 或 key 作为标识符
                    const sessionId = playerData.sessionId || key;
                    this.createPlayerItem(
                        playerListContent,
                        playerItemPrefab,
                        sessionId,
                        playerData,
                        currentSessionId,
                        hostId
                    );
                });
            }
            // 方法2: 如果 players 是普通对象
            else if (typeof players === 'object') {
                console.log('[UIUpdater] 使用 Object.values 方法处理 players');
                const playersList = Object.values(players);
                playersList.forEach((playerData: any) => {
                    // 使用 sessionId 作为标识符
                    const sessionId = playerData.sessionId || '';
                    this.createPlayerItem(
                        playerListContent,
                        playerItemPrefab,
                        sessionId,
                        playerData,
                        currentSessionId,
                        hostId
                    );
                });
            }
        } catch (error) {
            console.error('[UIUpdater] 处理 players 对象时出错:', error);
        }

        // 强制更新布局
        const layout = playerListContent.getComponent(Layout);
        if (layout) {
            layout.updateLayout();
        }
        
        console.log(`[UIUpdater] 玩家列表更新完成`);
    }

    private createPlayerItem(
        parent: Node,
        prefab: Prefab,
        sessionId: string,
        playerData: PlayerState,
        currentSessionId: string,
        hostId: string
    ): void {
        console.log(`[UIUpdater] Creating list item for player: ${sessionId} (${playerData.name})`);
        const playerNode = instantiate(prefab);
        const playerComp = playerNode.getComponent(PlayerItem);

        if (playerComp) {
            playerComp.setPlayerId(sessionId);
            playerComp.setPlayerName(playerData.name || `玩家...`);
            playerComp.setIsReady(playerData.isReady);
            playerComp.setIsAI(playerData.isAI);

            // Show host indicator (assuming PlayerItem has showHostIndicator method)
            const isHost = hostId === sessionId;
            if (typeof (playerComp as any).showHostIndicator === 'function') {
                 (playerComp as any).showHostIndicator(isHost);
            } else if (isHost) {
                 console.log(`[UIUpdater] Player ${playerData.name} is host (indicator method missing)`);
            }


            // Highlight current player (assuming PlayerItem has highlightSelf method)
            const isSelf = sessionId === currentSessionId;
             if (typeof (playerComp as any).highlightSelf === 'function') {
                 (playerComp as any).highlightSelf(isSelf);
             } else if (isSelf) {
                 console.log(`[UIUpdater] Highlighting current player: ${playerData.name} (highlight method missing)`);
             }

        } else {
            console.error(`[UIUpdater] Prefab is missing PlayerItem component!`);
        }
        parent.addChild(playerNode);
    }

    public checkIfCanStartGame(isHost: boolean, state: LiarDiceRoomState | null): boolean {
        // Must be host and state must exist
        if (!isHost || !state) {
            // console.log(`[UIUpdater] Cannot start: Not host (${isHost}) or state missing (${!state})`);
            return false;
        }
        // Must be in 'waiting' state
        if (state.status !== 'waiting') {
             // console.log(`[UIUpdater] Cannot start: Game status is not 'waiting' (${state.status})`);
             return false;
        }

        // Must have at least 2 players connected and with dice
        let activeConnectedPlayerCount = 0;
        let allReady = true;
        let activePlayersLog: string[] = []; // For logging

        // Iterate using Object.values for native object, add null check for state.players
        if (state.players) {
            Object.values(state.players).forEach((p: PlayerState) => {
                if (p.isConnected && p.diceCount > 0) {
                    activeConnectedPlayerCount++;
                    // Use sessionId for logging
                    activePlayersLog.push(`${p.sessionId}(${p.name}): Ready=${p.isReady}`);
                    if (!p.isReady) {
                        allReady = false;
                    }
                }
            });
        } else {
             // If state.players is null/undefined, cannot start
             console.log(`[UIUpdater] Cannot start: state.players is missing.`);
             return false;
        }


        if (activeConnectedPlayerCount < 2) {
            console.log(`[UIUpdater] Cannot start: Not enough active players (${activeConnectedPlayerCount}). Players: ${activePlayersLog.join(', ')}`);
            return false;
        }

        if (!allReady) {
            console.log(`[UIUpdater] Cannot start: Not all active players are ready. Players: ${activePlayersLog.join(', ')}`);
            return false;
        }

        console.log(`[UIUpdater] Can start game: Host=${isHost}, Status=${state.status}, Players=${activeConnectedPlayerCount}, AllReady=${allReady}`);
        return true; // All conditions met
    }

    // --- Status Display Methods ---
    // Pass the Component instance (e.g., RoomUI) to use its scheduler
    public showError(statusLabel: Label | null, message: string, persistent: boolean = false, component: Component) {
        if (statusLabel && statusLabel.node && statusLabel.node.isValid) { // Check validity
            statusLabel.string = message;
            statusLabel.color = Color.RED;
            statusLabel.node.active = true;
            const timerKey = 'statusLabelHideTimer_Error'; // Unique key
            const nodeWithTimer = statusLabel.node as any;

            // Clear previous timer if exists using the component's scheduler
            component.unschedule(nodeWithTimer[timerKey]);
            delete nodeWithTimer[timerKey]; // Remove old key reference

            if (!persistent) {
                nodeWithTimer[timerKey] = () => {
                    if (statusLabel && statusLabel.node.isValid) { // Check validity again before hiding
                         statusLabel.node.active = false;
                    }
                     delete nodeWithTimer[timerKey]; // Clean up timer reference
                };
                 // Use component's scheduleOnce
                 component.scheduleOnce(nodeWithTimer[timerKey], 3);
            }
        } else {
             console.error(`[UIUpdater] Cannot show error - StatusLabel invalid or null.`);
        }
        console.error(`[UIUpdater] Error: ${message}`);
    }

    public showInfo(statusLabel: Label | null, message: string, persistent: boolean = false, component: Component) {
         if (statusLabel && statusLabel.node && statusLabel.node.isValid) { // Check validity
            statusLabel.string = message;
            statusLabel.color = Color.WHITE; // Use default white color for info
            statusLabel.node.active = true;
            const timerKey = 'statusLabelHideTimer_Info'; // Unique key
            const nodeWithTimer = statusLabel.node as any;

            // Clear previous timer if exists using the component's scheduler
            component.unschedule(nodeWithTimer[timerKey]);
            delete nodeWithTimer[timerKey];

            if (!persistent) {
                 nodeWithTimer[timerKey] = () => {
                     if (statusLabel && statusLabel.node.isValid) { // Check validity again
                         statusLabel.node.active = false;
                     }
                      delete nodeWithTimer[timerKey];
                 };
                  // Use component's scheduleOnce
                  component.scheduleOnce(nodeWithTimer[timerKey], 3);
            }
        } else {
             console.warn(`[UIUpdater] Cannot show info - StatusLabel invalid or null.`);
        }
        console.log(`[UIUpdater] Info: ${message}`);
    }
}
