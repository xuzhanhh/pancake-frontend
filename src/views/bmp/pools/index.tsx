import semver from 'semver'
import Pools from 'views/Pools/index.bmp'
import React from 'react'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import useParsedQueryString from 'hooks/useParsedQueryString.bmp'
import { ActiveId } from '../BmpPage/constants'
import BmpPage from '../BmpPage'
import WalletWebView from '../farms/WebviewBridge'

const systemInfo = getSystemInfoSync()
declare const env
const PoolsHome = () => {
  const isNewVersion = semver.gte(systemInfo.version, '2.48.0')
  if (isNewVersion) {
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

  return (
    <WalletWebView
      // onMessage={handleMessage}
      // src={`https://pancakeswap.finance/_mp/pools${parsedQs?.search ? `?search=${parsedQs.search}` : ''}`}
      src={`https://web.pancake.run/_mp/pools${parsedQs?.search ? `?search=${parsedQs.search}` : ''}`}
    />
  )
}
export default PoolsHome
