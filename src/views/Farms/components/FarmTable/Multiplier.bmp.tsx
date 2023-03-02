import React from 'react'
import { styled } from '@pancakeswap/mp-styled-2'
import { Text, HelpIcon, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useTooltip } from 'contexts/bmp/TooltipContext'

const ReferenceElement = styled.div`
  /* display: inline-block; */
  display: flex;
`
export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
  const { t } = useTranslation()
  const tooltipContent = (
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
    </>
  )
  const { onPresent } = useTooltip(tooltipContent)
  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement onClick={onPresent}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
    </Container>
  )
}

export default Multiplier
