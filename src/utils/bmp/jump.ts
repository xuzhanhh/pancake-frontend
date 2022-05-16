import mpService from '@binance/mp-service'

export const jumpToSwap = (address?: string) => {
  mpService.switchTab({
    url: '/views/Swap/bmp/index',
  })
  globalThis.jumpToSwap = 1
  globalThis.tabbarSelected = 0
  if (address) {
    globalThis.currency2 = address
  }
}
