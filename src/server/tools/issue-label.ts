import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { handleTool } from '../utils/handleTool'

const listLabelsSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
})

const createLabelSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  name: z.string().describe('Label name'),
  color: z.string().describe('Label color (hex code without #)'),
  description: z.string().optional().describe('Label description'),
})

const editLabelSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  labelId: z.number().describe('Label ID'),
  name: z.string().optional().describe('Label name'),
  color: z.string().optional().describe('Label color (hex code without #)'),
  description: z.string().optional().describe('Label description'),
})

const deleteLabelSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  labelId: z.number().describe('Label ID'),
})

export const registerIssueTagTools = (server: McpServer) => {
  server.registerTool(
    'issue_label__list',
    {
      description: 'List all labels in a repository',
      inputSchema: listLabelsSchema,
    },
    async ({ owner, repo, page, limit }) =>
      handleTool((gitea) =>
        gitea.listRepoLabels(owner, repo, { page, limit }),
      ),
  )

  server.registerTool(
    'issue_label__create',
    {
      description: 'Create a new label in a repository',
      inputSchema: createLabelSchema,
    },
    async ({ owner, repo, name, color, description }) =>
      handleTool((gitea) => gitea.createRepoLabel(owner, repo, { name, color, description })),
  )

  server.registerTool(
    'issue_label__edit',
    {
      description: 'Edit an existing label',
      inputSchema: editLabelSchema,
    },
    async ({ owner, repo, labelId, name, color, description }) =>
      handleTool((gitea) =>
        gitea.editRepoLabel(owner, repo, labelId, { name, color, description }),
      ),
  )

  server.registerTool(
    'issue_label__delete',
    {
      description: 'Delete a label from a repository',
      inputSchema: deleteLabelSchema,
    },
    async ({ owner, repo, labelId }) =>
      handleTool((gitea) => gitea.deleteRepoLabel(owner, repo, labelId)),
  )
}
