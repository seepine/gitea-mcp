import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { handleTool } from '../utils/handleTool'

export const registerUserTools = (server: McpServer) => {
  server.registerTool(
    'user__get_my_userinfo',
    {
      description: 'Get the current user profile',
    },
    async () => handleTool((gitea) => gitea.getCurrentUserinfo()),
  )
}
