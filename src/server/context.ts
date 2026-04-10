import { AsyncLocalStorage } from 'async_hooks'

type Context = {
  giteaHost: string
  giteaAccessToken: string
}

let defaultContext: Context | undefined
const storage = new AsyncLocalStorage<Context>()
/**
 * 提供在 sse 或 streamable-http 传输中获取请求上下文的能力，例如获取请求头
 */
export const ctx = {
  get: () => {
    var val = storage.getStore() ?? defaultContext
    if (val === undefined) {
      throw new Error(
        'not found context, please use ctx.run(context,()=>{ /* xxx */ }) to wrap your code',
      )
    }
    return storage.getStore()!
  },
  safeGet: () => {
    var val = storage.getStore() ?? defaultContext
    if (val === undefined) {
      return {
        success: false as const,
        error: 'not found context, please use ctx.run(context,()=>{ /* xxx */ }) to wrap your code',
      }
    }
    return {
      success: true as const,
      data: val,
    }
  },
  setDefaultContext: (ctx: Context) => {
    defaultContext = ctx
  },
  run: (context: Context, fn: () => Promise<void> | void) => {
    return storage.run(context, fn)
  },
}
