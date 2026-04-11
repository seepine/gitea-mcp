# Gitea MCP

## 使用(stdio)

### 1. MCP 配置

```json
{
  "mcpServers": {
    "gitea-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["gitea-mcp"],
      "env": {
        "GITEA_HOST": "https://gitea.example.com",
        "GITEA_ACCESS_TOKEN": "xxxxxxxxxx"
      }
    }
  }
}
```

## 使用(服务端)

### 1. 部署服务端

1. Build

```bash
docker build -t gitea-mcp .
```

2. Run the server

```bash
docker run -p 3000:3000 gitea-mcp
# 或启动 sse
docker run -p 4000:4000 gitea-mcp node sse.js
```

### 2. MCP 配置

```json
{
  "mcpServers": {
    "gitea-mcp": {
      "type": "streamableHttp",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Gitea-Host": "https://gitea.example.com",
        "Gitea-Access-Token": "xxxxxxxxxx"
      }
    },
    // 或 sse
    "gitea-mcp": {
      "type": "sse",
      "url": "http://localhost:4000/mcp",
      "headers": {
        "Gitea-Host": "https://gitea.example.com",
        "Gitea-Access-Token": "xxxxxxxxxx"
      }
    }
  }
}
```

## 可用工具

| 工具                                | 范围         | 描述                                                           |
| ----------------------------------- | ------------ | -------------------------------------------------------------- |
| user\_\_get_my_userinfo             | User         | 获取当前用户信息                                               |
| repo\_\_list_my                     | Repo         | 列出当前用户拥有的仓库                                         |
| repo\_\_create                      | Repo         | 创建新仓库                                                     |
| repo\_\_fork                        | Repo         | Fork 仓库                                                      |
| repo\_\_list_tags                   | Repo         | 列出仓库的所有标签                                             |
| issue\_\_get_by_index               | Issue        | 根据索引号获取单个 Issue                                       |
| issue\_\_list                       | Issue        | 列出仓库的 Issue，支持过滤                                     |
| issue\_\_search_list                | Issue        | 搜索 Issue（按指派给我/我创建的），支持关键词和标签过滤         |
| issue\_\_create                     | Issue        | 在仓库中创建新 Issue                                           |
| issue\_\_edit                       | Issue        | 编辑 Issue（标题、正文、状态或标签）                           |
| issue\_\_comment_list               | Issue        | 获取 Issue 的所有评论                                          |
| issue\_\_comment_create             | Issue        | 添加评论到 Issue                                               |
| issue\_\_comment_edit               | Issue        | 编辑 Issue 的评论                                              |
| issue_label\_\_list                 | IssueLabel   | 列出仓库的所有标签                                             |
| issue_label\_\_create               | IssueLabel   | 在仓库中创建新标签                                             |
| issue_label\_\_edit                 | IssueLabel   | 编辑现有标签                                                   |
| issue_label\_\_delete               | IssueLabel   | 删除仓库中的标签                                               |
| pull_request\_\_list                | Pull Request | 列出仓库的 Pull Request，支持过滤和排序                        |
| pull_request\_\_get                 | Pull Request | 根据索引号获取单个 Pull Request                                |
| pull_request\_\_create              | Pull Request | 创建新 Pull Request                                            |
| pull_request\_\_add_reviewer        | Pull Request | 添加审核者到 Pull Request                                      |
| pull_request\_\_delete_reviewer     | Pull Request | 从 Pull Request 中移除审核者                                   |
| pull_request\_\_get_review          | Pull Request | 获取 Pull Request 的指定审核                                   |
| pull_request\_\_get_review_comments | Pull Request | 获取 Pull Request 审核的内联评论                               |
| pull_request\_\_list_reviews        | Pull Request | 列出 Pull Request 的所有审核                                   |
| pull_request\_\_edit                | Pull Request | 编辑 Pull Request（标题、正文、状态、 assignee、标签、里程碑） |
| pull_request\_\_list_my             | Pull Request | 列出当前用户创建的 Pull Request                                |

## 开发

### 1. 安装

```bash
pnpm install
```

### 2. 启动

```bash
pnpm dev
```

### 3. 调试

在弹出的 MCP Inspector 跳时网页，选择 SSE 模式并连接，SSE 支持自动重连，更好支持本地开发调试，当然你也可以选择其他模式

### 4. 参数传递

- stdio 模式，可以用 `process.env` 获取 mcp 配置的 env 变量
- see/streamable-http 模式，可以用封装的 ctx.get() 获取 mcp 配置的请求头，方便鉴权等
