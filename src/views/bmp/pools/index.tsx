import React from 'react'
import BmpPage from '../BmpPage'
import Pools from 'views/Pools/index.bmp'
import { ActiveId } from '../BmpPage/constants'

const PoolsHome = () => {
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
    <BmpPage activeId={ActiveId.Pools}>
      <Pools />
    </BmpPage>
  )
}
export default PoolsHome
