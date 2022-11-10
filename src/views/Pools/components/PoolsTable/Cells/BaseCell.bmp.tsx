import React from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { styled } from '@pancakeswap/mp-styled-2'

const BaseCell = styled(Flex)`
  color: black;

  padding: 24px 8px;

  flex-direction: column;
  justify-content: flex-start;
`

export const CellContent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  max-height: 40px;
`

export default BaseCell
