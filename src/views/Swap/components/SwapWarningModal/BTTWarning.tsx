import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Link, LinkExternal } from '@pancakeswap/uikit'

const BTTWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t(
          'Please note that this is the old BTT token, which has been swapped to the new BTT tokens in the following ratio:',
        )}
      </Text>
      <Text>1 BTT (OLD) = 1,000 BTT (NEW)</Text>
      <LinkExternal href="https://medium.com/@BitTorrent/tutorial-how-to-swap-bttold-to-btt-453264d7142">
        {t('For more details on the swap, please refer here.')}
      </LinkExternal>
    </>
  )
}

export default BTTWarning
