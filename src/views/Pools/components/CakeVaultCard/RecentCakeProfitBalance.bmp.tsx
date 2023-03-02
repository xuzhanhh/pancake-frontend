import React from 'react'
import { TooltipText } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import AutoEarningsBreakdown from '../AutoEarningsBreakdown'
import { useTooltip } from 'contexts/bmp/TooltipContext'

interface RecentCakeProfitBalanceProps {
  cakeToDisplay: number
  pool: DeserializedPool
  account: string
}

const RecentCakeProfitBalance: React.FC<RecentCakeProfitBalanceProps> = ({ cakeToDisplay, pool, account }) => {
  const { onPresent } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />)

  return (
    <view>
      {/* {tooltipVisible && tooltip} */}
      <TooltipText onClick={onPresent} small>
        <Balance fontSize="14px" value={cakeToDisplay} />
      </TooltipText>
    </view>
  )
}

export default RecentCakeProfitBalance
