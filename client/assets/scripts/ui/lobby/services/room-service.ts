import { _decorator, EventTarget } from 'cc';
import { NetworkManager } from '../../../core/network'; // 使用 NetworkManager 单例而不是 network
import { LoginManager } from '../../../core/login-manager'; // 用于获取玩家名
import type { RoomAvailable } from 'colyseus.js'; // Colyseus 提供的类型
// 移除旧的 Room 类型导入，因为 getAvailableRooms 返回 RoomAvailable
// import type { Room } from '../../../../../../shared/protocols/room-protocol';

const { ccclass } = _decorator;

// 适配 RoomAvailable 到一个 LobbyController 可能期望的简化结构
// 或者让 LobbyController 直接处理 RoomAvailable
export interface SimplifiedRoomInfo { // Export the interface
    id: string;
    name: string;
    playerCount: number;
    maxPlayers: number;
    status: string;
    hasPassword?: boolean; // 通常在 metadata 中
    isPrivate?: boolean; // 通常在 metadata 中
    // hasFriends 逻辑需要客户端实现或服务器 metadata 支持
}


/**
 * 房间服务类 (已适配 Colyseus)
 * 负责处理与房间相关的逻辑和网络通信
 */
@ccclass('RoomService')
export class RoomService extends EventTarget {
    private _currentFilter: string = 'all'; // 当前过滤器
    private _cachedRooms: RoomAvailable[] = []; // 缓存原始 Colyseus 房间列表
    private _isDestroyed: boolean = false; // 销毁状态标志

    constructor() {
        super();
        // 不再监听 lobbyUpdate，房间列表通过主动请求获取
        // network.on('lobbyUpdate', this.handleLobbyUpdate.bind(this));
    }

    /**
     * 获取房间列表 (适配 Colyseus)
     */
    async fetchRooms(): Promise<void> {
        console.log('[RoomService] Fetching rooms via Colyseus...');
        if (this._isDestroyed) return;

        try {
            // 调用 NetworkManager 单例方法
            const roomsAvailable = await NetworkManager.getInstance().getAvailableRooms();
            if (this._isDestroyed) return; // 检查销毁状态

            this._cachedRooms = roomsAvailable; // 缓存原始数据
            console.log('[RoomService] Colyseus rooms fetched:', this._cachedRooms.length);

            // 发出事件，通知 LobbyController 更新 UI，传递原始数据
            if (!this._isDestroyed) this.emit('room-list-updated', this._cachedRooms); // 检查销毁状态

        } catch (error) {
            console.error('[RoomService] Error fetching Colyseus rooms:', error);
            if (!this._isDestroyed) this.emit('fetch-error', { message: error instanceof Error ? error.message : '获取房间列表时发生未知错误' }); // 检查销毁状态
        }
    }

    /**
     * 设置过滤器
     * @param filterId 过滤器ID ('all', 'waiting', 'playing', 'friends')
     */
    setFilter(filterId: string): void {
        if (this._isDestroyed) return;
        this._currentFilter = filterId;
        console.log(`[RoomService] Filter set to: ${filterId}`);
        // 触发更新，让 Controller 重新获取过滤后的列表
        if (!this._isDestroyed) this.emit('room-list-updated', this._cachedRooms); // 使用缓存的数据触发更新
    }

    /**
     * 获取过滤后的房间列表 (适配 Colyseus RoomAvailable)
     * @param rooms 可选的原始 RoomAvailable 列表，如果未提供则使用缓存
     * @returns 过滤后的 RoomAvailable 列表
     */
    getFilteredRooms(rooms?: RoomAvailable[]): RoomAvailable[] {
        const sourceRooms = rooms || this._cachedRooms;
        console.log(`[RoomService] Filtering ${sourceRooms.length} rooms with filter: ${this._currentFilter}`);

        switch (this._currentFilter) {
            case 'waiting':
                // 需要假设 metadata 包含 status 字段
                return sourceRooms.filter(room => room.metadata?.status === 'waiting');
            case 'playing':
                 // 需要假设 metadata 包含 status 字段
                return sourceRooms.filter(room => room.metadata?.status === 'playing' || room.metadata?.status === 'gaming'); // 兼容旧状态名
            case 'friends':
                // TODO: 实现好友房间过滤逻辑 (需要好友服务和服务器 metadata 支持)
                console.warn('[RoomService] Friends filter not implemented yet.');
                return sourceRooms; // 暂时返回全部
            case 'all':
            default:
                return sourceRooms;
        }
    }

