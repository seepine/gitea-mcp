import { createAlova } from 'alova'
import fetchAdapter from 'alova/fetch'
import { createApis, withConfigType } from './api/createApis'

export class Gitea {
  Apis: ReturnType<typeof createApis>
  constructor(opts: { giteaHost: string; giteaAccessToken: string }) {
    const alovaInstance = createAlova({
      baseURL: `${opts.giteaHost.endsWith('/') ? opts.giteaHost : `${opts.giteaHost}/`}api/v1`,
      requestAdapter: fetchAdapter(),
      beforeRequest: (method) => {
        if (typeof method.config.params !== 'string') {
          method.config.params.access_token = opts.giteaAccessToken
        }
      },
      responded: (res) => {
        return res.json()
      },
    })
    const $$userConfigMap = withConfigType({})
    this.Apis = createApis(alovaInstance, $$userConfigMap)
  }

  async getCurrentUserinfo() {
    return this.Apis.user.userGetCurrent()
  }

  async getIssueByIndex(owner: string, repo: string, index: number) {
    return this.Apis.issue.issueGetIssue({ pathParams: { owner, repo, index } })
  }

  async listRepoIssues(
    owner: string,
    repo: string,
    params?: {
      state?: 'open' | 'closed' | 'all'
      labels?: string
      q?: string
      type?: 'issues' | 'pulls'
      milestones?: string
      since?: string
      before?: string
      page?: number
      limit?: number
      created_by?: string
      assigned_by?: string
    },
  ) {
    return this.Apis.issue.issueListIssues({ pathParams: { owner, repo }, params: params ?? {} })
  }

  async searchIssues(params: {
    state?: 'open' | 'closed' | 'all'
    labels?: string
    milestones?: string
    q?: string
    type?: 'assigned' | 'created'
    since?: string
    before?: string
    page?: number
    limit?: number
  }) {
    const { type, ...rest } = params
    return this.Apis.issue.issueSearchIssues({
      params: { ...rest, [type as string]: true },
    })
  }

  async createIssue(
    owner: string,
    repo: string,
    data: { title: string; body?: string; labels?: number[] },
  ) {
    return this.Apis.issue.issueCreateIssue({ pathParams: { owner, repo }, data })
  }

  async getIssueCommentsByIndex(
    owner: string,
    repo: string,
    index: number,
    params?: { since?: string; before?: string },
  ) {
    return this.Apis.issue.issueGetComments({
      pathParams: { owner, repo, index },
      params: params ?? {},
    })
  }

  async listRepoLabels(owner: string, repo: string, params?: { page?: number; limit?: number }) {
    return this.Apis.issue.issueListLabels({ pathParams: { owner, repo }, params: params ?? {} })
  }

  async createRepoLabel(
    owner: string,
    repo: string,
    data: { name: string; color: string; description?: string },
  ) {
    return this.Apis.issue.issueCreateLabel({ pathParams: { owner, repo }, data })
  }

  async editRepoLabel(
    owner: string,
    repo: string,
    labelId: number,
    data: { name?: string; color?: string; description?: string },
  ) {
    return this.Apis.issue.issueEditLabel({ pathParams: { owner, repo, id: labelId }, data })
  }

  async deleteRepoLabel(owner: string, repo: string, labelId: number) {
    return this.Apis.issue.issueDeleteLabel({ pathParams: { owner, repo, id: labelId } })
  }

  async replaceIssueLabels(owner: string, repo: string, index: number, data: { labels: number[] }) {
    // IssueLabelsOption in generated types incorrectly uses null[], actual API accepts number[] or string[]
    return this.Apis.issue.issueReplaceLabels({
      pathParams: { owner, repo, index },
      data: data as any,
    })
  }

  async createIssueComment(owner: string, repo: string, index: number, data: { body: string }) {
    return this.Apis.issue.issueCreateComment({ pathParams: { owner, repo, index }, data })
  }

  async editIssue(
    owner: string,
    repo: string,
    index: number,
    data: { title?: string; body?: string; state?: 'open' | 'closed' },
  ) {
    return this.Apis.issue.issueEditIssue({ pathParams: { owner, repo, index }, data })
  }

