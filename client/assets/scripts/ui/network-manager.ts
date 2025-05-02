import { NetworkManager as NetworkManagerCore, NetworkError, NetworkErrorCode } from '../core/network';

/**
 * NetworkManager 单例，负责封装网络相关操作，便于 UI 层调用和解耦。
 */
export class NetworkManager {
    private static instance: NetworkManager;

    private constructor() {}

    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }
        return NetworkManager.instance;
    }

    public get roomId(): string {
        return NetworkManagerCore.getInstance().roomId;
    }

    public get sessionId(): string {
        return NetworkManagerCore.getInstance().sessionId;
    }

    public get roomState(): any {
        return NetworkManagerCore.getInstance().roomState;
    }

    public on(event: string, handler: (...args: any[]) => void): void {
        NetworkManagerCore.getInstance().on(event, handler);
    }

    public off(event: string, handler: (...args: any[]) => void): void {
        NetworkManagerCore.getInstance().off(event, handler);
    }

    public send(type: string, payload?: any): void {
        NetworkManagerCore.getInstance().send(type, payload);
    }

    public leaveRoom(): Promise<void> {
        return NetworkManagerCore.getInstance().leaveRoom();
    }

    // 可根据需要扩展更多网络操作方法
}

export const networkManager = NetworkManager.getInstance();