import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@pancakeswap/uikit'

export interface EarnedProps {
  earnings: number
  pid: number
}

interface EarnedPropsWithLoading extends EarnedProps {
  userDataReady: boolean
}

const Amount = styled.div<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: inline-flex;
  align-items: center;
`

const Earned: React.FunctionComponent<EarnedPropsWithLoading> = ({ earnings, userDataReady }) => {
  if (userDataReady) {
    return <Amount earned={earnings}>{earnings.toLocaleString(undefined, { maximumFractionDigits: 3 })}</Amount>
  }
  return (
    <Amount earned={0}>
      <Skeleton width={60} />
    </Amount>
  )
}

export default Earned
