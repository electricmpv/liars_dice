import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量中获取配置
const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openrouter';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free';

// 检查必要的环境变量
if (!OPENROUTER_API_KEY) {
  console.error('错误: OpenRouter API密钥未在环境变量中设置');
}

/**
 * 构建用于吹牛骰子游戏的提示
 * @param payload 游戏状态数据
 * @returns 格式化的提示字符串
 */
export function buildPrompt(payload: any): string {
  const {
    aiPlayerDice,
    currentBid,
    totalDiceInGame,
    activePlayerIds,
    aiPlayerId,
    isOneCalledThisRound,
    aiType = 'coward'
  } = payload;

  // 获取骰子面值的标签
  const getFaceLabel = (face: number): string => {
    return face === 1 ? '1 (万能)' : face.toString();
  };

  // --- Helper function to calculate expected dice count ---
  const calculateExpectedCount = (bidValue: number, totalDice: number, isOneWild: boolean): number => {
    if (bidValue === 0) return 0; // No bid yet
    if (bidValue === 1 || !isOneWild) {
      // If bidding on 1s, or if 1s are not wild this round, expected count is totalDice / 6
      return Math.round(totalDice / 6);
    } else {
      // If bidding on 2-6 and 1s are wild, expected count is totalDice / 3
      return Math.round(totalDice / 3);
    }
  };

  const bidValue = currentBid ? currentBid[0] : 0;
  const bidCount = currentBid ? currentBid[1] : 0;
  const isOneWildForBid = !isOneCalledThisRound; // 1s are wild unless '1' has been called
  const expectedCount = calculateExpectedCount(bidValue, totalDiceInGame, isOneWildForBid);

  // Count own relevant dice (bid value + wilds if applicable)
  let ownRelevantDiceCount = 0;
  if (bidValue > 0) {
    // Add type annotation ': number' to 'd'
    ownRelevantDiceCount = aiPlayerDice.filter((d: number) =>
      d === bidValue || (d === 1 && isOneWildForBid && bidValue !== 1)
    ).length;
  }

  // --- 构建提示 ---
  return `你正在玩吹牛骰子游戏。你的角色是"胆小鬼"：谨慎、避险。

游戏情境:
- 你的骰子: [${aiPlayerDice.join(', ')}] (数量: ${aiPlayerDice.length})
- 当前最高叫价: ${bidCount > 0 ? `${bidCount}个${getFaceLabel(bidValue)}` : '无'}
- 游戏中的总骰子数: ${totalDiceInGame}
- 活跃玩家: [${activePlayerIds.join(', ')}] (你的ID: ${aiPlayerId})
- 本轮是否已叫过'1'?: ${isOneCalledThisRound ? '是' : '否'} ('1'是万能点: ${isOneWildForBid ? '是' : '否'})
- 对于当前叫价 (${getFaceLabel(bidValue)}):
    - 你手中有 ${ownRelevantDiceCount} 个 (含万能点，如果适用)
    - 基于总骰子数，理论上期望有 ${expectedCount} 个左右

任务: 谨慎地决定你的下一步行动(叫价或质疑)。
1.  **评估当前叫价 (${bidCount}个${getFaceLabel(bidValue)})**:
    *   比较叫价数量 (${bidCount}) 和理论期望数量 (${expectedCount})。
    *   考虑你手中的相关骰子数量 (${ownRelevantDiceCount})。
    *   叫价数量是否远超期望值，且你手中的牌也无法支持？
2.  **决策**:
    *   **质疑 (challenge)**: 只有当你非常有把握认为当前叫价不可能成立时（例如，叫价数量远高于期望值，且你手中的相关骰子很少）才选择质疑。质疑有风险！
    *   **叫价 (bid)**: 如果不质疑，你需要叫一个更高的价。作为胆小鬼，优先选择最小幅度的有效加注。
        *   **重要规则**: 如果当前最高叫价的点数是 '1' (即 ${bidValue === 1 ? '是' : '否'})，那么你的下一个叫价**必须增加数量** (叫 ${bidCount + 1} 个任意点数)。
        *   **一般情况**: 如果当前最高叫价的点数不是 '1'，你可以：
            *   增加数量：叫 ${bidCount + 1} 个 ${getFaceLabel(bidValue)} (如果点数不是1)。
            *   或者，保持数量不变，提升点数 (按照 2 < 3 < 4 < 5 < 6 < 1 的顺序)：叫 ${bidCount} 个 ${getFaceLabel(bidValue === 6 ? 1 : bidValue + 1)} (如果当前点数不是1)。
        *   **策略**: 优先选择最安全的最小加注。只有当你手中有非常多的目标点数或万能点时，才考虑跳跃式加注。
    *   **全中 (spot_on)**: (暂不实现，如果需要请明确指示)

仅以JSON格式输出你的决定:
{"action": "bid", "value": <1-6>, "count": <数量>}
或
{"action": "challenge"}
`; // Removed spot_on for now as it wasn't used and adds complexity
}

