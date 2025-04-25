import { sys } from 'cc';

/**
 * 好友服务类
 * 负责处理好友相关的网络请求和数据管理
 */
export class FriendService {
    private _listeners: Map<string, Array<{ callback: Function, target: any }>> = new Map();
    private _friendList: any[] = [];
    private _currentFilter: string = 'all';
    private _socket: any = null;

    constructor() {
        this.init();
    }

    /**
     * 初始化
     */
    private init(): void {
        // 初始化WebSocket连接（真实环境中应连接到实际服务器）
        this.initSocketConnection();
    }

    /**
     * 初始化Socket连接
     */
    private initSocketConnection(): void {
        // 真实环境中应连接到实际的WebSocket服务器
        // 这里只是模拟实现
        console.log('[FriendService] 初始化Socket连接');
        
        // 模拟接收好友状态更新
        setInterval(() => {
            this.simulateFriendStatusUpdate();
        }, 30000); // 每30秒模拟一次
    }

    /**
     * 获取好友列表
     */
    public async fetchFriends(): Promise<any[]> {
        return new Promise((resolve) => {
            // 模拟网络请求
            setTimeout(() => {
                this._friendList = this.getMockFriends();
                this.emit('friend-list-updated', this._friendList);
                resolve(this._friendList);
            }, 600);
        });
    }

    /**
     * 设置过滤器
     */
    public setFilter(filter: string): void {
        this._currentFilter = filter;
    }

    /**
     * 获取当前过滤器
     */
    public getFilter(): string {
        return this._currentFilter;
    }

    /**
     * 获取过滤后的好友列表
     */
    public getFilteredFriends(friends: any[]): any[] {
        switch (this._currentFilter) {
            case 'online':
                return friends.filter(friend => friend.isOnline);
            case 'playing':
                return friends.filter(friend => friend.isOnline && friend.status === 1);
            case 'all':
            default:
                return friends;
        }
    }

    /**
     * 发送好友请求
     */
    public sendFriendRequest(userId: string, message?: string): void {
        console.log(`[FriendService] 发送好友请求给用户 ${userId}，消息：${message || '无'}`);
        
        // 模拟发送好友请求
        setTimeout(() => {
            this.emit('friend-request-sent', {
                id: `FR${Date.now().toString().substr(-6)}`,
                targetId: userId,
                message: message || '请求添加您为好友'
            });
        }, 500);
    }

    /**
     * 接受好友请求
     */
    public acceptFriendRequest(requestId: string): void {
        console.log(`[FriendService] 接受好友请求 ${requestId}`);
        
        // 模拟接受好友请求
        setTimeout(() => {
            // 创建一个新的好友
            const newFriend = {
                id: `user_${Date.now().toString().substr(-6)}`,
                name: `玩家${Math.floor(Math.random() * 1000)}`,
                avatar: null,
                isOnline: true,
                status: 0,
                level: Math.floor(Math.random() * 30) + 1,
                addedAt: Date.now()
            };
            
            // 添加到好友列表
            this._friendList.unshift(newFriend);
            
            // 触发事件
            this.emit('friend-request-accepted', { requestId, friend: newFriend });
            this.emit('friend-list-updated', this._friendList);
        }, 500);
    }

    /**
     * 拒绝好友请求
     */
    public rejectFriendRequest(requestId: string): void {
        console.log(`[FriendService] 拒绝好友请求 ${requestId}`);
        
        // 模拟拒绝好友请求
        setTimeout(() => {
            this.emit('friend-request-rejected', { requestId });
        }, 300);
    }

    /**
     * 删除好友
     */
    public removeFriend(friendId: string): void {
        console.log(`[FriendService] 删除好友 ${friendId}`);
        
        // 查找好友
        const index = this._friendList.findIndex(f => f.id === friendId);
        if (index === -1) {
            return;
        }
        
        // 模拟删除好友
        setTimeout(() => {
            // 从列表中移除
            const removedFriend = this._friendList.splice(index, 1)[0];
            
            // 触发事件
            this.emit('friend-removed', removedFriend);
            this.emit('friend-list-updated', this._friendList);
        }, 500);
    }

