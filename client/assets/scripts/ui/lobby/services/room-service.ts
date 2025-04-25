import { _decorator, EventTarget } from 'cc';
import { network } from '../../../core/network'; // 假设 network 实例可用
import { LoginManager } from '../../../core/login-manager'; // 修正导入路径
import type { Room } from '../../../../../../shared/protocols/room-protocol'; // 修正导入路径

const { ccclass } = _decorator;

/**
 * 房间服务类
 * 负责处理与房间相关的逻辑和网络通信
 */
@ccclass('RoomService')
export class RoomService extends EventTarget {
    private _currentFilter: string = 'all'; // 当前过滤器
    private _cachedRooms: Room[] = []; // 缓存的房间列表
    private _isDestroyed: boolean = false; // 添加销毁状态标志

    constructor() {
        super();
        // 监听来自 network 层的 lobbyUpdate 事件
        network.on('lobbyUpdate', this.handleLobbyUpdate.bind(this)); // 使用 bind(this) 确保回调函数中的 this 指向正确
    }

    // 处理来自服务器的 lobbyUpdate 事件
    private handleLobbyUpdate(data: { rooms: Room[] }): void {
        if (this._isDestroyed) return; // 检查销毁状态
        console.log('[RoomService] Received lobbyUpdate from network:', data.rooms.length);
        this._cachedRooms = data.rooms;
        // 发出事件，通知 LobbyController 更新 UI
        this.emit('room-list-updated', this._cachedRooms);
    }

    /**
     * 获取房间列表
     */
    async fetchRooms(): Promise<void> {
        console.log('[RoomService] Fetching rooms...');
        if (this._isDestroyed) return; // 检查销毁状态

        try {
            // 调用 network 层获取房间列表 (使用 request 方法)
            const result = await network.request('getActiveRooms', {}); 
            if (this._isDestroyed) return; // 检查销毁状态

            if (result.success && result.rooms) {
                this._cachedRooms = result.rooms;
                if (!this._isDestroyed) this.emit('room-list-updated', this._cachedRooms); // 检查销毁状态
                console.log('[RoomService] Rooms fetched:', this._cachedRooms.length);
            } else {
                // result.success 为 false 时，result.error 应该存在
                console.error('[RoomService] Failed to fetch rooms:', result.error); 
                if (!this._isDestroyed) this.emit('fetch-error', { message: result.error || '获取房间列表失败' }); // 检查销毁状态
            }
        } catch (error) {
            console.error('[RoomService] Error fetching rooms:', error);
             if (!this._isDestroyed) this.emit('fetch-error', { message: error instanceof Error ? error.message : '获取房间列表时发生未知错误' }); // 检查销毁状态
        }
    }

    /**
     * 设置过滤器
     * @param filterId 过滤器ID ('all', 'waiting', 'playing', 'friends')
     */
    setFilter(filterId: string): void {
        if (this._isDestroyed) return; // 检查销毁状态
        this._currentFilter = filterId;
        console.log(`[RoomService] Filter set to: ${filterId}`);
        // 触发更新，让 Controller 重新获取过滤后的列表
        if (!this._isDestroyed) this.emit('room-list-updated', this._cachedRooms); // 检查销毁状态
    }

    /**
     * 获取过滤后的房间列表
     * @param rooms 可选的原始房间列表，如果未提供则使用缓存
     * @returns 过滤后的房间列表
     */
    getFilteredRooms(rooms?: Room[]): Room[] {
        const sourceRooms = rooms || this._cachedRooms;
        console.log(`[RoomService] Filtering rooms with filter: ${this._currentFilter}`);
        
        switch (this._currentFilter) {
            case 'waiting':
                return sourceRooms.filter(room => room.status === 'waiting');
            case 'playing':
                return sourceRooms.filter(room => room.status === 'gaming'); // 注意状态名称匹配
            case 'friends':
                // TODO: 实现好友房间过滤逻辑 (需要好友服务支持)
                console.warn('[RoomService] Friends filter not implemented yet.');
                return sourceRooms; // 暂时返回全部
            case 'all':
            default:
                return sourceRooms;
        }
    }

