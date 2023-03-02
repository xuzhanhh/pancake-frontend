import React, { useEffect } from 'react'
import { styled, keyframes, css } from '@pancakeswap/mp-styled-2'
import { Box, Flex, HelpIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { BIG_ZERO } from 'utils/bigNumber'
import Harvest from './Harvest'
import Stake from './Stake'
import AutoHarvest from './AutoHarvest'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import CakeVaultApr from './CakeVaultApr'
import PoolStatsInfo from '../../PoolStatsInfo'
import { useTooltip } from 'contexts/bmp/TooltipContext'

const expandAnimation = keyframes`
`

const collapseAnimation = keyframes`
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  @keyframes expandAnimation {
    from {
      max-height: 0px;
    }
    to {
      max-height: 1000px;
    }
  }
  @keyframes collapseAnimation {
    from {
      max-height: 1000px;
    }
    to {
      max-height: 0px;
    }
  }
  animation: ${({ expanded }) =>
    expanded
      ? `
          expandAnimation 300ms linear forwards
        `
      : `
          collapseAnimation 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;
`

const ActionContainer = styled.div<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  pool: DeserializedPool
  userDataLoaded: boolean
  expanded: boolean
  breakpoints: MediaBreakpoints
}
// FIXME
const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  padding: 8px 8px;
`

const YieldBoostDurationRow = ({ lockEndTime, lockStartTime }) => {
  const { weekDuration, secondDuration } = useUserDataInVaultPresenter({
    lockEndTime,
    lockStartTime,
  })

  return (
    <>
      <YieldBoostRow secondDuration={secondDuration} />
      <LockDurationRow weekDuration={weekDuration} />
    </>
  )
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  account,
  pool,
  userDataLoaded,
  expanded,
  // setIsLocked,
  // setIsShared,
  // trigger,
}) => {
  const { userData, vaultKey } = pool
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const vaultPool = useVaultPoolByKey(vaultKey)
  const {
    userData: {
      lockEndTime,
      lockStartTime,
      balance: { cakeAsBigNumber },
      locked,
    },
  } = vaultPool

  const vaultPosition = getVaultPosition(vaultPool.userData)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  // useEffect(() => {
  //   pool.vaultKey && trigger(n => n + 1)
  // }, [locked, stakingTokenBalance.toString()])
  // useEffect(() => {
  //   pool.vaultKey && trigger(n => n + 1)
  // }, [stakingTokenBalance])
  const poolStakingTokenBalance = vaultKey
    ? cakeAsBigNumber.plus(stakingTokenBalance)
    : stakedBalance.plus(stakingTokenBalance)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Rewards are distributed and included into your staking balance automatically. There’s no need to manually compound your rewards.',
  )

  const {
    // targetRef: tagTargetRef,
    // tooltip: tagTooltip,
    // tooltipVisible: tagTooltipVisible,
    onPresent,
  } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText)

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {isMobile && locked && (
          <Box mb="16px">
            <YieldBoostDurationRow lockEndTime={lockEndTime} lockStartTime={lockStartTime} />
          </Box>
        )}
        <Flex flexDirection="column" mb="8px">
          <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />
        </Flex>
        <view style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />}
          {/* {tagTooltipVisible && tagTooltip} */}
          <view onClick={onPresent}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </view>
        </view>
      </InfoSection>
      <ActionContainer>
        {isMobile && vaultKey && vaultPosition === VaultPosition.None && (
          <CakeVaultApr pool={pool} userData={vaultPool.userData} vaultPosition={vaultPosition} />
        )}
        <Box width="100%">
          {pool.vaultKey && (
            <VaultPositionTagWithLabel
              userData={vaultPool.userData}
              width={['auto', , 'fit-content']}
              ml={['12px', , , , , '32px']}
            />
          )}
          <ActionContainer isAutoVault={!!pool.vaultKey} hasBalance={poolStakingTokenBalance.gt(0)}>
            {pool.vaultKey ? (
              <AutoHarvest {...pool} userDataLoaded={userDataLoaded} />
            ) : (
              <Harvest {...pool} userDataLoaded={userDataLoaded} />
            )}
            <Stake pool={pool} userDataLoaded={userDataLoaded} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
