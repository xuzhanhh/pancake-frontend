import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import PoolRow from './PoolRow'
import { VariableSizeList } from 'views/bmp/BmpPage/components/VirtualList'
import remove from 'lodash/remove'
import { VaultPoolRow } from './PoolRow.bmp'

interface PoolsTableProps {
  pools: DeserializedPool[]
  userDataLoaded: boolean
  account: string
  remainHeight?: number
}

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const VirtualListRow = React.memo(({ data, index, style }) => {
  const { pool, userDataLoaded, account, expanded, toggleExpand, setHeight } = data[index]
  if (pool.vaultKey) {
    return (
      <VaultPoolRow
        account={account}
        vaultKey={pool.vaultKey}
        expanded={expanded}
        toggleExpand={toggleExpand}
        setHeight={setHeight}
        userDataLoaded={userDataLoaded}
      />
    )
  }
  return (
    <PoolRow
      // pool={pool}
      account={account}
      userDataLoaded={userDataLoaded}
      expanded={expanded}
      toggleExpand={toggleExpand}
      setHeight={setHeight}
      sousId={pool.sousId}
    />
  )
})
const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, account, remainHeight }) => {
  const [expandIndex, setExpandIndex] = useState([])
  // const [isLocked, setIsLocked] = useState(false)
  // const [isShared, setIsShared] = useState(false)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    virtualListRef.current?.resetAfterIndex(0)
  }, [height])

  const virtualListRef = useRef()
  const toggleExpand = useCallback(
    (index) => () => {
      console.log('???', toggleExpand)
      setExpandIndex((expandIndex) => {
        if (expandIndex.includes(index)) {
          const newArray = [...expandIndex]
          remove(newArray, (n) => n === index)
          return newArray
        } else {
          return [...expandIndex, index]
        }
      })
      virtualListRef.current?.resetAfterIndex(index)
    },
    [],
  )

  useEffect(() => {
    virtualListRef.current?.resetAfterIndex(0)
  }, [
    pools
      .map((item) => {
        return item.sousId.toString()
      })
      .join('-'),
  ])

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table">
        <VariableSizeList
          height={remainHeight || 500}
          ref={virtualListRef}
          width="100%"
          itemData={pools.map((item, index) => {
            return {
              pool: item,
              account,
              userDataLoaded,
              expanded: expandIndex.includes(index),
              toggleExpand: toggleExpand(index),
              // setIsLocked,
              // setIsShared,
              setHeight,
            }
          })}
          itemCount={pools.length}
          itemSize={(index) => {
            if (expandIndex.includes(index)) {
              if (pools[index].vaultKey) {
                return height || 750
                // if (!isLocked && isShared) {
                //   return 750
                // }
                // if (!isShared) {
                //   return 667
                // }
                // return 677
              }
              return 529
            }
            return 90
          }}
          overscanCount={1}
        >
          {VirtualListRow}
        </VariableSizeList>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
