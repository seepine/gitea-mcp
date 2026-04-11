import { Gitea } from '../gitea'
import { ctx } from '../context'

export const handleTool = async <T>(
  fn: (gitea: Gitea) => Promise<T>,
): Promise<{ content: { type: 'text'; text: string }[]; isError?: boolean }> => {
  const result = ctx.safeGet()
  if (!result.success) {
    return { isError: true, content: [{ type: 'text', text: result.error }] }
  }
  const gitea = new Gitea(result.data)
  try {
    return {
      content: [{ type: 'text', text: JSON.stringify(await fn(gitea), null, 2) }],
    }
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }],
    }
  }
}
