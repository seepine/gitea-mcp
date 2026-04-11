# Gitea MCP

MCP 服务端，支持通过 Model Context Protocol 与 Gitea 实例交互。

## 安装

```bash
npm install gitea-mcp
```

## 使用（stdio）

### MCP 配置

```json
{
  "mcpServers": {
    "gitea": {
      "command": "npx",
      "args": ["gitea-mcp"],
      "env": {
        "GITEA_HOST": "https://gitea.example.com",
        "GITEA_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

## 使用（服务端部署）

### 1. 运行服务

```bash
# Streamable HTTP 模式（默认，端口 3000）
docker run -p 3000:3000 seepine/gitea-mcp

# SSE 模式（端口 4000）
docker run -p 4000:4000 seepine/gitea-mcp node sse.js
```

### 2. MCP 配置

```json
{
  "mcpServers": {
    "gitea-http": {
      "type": "streamableHttp",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Gitea-Host": "https://gitea.example.com",
        "Gitea-Access-Token": "your-token"
      }
    },

    // 或 sse
    "gitea-sse": {
      "type": "sse",
      "url": "http://localhost:4000/mcp",
      "headers": {
        "Gitea-Host": "https://gitea.example.com",
        "Gitea-Access-Token": "your-token"
      }
    }
  }
}
```

## 可用工具

| 工具                                | 范围         | 描述                                 |
| ----------------------------------- | ------------ | ------------------------------------ |
| `user__get_my_userinfo`             | User         | 获取当前用户信息                     |
| `repo__list_my`                     | Repo         | 列出当前用户拥有的仓库               |
| `repo__create`                      | Repo         | 创建新仓库                           |
| `repo__fork`                        | Repo         | Fork 仓库                            |
| `repo__list_tags`                   | Repo         | 列出仓库的所有标签                   |
| `issue__get_by_index`               | Issue        | 根据索引号获取单个 Issue             |
| `issue__list`                       | Issue        | 列出仓库的 Issue，支持过滤           |
| `issue__search_list`                | Issue        | 搜索 Issue（按指派给我/我创建的）    |
| `issue__create`                     | Issue        | 在仓库中创建新 Issue                 |
| `issue__edit`                       | Issue        | 编辑 Issue（标题、正文、状态或标签） |
| `issue__comment_list`               | Issue        | 获取 Issue 的所有评论                |
| `issue__comment_create`             | Issue        | 添加评论到 Issue                     |
| `issue__comment_edit`               | Issue        | 编辑 Issue 的评论                    |
| `issue_label__list`                 | IssueLabel   | 列出仓库的所有标签                   |
| `issue_label__create`               | IssueLabel   | 在仓库中创建新标签                   |
| `issue_label__edit`                 | IssueLabel   | 编辑现有标签                         |
| `issue_label__delete`               | IssueLabel   | 删除仓库中的标签                     |
| `pull_request__list`                | Pull Request | 列出仓库的 Pull Request              |
| `pull_request__get`                 | Pull Request | 根据索引号获取单个 Pull Request      |
| `pull_request__create`              | Pull Request | 创建新 Pull Request                  |
| `pull_request__add_reviewer`        | Pull Request | 添加审核者到 Pull Request            |
| `pull_request__delete_reviewer`     | Pull Request | 从 Pull Request 中移除审核者         |
| `pull_request__get_review`          | Pull Request | 获取指定审核                         |
| `pull_request__get_review_comments` | Pull Request | 获取审核的内联评论                   |
| `pull_request__list_reviews`        | Pull Request | 列出所有审核                         |
| `pull_request__edit`                | Pull Request | 编辑 Pull Request                    |
| `pull_request__list_my`             | Pull Request | 列出当前用户创建的 Pull Request      |

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发模式（MCP Inspector + SSE + Streamable HTTP）
pnpm dev
```

> 提示：MCP Inspector 网页选择 SSE 模式连接，SSE 支持自动重连，适合本地调试。

### 参数获取方式

- **stdio 模式**：`process.env.GITEA_HOST` / `process.env.GITEA_ACCESS_TOKEN`
- **SSE / Streamable HTTP 模式**：`ctx.get()` 获取请求头（见 `src/server/context.ts`）
