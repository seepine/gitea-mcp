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
