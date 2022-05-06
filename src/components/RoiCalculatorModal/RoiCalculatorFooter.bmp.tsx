import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, ExpandableLabel, LinkExternal, Grid, HelpIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getApy } from 'utils/compoundApyHelpers'
import { useTooltip } from 'contexts/bmp/TooltipContext'

const Footer = styled(Flex)`
  background: ${({ theme }) => theme.colors.dropdown};
  p: 0 16px;
  mx: 24px;
  flex-direction: column;
  border-radius: 16px;
`

const BulletList = styled.div`
  margin-top: 16px;
  padding: 0;
  > bn-view {
    margin: 0;
    padding: 0;
    position: relative;
  }
  > bn-view::before {
    content: '•';
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`
const ListText = styled(Text)`
  font-size: 12px;
  color: textSubtle;
`

interface RoiCalculatorFooterProps {
  isFarm: boolean
  apr: number
  displayApr: string
  autoCompoundFrequency: number
  multiplier: string
  linkLabel: string
  linkHref: string
  performanceFee: number
  onDismiss(): void
  jumpToLiquidity: () => void
}

const RoiCalculatorFooter: React.FC<RoiCalculatorFooterProps> = ({
  isFarm,
  apr,
  displayApr,
  autoCompoundFrequency,
  multiplier,
  linkLabel,
  performanceFee,
  onDismiss,
  jumpToLiquidity,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const { onPresent } = useTooltip(
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of CAKE rewards each farm receives, as a proportion of the CAKE produced each block.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 CAKE per block, a 40x farm would receive 40 CAKE per block.')}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>,
  )

  const gridRowCount = isFarm ? 4 : 2
  const apy = (getApy(apr, autoCompoundFrequency > 0 ? autoCompoundFrequency : 1, 365, performanceFee) * 100).toFixed(2)

  const onGetLPClick = () => {
    jumpToLiquidity()
    onDismiss()
  }
  return (
    <Footer>
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? t('Hide') : t('Details')}
      </ExpandableLabel>
      {isExpanded && (
        <Box px="8px">
          <Grid
            style={{
              gridTemplateColumns: '2.5fr 1fr',
              alignItems: 'center',
              gridRowGap: '8px',
              gridTemplateRows: `repeat(${gridRowCount}, auto)`,
            }}
          >
            {isFarm && (
              <>
                <Text color="textSubtle" small>
                  {t('APR (incl. LP rewards)')}
                </Text>
                <Text small textAlign="right">
                  {displayApr}%
                </Text>
              </>
            )}
            <Text color="textSubtle" small>
              {isFarm ? t('Base APR (CAKE yield only)') : t('APR')}
            </Text>
            <Text small textAlign="right">
              {apr.toFixed(2)}%
            </Text>
            <Text color="textSubtle" small>
              {t('APY (%compoundTimes%x daily compound)', {
                compoundTimes: autoCompoundFrequency > 0 ? autoCompoundFrequency : 1,
              })}
            </Text>
            <Text small textAlign="right">
              {apy}%
            </Text>
            {isFarm && (
              <>
                <Text color="textSubtle" small>
                  {t('Farm Multiplier')}
                </Text>
                <Flex justifyContent="flex-end" alignItems="center">
                  <Text small textAlign="right" mr="4px">
                    {multiplier}
                  </Text>
                  <Flex onClick={onPresent}>
                    <HelpIcon color="textSubtle" width="16px" height="16px" />
                  </Flex>
                </Flex>
              </>
            )}
          </Grid>
          <BulletList>
            <ListText>{t('Calculated based on current rates.')}</ListText>
            {isFarm && (
              <ListText>
                {t('LP rewards: 0.17% trading fees, distributed proportionally among LP token holders.')}
              </ListText>
            )}
            <ListText>
              {t(
                'All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.',
              )}
            </ListText>
            {performanceFee > 0 && (
              <ListText mt="14px">
                {t('All estimated rates take into account this pool’s %fee%% performance fee', {
                  fee: performanceFee,
                })}
              </ListText>
            )}
          </BulletList>
          <Flex justifyContent="center" mt="24px" mb="16px" onClick={onGetLPClick}>
            <LinkExternal>{linkLabel}</LinkExternal>
          </Flex>
        </Box>
      )}
    </Footer>
  )
}

export default RoiCalculatorFooter
