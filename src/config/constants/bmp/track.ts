export const trackConfigs = {
  // stake flexible
  poolsAdd: {
    category: 'pools',
    action: 'add',
  },
  // unStake flexible
  poolsRemove: {
    category: 'pools',
    action: 'remove',
  },
  // stake locked
  poolsAddLocked: {
    category: 'pools',
    action: 'addLocked',
  },
  // swap submitted
  swapSubmitted: {
    category: 'swap',
    action: 'transactionSubmitted',
  },
  swapClickSwap: {
    category: 'swap',
    action: 'clickSwap',
  },
  liquidityRemove: {
    category: 'liquidity',
    action: 'removeLiquidity',
  },
  liquidityAdd: {
    category: 'liquidity',
    action: 'addLiquidity',
  },
  farmStake: {
    category: 'farm',
    action: 'stake',
  },
  farmHarvest: {
    category: 'farm',
    action: 'harvest',
  },
}
