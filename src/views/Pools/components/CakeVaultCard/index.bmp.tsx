import React, { useEffect, useMemo } from 'react'
import { Box, CardBody, CardProps, Flex, Text, TokenPairImage } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { vaultPoolConfig } from 'config/constants/pools'
import { useTranslation } from 'contexts/Localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'

import CardFooter from '../PoolCard/CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from '../PoolCard/PoolCardHeader'
import { StyledCard } from '../PoolCard/StyledCard'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'
import { StakingApy } from './StakingApy'
import VaultCardActions from './VaultCardActions'
import LockedStakingApy from '../LockedPool/LockedStakingApy'
import { getVaultPosition } from 'utils/cakePool'

const StyledCardBody = styled(CardBody) <{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface CakeVaultProps extends CardProps {
  pool: DeserializedPool
  showStakedOnly: boolean
  expanded?: boolean
  toggleExpand: any
  setHeight: (height: number) => void
  // setIsLocked: (locked: boolean) => void
  // setIsShared: (shared: boolean) => void
}

const CakeVaultCard: React.FC<CakeVaultProps> = ({
  pool,
  showStakedOnly,
  expanded,
  toggleExpand,
  // setIsLocked,
  // setIsShared,
  setHeight,
  ...props
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const vaultPool = useVaultPoolByKey(pool.vaultKey)

  // useEffect(() => {
  //   setIsLocked(vaultPool?.userData?.locked)
  // }, [vaultPool?.userData?.locked])
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
  } = vaultPool

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading
  // useEffect(() => {
  //   setIsShared(accountHasSharesStaked)
  // }, [accountHasSharesStaked])

  const position = useMemo(() => getVaultPosition(vaultPool?.userData), [vaultPool?.userData])
  useEffect(() => {
    setTimeout(() => {
      bn.createSelectorQuery()
        .selectAll(`.vault-pool`)
        .boundingClientRect(function (rect) {
          setHeight(rect[0].height)
        })
        .exec()
    }, 10)
  }, [position, expanded])

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }
  return (
    <view className="vault-pool">
      <StyledCard style={{ maxWidth: '100% !important' }} isActive {...props}>
        <PoolCardHeader isStaking={accountHasSharesStaked}>
          <PoolCardHeaderTitle
            title={vaultPoolConfig[pool.vaultKey].name}
            subTitle={vaultPoolConfig[pool.vaultKey].description}
          />
          <TokenPairImage
            secondarySrc={'https://pancakeswap.finance' + vaultPoolConfig[pool.vaultKey].tokenImage.secondarySrc}
            primarySrc={'https://pancakeswap.finance' + vaultPoolConfig[pool.vaultKey].tokenImage.primarySrc}
            width={64}
            height={64}
          />
        </PoolCardHeader>
        <StyledCardBody isLoading={isLoading}>
          {account && <VaultPositionTagWithLabel userData={vaultPool.userData} />}
          {account && vaultPool?.userData?.locked ? (
            <LockedStakingApy
              userData={vaultPool?.userData}
              stakingToken={pool?.stakingToken}
              stakingTokenBalance={pool?.userData?.stakingTokenBalance}
            />
          ) : (
            <>
              <StakingApy pool={pool} />
              <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
                <Box>
                  {account && (
                    <Box mb="8px">
                      <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
                    </Box>
                  )}
                  <RecentCakeProfitRow pool={pool} />
                </Box>
                <Flex flexDirection="column">
                  {account ? (
                    <VaultCardActions
                      pool={pool}
                      accountHasSharesStaked={accountHasSharesStaked}
                      isLoading={isLoading}
                      performanceFee={performanceFeeAsDecimal}
                    />
                  ) : (
                    <>
                      <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                        {t('Start earning')}
                      </Text>
                      <ConnectWalletButton />
                    </>
                  )}
                </Flex>
              </FlexGap>
            </>
          )}
        </StyledCardBody>
        <CardFooter expanded={expanded} toggleExpand={toggleExpand} pool={pool} account={account} />
      </StyledCard>
    </view>
  )
}

export default CakeVaultCard
