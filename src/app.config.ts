export default {
  // entryPagePath: 'views/Swap/bmp/index',
  entryPagePath: 'views/bmp/liquidity',
  pages: [
    // 'views/Swap/bmp/index',
    'views/bmp/liquidity/index',
    // 'views/bmp/farms/index',
    // 'views/bmp/pools/index',
    // 'views/webview',
  ],
  darkmode: true,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'PancakeSwap',
  },
  themeLocation: './theme.json',
  tabBar: {
    custom: true,
    color: '#7A6EAA',
    selectedColor: '#7645D9',
    backgroundColor: '@navBgColor',
    borderStyle: '@tabBorder',
    list: [
      {
        iconPath: 'images/trade.png',
        selectedIconPath: 'images/trade-select.png',
        pagePath: 'views/Swap/bmp/index',
        text: 'Exchange',
      },
      {
        iconPath: 'images/earn.png',
        selectedIconPath: 'images/earn-select.png',
        pagePath: 'views/bmp/liquidity/index',
        text: 'Liquidity',
      },
      {
        iconPath: 'images/farm.png',
        selectedIconPath: 'images/farm-select.png',
        pagePath: 'views/bmp/farms/index',
        text: 'Farm',
      },
      {
        iconPath: 'images/pools.png',
        selectedIconPath: 'images/pools-select.png',
        pagePath: 'views/bmp/pools/index',
        text: 'Pools',
      },
    ],
  },
}
