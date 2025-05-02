/**
 * 客户端专用的LiarDiceRoomState定义
 * 用于解决Colyseus Schema导入问题
 */
import { PlayerState } from './player-state-client';

// 客户端使用的房间状态类，不使用装饰器
export class LiarDiceRoomState {
  // 玩家列表: key 是 sessionId
  players: Map<string, PlayerState> = new Map<string, PlayerState>();
  
  // 参与当前游戏回合的玩家 sessionId 列表 (按顺序)
  activePlayerIds: string[] = [];
  
  // 当前轮到的玩家在 activePlayerIds 中的索引
  currentPlayerIndex: number = 0;
  
  // 当前叫价的点数 (1-6)
  currentBidValue: number = 0; // 0 表示尚未开始叫价
  
  // 当前叫价的数量
  currentBidCount: number = 0; // 0 表示尚未开始叫价
  
  // 上一个叫价的玩家 sessionId (用于质疑判断)
  lastBidderSessionId: string = "";
  
  // 游戏状态: waiting, playing, challenging, roundOver, finished
  status: string = "waiting";
  
  // 房主 sessionId (用于开始游戏、踢人等权限)
  hostId: string = "";
  
  // 当前游戏回合数
  roundNumber: number = 0;
  
  // 当前回合叫价次数 (用于判断是否可以质疑)
  moveNumber: number = 0;
  
  // 回合结算信息 (用于显示谁输了，输了多少骰子等)
  roundResult: string = "";
  
  // 本回合是否已经叫过 1 点 (影响 1 点是否为万能骰)
  isOneCalledThisRound: boolean = false;
  
  // 从服务器数据构造
  constructor(data?: any) {
    if (data) {
      this.update(data);
    }
  }
  
  // 从服务器数据更新
  update(data: any): void {
    if (!data) return;
    
    // 更新基本属性
    if (data.currentPlayerIndex !== undefined) this.currentPlayerIndex = data.currentPlayerIndex;
    if (data.currentBidValue !== undefined) this.currentBidValue = data.currentBidValue;
    if (data.currentBidCount !== undefined) this.currentBidCount = data.currentBidCount;
    if (data.lastBidderSessionId !== undefined) this.lastBidderSessionId = data.lastBidderSessionId;
    if (data.status !== undefined) this.status = data.status;
    if (data.hostId !== undefined) this.hostId = data.hostId;
    if (data.roundNumber !== undefined) this.roundNumber = data.roundNumber;
    if (data.moveNumber !== undefined) this.moveNumber = data.moveNumber;
    if (data.roundResult !== undefined) this.roundResult = data.roundResult;
    if (data.isOneCalledThisRound !== undefined) this.isOneCalledThisRound = data.isOneCalledThisRound;
    
    // 更新玩家ID列表
    if (data.activePlayerIds) {
      this.activePlayerIds = [...data.activePlayerIds];
    }
    
    // 更新玩家列表
    if (data.players) {
      // 清空当前玩家列表
      this.players.clear();
      
      // 处理不同类型的players对象
      if (typeof data.players.forEach === 'function') {
        // 如果是MapSchema或类似Map的对象
        data.players.forEach((playerData: any, sessionId: string) => {
          this.players.set(sessionId, new PlayerState(playerData));
        });
      } else if (typeof data.players === 'object') {
        // 如果是普通对象
        for (const sessionId in data.players) {
          if (Object.prototype.hasOwnProperty.call(data.players, sessionId)) {
            this.players.set(sessionId, new PlayerState(data.players[sessionId]));
          }
        }
      }
    }
  }
  
  // 获取当前玩家
  getCurrentPlayer(): PlayerState | undefined {
    if (this.activePlayerIds.length === 0 || this.currentPlayerIndex < 0 || 
        this.currentPlayerIndex >= this.activePlayerIds.length) {
      return undefined;
    }
    
    const currentPlayerId = this.activePlayerIds[this.currentPlayerIndex];
    return this.players.get(currentPlayerId);
  }
  
  // 获取上一个叫价的玩家
  getLastBidder(): PlayerState | undefined {
    if (!this.lastBidderSessionId) {
      return undefined;
    }
    
    return this.players.get(this.lastBidderSessionId);
  }
  
  // 获取所有玩家数组
  getAllPlayers(): PlayerState[] {
    return Array.from(this.players.values());
  }
  
  // 获取活跃玩家数组（按照游戏顺序）
  getActivePlayers(): PlayerState[] {
    return this.activePlayerIds
      .map(id => this.players.get(id))
      .filter((player): player is PlayerState => player !== undefined);
  }
}
