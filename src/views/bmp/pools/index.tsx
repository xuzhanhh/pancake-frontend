import React, { useContext } from 'react'
import mpService from '@binance/mp-service'
import { WebviewContext } from '@pancakeswap/uikit'
import { jumpToLiquidity } from 'utils/bmp/jump'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import WalletWebView, { BridgeEventData } from '../farms/WebviewBridge'
import { LiquidityPage } from '../liquidity/liquidityContext'

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

const PoolsHome = () => {
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

  return <WalletWebView onMessage={handleMessage} src="https://pancakeswap.finance/_mp/pools" />
}
export default PoolsHome
