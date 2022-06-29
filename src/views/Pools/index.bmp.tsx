import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { styled } from '@pancakeswap/mp-styled-2'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Box, Image, Text, Link } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { DeserializedPool, DeserializedPoolVault } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import Loading from 'components/Loading'
import { useInitialBlock } from 'state/block/hooks'
import { BSC_BLOCK_TIME } from 'config'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { getCakeVaultEarnings } from './helpers'
import { getSystemInfoSync, useDidHide, useDidShow } from '@binance/mp-service'
import { isEqual, remove } from 'lodash'
import { VariableSizeList } from 'views/bmp/BmpPage/components/VirtualList'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`
const LabelWrapperText = styled(Text)`
  font-size: 12px;
`
const LabelWrapper = styled.div``

const ControlStretch = styled(Flex)`
  /* > div { */
  /*   flex: 1; */
  /* } */
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 16px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const NUMBER_OF_POOLS_VISIBLE = 1000

const sortPools = (account: string, sortOption: string, pools: DeserializedPool[], poolsToSort: DeserializedPool[]) => {
  switch (sortOption) {
    case 'apr':
      // Ternary is needed to prevent pools without APR (like MIX) getting top spot
      return orderBy(poolsToSort, (pool: DeserializedPool) => (pool.apr ? pool.apr : 0), 'desc')
    case 'earned':
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool) => {
          if (!pool.userData || !pool.earningTokenPrice) {
            return 0
          }

          if (pool.vaultKey) {
            const vault = pool as DeserializedPoolVault
            if (!vault.userData || !vault.userData.userShares) {
              return 0
            }
            return getCakeVaultEarnings(
              account,
              vault.userData.cakeAtLastUserAction,
              vault.userData.userShares,
              vault.pricePerFullShare,
              vault.earningTokenPrice,
              vault.userData.currentOverdueFee.plus(vault.userData.currentPerformanceFee),
            ).autoUsdToDisplay
          }
          return pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
        },
        'desc',
      )
    case 'totalStaked': {
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool) => {
          let totalStaked = Number.NaN
          if (pool.vaultKey) {
            const vault = pool as DeserializedPoolVault
            if (pool.stakingTokenPrice && vault.totalCakeInVault.isFinite()) {
              totalStaked =
                +formatUnits(EthersBigNumber.from(vault.totalCakeInVault.toString()), pool.stakingToken.decimals) *
                pool.stakingTokenPrice
            }
          } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
            totalStaked =
              +formatUnits(EthersBigNumber.from(pool.totalStaked.toString()), pool.stakingToken.decimals) *
              pool.stakingTokenPrice
          }
          return Number.isFinite(totalStaked) ? totalStaked : 0
        },
        'desc',
      )
    }
    case 'latest':
      return orderBy(poolsToSort, (pool: DeserializedPool) => Number(pool.sousId), 'desc')
    default:
      return poolsToSort
  }
}

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

const VirtualListRow = React.memo(({ data, index, style }) => {
  const { pool, stakedOnly, account, expanded, toggleExpand, setHeight } = data[index]
  return pool.vaultKey ? (
    <CakeVaultCard
      key={pool.vaultKey}
      pool={pool}
      showStakedOnly={stakedOnly}
      expanded={expanded}
      toggleExpand={toggleExpand}
      setHeight={setHeight}
    />
  ) : (
    <PoolCard key={pool.sousId} pool={pool} account={account} expanded={expanded} toggleExpand={toggleExpand} />
  )
})

