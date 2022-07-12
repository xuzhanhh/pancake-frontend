import { useContext, useEffect } from 'react'
import mpService from '@binance/mp-service'
import { LanguageContext, useTranslation } from 'contexts/Localization'

const useBmpInit = () => {
  const { t } = useTranslation()
  const { isFetching } = useContext(LanguageContext)
  /* -------------------------------------------------------------------------- */
  /*                           Set Tab Item I18N Text                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    console.log('~ setTabBarItem')
    mpService.setTabBarItem({
      index: 0,
      text: t('Exchange'),
    })
    mpService.setTabBarItem({
      index: 1,
      text: t('Liquidity'),
    })
    mpService.setTabBarItem({
      index: 2,
      text: t('Farm'),
    })
    mpService.setTabBarItem({
      index: 3,
      text: t('Pools'),
    })
  }, [t, isFetching])
}

export default useBmpInit