    /**
     * 更新好友状态
     */
    public updateFriendStatus(friendId: string, isOnline: boolean, status?: number): void {
        console.log(`[FriendService] 更新好友 ${friendId} 状态，在线：${isOnline}，状态：${status}`);
        
        // 查找好友
        const friend = this._friendList.find(f => f.id === friendId);
        if (!friend) {
            return;
        }
        
        // 更新状态
        friend.isOnline = isOnline;
        if (status !== undefined) {
            friend.status = status;
        }
        
        // 触发事件
        this.emit('friend-status-changed', friend);
        this.emit('friend-list-updated', this._friendList);
    }

    /**
     * 模拟好友状态更新
     */
    private simulateFriendStatusUpdate(): void {
        if (this._friendList.length === 0) {
            return;
        }
        
        // 随机选择一个好友
        const randomIndex = Math.floor(Math.random() * this._friendList.length);
        const friend = this._friendList[randomIndex];
        
        // 随机更新状态
        const newIsOnline = Math.random() > 0.3; // 70%概率在线
        const newStatus = Math.floor(Math.random() * 3); // 0-2的状态
        
        // 更新状态
        this.updateFriendStatus(friend.id, newIsOnline, newStatus);
    }

    /**
     * 模拟接收好友请求
     */
    public simulateReceiveFriendRequest(): void {
        const names = ['小明', '小红', '小刚', '小李', '小张', '小王'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        // 创建模拟请求
        const request = {
            id: `FR${Date.now().toString().substr(-6)}`,
            senderId: `user_${Date.now().toString().substr(-6)}`,
            senderName: randomName,
            message: `我是${randomName}，请求添加您为好友`,
            timestamp: Date.now()
        };
        
        // 触发事件
        this.emit('friend-request-received', request);
    }

    /**
     * 模拟好友数据
     */
    private getMockFriends(): any[] {
        return [
            {
                id: 'user_123456',
                name: '张三',
                avatar: null,
                isOnline: true,
                status: 0, // 在线
                level: 25,
                addedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 // 一周前
            },
            {
                id: 'user_234567',
                name: '李四',
                avatar: null,
                isOnline: true,
                status: 1, // 游戏中
                level: 18,
                addedAt: Date.now() - 1000 * 60 * 60 * 24 * 14 // 两周前
            },
            {
                id: 'user_345678',
                name: '王五',
                avatar: null,
                isOnline: false,
                status: 0,
                level: 32,
                addedAt: Date.now() - 1000 * 60 * 60 * 24 * 30 // 一个月前
            },
            {
                id: 'user_456789',
                name: '赵六',
                avatar: null,
                isOnline: true,
                status: 2, // 匹配中
                level: 10,
                addedAt: Date.now() - 1000 * 60 * 60 * 24 * 2 // 两天前
            },
            {
                id: 'user_567890',
                name: '钱七',
                avatar: null,
                isOnline: false,
                status: 0,
                level: 5,
                addedAt: Date.now() - 1000 * 60 * 60 * 24 * 60 // 两个月前
            }
        ];
    }

    /**
     * 注册事件监听
     */
    public on(eventName: string, callback: Function, target?: any): void {
        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, []);
        }
        
        this._listeners.get(eventName)?.push({ callback, target });
    }

    /**
     * 移除事件监听
     */
    public off(eventName: string, callback: Function, target?: any): void {
        if (!this._listeners.has(eventName)) {
            return;
        }
        
        const listeners = this._listeners.get(eventName);
        if (!listeners) return;
        
        for (let i = listeners.length - 1; i >= 0; i--) {
            const listener = listeners[i];
            if (listener.callback === callback && (!target || listener.target === target)) {
                listeners.splice(i, 1);
            }
        }
    }

    /**
     * 触发事件
     */
    private emit(eventName: string, ...args: any[]): void {
        if (!this._listeners.has(eventName)) {
            return;
        }
        
        const listeners = this._listeners.get(eventName);
        if (!listeners) return;
        
        for (const listener of listeners) {
            if (listener.target) {
                listener.callback.apply(listener.target, args);
            } else {
                listener.callback(...args);
            }
        }
    }
}
