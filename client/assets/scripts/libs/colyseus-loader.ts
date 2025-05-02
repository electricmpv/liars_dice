/**
 * colyseus-loader.ts
 * 这个文件负责检查Colyseus客户端是否已加载
 * 现在使用插件脚本方式，不再需要动态加载
 */

// 定义全局Colyseus对象类型
declare global {
  interface Window {
    Colyseus: any;
  }
}

/**
 * 检查Colyseus客户端是否已加载
 * 现在使用插件脚本方式，这个函数始终返回true
 */
export function loadColyseusClient(): Promise<void> {
  return Promise.resolve();
}

/**
 * 检查Colyseus是否已加载
 */
export function isColyseusLoaded(): boolean {
  return typeof window.Colyseus !== 'undefined' && !!window.Colyseus.Client;
}
