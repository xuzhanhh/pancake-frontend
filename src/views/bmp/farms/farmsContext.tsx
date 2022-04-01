import React, { createContext } from 'react'
import mpService from '@binance/mp-service'
import { LiquidityPage } from '../liquidity/liquidityContext'
// import { useLiquidity, LiquidityPage } from './swapContext.bmp'

export enum FarmsPage {
  Farms,
  History,
}
type Action = { type: 'setPage'; page: FarmsPage }
type Dispatch = (action: Action) => void
interface State {
  page: FarmsPage
}
type FarmsProviderProps = { children: React.ReactNode }

const FarmsContext = createContext<
  { state: State; dispatch: Dispatch; jumpToLiquidity: (currency1: string, currency2: string) => void } | undefined
>(undefined)

function FarmsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setPage':
      return { ...(state || {}), page: action.page }
    default:
      break
  }
  return state
}

function FarmsProvider({ children }: FarmsProviderProps) {
  const [state, dispatch] = React.useReducer(FarmsReducer, {
    page: FarmsPage.Farms,
  })
  // const { dispatch: liquidityDispatch } = useLiquidity()
  const jumpToLiquidity = (currency1: string, currency2: string) => {
    mpService.switchTab({
      // url: `/views/bmp/liquidity/index?page=${LiquidityPage.Add}&currency1=${currency1}&currency2=${currency2}`
      url: '/views/bmp/liquidity/index',
    })
    globalThis.tabbarSelected = 1
    globalThis.liquidityPage = LiquidityPage.Add
    globalThis.currency1 = currency1
    globalThis.currency2 = currency2
    // setActiveId(ActiveId.LIQUIDITY)
    // liquidityDispatch({ type: 'setPage', page: LiquidityPage.Add })
    // liquidityDispatch({ type: 'setCurrency', currency1, currency2 })
  }
  const value = { state, dispatch, jumpToLiquidity }
  return <FarmsContext.Provider value={value}> {children} </FarmsContext.Provider>
}

function useFarms() {
  const context = React.useContext(FarmsContext)
  return context
}

export { FarmsProvider, useFarms }
