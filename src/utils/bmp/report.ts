import { miniTrack } from '@binance/mini-track'

function report(type, params) {
  try {
    miniTrack(type, params)
  } catch (err) {
    console.error('🚀 ~ file: track.ts ~ line 5 ~ report ~ err', err)
  }
}

export const track = {
  click(eventName: EVENT_IDS, params?: Record<string, string | number>) {
    report('df_mpclick', {
      eventName,
      ...params,
    })
  },
  view(eventName: EVENT_IDS, params?: Record<string, string | number>) {
    report('df_mpviewscreen', {
      eventName,
      ...params,
    })
  },
}

export enum EVENT_IDS {
  // contract
  INVOKE_CONTRACT_METHODS = 'app_click_pcs_invoke_contract_methods',
  // click
  CONNECT_WALLET = 'app_click_pcs_connect_wallet',
  SWAP_CLICK = 'app_click_pcs_swap_click',
}
