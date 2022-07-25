import { showModal } from '@binance/mp-service'
import { Percent } from '@pancakeswap/sdk'
import { ContextApi } from 'contexts/Localization/types'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from '../../../config/constants'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 * @param t Translation
 */
export default function confirmPriceImpactWithoutFee(
  priceImpactWithoutFee: Percent,
  t: ContextApi['t'],
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
      showModal({
        content: t(
          'This swap has a price impact of at least %amount%%. Please confirm that you would like to continue with this swap.',
          {
            amount: ALLOWED_PRICE_IMPACT_HIGH.toFixed(0),
          },
        ),
        success: function (res) {
          if (res.confirm) {
            resolve(true)
          } else if (res.cancel) {
            resolve(false)
          }
        },
        fail: function () {
          resolve(false)
        },
      })
    } else {
      resolve(true)
    }
  })
}
