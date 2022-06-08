import React, { useState } from 'react'
import Farms from 'pages/farms/index.bmp'
import BmpPage from '../BmpPage'
import { ActiveId } from '../BmpPage/constants'
import { FarmsPage, FarmsProvider, useFarms } from './farmsContext'
import mpService, { useDidHide, useDidShow } from '@binance/mp-service'
import { WebView } from '@binance/mp-components'

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
let webviewContext: Record<string, unknown>

const provider = bn.getWeb3Provider()
const setWebviewContext = (): Promise<void> => {
  return new Promise((resolve) => {
    mpService
      .createSelectorQuery()
      .select('.web-view')
      .context((result) => {
        // post message
        webviewContext = result.context
        resolve()
      })
      .exec()
  })
}
const request = async (payload: any) => {
  const res = await provider.request(payload)
  return res
}
const on = (payload: { event: string }, id: number) => {
  const { event } = payload
  provider.on(event, (params: any) => {
    webviewContext?.postMessage({ id, payload: params ?? JSON.stringify(params) })
  })
}
const onMessage = async (e) => {
  const { data } = e.detail
  console.log('~ mp onMessage: ', data)
  if (!webviewContext) {
    await setWebviewContext()
  }
  switch (data.action) {
    case 'request':
      const res = await request(data.payload)
      webviewContext.postMessage({ id: data.id, payload: JSON.stringify(res) })
      break
    case 'on':
      on(data.payload, data.id)
      break
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
  return <WebView className="web-view" src="https://web-git-mp-farms-webview.pancake.run/farms-mp" onMessage={onMessage} />
  return (
    <BmpPage activeId={ActiveId.FARMS}>
      <FarmsProvider>
        <FarmsWrapper />
      </FarmsProvider>
    </BmpPage>
  )
}
export default FarmsHome
