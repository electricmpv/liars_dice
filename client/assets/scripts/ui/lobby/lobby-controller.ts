import { _decorator, Component, Node, Prefab, instantiate, ScrollView, director } from 'cc'; // 导入 director
import { RoomItem } from '../../prefabs/room-item';
import { PlayerItem } from '../../prefabs/player-item';
import { ChatItem } from '../../prefabs/chat-item';
import { FilterTab } from '../../prefabs/filter-tab';
import { SystemNotice } from '../../prefabs/system-notice';
import { FriendRequest } from '../../prefabs/friend-request';
import { RoomService, SimplifiedRoomInfo } from './services/room-service'; // RoomService now exports SimplifiedRoomInfo adaptation helper
import { FriendService } from './services/friend-service';
import { ChatService } from './services/chat-service';
import type { RoomAvailable } from 'colyseus.js'; // Import Colyseus type
// Corrected relative path (5 levels up) and removing .ts extension
import { RoomStatus as SharedRoomStatus } from '../../../../../shared/protocols/room-protocol';

const { ccclass, property } = _decorator;

// 大厅状态枚举
enum LobbyState {
    ROOM_LIST,      // 房间列表
    FRIEND_LIST,    // 好友列表
    RANKING,        // 排行榜
    SETTINGS        // 设置
}

/**
 * 大厅场景控制器
 * 功能：
 * 1. 管理大厅UI和交互逻辑
 * 2. 协调房间列表、好友列表、聊天系统等模块
 * 3. 处理状态切换和场景跳转
 */
@ccclass('LobbyController')
export class LobbyController extends Component {
    // 预制体引用
    @property(Prefab)
    roomItemPrefab: Prefab = null!;
    
    @property(Prefab)
    playerItemPrefab: Prefab = null!;
    
    @property(Prefab)
    chatItemPrefab: Prefab = null!;

    @property(Prefab)
    filterTabPrefab: Prefab = null!;

    @property(Prefab)
    systemNoticePrefab: Prefab = null!;

    @property(Prefab)
    friendRequestPrefab: Prefab = null!;

    // UI容器引用
    @property(Node)
    roomListContainer: Node = null!;
    
    @property(Node)
    friendListContainer: Node = null!;
    
    @property(Node)
    chatMessageContainer: Node = null!;

    @property(Node)
    filterTabsContainer: Node = null!;

    @property(Node)
    noticeContainer: Node = null!;

    @property(Node)
    popupLayer: Node = null!;

    @property(ScrollView)
    roomScrollView: ScrollView = null!;

    @property(ScrollView)
    friendScrollView: ScrollView = null!;

    @property(ScrollView)
    chatScrollView: ScrollView = null!;

    // UI面板引用
    @property(Node)
    headerPanel: Node = null!;

    @property(Node)
    contentPanel: Node = null!;

    @property(Node)
    footerPanel: Node = null!;

    @property(Node)
    roomListPanel: Node = null!;

    @property(Node)
    friendListPanel: Node = null!;

    @property(Node)
    rankListPanel: Node = null!;

    @property(Node)
    settingsPanel: Node = null!;

    // 服务实例
    private _roomService: RoomService = null!;
    private _friendService: FriendService = null!;
    private _chatService: ChatService = null!;

    // 状态管理
    private _currentState: LobbyState = LobbyState.ROOM_LIST;
    private _filterTabs: Map<string, FilterTab[]> = new Map(); // 分组管理过滤标签
    private _systemNotice: SystemNotice = null!; // 系统通知实例

    // 缓存的数据
    private _cachedRooms: RoomAvailable[] = []; // Store RoomAvailable from RoomService
    private _cachedFriends: any[] = []; // Keep as any[] for now, adapt later if needed
    private _cachedMessages: any[] = []; // Keep as any[]

    // 用于防止重复加入
    private _isJoiningRoom: boolean = false;

    onLoad() {
        this.initServices();
        this.initSystemNotice();
        this.setupEventListeners();
    }

    start() {
        // 初始化默认状态
        this.setState(LobbyState.ROOM_LIST);
        
        // 加载初始数据
        this.loadInitialData();
        
        // 创建过滤标签
        this.createFilterTabs();
    }

