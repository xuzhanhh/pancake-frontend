import React from 'react'
import { Flex, Text, TooltipText } from '@pancakeswap/uikit'

import { useVaultApy } from 'hooks/useVaultApy'
import { BalanceWithLoading } from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useTooltip } from 'contexts/bmp/TooltipContext'

const YieldBoostRow = ({ secondDuration }) => {
  const { boostFactor } = useVaultApy({ duration: secondDuration })
  const { t } = useTranslation()

  const tooltipContent = t(
    'Your yield will be boosted based on the total lock duration of your current fixed term staking position.',
  )

  const { onPresent } = useTooltip(tooltipContent)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <TooltipText>
        <Text onClick={onPresent} color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Yield boost')}
        </Text>
      </TooltipText>
      <BalanceWithLoading
        color="text"
        bold
        fontSize="16px"
        value={boostFactor ? boostFactor?.toString() : '0'}
        decimals={2}
        unit="x"
      />
    </Flex>
  )
}

export default YieldBoostRow
