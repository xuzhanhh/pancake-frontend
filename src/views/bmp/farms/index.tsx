import React from 'react'
import semver from 'semver'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import Farms from 'pages/farms/index.bmp'
import useParsedQueryString from 'hooks/useParsedQueryString.bmp'
import WalletWebView from './WebviewBridge'
import { FarmsPage, FarmsProvider, useFarms } from './farmsContext'

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
const systemInfo = getSystemInfoSync()
declare const env
// const isMainland = () => !env.API_HOST?.includes('binance')
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
  return (
    <WalletWebView
      // onMessage={handleMessage}
      // src={`https://pancakeswap.finance/_mp/farms${parsedQs?.search ? `?search=${parsedQs.search}` : ''}`}
      src={`https://web.pancake.run/_mp/farms${parsedQs?.search ? `?search=${parsedQs.search}` : ''}`}
    />
  )
}
export default FarmsHome