    onDestroy() {
        this.removeEventListeners();
        
        // 销毁服务实例
        if (this._roomService && typeof (this._roomService as any).onDestroy === 'function') {
            (this._roomService as any).onDestroy();
        }
        if (this._friendService && typeof (this._friendService as any).onDestroy === 'function') {
            (this._friendService as any).onDestroy();
        }
        if (this._chatService && typeof (this._chatService as any).onDestroy === 'function') {
            (this._chatService as any).onDestroy();
        }
    }

    /**
     * 初始化服务
     */
    private initServices(): void {
        this._roomService = new RoomService();
        this._friendService = new FriendService();
        this._chatService = new ChatService();
    }

    /**
     * 初始化系统通知组件
     */
    private initSystemNotice(): void {
        if (this.systemNoticePrefab && this.noticeContainer) {
            const noticeNode = instantiate(this.systemNoticePrefab);
            this.noticeContainer.addChild(noticeNode);
            this._systemNotice = noticeNode.getComponent(SystemNotice)!;
        }
    }

    /**
     * 设置事件监听
     */
    private setupEventListeners(): void {
        // 房间相关事件
        this._roomService.on('room-list-updated', this.updateRoomList, this);
        this._roomService.on('room-created', this.onRoomCreated, this);
        this._roomService.on('room-joined', this.onRoomJoined, this);
        this._roomService.on('room-join-failed', this.onRoomJoinFailed, this);
        
        // 好友相关事件
        this._friendService.on('friend-list-updated', this.updateFriendList, this);
        this._friendService.on('friend-request-received', this.showFriendRequest, this);
        this._friendService.on('friend-status-changed', this.updateFriendStatus, this);
        
        // 聊天相关事件
        this._chatService.on('message-received', this.onMessageReceived, this);
        this._chatService.on('message-sent', this.onMessageSent, this);
        this._chatService.on('chat-error', this.onChatError, this);
    }

    /**
     * 移除事件监听
     */
    private removeEventListeners(): void {
        // 房间相关事件
        this._roomService.off('room-list-updated', this.updateRoomList, this);
        this._roomService.off('room-created', this.onRoomCreated, this);
        this._roomService.off('room-joined', this.onRoomJoined, this);
        this._roomService.off('room-join-failed', this.onRoomJoinFailed, this);
        
        // 好友相关事件
        this._friendService.off('friend-list-updated', this.updateFriendList, this);
        this._friendService.off('friend-request-received', this.showFriendRequest, this);
        this._friendService.off('friend-status-changed', this.updateFriendStatus, this);
        
        // 聊天相关事件
        this._chatService.off('message-received', this.onMessageReceived, this);
        this._chatService.off('message-sent', this.onMessageSent, this);
        this._chatService.off('chat-error', this.onChatError, this);
    }

    /**
     * 加载初始数据
     */
    private async loadInitialData(): Promise<void> {
        try {
            // 显示加载中通知
            this.showNotice("正在加载数据...", "info");

            // 并行加载数据
            await Promise.all([
                this._roomService.fetchRooms(),
                this._friendService.fetchFriends(),
                this._chatService.connect()
            ]);

            // 显示成功通知
            this.showNotice("数据加载完成", "success");
        } catch (error) {
            console.error("加载数据失败:", error);
            this.showNotice("数据加载失败，请重试", "error");
        }
    }

    /**
     * 创建过滤标签
     */
    private createFilterTabs(): void {
        if (!this.filterTabPrefab || !this.filterTabsContainer) return;
        
        // 创建房间过滤标签
        const roomTabs = [
            { id: 'all', name: '全部房间' },
            { id: 'waiting', name: '等待中' },
            { id: 'playing', name: '游戏中' },
            { id: 'friends', name: '好友房间' }
        ];
        
        this.createTabGroup('room', roomTabs, this.onRoomFilterChanged.bind(this));
        
        // 创建好友过滤标签
        const friendTabs = [
            { id: 'all', name: '全部好友' },
            { id: 'online', name: '在线好友' },
            { id: 'playing', name: '游戏中' }
        ];
        
        this.createTabGroup('friend', friendTabs, this.onFriendFilterChanged.bind(this));
    }

