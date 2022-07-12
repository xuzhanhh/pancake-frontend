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
export interface LiquidityParams {
  currency1?: string
  currency2?: string
  page?: LiquidityPage
}
export const jumpToLiquidity = ({ currency1, currency2, page = LiquidityPage.Add }: LiquidityParams) => {
  mpService.switchTab({
    url: '/views/bmp/liquidity/index',
  })
  globalThis.tabbarSelected = 1
  globalThis.liquidityPage = page ?? LiquidityPage.Add
  globalThis.currency1 = currency1
  globalThis.currency2 = currency2
}
