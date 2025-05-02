/**
 * 客户端专用的PlayerState定义
 * 用于解决Colyseus Schema导入问题
 */

// 客户端使用的PlayerState类，不使用装饰器
export class PlayerState {
  id: string = "";
  sessionId: string = "";
  name: string = "";
  diceCount: number = 0;
  isReady: boolean = false;
  isConnected: boolean = true;
  isAI: boolean = false;
  aiType: string = "";
  
  // 可选的骰子数组，仅在客户端使用
  currentDices?: number[] = [];
  
  // 从服务器数据构造
  constructor(data?: any) {
    if (data) {
      this.id = data.id || "";
      this.sessionId = data.sessionId || "";
      this.name = data.name || "";
      this.diceCount = data.diceCount || 0;
      this.isReady = data.isReady || false;
      this.isConnected = data.isConnected !== false; // 默认为true
      this.isAI = data.isAI || false;
      this.aiType = data.aiType || "";
      
      // 如果有骰子数据，也复制过来
      if (data.currentDices) {
        this.currentDices = [...data.currentDices];
      }
    }
  }
  
  // 从服务器数据更新
  update(data: any): void {
    if (!data) return;
    
    if (data.id !== undefined) this.id = data.id;
    if (data.sessionId !== undefined) this.sessionId = data.sessionId;
    if (data.name !== undefined) this.name = data.name;
    if (data.diceCount !== undefined) this.diceCount = data.diceCount;
    if (data.isReady !== undefined) this.isReady = data.isReady;
    if (data.isConnected !== undefined) this.isConnected = data.isConnected;
    if (data.isAI !== undefined) this.isAI = data.isAI;
    if (data.aiType !== undefined) this.aiType = data.aiType;
    
    // 如果有骰子数据，也更新
    if (data.currentDices) {
      this.currentDices = [...data.currentDices];
    }
  }
}
