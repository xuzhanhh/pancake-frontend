import React, { memo, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'
import { getVaultPosition } from 'utils/cakePool'
import { usePool, useDeserializedPoolByVaultKey } from 'state/pools/hooks'
import ExpandRow from './ExpandRow'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
  expanded: boolean
  toggleExpand: (expanded: boolean) => void
  setHeight: (height: number) => void
  sousId: number
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
  expanded: boolean;
  toggleExpand: any:
`
export const VaultPoolRow: React.FC<{
  vaultKey: VaultKey
  account: string
  expanded: boolean
  toggleExpand: (expanded: boolean) => void
  setHeight: (height: number) => void
  userDataLoaded: boolean
}> = memo(({ vaultKey, account, expanded, toggleExpand, setHeight, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  // const isLargerScreen = isLg || isXl || isXxl
  // const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey)

  const position = useMemo(() => getVaultPosition(pool?.userData), [pool?.userData])
  useEffect(() => {
    setTimeout(() => {
      pool.vaultKey &&
        expanded &&
        bn
          .createSelectorQuery()
          .selectAll(`.row-${pool.sousId}`)
          .boundingClientRect(function (rect) {
            setHeight(rect[0].height)
          })
          .exec()
    }, 500)
  }, [expanded, position])
  return (
    <view className={`row-${pool.sousId}`}>
      <ExpandRow
        panel={
          <ActionPanel
            userDataLoaded={userDataLoaded}
            account={account}
            pool={pool}
            expanded
            breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
          />
        }
        toggleExpand={toggleExpand}
        expanded={expanded}
      >
        <NameCell pool={pool} />
        <AutoAprCell pool={pool} />
      </ExpandRow>
    </view>
  )
})

const PoolRow: React.FC<PoolRowProps> = ({ sousId, account, userDataLoaded, expanded, toggleExpand, setHeight }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const { pool } = usePool(sousId)
  // const [triggerCount, trigger] = useState(0)
  // const [innerExpanded, setExpanded] = useState(expanded)
  // const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  // const toggleInnerExpanded = () => {
  //   setExpanded((prev) => !prev)
  //   toggleExpand()
  // }
  //
  const position = useMemo(() => getVaultPosition(pool?.userData), [pool?.userData])
  useEffect(() => {
    setTimeout(() => {
      pool.vaultKey &&
        expanded &&
        bn
          .createSelectorQuery()
          .selectAll(`.row-${pool.sousId}`)
          .boundingClientRect(function (rect) {
            setHeight(rect[0].height)
          })
          .exec()
    }, 500)
  }, [expanded, position])

  // const isCakePool = pool.sousId === 0

  // return (
  //   <view className={`row-${pool.sousId}`}>
  //     <StyledRow role="row" onClick={toggleExpand}>
  //       <NameCell pool={pool} />
  //       {pool.vaultKey ? (
  //         isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && <AutoEarningsCell pool={pool} account={account} />
  //       ) : (
  //         <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
  //       )}
  //       {isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && isCakePool ? (
  //         <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
  //       ) : null}
  //       {isLargerScreen && !isCakePool && <TotalStakedCell pool={pool} />}
  //       {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
  //       {isLargerScreen && isCakePool && <TotalStakedCell pool={pool} />}
  //       {isDesktop && !isCakePool && <EndsInCell pool={pool} />}
  //       <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
  //     </StyledRow>
  //     {expanded && (
  //       <ActionPanel
  //         account={account}
  //         pool={pool}
  //         userDataLoaded={userDataLoaded}
  //         expanded={expanded}
  //         breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
  //       />
  //     )}
  //   </view>
  // )
  return (
    <view className={`row-${pool.sousId}`}>
      <ExpandRow
        expanded={expanded}
        toggleExpand={toggleExpand}
        panel={
          <ActionPanel
            userDataLoaded={userDataLoaded}
            account={account}
            pool={pool}
            expanded
            breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
          />
        }
      >
        <NameCell pool={pool} />
        <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        <AprCell pool={pool} />
      </ExpandRow>
    </view>
  )
}

export default memo(PoolRow)
