import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { handleTool } from '../utils/handleTool'

const getIssueByIndexSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Issue index number'),
})

const listRepoIssuesSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
  state: z
    .enum(['open', 'closed', 'all'])
    .default('open')
    .optional()
    .describe('Filter by state (open, closed, all)'),
  labels: z.array(z.string()).optional().describe('Filter by labels (array of label names)'),
  keyword: z.string().optional().describe('Search keyword in issue title/body'),
  created_by: z.string().optional().describe('Filter by creator username'),
  assigned_by: z.string().optional().describe('Filter by assignee username'),
})

const searchIssuesSchema = z.object({
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
  state: z
    .enum(['open', 'closed', 'all'])
    .default('open')
    .optional()
    .describe('Filter by state (open, closed, all)'),
  type: z
    .enum(['assigned', 'created'])
    .describe('Filter by type (assigned: issues assigned to me, created: issues created by me)'),
  labels: z.array(z.string()).optional().describe('Filter by labels (array of label names)'),
  keyword: z.string().optional().describe('Search keyword in issue title/body'),
})

const createIssueSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue body/description'),
  labels: z.array(z.number()).optional().describe('Label IDs to assign'),
})

const getIssueCommentsByIndexSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Issue index number'),
})

const createIssueCommentSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Issue index number'),
  body: z.string().describe('Comment body'),
})

const editIssueSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Issue index number'),
  title: z.string().optional().describe('New issue title'),
  body: z.string().optional().describe('New issue body'),
  state: z.enum(['open', 'closed']).optional().describe('New issue state (open or closed)'),
})

const editIssueCommentSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  commentId: z.number().describe('Comment ID'),
  body: z.string().describe('New comment body'),
})

export const registerIssueTools = (server: McpServer) => {
  server.registerTool(
    'issue__get_by_index',
    {
      description: 'Get a single issue by index number',
      inputSchema: getIssueByIndexSchema,
    },
    async ({ owner, repo, index }) =>
      handleTool((gitea) => gitea.getIssueByIndex(owner, repo, index)),
  )

  server.registerTool(
    'issue__list',
    {
      description: 'List issues for a repository with optional filtering',
      inputSchema: listRepoIssuesSchema,
    },
    async ({ owner, repo, page, limit, state, labels, keyword, created_by, assigned_by }) =>
      handleTool((gitea) =>
        gitea.listRepoIssues(owner, repo, {
          page,
          limit,
          state,
          labels: labels?.join(','),
          q: keyword,
          created_by,
          assigned_by,
        }),
      ),
  )

  server.registerTool(
    'issue__search_list',
    {
      description: 'Search issues',
      inputSchema: searchIssuesSchema,
    },
    async ({ page, limit, state, type, labels, keyword }) =>
      handleTool((gitea) =>
        gitea.searchIssues({ state, labels: labels?.join(','), page, limit, type, q: keyword }),
      ),
  )

  server.registerTool(
    'issue__create',
    {
      description: 'Create a new issue in a repository',
      inputSchema: createIssueSchema,
    },
    async ({ owner, repo, title, body, labels }) =>
      handleTool((gitea) => gitea.createIssue(owner, repo, { title, body, labels })),
  )

  server.registerTool(
    'issue__edit',
    {
      description: 'Edit an issue (title, body, state, or labels)',
      inputSchema: editIssueSchema,
    },
    async ({ owner, repo, index, title, body, state }) =>
      handleTool((gitea) => gitea.editIssue(owner, repo, index, { title, body, state })),
  )

  server.registerTool(
    'issue__comment_list',
    {
      description: 'Get all comments on an issue',
      inputSchema: getIssueCommentsByIndexSchema,
    },
    async ({ owner, repo, index }) =>
      handleTool((gitea) => gitea.getIssueCommentsByIndex(owner, repo, index)),
  )

  server.registerTool(
    'issue__comment_create',
    {
      description: 'Add a comment to an issue',
      inputSchema: createIssueCommentSchema,
    },
    async ({ owner, repo, index, body }) =>
      handleTool((gitea) => gitea.createIssueComment(owner, repo, index, { body })),
  )

  server.registerTool(
    'issue__comment_edit',
    {
      description: 'Edit a comment on an issue',
      inputSchema: editIssueCommentSchema,
    },
    async ({ owner, repo, commentId, body }) =>
      handleTool((gitea) => gitea.editIssueComment(owner, repo, commentId, { body })),
  )
}