  async editIssueComment(owner: string, repo: string, commentId: number, data: { body: string }) {
    return this.Apis.issue.issueEditComment({ pathParams: { owner, repo, id: commentId }, data })
  }

  async listMyRepos(params?: { page?: number; limit?: number }) {
    return this.Apis.user.userCurrentListRepos({ params: params ?? {} })
  }

  async createRepo(data: {
    name: string
    description?: string
    private?: boolean
    auto_init?: boolean
    gitignore_template?: string
    license_template?: string
    readme?: string
    default_branch?: string
  }) {
    return this.Apis.repository.createCurrentUserRepo({ data })
  }

  async forkRepo(owner: string, repo: string, data?: { organization?: string }) {
    return this.Apis.repository.createFork({ pathParams: { owner, repo }, data: data ?? {} })
  }

  async listTags(owner: string, repo: string, params?: { page?: number; limit?: number }) {
    return this.Apis.repository.repoListTags({ pathParams: { owner, repo }, params: params ?? {} })
  }

  async listMyPullRequests(params?: {
    state?: 'open' | 'closed' | 'all'
    labels?: string
    milestones?: string
    q?: string
    since?: string
    before?: string
    page?: number
    limit?: number
  }) {
    return this.Apis.issue.issueSearchIssues({
      params: { ...params, type: 'pulls', created: true },
    })
  }

  async listPullRequests(
    owner: string,
    repo: string,
    params?: {
      state?: 'open' | 'closed' | 'all'
      sort?:
        | 'oldest'
        | 'recentupdate'
        | 'recentclose'
        | 'leastupdate'
        | 'mostcomment'
        | 'leastcomment'
        | 'priority'
      page?: number
      limit?: number
    },
  ) {
    return this.Apis.repository.repoListPullRequests({
      pathParams: { owner, repo },
      params: params ?? {},
    })
  }

  async getPullRequestByIndex(owner: string, repo: string, index: number) {
    return this.Apis.repository.repoGetPullRequest({ pathParams: { owner, repo, index } })
  }

  async createPullRequest(
    owner: string,
    repo: string,
    data: {
      title: string
      head: string
      base: string
      body?: string
      milestones?: number[]
      labels?: number[]
    },
  ) {
    return this.Apis.repository.repoCreatePullRequest({ pathParams: { owner, repo }, data })
  }

  async addPullRequestReviewer(
    owner: string,
    repo: string,
    index: number,
    data: { reviewers: string[]; team_reviewers?: string[] },
  ) {
    return this.Apis.repository.repoCreatePullReviewRequests({
      pathParams: { owner, repo, index },
      data,
    })
  }

  async deletePullRequestReviewer(owner: string, repo: string, index: number, reviewer: string) {
    return this.Apis.repository.repoDeletePullReviewRequests({
      pathParams: { owner, repo, index },
      data: { reviewers: [reviewer] },
    })
  }

  async getPullRequestReview(owner: string, repo: string, index: number, reviewId: number) {
    return this.Apis.repository.repoGetPullReview({
      pathParams: { owner, repo, index, id: reviewId },
    })
  }

  async getPullRequestReviewComments(owner: string, repo: string, index: number, reviewId: number) {
    return this.Apis.repository.repoGetPullReviewComments({
      pathParams: { owner, repo, index, id: reviewId },
    })
  }

  async editPullRequest(
    owner: string,
    repo: string,
    index: number,
    data: {
      title?: string
      body?: string
      state?: 'open' | 'closed'
      base?: string
      assignee?: string
      assignees?: string[]
      milestone?: number
      labels?: number[]
    },
  ) {
    return this.Apis.repository.repoEditPullRequest({ pathParams: { owner, repo, index }, data })
  }

  async listPullRequestReviews(
    owner: string,
    repo: string,
    index: number,
    params?: { page?: number; limit?: number },
  ) {
    return this.Apis.repository.repoListPullReviews({
      pathParams: { owner, repo, index },
      params: params ?? {},
    })
  }
}