const CardDisplay = ({ chosenPools, remainHeight, account, stakedOnly }) => {
  const [expandIndex, setExpandIndex] = useState([])
  const [isShared, setIsShared] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [height, setHeight] = useState(0)
  const virtualListRef = useRef()
  const toggleExpand = useCallback(
    (index) => () => {
      setExpandIndex((expandIndex) => {
        if (expandIndex.includes(index)) {
          const newArray = [...expandIndex]
          remove(newArray, (n) => n === index)
          return newArray
        } else {
          return [...expandIndex, index]
        }
      })
      virtualListRef.current?.resetAfterIndex(index)
    },
    [],
  )
  useEffect(() => {
    virtualListRef.current?.resetAfterIndex(0)
  }, [isLocked, isShared, height])
  useEffect(() => {
    virtualListRef.current?.resetAfterIndex(0)
  }, [chosenPools.map((item) => item.sousId).join('-')])

  return (
    <VariableSizeList
      height={remainHeight || 500}
      ref={virtualListRef}
      width="100%"
      itemData={chosenPools.map((item, index) => {
        return {
          pool: item,
          account,
          stakedOnly,
          expanded: expandIndex.includes(index),
          toggleExpand: toggleExpand(index),
          setIsLocked,
          setIsShared,
          setHeight,
        }
      })}
      itemCount={chosenPools.length}
      itemSize={(index) => {
        if (chosenPools[index].vaultKey) {
          return height ? height + 24 : 888
        }
        if (expandIndex.includes(index)) {
          // if (chosenPools[index].vaultKey) {
          //   if (!isLocked && isShared) {
          //     return 864 + 24
          //   }
          //   if (!isShared) {
          //     return 659 + 24
          //   }
          //   return 692 + 24
          // }
          return 570 + 24
        }
        // if (chosenPools[index].vaultKey) {
        //   if (!isLocked && isShared) {
        //     return 726 + 24
        //   }
        //   if (!isShared) {
        //     return 521 + 24
        //   }
        //   return 577 + 24
        // }
        return 457 + 24
      }}
      overscanCount={1}
    >
      {VirtualListRow}
    </VariableSizeList>
  )
}

