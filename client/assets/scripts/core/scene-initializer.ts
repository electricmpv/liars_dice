import { _decorator, Component, director, Node, find } from 'cc';
import { AppInitializer } from './app-initializer';

const { ccclass, property } = _decorator;

/**
 * 场景初始化器
 * 负责在场景加载时执行必要的初始化操作
 * 此组件应添加到每个场景的Canvas节点上
 */
@ccclass('SceneInitializer')
export class SceneInitializer extends Component {
    
    start() {
        console.log(`[SceneInitializer] 初始化场景: ${director.getScene()?.name}`);
        
        // 如果是LoginScene，确保AppInitializer已添加
        if (director.getScene()?.name === 'LoginScene') {
            this.ensureAppInitializer();
        }
    }
    
    /**
     * 确保AppInitializer已添加到Canvas节点
     */
    private ensureAppInitializer() {
        // 获取Canvas节点
        const canvas = find('Canvas');
        if (!canvas) {
            console.error('[SceneInitializer] 找不到Canvas节点');
            return;
        }
        
        // 检查是否已有AppInitializer组件
        let appInitializer = canvas.getComponent(AppInitializer);
        if (!appInitializer) {
            console.log('[SceneInitializer] 添加AppInitializer组件到Canvas节点');
            appInitializer = canvas.addComponent(AppInitializer);
        } else {
            console.log('[SceneInitializer] Canvas节点已有AppInitializer组件');
        }
    }
}
