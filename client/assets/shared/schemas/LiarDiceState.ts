import { PlayerState } from "./PlayerState";

/**
 * 客户端专用的骰子游戏房间状态
 * 用于解决Colyseus Schema导入问题
 */
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
    
    // 更新活跃玩家列表
    if (data.activePlayerIds) {
      this.activePlayerIds = [...data.activePlayerIds];
    }
    
    // 更新玩家数据
    if (data.players) {
      // 清空玩家列表，重新添加
      this.players.clear();
      
      // 如果是数组，则遍历添加
      if (Array.isArray(data.players)) {
        for (const playerData of data.players) {
          if (playerData && playerData.sessionId) {
            this.players.set(playerData.sessionId, new PlayerState(playerData));
          }
        }
      } 
      // 如果是对象，则遍历键值对
      else if (typeof data.players === 'object') {
        for (const sessionId in data.players) {
          const playerData = data.players[sessionId];
          if (playerData) {
            this.players.set(sessionId, new PlayerState(playerData));
          }
        }
      }
    }
  }
  
  // 获取当前玩家
  getCurrentPlayer(): PlayerState | undefined {
    if (this.activePlayerIds.length === 0) return undefined;
    const currentSessionId = this.activePlayerIds[this.currentPlayerIndex];
    return this.players.get(currentSessionId);
  }
  
  // 获取上一个叫价的玩家
  getLastBidder(): PlayerState | undefined {
    if (!this.lastBidderSessionId) return undefined;
    return this.players.get(this.lastBidderSessionId);
  }
  
  // 获取房主
  getHost(): PlayerState | undefined {
    if (!this.hostId) return undefined;
    return this.players.get(this.hostId);
  }
  
  // 获取所有玩家数组
  getPlayersArray(): PlayerState[] {
    return Array.from(this.players.values());
  }
  
  // 获取活跃玩家数组
  getActivePlayersArray(): PlayerState[] {
    return this.activePlayerIds
      .map(sessionId => this.players.get(sessionId))
      .filter((player): player is PlayerState => player !== undefined);
  }
}
