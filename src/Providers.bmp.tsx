import React, { useState } from 'react'
import { ThemeProvider } from '@pancakeswap/mp-styled-2'
import { light, dark, WebviewProvider } from '@pancakeswap/uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { SWRConfig } from 'swr'
import { Provider } from 'react-redux'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
// import { RefreshContextProvider } from 'contexts/RefreshContext'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import store, { persistor } from 'state'
import { PersistGate } from 'redux-persist/lib/integration/react'

import { usePollBlockNumber } from 'state/block/hooks'
import useEagerConnect from 'hooks/useEagerConnect'

const ThemeProviderWrapper = (props) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : light} {...props} />
}

const Hooks2 = () => {
  usePollBlockNumber()
  useEagerConnect()
  return null
}
export const PathContext = React.createContext({
  redirectAddress: '',
  setRedirectAddress: (redirectAddress) => {},
})

export const PathProvider = function ({ children }) {
  const [redirectAddress, setRedirectAddress] = useState('')
  return <PathContext.Provider value={{ redirectAddress, setRedirectAddress }}>{children}</PathContext.Provider>
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProviderWrapper>
            <LanguageProvider>
              <SWRConfig
                value={{
                  use: [fetchStatusMiddleware],
                }}
              >
                <PathProvider>
                  <WebviewProvider webviewFilePath="views/webview">{children}</WebviewProvider>
                  <Hooks2 />
                </PathProvider>
              </SWRConfig>
            </LanguageProvider>
          </ThemeProviderWrapper>
        </PersistGate>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
