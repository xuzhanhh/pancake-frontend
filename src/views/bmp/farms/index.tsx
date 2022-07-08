import React, { useContext } from 'react'
import mpService from '@binance/mp-service'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import Farms from 'pages/farms/index.bmp'
import { WebviewContext } from '@pancakeswap/uikit'
import WalletWebView, { BridgeEventData } from './WebviewBridge'
import { jumpToLiquidity } from 'utils/bmp/jump'
import { FarmsPage, useFarms } from './farmsContext'
import { LiquidityPage } from '../liquidity/liquidityContext'

export const FarmsWrapper = () => {
  const {
    state: { page },
  } = useFarms()
  switch (page) {
    case FarmsPage.Farms:
      return <Farms />
    case FarmsPage.History:
      // use same component here
      return <Farms />
    default:
      return null
  }
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
  }
}
const toWallet = () => {
  mpService.navigateToMiniProgram({
    appId: 'hhL98uho2A4sGYSHCEdCCo',
  })
}
const FarmsHome = () => {
  const { webviewFilePath, setUrl } = useContext(WebviewContext)
  const toExternal = (payload: { url }) => {
    setUrl(payload.url)
    setTimeout(() => {
      mpService.navigateTo({ url: webviewFilePath })
    }, 500)
  }
  const handleMessage = (data: BridgeEventData) => {
    switch (data.action) {
      case 'jump':
        jump(data.payload)
        break
      case 'getSystemInfo':
        return getSystemInfoSync()
      case 'toWallet':
        return toWallet()
      case 'toExternal':
        return toExternal(data.payload)
    }
  }
  return <WalletWebView onMessage={handleMessage} src="https://web-git-mp-farms-webview.pancake.run/_mp/farms" />
}
export default FarmsHome
