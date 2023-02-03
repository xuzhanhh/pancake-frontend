import React, { useEffect } from 'react'
import { useTracker } from 'contexts/AnalyticsContext'
import { HitBuilders } from 'utils/ga'
import { LiquidityProvider, useLiquidity, LiquidityPage } from './liquidityContext'
import Pool from '../../Pool/index'
import AddLiquidity from '../../AddLiquidity/bmp/index'
import RemoveLiquidity from '../../RemoveLiquidity/index'
import FindPool from '../../PoolFinder/index'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'
import useParsedQueryString from 'hooks/useParsedQueryString.bmp'
import { gte } from 'lodash'
import { getSystemInfoSync } from '@binance/mp-service'
import WalletWebView from '../farms/WebviewBridge'
import semver from 'semver'

const LiquidityWrapper = () => {
  const {
    state: { page },
  } = useLiquidity()
  switch (page) {
    case LiquidityPage.Pool:
      return <Pool />
    case LiquidityPage.Add:
      return <AddLiquidity />
    case LiquidityPage.Remove:
      return <RemoveLiquidity />
    case LiquidityPage.Find:
      return <FindPool />
    default:
      return null
  }
}

const pageEnumToString = (page: LiquidityPage) => {
  switch (page) {
    case LiquidityPage.Pool:
      return 'liquidity'
    case LiquidityPage.Add:
      return 'add'
    case LiquidityPage.Remove:
      return 'remove'
    case LiquidityPage.Find:
      return 'find'
  }
}
const LiquidityHome = () => {
  const tracker = useTracker()
  useEffect(() => {
    tracker.setScreenName('liquidity')
    tracker.send(new HitBuilders.ScreenViewBuilder().build())
  }, [])
  return (
    <BmpPage activeId={ActiveId.LIQUIDITY}>
      <LiquidityProvider>
        <LiquidityWrapper />
      </LiquidityProvider>
    </BmpPage>
  )
}

const NewLiquidityHome = () => {
  const isNewVersion = semver.gte(systemInfo.version, '2.48.0')
  if (isNewVersion) {
    return (
      <LiquidityProvider>
        <WebviewLiquidityHome />
      </LiquidityProvider>
    )
  }
  return <LiquidityHome />
}

const systemInfo = getSystemInfoSync()
const WebviewLiquidityHome = () => {
  const {
    state: { page, currency1, currency2 },
  } = useLiquidity()
  return (
    <WalletWebView
      src={`https://web-git-mp-qa.pancake.run/_mp/liquidity?page=${pageEnumToString(page)}${
        currency1 ? `&currency1=${currency1}` : ''
      }
        ${currency2 ? `&currency1=${currency2}` : ''}`}
    />
  )
}
export default NewLiquidityHome
