/**
 * 吹牛骰子游戏基础类型定义
 */

// 基础类型
export declare type IdType = string;
export declare type Ordinal = number;
export declare type Count = Ordinal;

// 玩家标识
export declare type PlayerID = Ordinal;
export declare type Yourself = 0;
export declare type EmptyPlayer = -1;

// 骰子面值
export declare type Face = 1 | 2 | 3 | 4 | 5 | 6;

// 竞价定义
export declare type Bid = [Face, Count];
export declare type EmptyBid = [0, 0];

// 玩家手牌
export declare type Hand = Face[];

// 骰子结果
export declare interface DiceResult {
  faces: Face[];
}

// 竞价数据
export declare interface BidData {
  playerId: PlayerID;
  bid: Bid;
}

// 网络消息定义
export declare interface MoveRequest {
  subject: "move_request";
  gameId: IdType;
  roundNumber: Ordinal;
  moveNumber: Ordinal;
  yourHand: Face[];
  otherHands: [PlayerID | Yourself, Count][];
  lastBid: Bid | EmptyBid;
}

export declare interface RoundOver {
  subject: "round_over";
  gameId: IdType;
  roundNumber: Ordinal;
  state: [PlayerID | Yourself, Count][];
  roundLoser: PlayerID;
  roundChallenger: PlayerID | EmptyPlayer;
  gameWinner: PlayerID | EmptyPlayer;
}

export declare interface MoveResponse {
  move: "pass" | "challenge" | "spot_on" | Bid;
}

export declare interface SetName {
  name: string;
}

export declare interface Header {
  messageId: IdType;
}

// 事件发射器类型
export declare interface EventEmitter<T> {
  on(callback: (data: T) => void): void;
  emit(data: T): void;
}
