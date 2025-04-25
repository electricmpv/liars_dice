import path from 'path';
import dotenv from 'dotenv';

// 加载环境变量，统一配置
// 调整路径相对于编译后的'dist'目录，或确保.env可访问
// 假设.env在项目根目录 (d:/editors/liars_dice_demo)
dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

// 导出环境变量
export const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3001'; // 默认值
