import React, { useContext, useEffect, useState } from 'react'
import { FarmsPageLayout, FarmsContext } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'views/Farms/Farms'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'
import { useDidHide, useDidShow } from '@binance/mp-service'

const FarmsPage = ({ cakePrice }) => {
  const { account } = useWeb3React()
  const { chosenFarmsMemoized } = useContext(FarmsContext)
  console.log('???rerender farmspage')
  return (
    <view>
      {chosenFarmsMemoized.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
          cakePrice={cakePrice}
          account={account}
          removed={false}
        />
      ))}
    </view>
  )
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
