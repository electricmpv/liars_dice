/**
 * Jest全局类型声明文件
 */
import '@jest/globals';

declare global {
  // 为jest.setTimeout添加全局声明
  namespace jest {
    function setTimeout(timeout: number): void;
  }
}
