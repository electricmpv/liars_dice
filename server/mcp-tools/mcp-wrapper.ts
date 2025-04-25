/**
 * MCP工具调用封装
 */

interface McpToolParams {
  server_name: string;
  tool_name: string;
  arguments: any;
}

/**
 * 调用MCP工具
 */
export async function use_mcp_tool(params: McpToolParams): Promise<any> {
  // 实际实现由Claude运行时提供
  throw new Error('use_mcp_tool should be implemented by runtime');
}
