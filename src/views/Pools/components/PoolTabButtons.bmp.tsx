import React from 'react'
// import { NextLinkFromReactRouter } from 'components/NextLink'
import ToggleView from 'components/ToggleView/ToggleView'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import { styled } from '@pancakeswap/mp-styled-2'
import { ButtonMenu, ButtonMenuItem, Toggle, Text, NotificationDot } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`
// FIXME
const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;
`

/* > div { */
/*   padding: 8px 0px; */
/* } */

// FIXME
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

/* a { */
/*   padding-left: 12px; */
/*   padding-right: 12px; */
/* } */

const PoolTabButtons = ({
  stakedOnly,
  setStakedOnly,
  hasStakeInFinishedPools,
  viewMode,
  setViewMode,
  setShowFinishedPools,
  showFinishedPools,
}) => {
  const router = useRouter()

  const { t } = useTranslation()

  const isExact = !showFinishedPools

  const viewModeToggle = (
    <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
  )
  const liveOrFinishedSwitch = (
    <Wrapper>
      <ButtonMenu
        onItemClick={(index) => {
          if (index === 0) {
            setShowFinishedPools(false)
          } else if (index === 1) {
            setShowFinishedPools(true)
          }
        }}
        activeIndex={isExact ? 0 : 1}
        scale="sm"
        variant="subtle"
      >
        <ButtonMenuItem replace>{t('Live')}</ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedPools}>
          <ButtonMenuItem id="finished-pools-button" replace>
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
      <Text> {t('Staked only')}</Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      {viewModeToggle}
      {stakedOnlySwitch}
      {liveOrFinishedSwitch}
    </ViewControls>
  )
}

export default PoolTabButtons
