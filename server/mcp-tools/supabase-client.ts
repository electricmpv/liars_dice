import { use_mcp_tool } from '../mcp-tools/mcp-wrapper';

/**
 * 执行PostgreSQL查询
 */
export async function execute_postgresql(params: {
  query: string;
  params?: any[];
}): Promise<{ rows: any[] }> {
  const result = await use_mcp_tool({
    server_name: 'github.com/alexander-zuev/supabase-mcp-server',
    tool_name: 'execute_postgresql',
    arguments: {
      query: params.query
      // migration_name: "" // 可选，如果需要可以添加
      // params 字段不符合 MCP 工具 schema，移除。
      // 参数化查询需要通过其他方式处理，或者确认 MCP 服务器是否支持。
    }
  });

  return result;
}
