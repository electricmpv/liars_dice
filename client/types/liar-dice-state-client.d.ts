// liar-dice-state-client.d.ts
// 客户端专用类型定义，避免直接依赖 @colyseus/schema

export interface PlayerState {
  sessionId: string;
  name: string;
  diceCount: number;
  isReady: boolean;
  isAI: boolean;
  isConnected: boolean; // 添加 isConnected 属性
  // 如有更多字段，请补充
}

export interface LiarDiceRoomState {
  players: { [sessionId: string]: PlayerState };
  activePlayerIds: string[];
  currentPlayerIndex: number;
  currentBidValue: number;
  currentBidCount: number;
  status: string;
  hostId: string;
  roundNumber: number;
  moveNumber: number;
  roundResult: string;
  isOneCalledThisRound: boolean;
  // 如有更多字段，请补充
}