    /**
     * 加入房间
      * @param roomId 房间ID
      * @param password 可选的密码 - 已移除
      */
     async joinRoom(roomId: string): Promise<void> { // 恢复签名，只接受 string
          if (this._isDestroyed) return; // 检查销毁状态
          // 不再需要检查 roomId 类型，因为签名强制要求 string
          console.log(`[RoomService] Attempting to join room: ${roomId}`);
          try {
             // 密码逻辑已移除
            // 假设 playerName 从其他地方获取，例如用户数据服务
            const playerName = `Player_${Math.random().toString().substring(2, 6)}`; // 临时名称
            const result = await network.joinRoom(roomId, playerName);
            if (this._isDestroyed) return; // 检查销毁状态

            // 修改条件以检查新的响应结构，包含 playerId
            if (result.success && result.room && result.playerId) { 
                console.log(`[RoomService] Joined room successfully:`, result.room, `Player ID: ${result.playerId}`);
                
                // 将服务器分配的内部 UUID 存储到 LoginManager
                LoginManager.currentPlayerId = result.playerId;
                console.log(`[RoomService] Updated currentPlayerId after joining room: ${LoginManager.currentPlayerId}`);

                if (!this._isDestroyed) this.emit('room-joined', result.room); // 检查销毁状态
            } else {
                 // 处理响应成功但缺少 room 或 playerId 的情况
                 console.error(`[RoomService] Failed to join room ${roomId}: Invalid response data.`, result);
                 if (!this._isDestroyed) this.emit('room-join-failed', { roomId, error: '加入房间失败 (无效的服务器响应)' });
                 // success 为 false 时，Promise 会 reject，错误在 catch 中处理
                 // 此处 else 块理论上不会执行，或者 response 结构未知
                 console.error(`[RoomService] Failed to join room ${roomId}: Unknown response format or error.`);
                 if (!this._isDestroyed) this.emit('room-join-failed', { roomId, error: '加入房间失败 (未知原因)' }); // 检查销毁状态
            }
         } catch (error) {
             console.error(`[RoomService] Error joining room ${roomId}:`, error);
             if (!this._isDestroyed) this.emit('room-join-failed', { roomId, error: error instanceof Error ? error.message : '加入房间时发生未知错误' }); // 检查销毁状态
         }
    }

    /**
     * 创建房间
     * @param roomInfo 房间信息 (例如名称、密码等)
     */
    async createRoom(roomInfo: any): Promise<void> {
        if (this._isDestroyed) return; // 检查销毁状态
        console.log('[RoomService] Attempting to create room:', roomInfo);
        try {
             // 假设 playerName 从其他地方获取
             const playerName = roomInfo.playerName || `Creator_${Math.random().toString().substring(2, 6)}`; // 临时名称
             // 假设 network.createRoom 现在返回 { success: boolean; data?: { playerId: string; room: Room }; error?: string }
             const result = await network.createRoom(playerName); 
             console.log('[RoomService] Received createRoom response:', JSON.stringify(result)); // 添加日志打印完整的响应
             if (this._isDestroyed) return; // 检查销毁状态

             // 更新条件判断以匹配新的返回结构，并使用类型断言 (as any) 绕过编译时类型检查
             if (result.success && (result as any).data && (result as any).data.room) { 
                 // console.log(`[RoomService] Room created successfully: ${(result as any).data.room.id}`); // 使用新结构中的 roomId
                 // 创建成功后通常需要自动加入，或者等待服务器确认
                 // 这里假设创建即加入，并触发事件
              // 服务器现在返回完整的房间信息，触发 room-joined 事件
              const roomData = (result as any).data.room;
              const playerId = (result as any).data.playerId; // 获取正确的 Player ID (UUID)

              // 更新 LoginManager 中的 Player ID
              if (playerId) {
                  LoginManager.currentPlayerId = playerId;
                  console.log(`[RoomService] Updated currentPlayerId after creating room: ${LoginManager.currentPlayerId}`);
              } else {
                  console.warn("[RoomService] Player ID not found in createRoom response data.");
              }

              console.log(`[RoomService] Room created and joined successfully:`, roomData);
              if (!this._isDestroyed) this.emit('room-joined', roomData); // 检查销毁状态
          } else {
              // success 为 false 的情况（理论上应该在 catch 中处理 Promise reject）
                 console.error(`[RoomService] Failed to create room: Unknown response format or error.`);
                 if (!this._isDestroyed) this.emit('room-create-failed', { error: '创建房间失败 (未知原因)' }); // 检查销毁状态
             }
        } catch (error) {
             console.error(`[RoomService] Error creating room:`, error);
             if (!this._isDestroyed) this.emit('room-create-failed', { error: error instanceof Error ? error.message : '创建房间时发生未知错误' }); // 检查销毁状态
        }
    }

    // 可选：处理来自网络层的房间列表更新推送
    // private handleRoomListUpdate(rooms: Room[]): void {
    //     console.log('[RoomService] Received room list update from network:', rooms.length);
    //     this._cachedRooms = rooms;
    //     this.emit('room-list-updated', this._cachedRooms);
    // }

    // 清理资源
    onDestroy() {
        console.log('[RoomService] Destroying...');
        this._isDestroyed = true;
        // 可以在这里添加其他清理逻辑，例如取消正在进行的网络请求（如果 network 模块支持）
    // network.off('roomListUpdate', this.handleRoomListUpdate, this); // 如果之前监听了网络层事件，需要取消
        network.off('lobbyUpdate', this.handleLobbyUpdate.bind(this)); // 使用 bind(this) 确保能正确移除监听器
    }
}
