import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { Gitea } from '../gitea'
import { ctx } from '../context'

export const registerUserTools = (server: McpServer) => {
  server.registerTool(
    'get_current_userinfo',
    {
      description: 'Get current userinfo',
    },
    async ({}) => {
      const gitea = new Gitea(ctx.get())
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(await gitea.getCurrentUserinfo(), null, 2),
          },
        ],
      }
    },
  )
}
