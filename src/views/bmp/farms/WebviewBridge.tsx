import mpService, { useDidShow } from '@binance/mp-service'
import React from 'react'
import { WebView } from '@binance/mp-components'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import { EVENT_IDS, track } from 'utils/bmp/report'

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

function parseTxData(data: string, to: string): { method: string; arg?: string } {
  try {
    let arg
    const functionSignature = data.slice(0, 10)
    switch (functionSignature) {
      case '0xb6b55f25':
        arg = data.slice(10)
        if (Number(`0x${arg}`) === 0) {
          return { method: 'pool-harvest' }
        } else {
          return { method: 'pool-stake', arg: `0x${arg}` }
        }
      case '0x2e1a7d4d':
        return { method: 'pool-unstake' }
      case '0x5521e9bf':
        return { method: 'pool-unstake' }
      case '0x441a3e70':
        return { method: 'farm-unstake' }
      case '0xe2bbb158':
        const area = to === '0x45c54210128a065de780c4b0df3d16664f7f859e' ? 'pool' : 'farm'
        if (area === 'pool') {
          arg = data.slice(10, 74)
          return { method: 'pool-stake' }
        } else {
          arg = data.slice(74)
          if (Number(`0x${arg}`) === 0) {
            return { method: 'farm-harvest' }
          } else {
            return { method: 'farm-stake' }
          }
        }
      default:
        return { method: 'undefined' }
    }
  } catch (e) {
    return { method: 'undefined' }
  }
}
const reportData = (payload, type: 'success' | 'fail', extraData = {}) => {
  const { data, to, from } = payload
  const { method } = parseTxData(data, to)
  track.click(EVENT_IDS.INVOKE_CONTRACT_METHODS, { df_8: from, df_9: `${method}_${type}`, ...extraData })
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
    if (data?.payload?.method === 'eth_sendTransaction') {
      reportData(data?.payload?.params?.[0], 'success')
    }
  } catch (e) {
    context.postMessage({ id: data.id, payload: JSON.stringify({ error: true, message: e.message }) })
    if (data?.payload?.method === 'eth_sendTransaction') {
      reportData(data?.payload?.params?.[0], 'fail', { df_12: e.toString() })
    }
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
  useDidShow(() => {
    setWebviewContext(src)
  })
  return <WebView className="web-view" src={src} onMessage={handleMessage} />
}

export default WalletWebView
