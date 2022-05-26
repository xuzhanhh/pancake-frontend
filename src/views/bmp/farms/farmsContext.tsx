import React, { createContext } from 'react'
import { jumpToLiquidity } from 'utils/bmp/jump'

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

  const value = { state, dispatch, jumpToLiquidity }
  return <FarmsContext.Provider value={value}> {children} </FarmsContext.Provider>
}

function useFarms() {
  const context = React.useContext(FarmsContext)
  return context
}

export { FarmsProvider, useFarms }