    /**
     * 创建标签组
     */
    private createTabGroup(groupId: string, tabs: {id: string, name: string}[], callback: Function): void {
        if (!this.filterTabPrefab || !this.filterTabsContainer) return;
        
        const group: FilterTab[] = [];
        
        tabs.forEach((tab, index) => {
            const tabNode = instantiate(this.filterTabPrefab);
            const tabComp = tabNode.getComponent(FilterTab)!;
            
            tabComp.setTabId(tab.id);
            tabComp.setTabName(tab.name);
            tabComp.setGroupId(groupId);
            tabComp.setTabIndex(index);
            
            // 设置第一个标签为选中状态
            if (index === 0) {
                tabComp.setSelected(true);
            }
            
            // 添加标签切换事件
            tabNode.on('tab-selected', (event: any) => {
                // 更新同组其他标签状态
                group.forEach(otherTab => {
                    if (otherTab !== tabComp) {
                        otherTab.setSelected(false);
                    }
                });
                
                // 调用回调
                if (callback) {
                    callback(tab.id);
                }
            });
            
            this.filterTabsContainer.addChild(tabNode);
            group.push(tabComp);
        });
        
        this._filterTabs.set(groupId, group);
    }

    /**
     * 设置当前状态
     */
    public setState(newState: LobbyState): void {
        this._currentState = newState;
        this.updateUIState();
    }

    /**
     * 更新UI状态
     */
    private updateUIState(): void {
        // 隐藏所有面板
        if (this.roomListPanel) this.roomListPanel.active = false;
        if (this.friendListPanel) this.friendListPanel.active = false;
        if (this.rankListPanel) this.rankListPanel.active = false;
        if (this.settingsPanel) this.settingsPanel.active = false;
        
        // 显示当前状态对应的面板
        switch (this._currentState) {
            case LobbyState.ROOM_LIST:
                if (this.roomListPanel) this.roomListPanel.active = true;
                // 更新房间列表
                this.updateRoomList(this._cachedRooms);
                break;
                
            case LobbyState.FRIEND_LIST:
                if (this.friendListPanel) this.friendListPanel.active = true;
                // 更新好友列表
                this.updateFriendList(this._cachedFriends);
                break;
                
            case LobbyState.RANKING:
                if (this.rankListPanel) this.rankListPanel.active = true;
                break;
                
            case LobbyState.SETTINGS:
                if (this.settingsPanel) this.settingsPanel.active = true;
                break;
        }
        
        // 更新过滤标签显示
        this.updateFilterTabsVisibility();
    }

    /**
     * 更新过滤标签显示
     */
    private updateFilterTabsVisibility(): void {
        if (!this.filterTabsContainer) return;
        
        // 获取所有分组
        this._filterTabs.forEach((tabs, groupId) => {
            // 根据当前状态决定是否显示
            const visible = 
                (groupId === 'room' && this._currentState === LobbyState.ROOM_LIST) || 
                (groupId === 'friend' && this._currentState === LobbyState.FRIEND_LIST);
            
            // 设置标签显示/隐藏
            tabs.forEach(tab => {
                tab.node.active = visible;
            });
        });
    }

    /**
     * 切换到房间列表
     */
    public switchToRoomList(): void {
        this.setState(LobbyState.ROOM_LIST);
    }

    /**
     * 切换到好友列表
     */
    public switchToFriendList(): void {
        this.setState(LobbyState.FRIEND_LIST);
    }

    /**
     * 切换到排行榜
     */
    public switchToRanking(): void {
        this.setState(LobbyState.RANKING);
    }

    /**
     * 切换到设置
     */
    public switchToSettings(): void {
        this.setState(LobbyState.SETTINGS);
    }

    /**
     * 房间过滤器改变
     */
    private onRoomFilterChanged(filterId: string): void {
        this._roomService.setFilter(filterId);
        this.updateRoomList(this._cachedRooms);
    }

    /**
     * 好友过滤器改变
     */
    private onFriendFilterChanged(filterId: string): void {
        this._friendService.setFilter(filterId);
        this.updateFriendList(this._cachedFriends);
    }

