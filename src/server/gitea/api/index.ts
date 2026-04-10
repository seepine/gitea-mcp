import { createAlova } from 'alova'
import fetchAdapter from 'alova/fetch'
import { createApis, withConfigType, mountApis } from './createApis'
import { ctx } from '../../context.js'

export const alovaInstance = createAlova({
  baseURL: '/api/v1',
  requestAdapter: fetchAdapter(),
  beforeRequest: (method) => {
    const context = ctx.get()
    method.baseURL = context.giteaHost + '/api/v1'
    if (typeof method.config.params !== 'string') {
      method.config.params.access_token = context.giteaAccessToken
    }
  },
  responded: (res) => {
    return res.json()
  },
})

export const $$userConfigMap = withConfigType({})

const Apis = createApis(alovaInstance, $$userConfigMap)

mountApis(Apis)

export default Apis
