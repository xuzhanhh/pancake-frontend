import mpService from '@binance/mp-service'
import React from 'react'
import { WebView } from '@binance/mp-components'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'

let webviewContext: Record<string, unknown>

const provider = bn.getWeb3Provider()
const setWebviewContext = (): Promise<void> => {
  return new Promise((resolve) => {
    mpService
      .createSelectorQuery()
      .select('.web-view')
      .context((result) => {
        // post message
        webviewContext = result.context
        resolve()
      })
      .exec()
  })
}
export interface BridgeEventData {
  action: string
  id: number
  payload: any
}
interface BridgeEvent {
  detail: {
    data: BridgeEventData
  }
}
const on = ({ payload, id }: BridgeEventData) => {
  const { event } = payload
  provider.on(event, (params: any) => {
    webviewContext?.postMessage({ id, payload: params ?? JSON.stringify(params) })
  })
}
const request = async (data: BridgeEventData) => {
  try {
    const res = await provider.request(data.payload)
    webviewContext.postMessage({ id: data.id, payload: JSON.stringify(res) })
  } catch (e) {
    webviewContext.postMessage({ id: data.id, payload: JSON.stringify({ error: true, message: e.message }) })
  }
}
interface Props {
  src: string
  onMessage?: (data: BridgeEventData) => void
}
const systemInfo = getSystemInfoSync()
const WalletWebView = ({ src, onMessage }: Props) => {
  const handleMessage = async (e: BridgeEvent) => {
    const { data } = e.detail
    if (!webviewContext) {
      await setWebviewContext()
    }
    switch (data.action) {
      case 'request': {
        await request(data)
        break
      }
      case 'on':
        on(data)
        break
      default:
        if (onMessage) {
          const res = onMessage(data)
          if (typeof res?.then === 'function') {
            res.then((response) => {
              webviewContext.postMessage({ id: data.id, payload: response })
            })
          } else {
            webviewContext.postMessage({ id: data.id, payload: res })
          }
        }
    }
  }
  return <WebView className="web-view" src={src} onMessage={handleMessage} />
}

export default WalletWebView
