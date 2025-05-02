import { z } from "zod";
export type RoomStatus = "waiting" | "gaming" | "closed";
export interface Room {
    id: string;
    name?: string;
    players: string[];
    status: RoomStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ChatMessage {
    roomId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
}
export interface Heartbeat {
    timestamp: number;
    clientTime?: number;
}
export declare const RoomSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    players: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["waiting", "gaming", "closed"]>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    players: string[];
    status: "waiting" | "gaming" | "closed";
    name?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    id: string;
    players: string[];
    status: "waiting" | "gaming" | "closed";
    name?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export declare const ChatMessageSchema: z.ZodObject<{
    roomId: z.ZodString;
    senderId: z.ZodString;
    senderName: z.ZodString;
    content: z.ZodString;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    roomId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
}, {
    roomId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
}>;
export declare const HeartbeatSchema: z.ZodObject<{
    timestamp: z.ZodNumber;
    clientTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
    clientTime?: number | undefined;
}, {
    timestamp: number;
    clientTime?: number | undefined;
}>;
export declare const CreateRoomRequestSchema: z.ZodObject<{
    playerName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    playerName: string;
}, {
    playerName: string;
}>;
export declare const JoinRoomRequestSchema: z.ZodObject<{
    roomId: z.ZodString;
    playerName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    roomId: string;
    playerName: string;
}, {
    roomId: string;
    playerName: string;
}>;
export declare const LeaveRoomRequestSchema: z.ZodObject<{
    roomId: z.ZodString;
    playerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    roomId: string;
    playerId: string;
}, {
    roomId: string;
    playerId: string;
}>;
