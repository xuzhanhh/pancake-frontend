import React from 'react'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useActiveHandle } from 'hooks/useEagerConnect'
import { track, EVENT_IDS } from 'utils/bmp/report'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const handle = useActiveHandle()
  return (
    <Button
      onClick={() => {
        track.click(EVENT_IDS.CONNECT_WALLET)
        handle()
      }}
      {...props}
    >
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
