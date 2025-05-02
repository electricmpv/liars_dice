// 直接从Colyseus插件导入
// @ts-ignore - 忽略类型检查，因为这是一个JavaScript文件
import * as ColyseusModule from '../colyseus-cocos-creator.js';
import { LiarDiceRoomState } from '../../shared/schemas/liar-dice-room-state-client';
import { PlayerState } from '../../shared/schemas/player-state-client';
import { LoginManager } from './login-manager';

/**
 * 网络管理器错误类型定义
 */
export enum NetworkErrorCode {
    CLIENT_INIT_ERROR = 1000,
    CONNECTION_ERROR = 1001,
    CONNECTION_TIMEOUT = 1002,
    CONNECTION_CLOSED = 1003,
    ROOM_JOIN_ERROR = 2000,
    ROOM_NOT_FOUND = 2001,
    ROOM_FULL = 2002,
    SERVER_ERROR = 5000,
    UNKNOWN_ERROR = 9999
}

/**
 * 网络错误详情
 */
export interface NetworkError {
    code: number;
    message: string;
    details?: any;
}

/**
 * 网络状态类型
 */
export enum NetworkStatus {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    JOINING_ROOM = 'joining',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting',
    ERROR = 'error'
}

/**
 * 骰子游戏房间选项
 */
export interface LiarDiceRoomOptions {
    playerName: string;
    create?: boolean;
    roomId?: string;
}

/**
 * 网络管理器类
 * 负责处理与Colyseus服务器的通信
 */
export class NetworkManager {
    private static instance: NetworkManager;
    private colyseusClient: Colyseus.Client | null = null;
    private colyseusRoom: Colyseus.Room<LiarDiceRoomState> | null = null;
    
    // 支持多个服务器 URL，按优先级排序
    private serverUrls: string[] = [
        "ws://localhost:3000",
        "ws://127.0.0.1:3000",
        "wss://liars-dice-server.example.com" // 如果有生产环境服务器，可以添加
    ];
    private currentServerUrlIndex: number = 0;
    private get serverUrl(): string {
        return this.serverUrls[this.currentServerUrlIndex];
    }
    
    // 状态和会话信息
    private _status: NetworkStatus = NetworkStatus.DISCONNECTED;
    private _roomId: string = '';
    private _sessionId: string = '';
    private _lastState: LiarDiceRoomState | null = null;
    
    // 事件处理器
    private eventHandlers: Map<string, Array<(data?: any) => void>> = new Map();
    
    /**
     * 私有构造函数，确保单例模式
     */
    private constructor() {
        // 私有构造函数，防止直接实例化
    }
    
