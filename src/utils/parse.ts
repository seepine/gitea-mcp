import { IncomingHttpHeaders } from 'http'
import { Response } from 'express'

const GITEA_HOST = process.env['GITEA_HOST']
const GITEA_ACCESS_TOKEN = process.env['GITEA_ACCESS_TOKEN']

export const parseContextData = (headers?: IncomingHttpHeaders, res?: Response) => {
  let giteaHost = GITEA_HOST
  let giteaAccessToken = GITEA_ACCESS_TOKEN
  if (headers) {
    if (!giteaHost) {
      giteaHost = headers['gitea-host']?.toString() || headers['gitea_host']?.toString()
    }
    if (!giteaAccessToken) {
      giteaAccessToken =
        headers['gitea-access-token']?.toString() || headers['gitea_access_token']?.toString()
    }
  }

  if (!giteaHost) {
    if (res) {
      res.status(401)
      res.json({
        isError: true,
        message: 'the request header of `Gitea-Host` must be set',
      })
      return
    }
    throw new Error(`the env of 'GITEA_HOST' must be set`)
  }
  if (!giteaAccessToken) {
    if (res) {
      res.status(401)
      res.json({
        isError: true,
        message: 'the request header of `Gitea-Access-Token` must be set',
      })
      return
    }
    throw new Error(`the env of 'GITEA_ACCESS_TOKEN' must be set`)
  }
  return {
    giteaHost,
    giteaAccessToken,
  }
}
