import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerUserTools } from './user'

export const registerTools = (server: McpServer) => {
  registerUserTools(server)

  // 添加更多工具注册...
}
