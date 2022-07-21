import { miniTrack } from './sensors'

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
  CONFIRM_SWAP_CLICK = 'app_click_pcs_confirm_swap_click',
  SWAP_MODAL_CANCEL = 'app_click_pcs_swap_modal_cancel',
  SWAP_MODAL_ACCEPT_CHANGES = 'app_click_pcs_swap_modal_accept_changes',
  // view
  ACCOUNT_DETAIL = 'app_view_pcs_account_detail',
}
