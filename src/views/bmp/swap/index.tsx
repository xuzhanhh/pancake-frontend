import React, { useEffect, useState } from 'react'
import semver from 'semver'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import useParsedQueryString from 'hooks/useParsedQueryString.bmp'
import { Swap } from 'views/Swap/bmp'
import WalletWebView from '../farms/WebviewBridge'
import { useDidShow } from '@binance/mp-service'

const systemInfo = getSystemInfoSync()
declare const env
// const isMainland = () => !env.API_HOST?.includes('binance')
const SwapHome = () => {
  const isNewVersion = semver.gte(systemInfo.version, '2.48.0')
  if (isNewVersion) {
    return <WebviewWrapper />
  }
  return <MiniSwapHome />
}
const MiniSwapHome = () => {
  return (
    <BmpPage activeId={ActiveId.SWAP}>
      <Swap />
    </BmpPage>
  )
}

const WebviewWrapper = () => {
  useDidShow(() => {
    console.log('??? wrapper show')
  })
  return <WebviewSwapHome />
}
const WebviewSwapHome = () => {
  const parsedQs = useParsedQueryString()

  const { inputCurrencyId, outputCurrencyId } = parsedQs

  const [output, setOutput] = useState(null)
  useEffect(() => {
    if (outputCurrencyId) {
      setOutput(outputCurrencyId)
    }
  }, [outputCurrencyId])
  useDidShow(() => {
    console.log('???  home show', globalThis.currency2)
    if (globalThis.jumpToSwap) {
      if (globalThis.currency2) {
        setOutput(globalThis.currency2)
      }
      globalThis.jumpToSwap = undefined
      globalThis.currency2 = undefined
    }
  })
  return (
    <WalletWebView
      src={`https://web-git-mp-qa.pancake.run/_mp/swap?${inputCurrencyId ? `inputCurrency=${inputCurrencyId}` : ''}${
        output ? `&outputCurrency=${output}` : ''
      }`}
    />
  )
}
export default SwapHome
