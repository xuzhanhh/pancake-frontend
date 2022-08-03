import React, { useContext } from 'react'
import semver from 'semver'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'
import mpService from '@binance/mp-service'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import Farms from 'pages/farms/index.bmp'
import { WebviewContext } from '@pancakeswap/uikit'
import useParsedQueryString from 'hooks/useParsedQueryString.bmp'
import WalletWebView, { BridgeEventData } from './WebviewBridge'
import { jumpToLiquidity, jumpToSwap } from 'utils/bmp/jump'
import { FarmsPage, FarmsProvider, useFarms } from './farmsContext'
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
    case 'swap':
      return jumpToSwap(payload?.query?.outputCurrency || '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
  }
}
const toWallet = () => {
  mpService.navigateToMiniProgram({
    appId: 'hhL98uho2A4sGYSHCEdCCo',
  })
}
const systemInfo = getSystemInfoSync()
const FarmsHome = () => {
  const isNewVersion = semver.gte(systemInfo.version, '2.48.0')
  if (isNewVersion) {
    return <WalletFarmsHome />
  }
  return <MiniFarmHome />
}
const MiniFarmHome = () => {
  return (
    <BmpPage activeId={ActiveId.FARMS}>
      <FarmsProvider>
        <FarmsWrapper />
      </FarmsProvider>
    </BmpPage>
  )
}
const WalletFarmsHome = () => {
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
      src={`https://pancakeswap.finance/_mp/farms${parsedQs?.search ? `?search=${parsedQs.search}` : ''}`}
    />
  )
}
export default FarmsHome
