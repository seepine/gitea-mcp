import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { handleTool } from '../utils/handleTool'

const listPullRequestsSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
  state: z
    .enum(['open', 'closed', 'all'])
    .default('open')
    .optional()
    .describe('Filter by state (open, closed, all)'),
  sort: z
    .enum([
      'oldest',
      'recentupdate',
      'recentclose',
      'leastupdate',
      'mostcomment',
      'leastcomment',
      'priority',
    ])
    .optional()
    .describe(
      'Sort order (oldest, recentupdate, recentclose, leastupdate, mostcomment, leastcomment, priority)',
    ),
})

const getPullRequestByIndexSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
})

const createPullRequestSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  title: z.string().describe('Pull request title'),
  head: z.string().describe('The name of the head branch'),
  base: z.string().describe('The name of the base branch'),
  body: z.string().optional().describe('Pull request body/description'),
  milestones: z.array(z.number()).optional().describe('Milestone IDs'),
  labels: z.array(z.number()).optional().describe('Label IDs'),
})

const addReviewerSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
  reviewers: z.array(z.string()).describe('List of reviewer usernames'),
  team_reviewers: z.array(z.string()).optional().describe('List of team reviewer slugs'),
})

const deleteReviewerSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
  reviewer: z.string().describe('Username of the reviewer to remove'),
})

const getReviewByIndexSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
  reviewId: z.number().describe('Review ID'),
})

const getReviewCommentsSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
  reviewId: z.number().describe('Review ID'),
})

const listReviewsSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
})

const editPullRequestSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  index: z.number().describe('Pull request index'),
  title: z.string().optional().describe('New pull request title'),
  body: z.string().optional().describe('New pull request body'),
  state: z.enum(['open', 'closed']).optional().describe('New pull request state (open or closed)'),
  base: z.string().optional().describe('New base branch'),
  assignee: z.string().optional().describe('Assignee username'),
  assignees: z.array(z.string()).optional().describe('List of assignee usernames'),
  milestone: z.number().optional().describe('Milestone ID'),
  labels: z.array(z.number()).optional().describe('Label IDs'),
})

const listMyPullRequestsSchema = z.object({
  page: z.number().optional().describe('Page number'),
  limit: z.number().optional().describe('Items per page'),
  state: z
    .enum(['open', 'closed', 'all'])
    .default('open')
    .optional()
    .describe('Filter by state (open, closed, all)'),
  labels: z.string().optional().describe('Comma-separated label names'),
  milestones: z.string().optional().describe('Comma-separated milestone names'),
  q: z.string().optional().describe('Search string'),
  since: z.string().optional().describe('Filter PRs updated after this time (RFC 3339 format)'),
  before: z.string().optional().describe('Filter PRs updated before this time (RFC 3339 format)'),
})

export const registerPullRequestTools = (server: McpServer) => {
  server.registerTool(
    'pull_request__list',
    {
      description: 'List pull requests in a repository with optional filtering and sorting',
      inputSchema: listPullRequestsSchema,
    },
    async ({ owner, repo, page, limit, state, sort }) =>
      handleTool((gitea) => gitea.listPullRequests(owner, repo, { page, limit, state, sort })),
  )

  server.registerTool(
    'pull_request__get',
    {
      description: 'Get a single pull request by index',
      inputSchema: getPullRequestByIndexSchema,
    },
    async ({ owner, repo, index }) =>
      handleTool((gitea) => gitea.getPullRequestByIndex(owner, repo, index)),
  )

  server.registerTool(
    'pull_request__create',
    {
      description: 'Create a new pull request',
      inputSchema: createPullRequestSchema,
    },
    async ({ owner, repo, title, head, base, body, milestones, labels }) =>
      handleTool((gitea) =>
        gitea.createPullRequest(owner, repo, { title, head, base, body, milestones, labels }),
      ),
  )

  server.registerTool(
    'pull_request__add_reviewer',
    {
      description: 'Add reviewers to a pull request',
      inputSchema: addReviewerSchema,
    },
    async ({ owner, repo, index, reviewers, team_reviewers }) =>
      handleTool((gitea) =>
        gitea.addPullRequestReviewer(owner, repo, index, { reviewers, team_reviewers }),
      ),
  )

  server.registerTool(
    'pull_request__delete_reviewer',
    {
      description: 'Remove a reviewer from a pull request',
      inputSchema: deleteReviewerSchema,
    },
    async ({ owner, repo, index, reviewer }) =>
      handleTool((gitea) => gitea.deletePullRequestReviewer(owner, repo, index, reviewer)),
  )

  server.registerTool(
    'pull_request__get_review',
    {
      description: 'Get a specific review on a pull request',
      inputSchema: getReviewByIndexSchema,
    },
    async ({ owner, repo, index, reviewId }) =>
      handleTool((gitea) => gitea.getPullRequestReview(owner, repo, index, reviewId)),
  )

  server.registerTool(
    'pull_request__get_review_comments',
    {
      description: 'Get inline comments in a pull request review',
      inputSchema: getReviewCommentsSchema,
    },
    async ({ owner, repo, index, reviewId }) =>
      handleTool((gitea) => gitea.getPullRequestReviewComments(owner, repo, index, reviewId)),
  )

  server.registerTool(
    'pull_request__list_reviews',
    {
      description: 'List all reviews on a pull request',
      inputSchema: listReviewsSchema,
    },
    async ({ owner, repo, index }) =>
      handleTool((gitea) => gitea.listPullRequestReviews(owner, repo, index)),
  )

  server.registerTool(
    'pull_request__edit',
    {
      description: 'Edit a pull request (title, body, state, assignees, labels, milestone)',
      inputSchema: editPullRequestSchema,
    },
    async ({
      owner,
      repo,
      index,
      title,
      body,
      state,
      base,
      assignee,
      assignees,
      milestone,
      labels,
    }) =>
      handleTool((gitea) =>
        gitea.editPullRequest(owner, repo, index, {
          title,
          body,
          state,
          base,
          assignee,
          assignees,
          milestone,
          labels,
        }),
      ),
  )

  server.registerTool(
    'pull_request__list_my',
    {
      description: 'List pull requests created by the current user',
      inputSchema: listMyPullRequestsSchema,
    },
    async ({ page, limit, state, labels, milestones, q, since, before }) =>
      handleTool((gitea) =>
        gitea.listMyPullRequests({ page, limit, state, labels, milestones, q, since, before }),
      ),
  )
}
