#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from '@/server'
import { ctx } from '@/server/context'
import { parseContextData } from '@/utils/parse'

async function main() {
  await ctx.run(parseContextData()!, async () => {
    const server: McpServer = createServer()
    const transport = new StdioServerTransport()
    await server.connect(transport)
  })
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