    /**
     * 获取单例实例
     */
    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }
        return NetworkManager.instance;
    }
    
    /**
     * 获取当前网络状态
     */
    public get status(): NetworkStatus {
        return this._status;
    }
    
    /**
     * 获取当前房间ID
     */
    public get roomId(): string {
        return this._roomId;
    }
    
    /**
     * 获取当前会话ID
     */
    public get sessionId(): string {
        return this._sessionId;
    }
    
    /**
     * 获取当前房间状态
     */
    public get roomState(): LiarDiceRoomState | null {
        return this._lastState;
    }
    
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param data 事件数据
     */
    public emit(eventName: string, data?: any): void {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`[网络][错误] 事件处理器出错 ${eventName}:`, error);
                }
            });
        }
    }
    
    /**
     * 注册事件监听
     * @param eventName 事件名称
     * @param handler 事件处理器
     */
    public on(eventName: string, handler: (data?: any) => void): void {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        const handlers = this.eventHandlers.get(eventName);
        if (handlers && !handlers.includes(handler)) {
            handlers.push(handler);
        }
    }
    
    /**
     * 移除事件监听
     * @param eventName 事件名称
     * @param handler 事件处理器
     */
    public off(eventName: string, handler: (data?: any) => void): void {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    /**
     * 移除特定事件的所有监听器
     * @param eventName 事件名称
     */
    public offAll(eventName: string): void {
        this.eventHandlers.delete(eventName);
    }
    
    /**
     * 创建错误对象
     * @param code 错误代码
     * @param message 错误消息
     * @param details 详细信息
     * @returns 错误对象
     */
    private _createError(code: NetworkErrorCode, message: string, details?: any): NetworkError {
        return { code, message, details };
    }
    
    /**
     * 初始化Colyseus客户端
     * @returns 成功返回true，失败返回false
     */
    private _initColyseusClient(): boolean {
        try {
            if (!this.colyseusClient) {
                console.log(`[网络] 初始化 Colyseus 客户端，服务器地址: ${this.serverUrl}`);
                
                // 获取Client构造函数，兼容不同的导出方式
                let ClientCtor: any;
                if (typeof ColyseusModule === "function") {
                    // 情况A：ColyseusModule本身就是构造函数
                    ClientCtor = ColyseusModule;
                } else if (ColyseusModule.Client) {
                    // 情况B：ColyseusModule.Client存在
                    ClientCtor = ColyseusModule.Client;
                } else if (ColyseusModule.default) {
                    // 情况C：放在.default里
                    ClientCtor = ColyseusModule.default.Client || ColyseusModule.default;
                } else {
                    throw new Error("无法找到 Colyseus.Client 构造函数");
                }
                
                // 确保使用正确的协议和配置
                const serverUrl = this.serverUrl;
                console.log(`[网络] 使用服务器地址: ${serverUrl}`);
                
                // 禁用 withCredentials，避免 CORS 错误
                this.colyseusClient = new ClientCtor(serverUrl, { 
                    headers: {},
                    urlBuilder: null,
                    // 添加自定义配置来禁用 withCredentials
                    httpOptions: { 
                        withCredentials: false,
                        // 添加重试和超时设置
                        retryCount: 3,
                        retryDelay: 1500,
                        timeout: 10000
                    } 
                });
            }
            return true;
        } catch (error) {
            console.error('[网络][错误] 初始化 Colyseus 客户端失败:', error);
            this._status = NetworkStatus.ERROR;
            this.emit('error', this._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '初始化客户端失败', error));
            return false;
        }
    }
    
    /**
     * 尝试下一个服务器URL
     * @returns 是否有下一个URL可尝试
     */
    private _tryNextServerUrl(): boolean {
        if (this.currentServerUrlIndex < this.serverUrls.length - 1) {
            this.currentServerUrlIndex++;
            console.log(`[网络] 尝试下一个服务器地址: ${this.serverUrl}`);
            this.colyseusClient = null; // 重置客户端，强制重新初始化
            return true;
        }
        return false;
    }
    
    /**
     * 重置服务器URL索引到第一个
     */
    private _resetServerUrlIndex(): void {
        this.currentServerUrlIndex = 0;
    }
    
    /**
     * 加入或创建骰子游戏房间
     * @param options 选项，如玩家名称、是否创建新房间、房间ID等
     * @returns Promise<Colyseus.Room<LiarDiceRoomState>>
     */
    public async joinLiarDiceRoom(options: LiarDiceRoomOptions): Promise<Colyseus.Room<LiarDiceRoomState>> {
        // 1. 确保客户端已初始化
        if (!this._initColyseusClient()) {
            throw this._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '初始化客户端失败');
        }
        
        // 2. 如果已在房间中，先离开
        if (this.colyseusRoom) {
            console.warn("[网络][警告] 已经在一个房间中，将先离开旧房间...");
            try {
                await this.leaveRoom();
            } catch (error) {
                console.error("[网络][错误] 离开旧房间失败:", error);
                // 继续尝试加入新房间
            }
        }
        
        // 3. 设置状态
        this._status = NetworkStatus.JOINING_ROOM;
        this.emit('statusChange', this._status);
        
        try {
            console.log(`[网络] ${options.create ? '创建' : '加入'}房间, 玩家名称: ${options.playerName}${options.roomId ? ', 房间ID: ' + options.roomId : ''}`);
            
            // 4. 根据选项决定是创建还是加入房间
            if (options.create) {
                // 创建新房间
                this.colyseusRoom = await this.colyseusClient!.create<LiarDiceRoomState>("liar_dice", {
                    playerName: options.playerName,
                    userId: LoginManager.currentPlayerId // 传递用户ID
                });
            } else if (options.roomId) {
                // 加入指定ID的房间
                this.colyseusRoom = await this.colyseusClient!.joinById<LiarDiceRoomState>(
                    options.roomId,
                    {
                        playerName: options.playerName,
                        userId: LoginManager.currentPlayerId
                    }
                );
            } else {
                // 加入任意可用房间，如果没有则创建
                this.colyseusRoom = await this.colyseusClient!.joinOrCreate<LiarDiceRoomState>(
                    "liar_dice",
                    {
                        playerName: options.playerName,
                        userId: LoginManager.currentPlayerId
                    }
                );
            }
            
            // 5. 设置房间相关信息
            this._roomId = this.colyseusRoom.roomId;
            this._sessionId = this.colyseusRoom.sessionId;
            this._status = NetworkStatus.CONNECTED;
            
            // 6. 设置房间监听器
            this._setupRoomListeners();
            
            // 7. 触发连接成功事件
            this.emit('connected', {
                roomId: this._roomId,
                sessionId: this._sessionId
            });
            this.emit('statusChange', this._status);
            
            console.log(`[网络] 成功${options.create ? '创建' : '加入'}房间, ID: ${this._roomId}, 会话ID: ${this._sessionId}`);
            
            return this.colyseusRoom;
            
        } catch (error) {
            // 8. 处理连接错误
            console.error(`[网络][错误] ${options.create ? '创建' : '加入'}房间失败:`, error);
            
            // 尝试下一个服务器地址
            if (this._tryNextServerUrl()) {
                console.log('[网络] 尝试使用下一个服务器地址重新连接...');
                return this.joinLiarDiceRoom(options);
            }
            
            // 重置服务器索引，以便下次从第一个开始尝试
            this._resetServerUrlIndex();
            
            // 设置错误状态
            this._status = NetworkStatus.ERROR;
            this.emit('statusChange', this._status);
            
            // 根据错误类型创建具体错误
            let errorCode = NetworkErrorCode.ROOM_JOIN_ERROR;
            let errorMessage = '加入房间失败';
            
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    errorCode = NetworkErrorCode.ROOM_NOT_FOUND;
                    errorMessage = '房间不存在';
                } else if (error.message.includes('full')) {
                    errorCode = NetworkErrorCode.ROOM_FULL;
                    errorMessage = '房间已满';
                } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
                    errorCode = NetworkErrorCode.CONNECTION_TIMEOUT;
                    errorMessage = '连接超时';
                }
            }
            
            const networkError = this._createError(errorCode, errorMessage, error);
            this.emit('error', networkError);
            throw networkError;
        }
    }
    
    /**
     * 离开当前房间
     */
    public async leaveRoom(): Promise<void> {
        if (this.colyseusRoom) {
            try {
                console.log(`[网络] 离开房间: ${this._roomId}`);
                await this.colyseusRoom.leave();
            } catch (error) {
                console.error('[网络][错误] 离开房间时出错:', error);
            } finally {
                this._cleanupRoomConnection(NetworkErrorCode.CONNECTION_CLOSED);
            }
        } else {
            console.warn('[网络][警告] 尝试离开房间，但当前未在任何房间中');
        }
    }
    
    /**
     * 断开与服务器的连接
     */
    public disconnect(): void {
        this.leaveRoom();
        if (this.colyseusClient) {
            console.log('[网络] 断开与服务器的连接');
            // Colyseus.js 客户端没有显式的断开连接方法，离开房间即可
            this.colyseusClient = null;
        }
        this._status = NetworkStatus.DISCONNECTED;
        this.emit('statusChange', this._status);
        this.emit('disconnected');
    }
    
    /**
     * 向服务器发送消息
     * @param type 消息类型
     * @param payload 消息内容
     */
    public send(type: string, payload?: any): void {
        if (!this.colyseusRoom) {
            console.error("[网络] 不在房间内，无法发送消息:", type);
            this.emit('error', this._createError(NetworkErrorCode.CONNECTION_CLOSED, '不在房间内，无法发送消息'));
            return;
        }
        
        try {
            console.log(`[网络] 发送消息: ${type}`, payload);
            this.colyseusRoom.send(type, payload);
        } catch (error) {
            console.error(`[网络][错误] 发送消息 ${type} 失败:`, error);
            this.emit('error', this._createError(NetworkErrorCode.CONNECTION_ERROR, '发送消息失败', error));
        }
    }
    
    /**
     * 初始化客户端
     * @private
     * @returns 是否初始化成功
     */
    private _initClient(): boolean {
        return this._initColyseusClient();
    }
    
    // 已删除重复的 getAvailableRooms 方法，使用下面的实现
    
    /**
     * 设置房间监听器
     */
    private _setupRoomListeners(): void {
        if (!this.colyseusRoom) {
            console.error('[网络] 无法设置房间监听器：房间未初始化');
            return;
        }
        
        console.log(`[网络][${this.colyseusRoom.roomId}] 设置房间监听器...`);
        
        try {
            // 尝试访问state，如果出错则说明Schema版本不兼容
            const stateTest = this.colyseusRoom.state;
            console.log(`[网络] 房间状态类型: ${stateTest ? typeof stateTest : 'undefined'}`);
            
            // 监听房间状态变化
            this.colyseusRoom.onStateChange((state: any) => {
                try {
                    // 将服务器的Schema状态转换为客户端可用的普通对象
                    const clientState = this._convertSchemaToClientState(state);
                    this._lastState = clientState;
                    this.emit('stateChange', clientState);
                } catch (error) {
                    console.error('[网络] 处理状态变化时出错:', error);
                }
            });
            
            // 监听房间错误
            this.colyseusRoom.onError((code: number, message?: string) => {
                console.error(`[网络][错误] 房间错误: ${code} - ${message}`);
                this.emit('error', this._createError(
                    NetworkErrorCode.SERVER_ERROR,
                    message || '服务器错误',
                    { code }
                ));
            });
            
            // 监听房间离开事件
            this.colyseusRoom.onLeave((code: number) => {
                console.log(`[网络] 离开房间，代码: ${code}`);
                this._cleanupRoomConnection(code);
            });
            
            // 监听所有消息
            this.colyseusRoom.onMessage("*", (data: any) => {
                try {
                    // 从数据中提取类型和消息
                    const { type, message } = data;
                    const eventType = String(type);
                    console.log(`[网络] 收到消息: ${eventType}`, message);
                    
                    // 触发对应类型的事件
                    this.emit(eventType, message);
                    
                    // 同时触发通用消息事件
                    this.emit('message', { type: eventType, message });
                } catch (error) {
                    console.error('[网络] 处理消息时出错:', error);
                }
            });
            
            // 尝试安全地处理初始玩家列表
            this._safelyProcessInitialPlayers();
            
            // 使用 onStateChange 来监听玩家变化
            this.colyseusRoom.onStateChange((state: any) => {
                try {
                    this._safelyProcessPlayerChanges(state);
                } catch (error) {
                    console.error('[网络] 处理玩家变化时出错:', error);
                }
            });
        } catch (error) {
            console.error('[网络] 设置房间监听器时出错:', error);
            // 尝试基本的错误恢复
            this.emit('error', this._createError(
                NetworkErrorCode.CLIENT_INIT_ERROR,
                '设置房间监听器失败，可能是Schema版本不兼容',
                { originalError: error }
            ));
        }
    }
    
    /**
     * 安全地处理初始玩家列表
     * @private
     */
    private _safelyProcessInitialPlayers(): void {
        try {
            if (!this.colyseusRoom || !this.colyseusRoom.state) return;
            
            // 尝试多种方式访问玩家列表
            const state = this.colyseusRoom.state;
            
            // 方法1: 使用forEach (如果是MapSchema)
            if (state.players && typeof state.players.forEach === 'function') {
                state.players.forEach((player: any, sessionId: string) => {
                    try {
                        const playerData = this._extractPlayerData(player);
                        console.log(`[网络] 初始玩家: ${playerData.name} (${sessionId})`);
                        this.emit('playerJoin', { player: playerData, sessionId });
                    } catch (e) {
                        console.error(`[网络] 处理玩家数据时出错:`, e);
                    }
                });
                return;
            }
            
            // 方法2: 尝试作为普通对象处理
            if (state.players && typeof state.players === 'object') {
                Object.keys(state.players).forEach(sessionId => {
                    try {
                        const player = (state.players as any)[sessionId];
                        const playerData = this._extractPlayerData(player);
                        console.log(`[网络] 初始玩家(对象模式): ${playerData.name} (${sessionId})`);
                        this.emit('playerJoin', { player: playerData, sessionId });
                    } catch (e) {
                        console.error(`[网络] 处理玩家数据时出错:`, e);
                    }
                });
                return;
            }
            
            console.log(`[网络] 无法遍历玩家列表，可能是 Schema 版本不兼容`);
        } catch (error) {
            console.error('[网络] 处理初始玩家列表时出错:', error);
        }
    }
    /**
     * 安全地处理玩家变化
     * @param state 服务器状态
     * @private
     */
    private _safelyProcessPlayerChanges(state: any): void {
        if (!state || !this._lastState) return;
        
        try {
            // 将服务器状态转换为客户端可用的格式
            const clientState = this._convertSchemaToClientState(state);
            
            // 处理玩家加入和状态变化
            if (clientState.players) {
                Object.entries(clientState.players).forEach(([sessionId, player]) => {
                    const previousPlayers = this._lastState?.players;
                    let previousPlayer = null;
                    
                    // 尝试获取之前的玩家数据
                    if (previousPlayers instanceof Map) {
                        previousPlayer = previousPlayers.get(sessionId);
                    } else if (previousPlayers && typeof previousPlayers === 'object') {
                        previousPlayer = (previousPlayers as any)[sessionId];
                    }
                    
                    if (!previousPlayer) {
                        // 新玩家加入
                        console.log(`[网络] 玩家加入: ${player.name} (${sessionId})`);
                        this.emit('playerJoin', { player, sessionId });
                    } else if (JSON.stringify(previousPlayer) !== JSON.stringify(player)) {
                        // 玩家状态变化
                        console.log(`[网络] 玩家 ${player.name} (${sessionId}) 状态变化`);
                        this.emit('playerChange', { player, sessionId });
                    }
                });
            }
            
            // 处理玩家离开
            if (this._lastState.players) {
                // 获取上一个状态的玩家列表
                const lastPlayers = this._lastState.players instanceof Map ? 
                    Array.from(this._lastState.players.entries()) : 
                    Object.entries(this._lastState.players);
                
                // 遍历玩家列表，使用类型断言确保类型安全
                lastPlayers.forEach((entry) => {
                    const sessionId = entry[0];
                    const player = entry[1] as PlayerState;
                    const currentPlayers = clientState.players;
                    let playerExists = false;
                    
                    // 检查玩家是否还存在
                    if (currentPlayers instanceof Map) {
                        playerExists = currentPlayers.has(sessionId);
                    } else if (currentPlayers && typeof currentPlayers === 'object') {
                        playerExists = sessionId in currentPlayers;
                    }
                    
                    if (!playerExists) {
                        // 玩家离开
                        console.log(`[网络] 玩家离开: ${player.name} (${sessionId})`);
                        this.emit('playerLeave', { player: player as PlayerState, sessionId });
                    }
                });
            }
            
            this._lastState = clientState;
        } catch (error) {
            console.error('[网络] 处理玩家变化时出错:', error);
        }
    }
    
    private _convertSchemaToClientState(state: any): LiarDiceRoomState {
        if (!state) return new LiarDiceRoomState();
        
        try {
            // 创建新的客户端状态对象
            const clientState = new LiarDiceRoomState();
            
            // 复制基本属性
            if (state.activePlayerIds) {
                clientState.activePlayerIds = this._extractArrayData(state.activePlayerIds);
            }
            
            clientState.currentPlayerIndex = this._getNumberProperty(state, 'currentPlayerIndex', 0);
            clientState.currentBidValue = this._getNumberProperty(state, 'currentBidValue', 0);
            clientState.currentBidCount = this._getNumberProperty(state, 'currentBidCount', 0);
            clientState.lastBidderSessionId = this._getStringProperty(state, 'lastBidderSessionId', '');
            clientState.status = this._getStringProperty(state, 'status', 'waiting');
            clientState.hostId = this._getStringProperty(state, 'hostId', '');
            clientState.roundNumber = this._getNumberProperty(state, 'roundNumber', 0);
            clientState.moveNumber = this._getNumberProperty(state, 'moveNumber', 0);
            clientState.roundResult = this._getStringProperty(state, 'roundResult', '');
            clientState.isOneCalledThisRound = this._getBooleanProperty(state, 'isOneCalledThisRound', false);
            
            // 处理玩家列表
            if (state.players) {
                // 如果是MapSchema，使用forEach
                if (typeof state.players.forEach === 'function') {
                    state.players.forEach((player: any, sessionId: string) => {
                        const playerData = this._extractPlayerData(player);
                        clientState.players.set(sessionId, playerData);
                    });
                }
                // 如果是普通对象，使用Object.entries
                else if (typeof state.players === 'object') {
                    Object.entries(state.players).forEach(([sessionId, player]) => {
                        const playerData = this._extractPlayerData(player as any);
                        clientState.players.set(sessionId, playerData);
                    });
                }
            }
            
            return clientState;
        } catch (error) {
            console.error('[网络] 转换Schema状态时出错:', error);
            return new LiarDiceRoomState();
        }
    }
    
    /**
     * 提取玩家数据
     * @param player 服务器玩家数据
     * @returns 客户端玩家数据
     * @private
     */
    private _extractPlayerData(player: any): PlayerState {
        const playerData = new PlayerState();
        
        if (!player) return playerData;
        
        try {
            // 复制基本属性
            playerData.id = this._getStringProperty(player, 'id', '');
            playerData.sessionId = this._getStringProperty(player, 'sessionId', '');
            playerData.name = this._getStringProperty(player, 'name', '');
            playerData.diceCount = this._getNumberProperty(player, 'diceCount', 0);
            playerData.isReady = this._getBooleanProperty(player, 'isReady', false);
            playerData.isConnected = this._getBooleanProperty(player, 'isConnected', true);
            playerData.isAI = this._getBooleanProperty(player, 'isAI', false);
            playerData.aiType = this._getStringProperty(player, 'aiType', '');
            
            // 如果有骰子数据，也复制过来
            if (player.currentDices) {
                playerData.currentDices = this._extractArrayData(player.currentDices);
            }
        } catch (error) {
            console.error('[网络] 提取玩家数据时出错:', error);
        }
        
        return playerData;
    }
    
    /**
     * 安全地提取数组数据
     * @param arr 数组或ArraySchema
     * @returns 普通数组
     * @private
     */
    private _extractArrayData(arr: any): any[] {
        if (!arr) return [];
        
        try {
            // 如果是ArraySchema，使用toArray方法
            if (typeof arr.toArray === 'function') {
                return arr.toArray();
            }
            
            // 如果是普通数组，直接返回
            if (Array.isArray(arr)) {
                return [...arr];
            }
            
            // 如果是类数组对象，转换为数组
            if (typeof arr.forEach === 'function') {
                const result: any[] = [];
                arr.forEach((item: any) => result.push(item));
                return result;
            }
            
            // 如果是普通对象，尝试转换为数组
            if (typeof arr === 'object') {
                return Object.values(arr);
            }
        } catch (error) {
            console.error('[网络] 提取数组数据时出错:', error);
        }
        
        return [];
    }
    
    /**
     * 安全地获取字符串属性
     * @param obj 对象
     * @param prop 属性名
     * @param defaultValue 默认值
     * @returns 字符串值
     * @private
     */
    private _getStringProperty(obj: any, prop: string, defaultValue: string = ''): string {
        if (!obj) return defaultValue;
        
        try {
            // 尝试直接访问
            if (obj[prop] !== undefined) {
                return String(obj[prop]);
            }
            
            // 尝试通过getter访问
            if (typeof obj.get === 'function') {
                const value = obj.get(prop);
                if (value !== undefined) {
                    return String(value);
                }
            }
        } catch (error) {
            // 忽略错误，返回默认值
        }
        
        return defaultValue;
    }
    
    /**
     * 安全地获取数字属性
     * @param obj 对象
     * @param prop 属性名
     * @param defaultValue 默认值
     * @returns 数字值
     * @private
     */
    private _getNumberProperty(obj: any, prop: string, defaultValue: number = 0): number {
        if (!obj) return defaultValue;
        
        try {
            // 尝试直接访问
            if (obj[prop] !== undefined) {
                const num = Number(obj[prop]);
                return isNaN(num) ? defaultValue : num;
            }
            
            // 尝试通过getter访问
            if (typeof obj.get === 'function') {
                const value = obj.get(prop);
                if (value !== undefined) {
                    const num = Number(value);
                    return isNaN(num) ? defaultValue : num;
                }
            }
        } catch (error) {
            // 忽略错误，返回默认值
        }
        
        return defaultValue;
    }
    
    /**
     * 安全地获取布尔属性
     * @param obj 对象
     * @param prop 属性名
     * @param defaultValue 默认值
     * @returns 布尔值
     * @private
     */
    private _getBooleanProperty(obj: any, prop: string, defaultValue: boolean = false): boolean {
        if (!obj) return defaultValue;
        
        try {
            // 尝试直接访问
            if (obj[prop] !== undefined) {
                return Boolean(obj[prop]);
            }
            
            // 尝试通过getter访问
            if (typeof obj.get === 'function') {
                const value = obj.get(prop);
                if (value !== undefined) {
                    return Boolean(value);
                }
            }
        } catch (error) {
            // 忽略错误，返回默认值
        }
        
        return defaultValue;
    }
    
    /**
     * 清理房间连接相关状态并触发断开连接事件
     * @param code 断开连接的代码
     */
    private _cleanupRoomConnection(code: number): void {
        if (!this.colyseusRoom && this._status === NetworkStatus.DISCONNECTED) {
            return; // 避免重复清理
        }
        
        // 记录之前的房间ID，用于日志
        const prevRoomId = this._roomId;
        
        // 重置房间相关状态
        this.colyseusRoom = null;
        this._roomId = '';
        this._sessionId = '';
        this._lastState = null;
        this._status = NetworkStatus.DISCONNECTED;
        
        // 触发状态变化和断开连接事件
        console.log(`[网络] 房间连接已清理: ${prevRoomId}`);
        this.emit('statusChange', this._status);
        this.emit('roomDisconnected', { code, roomId: prevRoomId });
    }
    
    /**
     * 获取可用房间列表
     * @param roomName 可选的房间名称过滤
     * @returns Promise<RoomAvailable[]>
     */
    public async getAvailableRooms(roomName?: string): Promise<any[]> {
        if (!this._initColyseusClient()) {
            throw this._createError(NetworkErrorCode.CLIENT_INIT_ERROR, '初始化客户端失败');
        }
        
        try {
            console.log('[网络] 获取可用房间列表...');
            
            // 构造正确的HTTP URL，而不是WebSocket URL
            let httpUrl = this.serverUrl.replace('ws://', 'http://').replace('wss://', 'https://');
            const path = roomName ? `/rooms/${roomName}` : '/rooms';
            console.log(`[网络] 请求房间列表URL: ${httpUrl}${path}`);
            
            // 使用正确的HTTP URL请求
            const response = await this.colyseusClient!.http.get(path);
            
            // 处理响应数据，确保返回数组
            const rooms = Array.isArray(response) ? response : [];
            
            console.log(`[网络] 找到 ${rooms.length} 个可用房间`);
            return rooms;
        } catch (error) {
            console.error('[网络][错误] 获取可用房间列表失败:', error);
            
            // 尝试下一个服务器地址
            if (this._tryNextServerUrl()) {
                console.log('[网络] 尝试使用下一个服务器地址重新获取房间列表...');
                // 重置客户端并重试
                this.colyseusClient = null;
                this._initColyseusClient();
                return this.getAvailableRooms(roomName);
            }
            
            // 重置服务器索引，以便下次从第一个开始尝试
            this._resetServerUrlIndex();
            
            const networkError = this._createError(
                NetworkErrorCode.CONNECTION_ERROR,
                '获取可用房间列表失败',
                error
            );
            this.emit('error', networkError);
            throw networkError;
        }
    }
    
    /**
     * 重新连接到之前的房间
     * @param sessionId 之前的会话ID
     * @param roomId 之前的房间ID
     * @returns Promise<boolean> 是否重连成功
     */
    public async reconnect(sessionId: string, roomId: string): Promise<boolean> {
        if (!sessionId || !roomId) {
            console.error('[网络][错误] 重连失败: 缺少会话ID或房间ID');
            return false;
        }
        
        if (!this._initColyseusClient()) {
            return false;
        }
        
        this._status = NetworkStatus.RECONNECTING;
        this.emit('statusChange', this._status);
        
        try {
            console.log(`[网络] 尝试重连到房间: ${roomId}, 会话ID: ${sessionId}`);
            
            // Colyseus.js 客户端可能没有直接的 reconnect 方法
            // 我们使用 joinById 来模拟重连
            this.colyseusRoom = await this.colyseusClient!.joinById<LiarDiceRoomState>(
                roomId,
                {
                    sessionId: sessionId,
                    reconnect: true
                }
            );
            
            this._roomId = this.colyseusRoom.roomId;
            this._sessionId = this.colyseusRoom.sessionId;
            this._status = NetworkStatus.CONNECTED;
            
            this._setupRoomListeners();
            
            this.emit('reconnected', {
                roomId: this._roomId,
                sessionId: this._sessionId
            });
            this.emit('statusChange', this._status);
            
            console.log(`[网络] 重连成功, 房间ID: ${this._roomId}, 会话ID: ${this._sessionId}`);
            
            return true;
        } catch (error) {
            console.error('[网络][错误] 重连失败:', error);
            
            // 尝试下一个服务器地址
            if (this._tryNextServerUrl()) {
                console.log('[网络] 尝试使用下一个服务器地址重新重连...');
                return this.reconnect(sessionId, roomId);
            }
            
            // 重置服务器索引，以便下次从第一个开始尝试
            this._resetServerUrlIndex();
            
            this._status = NetworkStatus.ERROR;
            this.emit('statusChange', this._status);
            
            const networkError = this._createError(
                NetworkErrorCode.CONNECTION_ERROR,
                '重连失败',
                error
            );
            this.emit('error', networkError);
            
            return false;
        }
    }
}
