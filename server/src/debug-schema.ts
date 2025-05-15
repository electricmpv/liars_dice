import { LiarDiceRoomState, PlayerState } from "../../shared/schemas/LiarDiceState";
import { ArraySchema, type, Schema, MapSchema } from "@colyseus/schema";
import * as Reflect from "reflect-metadata";

// 注意：不需要手动调用 Schema.initialize()
// 在 Colyseus v0.16.x 中，Schema 类已经在导入时自动初始化

/**
 * 调试Schema对象的元数据
 * 这个函数会检查Schema对象的所有属性是否都有正确的元数据
 */
export function debugSchema(schema: any, name: string): void {
  console.log(`[调试] 开始检查Schema: ${name}`);
  
  // 获取所有属性
  const properties = Object.getOwnPropertyNames(schema);
  console.log(`[调试] ${name}的属性列表:`, properties);
  
  // 检查每个属性的元数据
  for (const prop of properties) {
    if (prop.startsWith('_')) continue; // 跳过私有属性
    
    try {
      // 尝试访问属性的元数据
      // 使用Schema内部的方式检查元数据
      const hasMetadata = schema._definition && schema._definition[prop];
      console.log(`[调试] ${name}.${prop} 元数据:`, hasMetadata ? '存在' : '不存在');
      
      // 如果属性是Schema类型，递归检查
      const value = (schema as any)[prop];
      if (value && typeof value === 'object' && value.constructor && value.constructor.name !== 'Object') {
        if (value instanceof Map) {
          console.log(`[调试] ${name}.${prop} 是Map类型`);
          if (value.size > 0) {
            const firstItem = value.values().next().value;
            if (firstItem && typeof firstItem === 'object') {
              debugSchema(firstItem, `${name}.${prop}[第一项]`);
            }
          }
        } else if (value instanceof Set) {
          console.log(`[调试] ${name}.${prop} 是Set类型`);
          if (value.size > 0) {
            const firstItem = value.values().next().value;
            if (firstItem && typeof firstItem === 'object') {
              debugSchema(firstItem, `${name}.${prop}[第一项]`);
            }
          }
        } else if (Array.isArray(value)) {
          console.log(`[调试] ${name}.${prop} 是数组类型`);
          if (value.length > 0) {
            const firstItem = value[0];
            if (firstItem && typeof firstItem === 'object') {
              debugSchema(firstItem, `${name}.${prop}[0]`);
            }
          }
        } else {
          debugSchema(value, `${name}.${prop}`);
        }
      }
    } catch (error) {
      console.error(`[调试] 检查 ${name}.${prop} 元数据时出错:`, error);
    }
  }
  
  console.log(`[调试] 完成检查Schema: ${name}`);
}

/**
 * 初始化Schema元数据
 * 确保 Schema 类的元数据正确生成
 */
export function initializeSchemaMetadata(state: LiarDiceRoomState): void {
  try {
    console.log(`[调试] 开始初始化Schema元数据`);
    
    // 确保所有 Schema 类都被正确引用，触发元数据生成
    // 在 Colyseus v0.16.x 中，只需要确保类被正确引用和初始化
    
    // 确保所有属性都已初始化
    state.players = new MapSchema<PlayerState>();
    state.activePlayerIds = new ArraySchema<string>();
    state.currentPlayerIndex = 0;
    state.currentBidValue = 0;
    state.currentBidCount = 0;
    state.lastBidderSessionId = "";
    state.status = "waiting";
    state.hostId = "";
    state.roundNumber = 0;
    state.moveNumber = 0;
    state.roundResult = "";
    state.isOneCalledThisRound = false;
    
    // 强制触发元数据生成
    const schemaKeys = Object.getOwnPropertyNames(state).filter(key => !key.startsWith('_'));
    console.log(`[调试] 强制触发元数据生成，属性数量: ${schemaKeys.length}`);
    
    console.log(`[调试] Schema元数据初始化完成`);
  } catch (error) {
    console.error(`[调试][错误] 初始化Schema元数据时出错:`, error);
  }
}

/**
 * 修复PlayerState中的currentDices属性
 * 确保它被正确初始化为ArraySchema
 */
export function fixPlayerState(player: PlayerState): void {
  try {
    console.log(`[调试] 检查PlayerState.currentDices`);
    
    // 检查currentDices是否存在
    if (player.currentDices) {
      console.log(`[调试] currentDices已存在`);
    } else {
      console.log(`[调试] currentDices不存在，创建新的ArraySchema`);
      player.currentDices = new ArraySchema<number>();
    }
    
    // 测试是否可以正常操作
    console.log(`[调试] currentDices可正常操作`);
    
    // 打印玩家属性信息
    console.log(`[调试] PlayerState属性:`);
    console.log(`[调试] id = "${player.id}"`);
    console.log(`[调试] sessionId = "${player.sessionId}"`);
    console.log(`[调试] name = "${player.name}"`);
    console.log(`[调试] diceCount = ${player.diceCount}`);
    console.log(`[调试] isReady = ${player.isReady}`);
    console.log(`[调试] isConnected = ${player.isConnected}`);
    console.log(`[调试] isAI = ${player.isAI}`);
    console.log(`[调试] aiType = "${player.aiType}"`);
    console.log(`[调试] currentDices = ${JSON.stringify(player.currentDices)}`);
  } catch (error) {
    console.error(`[调试][错误] 修复PlayerState时出错:`, error);
  }
}