    /**
     * 更新房间列表 (适配 Colyseus RoomAvailable)
     */
    private updateRoomList(rooms: RoomAvailable[]): void { // Change parameter type
        if (!this.roomListContainer || !this.roomItemPrefab) return;

        // 缓存房间列表
        this._cachedRooms = rooms;
        
        // 如果不是房间列表状态，不更新UI
        if (this._currentState !== LobbyState.ROOM_LIST) return;
        
        // 清空当前列表
        this.roomListContainer.removeAllChildren();
        
        // 获取过滤后的房间
        const filteredRooms = this._roomService.getFilteredRooms(rooms);
        
        // 添加房间项
        // 添加房间项 - 使用适配器转换 RoomAvailable
        filteredRooms.forEach(roomAvailable => { // Variable renamed for clarity
            const adaptedInfo = RoomService.adaptRoomAvailable(roomAvailable); // Use static adapter method

            const roomNode = instantiate(this.roomItemPrefab);
            const roomComp = roomNode.getComponent(RoomItem)!;

            // Pass the adapted info to the RoomItem component
            roomComp.setRoomInfo({
                roomId: adaptedInfo.id,
                roomName: adaptedInfo.name,
                playerCount: adaptedInfo.playerCount,
                maxPlayers: adaptedInfo.maxPlayers,
                status: adaptedInfo.status as SharedRoomStatus, // Cast status to expected type
                hasPassword: adaptedInfo.hasPassword ?? false, // Provide default value
                isPrivate: adaptedInfo.isPrivate ?? false, // Provide default value
                hasFriends: false // TODO: Implement friend logic later
            });

            // 监听房间点击事件
            roomNode.on('room-item-clicked', () => this.onRoomItemClicked(adaptedInfo), this); // Pass adaptedInfo
            roomNode.on('join-room', () => this.onJoinRoomClicked(adaptedInfo), this); // Pass adaptedInfo

            this.roomListContainer.addChild(roomNode);
            
            // 播放新增动画
            roomComp.playNewItemAnimation();
        });
        
        // 刷新滚动视图
        if (this.roomScrollView) {
            this.roomScrollView.scrollToTop();
        }
    }

    /**
     * 更新好友列表
     */
    private updateFriendList(friends: any[]): void {
        if (!this.friendListContainer || !this.playerItemPrefab) return;
        
        // 缓存好友列表
        this._cachedFriends = friends;
        
        // 如果不是好友列表状态，不更新UI
        if (this._currentState !== LobbyState.FRIEND_LIST) return;
        
        // 清空当前列表
        this.friendListContainer.removeAllChildren();
        
        // 获取过滤后的好友
        const filteredFriends = this._friendService.getFilteredFriends(friends);
        
        // 添加好友项
        filteredFriends.forEach(friend => {
            const playerNode = instantiate(this.playerItemPrefab);
            const playerComp = playerNode.getComponent(PlayerItem)!;
            
            playerComp.setPlayerId(friend.id);
            playerComp.setPlayerName(friend.name);
            playerComp.setIsOnline(friend.isOnline);
            
            if (friend.avatar) {
                playerComp.setAvatar(friend.avatar);
            }
            
            // 监听玩家点击事件
            playerNode.on('player-item-clicked', this.onPlayerItemClicked, this);
            
            this.friendListContainer.addChild(playerNode);
        });
        
        // 刷新滚动视图
        if (this.friendScrollView) {
            this.friendScrollView.scrollToTop();
        }
    }

    /**
     * 添加聊天消息
     */
    private addChatMessage(message: any): void {
        if (!this.chatMessageContainer || !this.chatItemPrefab) return;
        
        // 创建消息项
        const chatNode = instantiate(this.chatItemPrefab);
        const chatComp = chatNode.getComponent(ChatItem)!;
        
        chatComp.setMessageData({
            id: message.id,
            type: message.type,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            timestamp: message.timestamp
        });
        
        // 添加到消息容器
        this.chatMessageContainer.addChild(chatNode);
        
        // 播放新消息动画
        chatComp.playNewMessageAnimation();
        
        // 滚动到最新消息
        if (this.chatScrollView) {
            this.chatScrollView.scrollToBottom();
        }
        
        // 缓存消息
        this._cachedMessages.push(message);
        
        // 限制缓存消息数量
        if (this._cachedMessages.length > 100) {
            this._cachedMessages.shift();
        }
    }

