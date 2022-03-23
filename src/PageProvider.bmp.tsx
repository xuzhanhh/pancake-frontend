import React from 'react'
import { StyleProvider } from 'styled-components'
import { ModalProvider } from '@pancakeswap/uikit'
import { ToastsProvider, ToastListener } from 'contexts/ToastsContext'

import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { AnalyticsProvider } from 'contexts/AnalyticsContext'
import { TooltipListener, TooltipProvider } from 'contexts/bmp/TooltipContext'
import { useInactiveListener } from './hooks/useInactiveListener'
import { Blocklist, Updaters } from './index'

const Hooks = () => {
  usePollBlockNumber()
  useEagerConnect()
  // useFetchProfile()
  // usePollCoreFarmData()
  // useUserAgent()
  // useInactiveListener()
  return <></>
}

const Providers: React.FC = ({ children }) => {
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
                    <Updaters />
                    <Hooks />
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
