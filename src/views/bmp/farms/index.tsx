import React, { useState } from 'react'
import Farms from 'pages/farms/index.bmp'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'
import { FarmsPage, FarmsProvider, useFarms } from './farmsContext'
import { useDidHide, useDidShow } from '@binance/mp-service'

export const FarmsWrapper = () => {
  const {
    state: { page },
  } = useFarms()
  switch (page) {
    case FarmsPage.Farms:
      return <Farms />
    case FarmsPage.History:
      // use same component here
      return <Farms />
    default:
      return null
  }
}

const FarmsHome = () => {
  //   const [isHide, setIsHide] = useState(false)
  //   useDidShow(() => {
  //     setIsHide(false)
  //   })
  //   useDidHide(() => {
  //     setIsHide(true)
  //   })
  //   if (isHide) {
  //     return null
  //   }
  return (
    <BmpPage activeId={ActiveId.FARMS}>
      <FarmsProvider>
        <FarmsWrapper />
      </FarmsProvider>
    </BmpPage>
  )
}
export default FarmsHome