    /**
     * 显示系统通知
     */
    public showNotice(text: string, type: 'info' | 'warning' | 'error' | 'success' = 'info', duration?: number, isPersistent: boolean = false): void {
        if (this._systemNotice) {
            this._systemNotice.show(text, type, duration, isPersistent);
        }
    }

    /**
     * 显示好友请求
     */
    private showFriendRequest(requestInfo: any): void {
        if (!this.friendRequestPrefab || !this.popupLayer) return;
        
        // 创建好友请求节点
        const requestNode = instantiate(this.friendRequestPrefab);
        const requestComp = requestNode.getComponent(FriendRequest)!;
        
        // 设置请求信息
        requestComp.show({
            requestId: requestInfo.id,
            senderId: requestInfo.senderId,
            senderName: requestInfo.senderName,
            message: requestInfo.message,
            requestType: requestInfo.type
        });
        
        // 监听请求事件
        requestNode.on('request-accepted', (event: any) => {
            this._friendService.acceptFriendRequest(event.detail.requestId);
            this.showNotice(`已接受 ${event.detail.senderName} 的好友请求`, 'success');
        }, this);
        
        requestNode.on('request-rejected', (event: any) => {
            this._friendService.rejectFriendRequest(event.detail.requestId);
        }, this);
        
        this.popupLayer.addChild(requestNode);
    }

    /**
     * 更新好友状态
     */
    private updateFriendStatus(friendInfo: any): void {
        // 更新缓存中的好友状态
        const friend = this._cachedFriends.find(f => f.id === friendInfo.id);
        if (friend) {
            friend.isOnline = friendInfo.isOnline;
            friend.status = friendInfo.status;
        }
        
        // 如果是好友列表状态，更新UI
        if (this._currentState === LobbyState.FRIEND_LIST) {
            this.updateFriendList(this._cachedFriends);
        }
        
        // 如果从离线变为在线，显示通知
        if (friendInfo.isOnline && friend && !friend.isOnline) {
            this.showNotice(`好友 ${friendInfo.name} 上线了`, 'info');
        }
    }

    /**
     * 房间项点击事件 (接收 SimplifiedRoomInfo)
     */
    private onRoomItemClicked(roomInfo: SimplifiedRoomInfo): void {
        // const roomInfo = event.detail; // No longer using event detail
        console.log('房间点击:', roomInfo);
        
        // 显示房间详情
        // TODO: 实现房间详情展示
    }

    /**
    // 用于防止重复加入
    private _isJoiningRoom: boolean = false;

    /**
     * 加入房间按钮点击事件 (接收 SimplifiedRoomInfo)
     */
    private onJoinRoomClicked(roomInfo: SimplifiedRoomInfo): void { // Change parameter type
        if (this._isJoiningRoom) {
            console.warn('[LobbyController] Already attempting to join a room.');
            return; // 防止重复点击
        }
        this._isJoiningRoom = true; // 设置标志位

        console.log('加入房间 (Simplified):', roomInfo); // Log adapted info

        // Use adaptedInfo.id instead of roomInfo.roomId
        if (!roomInfo || !roomInfo.id) {
            console.error('[LobbyController] onJoinRoomClicked: 无效的 roomInfo 或 id');
            this.showNotice("加入房间失败：无效的房间信息", "error");
            this._isJoiningRoom = false; // 重置标志位
            return;
        }

        // 检查房间是否有密码 (use adaptedInfo.hasPassword)
        if (roomInfo.hasPassword) {
            // TODO: Implement password input popup logic
            this.showNotice("该房间需要密码，暂不支持加入", "warning");
            this._isJoiningRoom = false; // 重置标志位
        } else {
            // No password, join directly using adaptedInfo.id
            this.showNotice(`正在加入房间 ${roomInfo.name || roomInfo.id}...`, "info"); // Use adapted name/id
            // No need to check typeof id, as it's guaranteed string by interface
            this._roomService.joinRoom(roomInfo.id)
                .finally(() => {
                    // Reset the flag regardless of success/failure (event is emitted by service)
                    this._isJoiningRoom = false;
                });
            // No need for the 'else' block checking typeof roomId
        }
    }

    /**
     * 玩家项点击事件
     */
    private onPlayerItemClicked(event: any): void {
        const playerInfo = event.detail;
        console.log('玩家点击:', playerInfo);
        
        // 显示玩家信息菜单
        // TODO: 实现玩家信息菜单
    }

