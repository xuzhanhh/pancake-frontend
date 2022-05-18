import mpService from '@binance/mp-service'
import { LiquidityPage } from 'views/bmp/liquidity/liquidityContext'

export const jumpToSwap = (outputCurrency?: string) => {
  mpService.switchTab({
    url: '/views/Swap/bmp/index',
  })
  globalThis.jumpToSwap = 1
  globalThis.tabbarSelected = 0
  if (outputCurrency) {
    globalThis.currency2 = outputCurrency
  }
}
export const jumpToLiquidity = (currency1: string, currency2: string) => {
  mpService.switchTab({
    url: '/views/bmp/liquidity/index',
  })
  globalThis.tabbarSelected = 1
  globalThis.liquidityPage = LiquidityPage.Add
  globalThis.currency1 = currency1
  globalThis.currency2 = currency2
}
