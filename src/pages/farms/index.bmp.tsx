import React, { useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { FarmsPageLayout, FarmsContext } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'views/Farms/Farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'
import { useDidHide, useDidShow } from '@binance/mp-service'
import { VariableSizeList } from 'views/bmp/BmpPage/components/VirtualList'
import { remove } from 'lodash'

let expandIndex = []
const setExpandIndex = (func) => {
  const result = func(expandIndex)
  expandIndex = result
}

const FarmsPage = ({ cakePrice }) => {
  const { account } = useWeb3React()
  const { chosenFarmsMemoized, height } = useContext(FarmsContext)
  const [reRender, triggerRerender] = useState(0)

  useDidShow(() => {
    triggerRerender((n) => n + 1)
  })
  useEffect(() => {
    triggerRerender((n) => n + 1)
  }, [chosenFarmsMemoized])

  const virtualListRef = useRef()
  const toggleExpand = (index) => () => {
    setExpandIndex((expandIndex) => {
      if (expandIndex.includes(index)) {
        const newArray = [...expandIndex]
        remove(newArray, (n) => n === index)
        return newArray
      } else {
        return [...expandIndex, index]
        // setExpandIndex(array => [...array, index])
      }
    })
    virtualListRef.current?.resetAfterIndex(index)
  }
  const Row = React.memo(
    useCallback(
      ({ data, index, style }) => {
        const farm = data[index]
        return (
          <FarmCard
            key={farm.pid}
            farm={farm}
            displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
            cakePrice={cakePrice}
            account={account}
            removed={false}
            toggleExpand={toggleExpand(index)}
            expand={expandIndex.includes(index)}
          />
        )
      },
      [account, cakePrice],
    ),
  )

  const itemKey = useCallback((index, data) => data[index].pid, [])
  const VariableList = useMemo(() => {
    return (
      <VariableSizeList
        height={height || 500}
        ref={virtualListRef}
        width="100%"
        itemData={chosenFarmsMemoized}
        itemCount={chosenFarmsMemoized.length}
        itemSize={(index) => (expandIndex.includes(index) ? 566 : 422)}
        itemKey={itemKey}
        overscanCount={4}
        // onScrollToLower={setVisible}
      >
        {Row}
      </VariableSizeList>
    )
  }, [chosenFarmsMemoized, itemKey, expandIndex])
  return <view style={{ maxWidth: 'unset', margin: 'unset' }}>{VariableList}</view>
}

const Fetcher = ({ setCakePrice }) => {
  const cakePrice = usePriceCakeBusd()
  useEffect(() => {
    setCakePrice(cakePrice)
  }, [cakePrice, setCakePrice])
  return null
}

const FarmsPageWrapper = () => {
  const [isDisplay, setIsDisplay] = useState(true)
  const [cakePrice, setCakePrice] = useState(undefined)
  useDidShow(() => {
    setIsDisplay(true)
  })
  useDidHide(() => {
    setIsDisplay(false)
  })
  return (
    <FarmsPageLayout>
      <FarmsPage cakePrice={cakePrice} />
      {isDisplay && <Fetcher setCakePrice={setCakePrice} />}
    </FarmsPageLayout>
  )
}

export default FarmsPageWrapper