    /**
     * 房间创建成功事件
     */
    private onRoomCreated(roomInfo: any): void {
        this.showNotice(`房间 "${roomInfo.name}" 创建成功`, 'success');
        // TODO: 跳转到游戏场景
    }

    /**
     * 房间加入成功事件
     */
    private onRoomJoined(roomInfo: any): void {
        this.showNotice(`已加入房间 "${roomInfo.name}"`, 'success');
        // 跳转到游戏场景 (假设场景名为 RoomScene)
        console.log(`[LobbyController] 准备跳转到房间场景: RoomScene, 房间信息:`, roomInfo);
        // 可以在跳转前保存一些需要传递给下一个场景的数据
        // director.settings.set('currentRoomInfo', roomInfo); // 示例：使用 settings 传递数据
        director.loadScene('RoomScene', (err) => {
            if (err) {
                console.error(`[LobbyController] 跳转到 RoomScene 失败:`, err);
                this.showNotice("跳转房间场景失败", "error");
            }
        });
    }

    /**
     * 房间加入失败事件
     */
    private onRoomJoinFailed(error: any): void {
        // 加入失败时 RoomService 会发出事件，这里显示通知
        // _isJoiningRoom 标志位已在 joinRoom 的 finally 块中重置
        this.showNotice(`加入房间失败: ${error.error || '未知错误'}`, 'error'); // 使用 error.error
    }

    /**
     * 消息接收事件
     */
    private onMessageReceived(message: any): void {
        this.addChatMessage(message);
    }

    /**
     * 消息发送事件
     */
    private onMessageSent(message: any): void {
        this.addChatMessage(message);
    }

    /**
     * 聊天错误事件
     */
    private onChatError(error: any): void {
        this.showNotice(`聊天错误: ${error.message}`, 'error');
    }

    /**
     * 创建房间
     */
    public createRoom(roomInfo: any): void {
        this._roomService.createRoom(roomInfo);
    }

    /**
     * 发送聊天消息
     */
    public sendChatMessage(content: string): void {
        this._chatService.sendMessage(content);
    }

    /**
     * 发送好友请求
     */
    public sendFriendRequest(userId: string, message?: string): void {
        // 显式处理 undefined 情况
        if (typeof message === 'string') {
            this._friendService.sendFriendRequest(userId, message);
        } else {
            // 如果 message 是 undefined 或其他非字符串类型，传递空字符串
            this._friendService.sendFriendRequest(userId, '');
        }
    }

    /**
     * 快速加入按钮点击处理
     */
    public onQuickJoinClicked(): void {
        console.log('[LobbyController] Quick Join button clicked.');
        this.showNotice("正在尝试快速加入...", "info");
        // TODO: 调用 RoomService 的快速加入逻辑
        // this._roomService.quickJoin().catch(error => {
        //     this.showNotice(`快速加入失败: ${error.message}`, 'error');
        // });
    }

    /**
     * 刷新按钮点击处理
     */
    public onRefreshClicked(): void {
        console.log('[LobbyController] Refresh button clicked.');
        this.showNotice("正在刷新房间列表...", "info");
        this.loadInitialData().catch(error => {
             // 错误已在 loadInitialData 内部处理并显示通知
             console.error('[LobbyController] Error refreshing data:', error);
        });
    }

    /**
     * 返回按钮点击处理
     */
    public onBackButtonClick(): void {
        console.log('[LobbyController] Back button clicked.');
        // 返回登录场景
        director.loadScene('LoginScene', (err) => {
            if (err) {
                console.error(`[LobbyController] 跳转到 LoginScene 失败:`, err);
                this.showNotice("返回登录失败", "error");
            }
        });
    }

    /**
     * 设置按钮点击处理
     */
    public onSettingsButtonClicked(): void {
        console.log('[LobbyController] Settings button clicked.');
        this.switchToSettings();
    }

    /**
     * 搜索房间按钮点击处理
     */
    public onSearchRoomClicked(): void {
        console.log('[LobbyController] Search Room button clicked.');
        // TODO: 实现搜索房间的 UI 逻辑，例如弹出搜索框
        this.showNotice("搜索功能暂未实现", "warning");
    }
}
