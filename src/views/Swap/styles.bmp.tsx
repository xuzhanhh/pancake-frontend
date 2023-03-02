import { Box, Flex } from '@pancakeswap/uikit'
import { styled } from '@pancakeswap/mp-styled-2'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  justify-content: center;
`

export const StyledInputCurrencyWrapper = styled(Box)`
  /* width: 328px; */
  min-width: 328px;
  width: 100%;
`
