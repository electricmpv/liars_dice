// 共享游戏类型定义
export type Face = 1 | 2 | 3 | 4 | 5 | 6;
export type Bid = [number, number]; // [value, count]
export type EmptyBid = [0, 0];
export type AIActionDecision = 
  | { action: 'bid', value: Face, count: number } 
  | { action: 'challenge' } 
  | { action: 'spot_on' };