    /**
     * 加入房间 (适配 Colyseus)
     * @param roomId 房间ID
     */
    async joinRoom(roomId: string): Promise<void> {
        if (this._isDestroyed) return;
        console.log(`[RoomService] Attempting to join Colyseus room: ${roomId}`);
        try {
            const playerName = LoginManager.playerName || `Player_${Math.random().toString().substring(2, 6)}`; // 获取玩家名
            const room = await NetworkManager.getInstance().joinLiarDiceRoom({ roomId, playerName }); // 使用新的方法
            if (this._isDestroyed) return; // Double check after await

            console.log(`[RoomService] Joined Colyseus room successfully: ${room.roomId}`);
            // 发出事件，只传递 roomId，让 RoomUI 通过 network 获取状态
            if (!this._isDestroyed) this.emit('room-joined', { id: room.roomId, name: room.name });

        } catch (error) {
            console.error(`[RoomService] Error joining Colyseus room ${roomId}:`, error);
            if (!this._isDestroyed) this.emit('room-join-failed', { roomId, error: error instanceof Error ? error.message : '加入房间时发生未知错误' });
        }
    }

    /**
     * 创建房间 (适配 Colyseus)
     * @param roomInfo 房间信息 (例如名称) - { name: string }
     */
    async createRoom(roomInfo: { name?: string }): Promise<void> {
        if (this._isDestroyed) return;
        console.log('[RoomService] Attempting to create Colyseus room:', roomInfo);
        try {
            const playerName = LoginManager.playerName || `Creator_${Math.random().toString().substring(2, 6)}`;
            const options = {
                playerName: playerName,
                create: true,
                // 从 roomInfo 获取房间名，或提供默认名
                roomName: roomInfo?.name || `${playerName}的房间`
                // 可以添加其他创建选项，如密码、最大玩家数，需要服务器支持
                // maxPlayers: 6,
                // password: '...'
            };
            const room = await NetworkManager.getInstance().joinLiarDiceRoom(options); // 使用 joinLiarDiceRoom 并设置 create 标志
            if (this._isDestroyed) return; // Double check after await

            console.log(`[RoomService] Created Colyseus room successfully: ${room.roomId}`);
            // 创建即加入，发出 room-joined 事件
            if (!this._isDestroyed) this.emit('room-joined', { id: room.roomId, name: room.name });

        } catch (error) {
            console.error(`[RoomService] Error creating Colyseus room:`, error);
            if (!this._isDestroyed) this.emit('room-create-failed', { error: error instanceof Error ? error.message : '创建房间时发生未知错误' });
        }
    }

    // 清理资源
    onDestroy() {
        console.log('[RoomService] Destroying...');
        this._isDestroyed = true;
        // 不再需要取消 lobbyUpdate 监听
        // network.off('lobbyUpdate', this.handleLobbyUpdate.bind(this));
    }

    // --- 辅助函数 ---

    /**
     * 将 Colyseus RoomAvailable 转换为简化的房间信息对象 (LobbyController 可能需要)
     * @param room RoomAvailable 对象
     * @returns SimplifiedRoomInfo 对象
     */
    public static adaptRoomAvailable(room: RoomAvailable): SimplifiedRoomInfo {
        return {
            id: room.roomId,
            name: room.metadata?.roomName || `房间 ${room.roomId.substring(0, 4)}`,
            playerCount: room.clients,
            maxPlayers: room.maxClients,
            status: room.metadata?.status || 'waiting',
            hasPassword: room.metadata?.hasPassword || false,
            isPrivate: room.metadata?.isPrivate || false,
        };
    }
}
