import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerUserTools } from './user'
import { registerIssueTools } from './issue'
import { registerIssueTagTools } from './issue-label'
import { registerRepoTools } from './repo'
import { registerPullRequestTools } from './pull-request'

export const registerTools = (server: McpServer) => {
  registerUserTools(server)
  registerIssueTools(server)
  registerIssueTagTools(server)
  registerRepoTools(server)
  registerPullRequestTools(server)
}
