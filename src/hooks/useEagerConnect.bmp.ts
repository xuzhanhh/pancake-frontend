import { useCallback, useEffect } from 'react'
import semver from 'semver'
import mpService from '@binance/mp-service'
import { useWeb3React } from '@web3-react/core'

/* eslint max-classes-per-file: off -- noop */
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'
import { captureException, setUser } from '@binance/sentry-miniapp'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import { useTranslation } from 'contexts/Localization'
import useToast from './useToast'
import sensors from 'utils/bmp/sensors/mp'
import { currentProvider, selectProvider, webviewContextMap } from 'views/bmp/farms/WebviewBridge'

const __DEV__ = process.env.NODE_ENV !== 'production'

class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on getWeb3Provider.'
  }
}

class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

class BnInjectedConnector extends AbstractConnector {
  // bnEthereum: any

  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    // currentProvider = bn.getWeb3Provider()
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleNetworkChanged(networkId: string | number): void {
    if (__DEV__) {
      console.log("Handling 'networkChanged' event with payload", networkId)
    }
    this.emitUpdate({ chainId: networkId, provider: currentProvider })
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!currentProvider) {
      await selectProvider()
    }
    if (!currentProvider) {
      throw new NoEthereumProviderError()
    }
    currentProvider.on('accountsChanged', this.handleAccountsChanged)
    currentProvider.on('networkChanged', this.handleNetworkChanged)
    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await currentProvider
        .request({
          method: 'eth_requestAccounts',
        })
        .then((sendReturn) => sendReturn[0])
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful')
    }
    Object.values(webviewContextMap).forEach((context) => {
      context.postMessage({ id: 'connect' })
    })

    return { provider: currentProvider, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    if (!currentProvider) {
      await selectProvider()
    }
    return currentProvider
  }

  public async getChainId(): Promise<number | string> {
    if (!currentProvider) {
      await selectProvider()
    }
    if (!currentProvider) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await currentProvider.request({
        method: 'eth_chainId',
      })
    } catch (error) {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }
    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!currentProvider) {
      await selectProvider()
    }
    if (!currentProvider) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await currentProvider
        .request({
          method: 'eth_accounts',
        })
        .then((sendReturn) => sendReturn[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful')
    }
    return account
  }

  public deactivate() {
    if (currentProvider && currentProvider.removeListener) {
      currentProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      currentProvider.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!currentProvider) {
      await selectProvider()
    }
    if (!currentProvider) {
      return false
    }

    try {
      return await currentProvider
        .request({
          method: 'eth_accounts',
        })
        .then((sendReturn) => {
          if (sendReturn.length > 0) {
            return true
          }
          return false
        })
    } catch {
      return false
    }
  }
}

const injected = new BnInjectedConnector({ supportedChainIds: [56, 97] })
const getAccount = () => injected.getAccount()

const useActive = () => {
  const { activate } = useWeb3React()
  return useCallback(
    () =>
      activate(injected, (error) => {
        console.log('🚀 ~ file: useEagerConnect.ts ~ line 183 ~ activate ~ error', error)
        captureException(error)
      }),
    [activate],
  )
}
export const useEagerConnect = () => {
  const handleActive = useActive()

  useEffect(() => {
    const main = async () => {
      const address = await injected.getAccount()
      if (address) {
        setTimeout(() => {
          handleActive()
        }, 100)
        sensors.login(address)
        setUser({ id: address })
      }
      sensors.init()
    }
    main()
  }, [])
}

const isOldVersion = () => {
  const { version } = getSystemInfoSync()
  return semver.lt(version, '2.43.0')
}

export const useActiveHandleWithoutToast = () => {
  const handleActive = useActive()
  const { t } = useTranslation()

  const main = async () => {
    /**
     *  backward
     */
    const address = await getAccount()
    return new Promise((resolve) => {
      let isLogin = true
      if (!address && isOldVersion()) {
        injected.bnEthereum.ready = true
        injected.bnEthereum
          .request({
            method: 'personal_sign',
            params: ['test'],
          })
          .catch((error) => {
            if (error && error?._code === '600005') {
              isLogin = false
              mpService.login().then(() => {
                handleActive().then(resolve)
              })
            }
          })
        injected.bnEthereum.ready = false
      }
      if (isLogin) {
        handleActive().then(resolve)
      }
    })
  }
  return async () => {
    await main()
    const address = await getAccount()
    if (address) {
      sensors.login(address)
      setUser({ id: address })
    }
    sensors.init()
  }
}
export const useActiveHandle = () => {
  const handleActive = useActive()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const main = async () => {
    /**
     *  backward
     */
    const address = await getAccount()
    return new Promise((resolve) => {
      let isLogin = true
      if (!address && isOldVersion()) {
        injected.bnEthereum.ready = true
        injected.bnEthereum
          .request({
            method: 'personal_sign',
            params: ['test'],
          })
          .catch((error) => {
            if (error && error?._code === '600005') {
              isLogin = false
              mpService.login().then(() => {
                handleActive().then(resolve)
              })
            }
          })
        injected.bnEthereum.ready = false
      }
      if (isLogin) {
        handleActive().then(resolve)
      }
    })
  }
  return async () => {
    await main()
    const address = await getAccount()
    if (address) {
      sensors.login(address)
      setUser({ id: address })
      toastSuccess(t('Success'), 'Wallet connected')
    }
    sensors.init()
  }
}
export default useEagerConnect
