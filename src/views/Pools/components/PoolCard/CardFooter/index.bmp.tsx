import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import PoolStatsInfo from '../../PoolStatsInfo'
import { useTooltip } from 'contexts/bmp/TooltipContext'

interface FooterProps {
  pool: DeserializedPool
  account: string
  totalCakeInVault?: BigNumber
  defaultExpanded?: boolean
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`
const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const Footer: React.FC<FooterProps> = ({ pool, account, defaultExpanded, children }) => {
  const { vaultKey } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Rewards are distributed and included into your staking balance automatically. There’s no need to manually compound your rewards.',
  )

  const { onPresent } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText)

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />}
          <Flex onClick={onPresent}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedWrapper flexDirection="column">
          {children || <PoolStatsInfo pool={pool} account={account} />}
        </ExpandedWrapper>
      )}
    </CardFooter>
  )
}

export default Footer
