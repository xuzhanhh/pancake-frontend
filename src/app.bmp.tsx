import React, { Component } from 'react'
import Provider from './Providers'
import './style.scss'
import { init, bindRequest } from '@binance/sentry-miniapp'
import { getEnv } from 'utils/bmp/getEnv'
import './polyfill.bmp'
import 'utils/apr.bmp'
import { initMiniTrack } from 'utils/bmp/sensors'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import '@pancakeswap/mp-uikit-2/dist/lib/index.css'

declare const COMMIT_ID: string
declare const env: any

const systemInfo = getSystemInfoSync()

init({
  dsn: 'https://c4641904bb124a01adcbf53b19b94f3d@o529943.ingest.sentry.io/6227528',
  autoSessionTracking: true,
  tracesSampleRate: 1,
  environment: getEnv(),
  release: `${COMMIT_ID}`,
  beforeBreadcrumb(breadcrumb, hint) {
    if ((breadcrumb.level === 'debug' || breadcrumb.level === 'info') && breadcrumb.category === 'console') {
      return null
    }
    return breadcrumb
  },
})

const request = (params) => {
  console.log('????? fetch')
  const promise = new Promise((resolve, reject) => {
    bn.request({
      ...params,
      success: (res) => {
        console.log('???? success', res)
        const { data, header } = res

        if (res.statusCode >= 200 && res.statusCode < 300) {
          res.ok = true
        }
        res.headers = {
          get: (key) => res.header[key.toLowerCase()],
        }
        res.json = () => {
          return JSON.parse(res.data)
        }
        if (header['content-type']?.indexOf('application/json') > -1) {
          if (typeof data === 'object') {
            resolve(res)
            return
          }

          try {
            const json = JSON.parse(res.data)
            res.data = json
            resolve(res)
          } catch (e) {
            if (typeof e === 'string') {
              reject(new Error(e))
            } else if (e instanceof Error) {
              reject(e)
            }
          }
        } else {
          res(data)
        }
      },
      fail: (response) => reject(new Error(response.errMsg)),
    })
  }).catch((reason) => {
    throw reason
  })

  return promise
}
// bn.request = bindRequest(request)
// __mp_private_api__.request = bindRequest(__mp_private_api__.request)

initMiniTrack({
  appId: systemInfo?.host?.appId,
  server_url: 'https://sensors.binance.cloud/sa?project=binance',
  data_report_type: 'request',
})

class App extends Component {
  componentDidMount() {
    console.log('🚀 ~ file: app.bmp.tsx ~ line 39 ~ App ~ componentDidMount ~ componentDidMount')
  }

  componentDidShow() {
    console.log('🚀 ~ file: app.bmp.tsx ~ line 44 ~ App ~ componentDidShow ~ componentDidShow')
  }

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    console.log('🚀 ~ file: app.bmp.tsx ~ line 51 ~ App ~ render ~ render')
    const { children } = this.props
    return <Provider>{children}</Provider>
  }
}

export default App
