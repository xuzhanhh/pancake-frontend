// @ts-ignore

import mpService from '@binance/mp-service'

const { platform, host } = mpService.getSystemInfoSync()

import sensors from './mp'

declare const __mp_private_api__: any

export interface Params {
  server_url: string
  appId?: string
  data_report_type?: 'native' | 'request'
  show_log?: boolean
  max_string_length?: number
  datasend_timeout?: number
}

export const initMiniTrack = async (params: Params) => {
  let {
    appId,
    server_url,
    data_report_type = 'native',
    show_log = false,
    max_string_length = 500,
    datasend_timeout = 3000,
  } = params

  if (!server_url) throw new Error('server_url are required parameters')

  if (!appId) appId = host?.appId

  let canNative
  if ((mpService as any).canIUseCustom)
    canNative = await (mpService as any).canIUseCustom('private-sensors-track-event')
  if (platform === 'devtools' || !canNative) data_report_type = 'request'
  if (Array.isArray(server_url)) server_url = server_url[0]

  sensors.registerApp({ df_appId: appId })
  sensors.setPara({
    server_url,
    data_report_type,
    show_log,
    max_string_length,
    datasend_timeout,
  })

  try {
    if (__mp_private_api__?.getUserProfile) {
      const res = await __mp_private_api__.getUserProfile()
      if (res?.uid) sensors.login(res.uid)
      sensors.init()
    } else {
      sensors.init()
    }
  } catch (e) {
    sensors.init()
  }
}

export const miniTrack = (eventType, params) => {
  if (eventType?.startsWith('$')) throw new Error(`track event type must not start with "$"`)
  if (!['df_mplaunch', 'df_mpshow', 'df_mpclick', 'df_mpviewscreen'].includes(eventType)) {
    console.warn('The event type must be the following values: df_mplaunch, df_mpshow, df_mpclick, df_mpviewscreen')
  }
  sensors.track(eventType, params)
}
