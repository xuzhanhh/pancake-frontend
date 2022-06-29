import React, { useEffect, useMemo, useState } from 'react'
import { styled } from '@pancakeswap/mp-styled-2'
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

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
  expanded: boolean;
  toggleExpand: any:
`

const PoolRow: React.FC<PoolRowProps> = ({
  pool,
  account,
  userDataLoaded,
  expanded,
  toggleExpand,
  // setIsLocked,
  // setIsShared,
  setHeight,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  // const [triggerCount, trigger] = useState(0)
  // const [innerExpanded, setExpanded] = useState(expanded)
  // const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  // const toggleInnerExpanded = () => {
  //   setExpanded((prev) => !prev)
  //   toggleExpand()
  // }
  //
  console.log('aaa PoolRow')
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

  const isCakePool = pool.sousId === 0

  return (
    <view className={`row-${pool.sousId}`}>
      <StyledRow role="row" onClick={toggleExpand}>
        <NameCell pool={pool} />
        {pool.vaultKey ? (
          isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && <AutoEarningsCell pool={pool} account={account} />
        ) : (
          <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        )}
        {isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && isCakePool ? (
          <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        ) : null}
        {isLargerScreen && !isCakePool && <TotalStakedCell pool={pool} />}
        {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
        {isLargerScreen && isCakePool && <TotalStakedCell pool={pool} />}
        {isDesktop && !isCakePool && <EndsInCell pool={pool} />}
        <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {expanded && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
          // setIsLocked={setIsLocked}
          // setIsShared={setIsShared}
          // trigger={trigger}
        />
      )}
    </view>
  )
}

export default PoolRow