const Pools: React.FC = ({ pools, userDataLoaded }) => {
  // const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  // const { observerRef, isIntersecting } = useIntersectionObserver()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const initialBlock = useInitialBlock()

  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const openPoolsWithStartBlockFilter = useMemo(
    () =>
      openPools.filter((pool) =>
        initialBlock > 0 && pool.startBlock
          ? Number(pool.startBlock) < initialBlock + POOL_START_BLOCK_THRESHOLD
          : true,
      ),
    [initialBlock, openPools],
  )
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          const vault = pool as DeserializedPoolVault
          return vault.userData.userShares && vault.userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      if (pool.vaultKey) {
        const vault = pool as DeserializedPoolVault
        return vault.userData.userShares && vault.userData.userShares.gt(0)
      }
      return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
    })
  }, [openPoolsWithStartBlockFilter])
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  // useEffect(() => {
  //   if (isIntersecting) {
  //     setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
  //       if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
  //         return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
  //       }
  //       return poolsCurrentlyVisible
  //     })
  //   }
  // }, [isIntersecting])

  const [showFinishedPools, setShowFinishedPools] = useState(false)

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    [],
  )

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), [])

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter
    // chosenPools = openPoolsWithStartBlockFilter
  }

  chosenPools = useMemo(() => {
    const sortedPools = sortPools(account, sortOption, pools, chosenPools).slice(0, numberOfPoolsVisible)

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      return sortedPools.filter((pool) => latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery))
    }
    return sortedPools
  }, [account, sortOption, pools, chosenPools, numberOfPoolsVisible, searchQuery])
  chosenPoolsLength.current = chosenPools.length

  const [remainHeight, setRemainHeight] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      bn.createSelectorQuery()
        .selectAll('.pools-control')
        .boundingClientRect(function (rect) {
          const { safeArea } = getSystemInfoSync()
          setRemainHeight(safeArea.height - rect[0].height - 16 - 55 - 50 - 50 - 20)
        })
        .exec()
    }, 0)
  }, [remainHeight])
  console.log('???',chosenPools, viewMode)
  const cardLayout = (
    <CardDisplay chosenPools={chosenPools} account={account} remainHeight={remainHeight} stakedOnly={stakedOnly} />
  )

  const tableLayout = (
    <PoolsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} remainHeight={remainHeight} />
  )

  return (
    <>
      <Page style={{ paddingBottom: '0px', minHeight: 'unset' }}>
        <Box marginBottom="12px">
          <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
              <Heading scale="lg" color="secondary" mb="8px">
                {t('Syrup Pools')}
              </Heading>
              <Text fontSize="14px" color="text" fontWeight="bold">
                {t('Just stake some tokens to earn.')}
                {t('High APR, low risk.')}
              </Text>
            </Flex>
          </Flex>
        </Box>
        <PoolControls className="pools-control">
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setShowFinishedPools={setShowFinishedPools}
            showFinishedPools={showFinishedPools}
          />
          <FilterContainer style={{ paddingBottom: 0 }}>
            <LabelWrapperText style={{ minWidth: '136px' }} textTransform="uppercase">
              {t('Sort by')}
            </LabelWrapperText>
            <LabelWrapperText style={{ width: '100%', marginLeft: '16px' }} textTransform="uppercase">
              {t('Search')}
            </LabelWrapperText>
          </FilterContainer>
          <FilterContainer style={{ paddingTop: 0 }}>
            <LabelWrapper>
              {/* <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase"> */}
              {/*   {t('Sort by')} */}
              {/* </Text> */}
              {/* <ControlStretch> */}
              <Select
                options={[
                  {
                    label: t('Hot'),
                    value: 'hot',
                  },
                  {
                    label: t('APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Total staked'),
                    value: 'totalStaked',
                  },
                  {
                    label: t('Latest'),
                    value: 'latest',
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
              {/* </ControlStretch> */}
            </LabelWrapper>
            <SearchInput style={{ marginLeft: 16 }} onChange={handleChangeSearchQuery} placeholder="Search Pools" />
          </FilterContainer>
        </PoolControls>
        {/*   {showFinishedPools && ( */}
        {/*     <FinishedTextContainer> */}
        {/*       <Text fontSize={['16px', null, '20px']} color="failure" pr="4px"> */}
        {/*         {t('Looking for v1 CAKE syrup pools?')} */}
        {/*       </Text> */}
        {/*       <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure"> */}
        {/*         {t('Go to migration page')}. */}
        {/*       </FinishedTextLink> */}
        {/*     </FinishedTextContainer> */}
        {/*   )} */}
        {/*   {account && !userDataLoaded && stakedOnly && ( */}
        {/*     <Flex justifyContent="center" mb="4px"> */}
        {/*       <Loading /> */}
        {/*     </Flex> */}
        {/*   )} */}
        {/* {cardLayout} */}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        {/*   <div ref={observerRef} /> */}
        {/*   <Image */}
        {/*     mx="auto" */}
        {/*     mt="12px" */}
        {/*     src="/images/decorations/3d-syrup-bunnies.png" */}
        {/*     alt="Pancake illustration" */}
        {/*     width={192} */}
        {/*     height={184.5} */}
        {/*   /> */}
      </Page>
    </>
  )
}

const Fetcher = ({ pools: oldPools, setPools, userDataLoaded: oldUserDataLoaded, setUserDataLoaded }) => {
  const { pools, userDataLoaded } = usePoolsWithVault()
  useEffect(() => {
    if (!isEqual(pools, oldPools)) {
      setPools(pools)
    }
  }, [pools])
  useEffect(() => {
    if (userDataLoaded !== oldUserDataLoaded) {
      setUserDataLoaded(userDataLoaded)
    }
  }, [userDataLoaded])
  usePoolsPageFetch()
  return null
}

const PoolsWrapper = () => {
  const [fetchingData, setFetchingData] = useState(true)
  const [pools, setPools] = useState([])
  const [userDataLoaded, setUserDataLoaded] = useState(false)

  useDidShow(() => {
    setFetchingData(true)
  })
  useDidHide(() => {
    setFetchingData(false)
  })

  return (
    <view>
      <Pools pools={pools} userDataLoaded={userDataLoaded} />
      {fetchingData && (
        <Fetcher
          pools={pools}
          setPools={setPools}
          userDataLoaded={userDataLoaded}
          setUserDataLoaded={setUserDataLoaded}
        />
      )}
    </view>
  )
}

export default PoolsWrapper
