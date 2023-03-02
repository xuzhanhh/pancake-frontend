import React from 'react'
import { Box, Button, TooltipText } from '@pancakeswap/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'
import { useTooltip } from 'contexts/bmp/TooltipContext'

export const VaultStakeButtonGroup = ({
  onFlexibleClick,
  onLockedClick,
}: {
  onFlexibleClick: () => void
  onLockedClick: () => void
}) => {
  const { t } = useTranslation()
  const { onPresent } = useTooltip(
    <Box>
      {t(
        'Flexible staking offers flexibility for staking/unstaking whenever you want. Locked staking offers higher APY as well as other benefits.',
      )}
    </Box>,
  )
  return (
    <Box width="100%">
      <FlexGap gap="12px">
        <Button style={{ flex: 1 }} onClick={onFlexibleClick}>
          {t('Flexible')}
        </Button>
        <Button style={{ flex: 1 }} onClick={onLockedClick}>
          {t('Locked')}
        </Button>
      </FlexGap>
      {/* {tooltipVisible && tooltip} */}
      <TooltipText mt="16px" small onClick={onPresent}>
        {t('What’s the difference?')}
      </TooltipText>
    </Box>
  )
}
