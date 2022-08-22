import semver from 'semver'
import Pools from 'views/Pools/index.bmp'
import React, { useContext } from 'react'
import mpService from '@binance/mp-service'
import { WebviewContext } from '@pancakeswap/uikit'
import { jumpToFarms, jumpToLiquidity, jumpToPools, jumpToSwap } from 'utils/bmp/jump'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import useParsedQueryString from 'hooks/useParsedQueryString.bmp'
import { ActiveId } from '../BmpPage/constants'
import BmpPage from '../BmpPage'
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
const toWallet = () => {
  mpService.navigateToMiniProgram({
    appId: 'hhL98uho2A4sGYSHCEdCCo',
  })
}
const systemInfo = getSystemInfoSync()
declare const env
const isMainland = () => !env.API_HOST?.includes('binance')
const PoolsHome = () => {
  const isNewVersion = semver.gte(systemInfo.version, '2.48.0')
  if (isNewVersion && !isMainland()) {
    return <WalletPoolsHome />
  }
  return <MiniPoolsHome />
}
const MiniPoolsHome = () => {
  return (
    <BmpPage activeId={ActiveId.Pools}>
      <Pools />
    </BmpPage>
  )
}
const WalletPoolsHome = () => {
  const parsedQs = useParsedQueryString()
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

  return (
    <WalletWebView
      onMessage={handleMessage}
      src={`https://pancakeswap.finance/_mp/pools${parsedQs?.search ? `?search=${parsedQs.search}` : ''}`}
    />
  )
}
export default PoolsHome
