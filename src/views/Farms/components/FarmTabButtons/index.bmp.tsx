import React from 'react'
import { styled } from '@pancakeswap/mp-styled-2'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useFarms, FarmsPage } from 'views/bmp/farms/farmsContext'
// import { useRouter } from 'next/router'
// import { NextLinkFromReactRouter } from 'components/NextLink'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  // const router = useRouter()
  const { t } = useTranslation()
  const {
    dispatch,
    state: { page },
  } = useFarms()
  let activeIndex
  switch (page) {
    case FarmsPage.Farms:
      activeIndex = 0
      break
    case FarmsPage.History:
      activeIndex = 1
      break
    // case '/farms/archived':
    //   activeIndex = 2
    //   break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu
        onItemClick={(index) => {
          console.log('???', index)
          if (index === 0) {
            dispatch({ type: 'setPage', page: FarmsPage.Farms })
          } else if (index === 1) {
            dispatch({ type: 'setPage', page: FarmsPage.History })
          }
        }}
        activeIndex={activeIndex}
        scale="sm"
        variant="subtle"
      >
        <ButtonMenuItem>{t('Live')}</ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* FIXME */
  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
