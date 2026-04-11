import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { handleTool } from '../utils/handleTool'

const repoCreateSchema = z.object({
  name: z.string().describe('Repository name'),
  description: z.string().optional().describe('Repository description'),
  private: z.boolean().optional().describe('Whether the repository is private'),
  auto_init: z.boolean().optional().describe('Whether to initialize the repository with a README'),
  gitignore_template: z.string().optional().describe('Gitignore template to use'),
  license_template: z.string().optional().describe('License template to use'),
  readme: z.string().optional().describe('README content'),
  default_branch: z.string().optional().describe('Default branch name'),
})

const repoForkSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  organization: z.string().optional().describe('Organization to fork the repository under'),
})

const repoListTagsSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
})

const repoListMySchema = z.object({
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
})

export const registerRepoTools = (server: McpServer) => {
  server.registerTool(
    'repo__list_my',
    {
      description: 'List repositories owned by the current user',
      inputSchema: repoListMySchema,
    },
    async ({ page, limit }) =>
      handleTool((gitea) => gitea.listMyRepos({ page, limit })),
  )

  server.registerTool(
    'repo__create',
    {
      description: 'Create a new repository',
      inputSchema: repoCreateSchema,
    },
    async ({ name, description, private: isPrivate, auto_init, gitignore_template, license_template, readme, default_branch }) =>
      handleTool((gitea) =>
        gitea.createRepo({ name, description, private: isPrivate, auto_init, gitignore_template, license_template, readme, default_branch }),
      ),
  )

  server.registerTool(
    'repo__fork',
    {
      description: 'Fork a repository',
      inputSchema: repoForkSchema,
    },
    async ({ owner, repo, organization }) => handleTool((gitea) => gitea.forkRepo(owner, repo, { organization })),
  )

  server.registerTool(
    'repo__list_tags',
    {
      description: 'List all tags in a repository',
      inputSchema: repoListTagsSchema,
    },
    async ({ owner, repo, page, limit }) =>
      handleTool((gitea) => gitea.listTags(owner, repo, { page, limit })),
  )
}
