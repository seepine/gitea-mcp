#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from '@/server'
import { ctx } from '@/server/context'
import { parseContextData } from '@/utils/parse'

async function main() {
  // stdio 模式下填充默认上下文，因为一般从 env 传值
  ctx.setDefaultContext(parseContextData()!)
  const server: McpServer = createServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
