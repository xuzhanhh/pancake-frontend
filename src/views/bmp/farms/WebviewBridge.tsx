import mpService, { useDidShow } from '@binance/mp-service'
import React, { useContext } from 'react'
import { WebView } from '@binance/mp-components'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import { EVENT_IDS, track } from 'utils/bmp/report'
import { jumpToFarms, jumpToLiquidity, jumpToPools, jumpToSwap } from 'utils/bmp/jump'
import { LiquidityPage } from '../liquidity/liquidityContext'

import { WebviewContext } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useActiveHandleWithoutToast } from 'hooks/useEagerConnect.bmp'
export const webviewContextMap: Record<string, Record<string, unknown>> = {}
const web3Provider = bn.getWeb3Provider()
const mpcProvider = bn.getMpcProvider()
export let currentProvider = mpcProvider ? null : web3Provider
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

function shortenAddress(address = '') {
  if (address.length < 11) {
    return address
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`
}
export const selectProvider = async (selectedCb, isNeedTrigger) => {
  if (!currentProvider) {
    const web3Wallets = await web3Provider.request({ method: 'eth_accounts' })
    const mpcWallets = await mpcProvider.request({ method: 'eth_accounts' })
    if (mpcProvider && web3Wallets.length === 0 && mpcWallets.length === 0) {
      currentProvider = mpcProvider
    } else {
      const { tapIndex } = await bn.showActionSheet({
        alertText: 'Select Wallet',
        itemList: [
          web3Wallets.length > 0 ? `${shortenAddress(web3Wallets[0])}(DeFi Wallet original)` : null,
          mpcWallets.length > 0 ? `${shortenAddress(mpcWallets[0])}` : `+ Create DeFi Wallet`,
        ].filter((item) => item),
      })
      if (tapIndex === 0 && web3Wallets.length > 0) {
        currentProvider = web3Provider
      } else if (tapIndex === 1 || (tapIndex === 0 && web3Wallets.length === 0)) {
        currentProvider = mpcProvider
      }
    }
  }
  try {
    await currentProvider.request({ method: 'eth_requestAccounts' })
  } catch (e) {
    console.error('??? eth_requestAccounts', e)
    if (e.code === '604003') {
      currentProvider = null
    }
  }
  if (currentProvider && selectedCb && typeof selectedCb === 'function' && isNeedTrigger) {
    selectedCb()
  }
}

export const toWallet = async ({ disconnectCb, currentSrc = '' }) => {
  if (currentProvider) {
    const { tapIndex } = await bn.showActionSheet({
      itemList: ['Details', 'Disconnect'],
    })
    if (tapIndex === 0) {
      mpService.navigateToMiniProgram({
        appId: currentProvider === web3Provider ? 'hhL98uho2A4sGYSHCEdCCo' : 'xoqXxUSMRccLCrZNRebmzj',
      })
    } else if (tapIndex === 1) {
      // reset selected provider
      currentProvider = mpcProvider ? null : web3Provider
      if (disconnectCb && typeof disconnectCb === 'function') {
        await disconnectCb()
      }
      Object.entries(webviewContextMap).forEach(([src, context]) => {
        if (src !== currentSrc) {
          context.postMessage({ id: 'disconnect' })
        }
      })
      return JSON.stringify({ method: 'disconnect' })
    }
  }
}
const on = async (context, { payload, id }: BridgeEventData) => {
  console.log('??? on')
  const { event } = payload
  currentProvider.on(event, (params: any) => {
    context?.postMessage({ id, payload: params ?? JSON.stringify(params), on: event })
  })
}
const request = async (context, data: BridgeEventData) => {
  try {
    const res = await currentProvider.request(data.payload)
    context.postMessage({ id: data.id, payload: JSON.stringify(res) })
    if (data?.payload?.method === 'eth_sendTransaction') {
      reportData(data?.payload?.params?.[0], 'success')
    }
  } catch (e) {
    console.log('??? request error', e)
    context.postMessage({ id: data.id, payload: JSON.stringify({ error: true, message: e.message }) })
    if (data?.payload?.method === 'eth_sendTransaction') {
      reportData(data?.payload?.params?.[0], 'fail', { df_12: e.toString() })
    }
  }
}
interface Props {
  src: string
  // onMessage?: (data: BridgeEventData) => void
}

const jump = (payload: { path: string; query?: Record<string, string> }) => {
  switch (payload.path) {
    case 'add':
      jumpToLiquidity({
        page: LiquidityPage.Add,
        currency1: payload.query.currency1,
        currency2: payload.query.currency2,
      })
      break
    case 'swap':
      return jumpToSwap(payload?.query?.outputCurrency || '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
    case 'pools':
      return jumpToPools()
    case 'farms':
      return jumpToFarms()
    default:
      console.log('~ does not match any path')
  }
}
const systemInfo = getSystemInfoSync()
const WalletWebView = ({ src }: Props) => {
  const { deactivate, active } = useWeb3React()
  const handle = useActiveHandleWithoutToast()

  const { webviewFilePath, setUrl } = useContext(WebviewContext)
  const toExternal = (payload: { url }) => {
    setUrl(payload.url)
    setTimeout(() => {
      mpService.navigateTo({ url: webviewFilePath })
    }, 500)
  }
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
        await selectProvider(handle, !active)
        await request(context, data)
        break
      }
      case 'on':
        await selectProvider(handle, !active)
        await on(context, data)
        break
      default:
        let res
        switch (data.action) {
          case 'toWallet':
            res = await toWallet({ disconnectCb: deactivate, currentSrc: src })
            break
          case 'jump':
            res = jump(data.payload)
            break
          case 'getSystemInfo':
            res = getSystemInfoSync()
            break
          case 'toExternal':
            res = toExternal(data.payload)
            break
          default:
            console.error('not match any path')
        }
        console.log('??? result', data.id, res)
        // const res = onMessage(data)
        if (typeof res?.then === 'function') {
          res.then((response) => {
            context.postMessage({ id: data.id, payload: response })
          })
        } else {
          context.postMessage({ id: data.id, payload: res })
        }
    }
  }
  useDidShow(() => {
    setWebviewContext(src)
  })
  return <WebView className="web-view" src={src} onMessage={handleMessage} />
}

export default WalletWebView
