import React from 'react'
import { styled } from '@pancakeswap/mp-styled-2'

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-align: left;
`

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
`

interface CellLayoutProps {
  label?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <view>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </view>
  )
}

export default CellLayout
