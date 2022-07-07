import mpService from '@binance/mp-service'
import React from 'react'
import { WebView } from '@binance/mp-components'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'

const webviewContextMap: Record<string, Record<string, unknown>> = {}
const provider = bn.getWeb3Provider()
const setWebviewContext = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    mpService
      .createSelectorQuery()
      .select('.web-view')
      .context((result) => {
        // post message
        webviewContextMap[src] = result.context
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
const on = (context, { payload, id }: BridgeEventData) => {
  const { event } = payload
  provider.on(event, (params: any) => {
    context?.postMessage({ id, payload: params ?? JSON.stringify(params) })
  })
}
const request = async (context, data: BridgeEventData) => {
  try {
    const res = await provider.request(data.payload)
    context.postMessage({ id: data.id, payload: JSON.stringify(res) })
  } catch (e) {
    context.postMessage({ id: data.id, payload: JSON.stringify({ error: true, message: e.message }) })
  }
}
interface Props {
  src: string
  onMessage?: (data: BridgeEventData) => void
}
const systemInfo = getSystemInfoSync()
const WalletWebView = ({ src, onMessage }: Props) => {
  const handleMessage = async (e: BridgeEvent) => {
    let context = webviewContextMap[src]
    console.log('~ context: ', context)
    const { data } = e.detail
    if (!context) {
      await setWebviewContext(src)
      context = webviewContextMap[src]
    }
    switch (data.action) {
      case 'request': {
        await request(context, data)
        break
      }
      case 'on':
        on(context, data)
        break
      default:
        if (onMessage) {
          const res = onMessage(data)
          if (typeof res?.then === 'function') {
            res.then((response) => {
              context.postMessage({ id: data.id, payload: response })
            })
          } else {
            context.postMessage({ id: data.id, payload: res })
          }
        }
    }
  }
  return <WebView className="web-view" src={src} onMessage={handleMessage} />
}

export default WalletWebView
