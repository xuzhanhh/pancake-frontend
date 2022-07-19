import React, { useEffect, useState } from 'react'
import { StyleProvider } from 'styled-components'
import { ModalProvider } from '@pancakeswap/uikit'
import { ToastsProvider, ToastListener } from 'contexts/ToastsContext'

import useUserAgent from 'hooks/useUserAgent'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { AnalyticsProvider } from 'contexts/AnalyticsContext'
import { TooltipListener, TooltipProvider } from 'contexts/bmp/TooltipContext'
import useBmpInit from 'hooks/useBmpInit'
import { useInactiveListener } from './hooks/useInactiveListener'
import { Blocklist, Updaters } from './index'
import { useDidHide, useDidShow } from '@binance/mp-service'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useWeb3React } from '@web3-react/core'
import { FetchStatus } from 'config/constants/types'
import { LOW_BNB_BALANCE } from 'components/Menu/UserMenu/WalletModal'
import { EVENT_IDS, track } from 'utils/bmp/report'
import { ethers } from 'ethers'

const Hooks = () => {
  // useEagerConnect()
  // useBmpInit()
  // useFetchProfile()
  // usePollCoreFarmData()
  // useUserAgent()
  // useInactiveListener()
  return <></>
}

const Hooks2 = () => {
  usePollBlockNumber()
  return null
}

const Providers: React.FC = ({ children }) => {
  const { balance, fetchStatus } = useGetBnbBalance()
  const { account } = useWeb3React()
  useEffect(() => {
    if (fetchStatus === FetchStatus.Fetched || fetchStatus === FetchStatus.Failed) {
      const etherString = ethers.utils.formatEther(balance)
      const hasLowBnbBalance = fetchStatus === FetchStatus.Fetched && balance.lte(LOW_BNB_BALANCE)
      track.view(EVENT_IDS.ACCOUNT_DETAIL, {
        df_8: account || '',
        df_9: Number(hasLowBnbBalance),
        price1: Number(etherString),
      })
    }
  }, [balance, fetchStatus, account])
  const [visible, setVisible] = useState(false)
  useDidHide(() => {
    setVisible(false)
  })
  useDidShow(() => {
    setVisible(true)
  })
  return (
    <>
      <StyleProvider />
      <view>
        <AnalyticsProvider>
          <TooltipProvider>
            <ToastsProvider>
              <ModalProvider>
                <Blocklist>
                  <view>
                    {visible && <Updaters />}
                    {visible && <Hooks />}
                  </view>
                  {children}
                  <ToastListener />
                  <TooltipListener />
                </Blocklist>
              </ModalProvider>
            </ToastsProvider>
          </TooltipProvider>
        </AnalyticsProvider>
      </view>
    </>
  )
}

export default Providers