/**
或
{"action": "challenge"}
或
{"action": "spot_on"}`;
}

/**
 * 清理LLM响应字符串，尝试提取纯JSON内容
 * @param rawContent 原始LLM响应字符串
 * @returns 清理后的字符串，尽可能接近纯JSON
 */
function cleanLlmResponse(rawContent: string): string {
  const trimmed = rawContent.trim();

  // 1. 尝试从 ```json ... ``` 或 ``` ... ``` 代码块中提取
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    // 找到了代码块，返回其内容
    return codeBlockMatch[1].trim();
  }

  // 2. 如果没有代码块，尝试查找第一个 '{' 和最后一个 '}' 之间的内容
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.substring(firstBrace, lastBrace + 1);
  }

  // 3. 如果以上方法都失败，返回原始的trimmed字符串，让JSON.parse尝试处理
  return trimmed;
}


/**
 * 调用OpenRouter API获取LLM响应
 * @param prompt 提示字符串
 * @returns 解析后的LLM响应
 */
export async function callLLM(prompt: string): Promise<any> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API密钥未设置');
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: '你是一个吹牛骰子游戏中的AI玩家，角色是"胆小鬼"。你只能以JSON格式回复。' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://liars-dice-game.com', // 替换为你的实际域名
          'X-Title': 'Liars Dice Game' // 应用名称
        }
      }
    );

    // 提取LLM的回复内容
    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('LLM响应中没有内容');
    }

    // 使用新的清理函数
    const cleanedContent = cleanLlmResponse(content);

    // 尝试解析清理后的JSON响应
    try {
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('无法解析清理后的LLM响应为JSON:', cleanedContent);
      console.error('原始LLM响应:', content); // 添加原始响应日志以便调试
      throw new Error('LLM响应格式无效');
    }
  } catch (error) {
    console.error('调用LLM API时出错:', error);
    throw error;
  }
}

/**
 * 验证叫价是否高于当前叫价
 * @param newBid 新叫价 [value, count]
 * @param currentBid 当前叫价 [value, count]
 * @returns 是否有效
 */
export function isValidBid(newBid: [number, number], currentBid?: [number, number]): boolean {
  // 如果没有当前叫价，任何叫价都有效
  if (!currentBid || currentBid[1] === 0) {
    return true;
  }

  const [newValue, newCount] = newBid;
  const [currentValue, currentCount] = currentBid;

  // 简单的验证规则：
  // 1. 如果新的数量更多，则有效
  // 2. 如果数量相同但点数更大，则有效
  if (newCount > currentCount) {
    return true;
  } else if (newCount === currentCount && newValue > currentValue) {
    return true;
  }

  return false;
}

/**
 * 获取兜底决策
 * @param payload 游戏状态数据
 * @returns 兜底决策
 */
export function getFallbackDecision(payload: any): any {
  const { currentBid } = payload;

  // 简单的兜底逻辑：如果有当前叫价，则质疑；否则叫1个1
  if (currentBid && currentBid[1] > 0) {
    return { action: 'challenge' };
  } else {
    return { action: 'bid', value: 1, count: 1 };
  }
}
