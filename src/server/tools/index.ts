import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerUserTools } from './user'
import { registerRepoTools } from './repo'
import { registerIssueTools } from './issue'
import { registerIssueTagTools } from './issue-label'
import { registerPullRequestTools } from './pull-request'

export const registerTools = (server: McpServer) => {
  registerUserTools(server)
  registerRepoTools(server)
  registerIssueTools(server)
  registerIssueTagTools(server)
  registerPullRequestTools(server)
}
