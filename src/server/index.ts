import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerTools } from '@/server/tools'
import pkg from '../../package.json'

export function createServer(): McpServer {
  const server = new McpServer({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  })

  // 注册工具
  registerTools(server)

  return server
}
