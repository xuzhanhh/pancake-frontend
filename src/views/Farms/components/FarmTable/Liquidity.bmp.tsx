import React from 'react'
import { styled } from '@pancakeswap/mp-styled-2'
import { HelpIcon, Text, Skeleton } from '@pancakeswap/uikit'
import { useTooltip } from 'contexts/bmp/TooltipContext'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'

const ReferenceElement = styled.div`
  /* display: inline-block; */
  display: flex;
`

export interface LiquidityProps {
  liquidity: BigNumber
}

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: bold;
  text-align: right;
  line-height: 1.5;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0) ? (
      `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    ) : (
      <Skeleton width={60} />
    )
  const { t } = useTranslation()
  // const { targetRef, tooltip, tooltipVisible } = useTooltip(
  //   { placement: 'top-end', tooltipOffset: [20, 10] },
  // )
  //
  const tooltipContent = (
    <>
      <Text>{t('Total value of the funds in this farm’s liquidity pool')}</Text>
    </>
  )

  const { onPresent } = useTooltip(tooltipContent)

  return (
    <Container>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
      {/* <ReferenceElement ref={targetRef}> */}
      <ReferenceElement onClick={onPresent}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {/* {tooltipVisible && tooltip} */}
    </Container>
  )
}

export default Liquidity
