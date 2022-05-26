import React from 'react'
import { Flex, TooltipText } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import Apr from 'views/Pools/components/Apr'
import { useTooltip } from 'contexts/bmp/TooltipContext'

interface AprRowProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  performanceFee?: number
  showIcon?: boolean
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakedBalance, performanceFee = 0, showIcon = true }) => {
  const { t } = useTranslation()
  const { vaultKey } = pool

  const tooltipContent = vaultKey
    ? t('APY includes compounding, APR doesn’t. This pool’s CAKE is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const { onPresent } = useTooltip(<view>{tooltipContent}</view>)
  return (
    <Flex alignItems="center" justifyContent="space-between">
      {/* {tooltipVisible && tooltip} */}
      <TooltipText onClick={onPresent}>{vaultKey ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText>
      <Apr pool={pool} stakedBalance={stakedBalance} performanceFee={performanceFee} showIcon={showIcon} />
    </Flex>
  )
}

export default AprRow
