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
}
