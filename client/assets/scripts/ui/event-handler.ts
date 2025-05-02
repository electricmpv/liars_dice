import { networkManager } from './network-manager'; // Use the singleton instance
import { RoomUI } from './room-ui'; // Import RoomUI type for context
// Import the new client-side interface type
import type { LiarDiceRoomStateClient } from '../shared/schemas/liar-dice-room-state-client';
import { NetworkError } from '../core/network'; // Import error type

/**
 * EventHandler 单例，负责统一管理 RoomUI 的网络事件监听和分发。
 */
export class EventHandler {
    private static instance: EventHandler;
    private context: RoomUI | null = null; // Store the RoomUI instance

    // Store bound handlers to ensure 'this' context is correct when called by network events
    // State handler accepts 'any' from network, will be cast later
    private boundHandleStateChange: (state: any) => void;
    private boundHandleGameStarted: (data: { gameId: string }) => void;
    private boundHandleKicked: (data: { reason?: string }) => void;
    private boundHandleDisconnect: (code: number) => void;
    private boundHandleNetworkError: (error: NetworkError) => void;
    private boundHandlePlayerData: (data: any) => void;
    private boundHandleFullRoomState: (data: any) => void;


    private constructor() {
        // Bind methods in constructor to ensure 'this' refers to EventHandler instance
        // These bound methods will then call the methods on the stored RoomUI context
        this.boundHandleStateChange = this._handleStateChange.bind(this);
        this.boundHandleGameStarted = this._handleGameStarted.bind(this);
        this.boundHandleKicked = this._handleKicked.bind(this);
        this.boundHandleDisconnect = this._handleDisconnect.bind(this);
        this.boundHandleNetworkError = this._handleNetworkError.bind(this);
        this.boundHandlePlayerData = this._handlePlayerData.bind(this);
        this.boundHandleFullRoomState = this._handleFullRoomState.bind(this);
    }

    public static getInstance(): EventHandler {
        if (!EventHandler.instance) {
            EventHandler.instance = new EventHandler();
        }
        return EventHandler.instance;
    }

    // Setup listeners, storing the RoomUI context
    public setupEventListeners(context: RoomUI): void {
        if (this.context) {
            console.warn("[EventHandler] Listeners already set up for a context. Overwriting.");
            this.removeEventListeners(); // Remove old listeners first
        }
        this.context = context;
        console.log("[EventHandler] Setting up listeners for context:", context?.node?.name);

        networkManager.on('stateUpdate', this.boundHandleStateChange);
        networkManager.on('gameStarted', this.boundHandleGameStarted);
        networkManager.on('kicked', this.boundHandleKicked);
        networkManager.on('disconnected', this.boundHandleDisconnect);
        networkManager.on('error', this.boundHandleNetworkError);
        networkManager.on('playerData', this.boundHandlePlayerData);
        networkManager.on('fullRoomState', this.boundHandleFullRoomState);
    }

    // Remove listeners and clear context
    public removeEventListeners(): void {
        if (!this.context) {
            // console.warn("[EventHandler] No context found, cannot remove listeners effectively.");
             // Still try to remove listeners from networkManager in case they were somehow added without context
        }
         console.log("[EventHandler] Removing listeners.");

        networkManager.off('stateUpdate', this.boundHandleStateChange);
        networkManager.off('gameStarted', this.boundHandleGameStarted);
        networkManager.off('kicked', this.boundHandleKicked);
        networkManager.off('disconnected', this.boundHandleDisconnect);
        networkManager.off('error', this.boundHandleNetworkError);
        networkManager.off('playerData', this.boundHandlePlayerData);
        networkManager.off('fullRoomState', this.boundHandleFullRoomState);

        this.context = null; // Clear the context
    }

    // --- Internal Handlers ---
    // These call the corresponding public methods on the stored RoomUI context

    // Accepts 'any' from the bound listener, casts to client interface before forwarding
    private _handleStateChange(state: any): void {
        if (this.context) {
            // Forward the call to the RoomUI instance's method, casting state
            // Need to ensure handleStateChange is public in RoomUI and accepts LiarDiceRoomStateClient
            (this.context as any).handleStateChange(state as LiarDiceRoomStateClient);
        } else {
            console.warn("[EventHandler] Received stateUpdate but no context is set.");
        }
    }

    private _handleGameStarted(data: { gameId: string }): void {
        if (this.context) {
            (this.context as any).handleGameStarted(data);
        } else {
            console.warn("[EventHandler] Received gameStarted but no context is set.");
        }
    }

    private _handleKicked(data: { reason?: string }): void {
         if (this.context) {
            (this.context as any).handleKicked(data);
        } else {
            console.warn("[EventHandler] Received kicked but no context is set.");
        }
    }

    private _handleDisconnect(code: number): void {
         if (this.context) {
            (this.context as any).handleDisconnect(code);
        } else {
            console.warn("[EventHandler] Received disconnected but no context is set.");
        }
    }

    private _handleNetworkError(error: NetworkError): void {
         if (this.context) {
            (this.context as any).handleNetworkError(error);
        } else {
            console.warn("[EventHandler] Received error but no context is set.");
        }
    }

     private _handlePlayerData(data: any): void {
         if (this.context) {
            (this.context as any).handlePlayerData(data);
        } else {
            console.warn("[EventHandler] Received playerData but no context is set.");
        }
    }

     private _handleFullRoomState(data: any): void {
         if (this.context) {
            (this.context as any).handleFullRoomState(data);
        } else {
            console.warn("[EventHandler] Received fullRoomState but no context is set.");
        }
    }
}
