import { _decorator, Component, director, game } from 'cc';
import { loadColyseusClient } from '../libs/colyseus-loader';
import { NetworkManager } from './network';

const { ccclass, property } = _decorator;

/**
 * 应用初始化器
 * 负责在应用启动时执行必要的初始化操作
 * 此组件应添加到LoginScene的Canvas节点上
 */
@ccclass('AppInitializer')
export class AppInitializer extends Component {
    
    private static _initialized: boolean = false;
    
    async start() {
        // 避免重复初始化
        if (AppInitializer._initialized) {
            console.log('[AppInitializer] 应用已初始化，跳过');
            return;
        }
        
        console.log('[AppInitializer] 开始初始化应用...');
        
        try {
            // 检查Colyseus是否已加载（作为插件脚本）
            console.log('[AppInitializer] 检查Colyseus客户端库...');
            if (typeof window.Colyseus === 'undefined' || !window.Colyseus.Client) {
                console.error('[AppInitializer] Colyseus客户端库未加载或无效');
                console.log('[AppInitializer] 尝试通过loadColyseusClient加载...');
                await loadColyseusClient();
                
                // 再次检查
                if (typeof window.Colyseus === 'undefined' || !window.Colyseus.Client) {
                    throw new Error('Colyseus客户端库加载失败，请确保在Cocos Creator中正确配置插件脚本');
                }
            } else {
                console.log('[AppInitializer] Colyseus客户端库已加载');
            }
            
            // 预初始化网络管理器（不连接，只创建实例）
            console.log('[AppInitializer] 预初始化网络管理器...');
            // 只需要获取实例，不需要显式初始化
            NetworkManager.getInstance();
            
            // 标记为已初始化
            AppInitializer._initialized = true;
            console.log('[AppInitializer] 应用初始化完成');
            
            // 注册游戏事件监听器
            this.registerGameEvents();
            
        } catch (error) {
            console.error('[AppInitializer] 应用初始化失败:', error);
            // 显示错误信息或重试
            this.handleInitializationError(error);
        }
    }
    
    private registerGameEvents() {
        // 监听游戏隐藏/显示事件
        game.on('hide', () => {
            console.log('[AppInitializer] 游戏进入后台');
            // 可以在这里暂停游戏或执行其他操作
        });
        
        game.on('show', () => {
            console.log('[AppInitializer] 游戏回到前台');
            // 可以在这里恢复游戏或执行其他操作
        });
    }
    
    private handleInitializationError(error: any) {
        console.error('[AppInitializer] 初始化错误:', error);
        // 这里可以显示错误对话框或重试初始化
        // 简单起见，我们延迟3秒后重新加载当前场景
        this.scheduleOnce(() => {
            director.loadScene(director.getScene()!.name);
        }, 3);
    }
}
