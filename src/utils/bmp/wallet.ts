import { getWeb3Provider } from '@binance/mp-service'

export const registerToken = async (tokenAddress: string) => {
  const tokenAdded = await getWeb3Provider().request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
      },
    },
  })
  return tokenAdded
}
