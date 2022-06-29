import React, { useEffect, useMemo } from 'react'
import { ScrollView } from '@binance/mp-components'
import { styled } from '@pancakeswap/mp-styled-2'
import {
  Modal,
  Text,
  Button,
  Flex,
  ButtonMenu,
  Checkbox,
  BalanceInput,
  HelpIcon,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTooltip } from 'contexts/bmp/TooltipContext'
import RoiCalculatorFooter from './RoiCalculatorFooter.bmp'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, {
  CalculatorMode,
  DefaultCompoundStrategy,
  EditingCurrency,
} from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'
import { FloatLayout } from 'components/FloatLayout/index.bmp'

export interface RoiCalculatorModalProps {
  onDismiss?: () => void
  onBack?: () => void
  earningTokenPrice: number
  apr?: number
  apy?: number
  displayApr?: string
  linkLabel: string
  linkHref: string
  stakingTokenBalance: BigNumber
  stakingTokenSymbol: string
  stakingTokenPrice: number
  earningTokenSymbol?: string
  multiplier?: string
  autoCompoundFrequency?: number
  performanceFee?: number
  isFarm?: boolean
  initialState?: any
  initialValue?: string
  strategy?: any
  header?: React.ReactNode
  jumpToLiquidity: () => void
}

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
    box-shadow: none;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const PricesWrap = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  mt: 8px;
  > bn-button {
    mr: 4px;
  }
`
const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  onDismiss,
  onBack,
  earningTokenPrice,
  apr,
  apy,
  displayApr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  multiplier,
  initialValue,
  earningTokenSymbol = 'CAKE',
  autoCompoundFrequency = 0,
  performanceFee = 0,
  isFarm = false,
  initialState,
  strategy,
  header,
  children,
  jumpToLiquidity,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleCompounding,
    toggleEditingCurrency,
    setCompoundingFrequency,
    setCalculatorMode,
    setTargetRoi,
    dispatch,
  } = useRoiCalculatorReducer({ stakingTokenPrice, earningTokenPrice, autoCompoundFrequency }, initialState)

  const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue)
    }
  }, [initialValue, setPrincipalFromTokenValue])

  const { onPresent } = useTooltip(
    isFarm
      ? t('“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.')
      : t(
          '“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.',
          { assetSymbol: stakingTokenSymbol },
        ),
  )

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue
  const DURATION = useMemo(() => [t('1D'), t('7D'), t('30D'), t('1Y'), t('5Y')], [t])

  return (
    <FloatLayout
      title={t('ROI Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="gradients.cardHeader"
    >
      <ScrollView
        scrollY
        showScrollbar
        style={{ padding: '24px', paddingBottom: 0, maxHeight: '70vh', width: 'unset' }}
      >
        {strategy ? (
          strategy(state, dispatch)
        ) : (
          <DefaultCompoundStrategy
            apr={apy ?? apr}
            dispatch={dispatch}
            state={state}
            earningTokenPrice={earningTokenPrice}
            performanceFee={performanceFee}
            stakingTokenPrice={stakingTokenPrice}
          />
        )}
        {header}
        <view style={{ paddingBottom: '24px' }}>
          <Flex flexDirection="column" mb="8px">
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('%asset% staked', { asset: stakingTokenSymbol })}
            </Text>
            <BalanceInput
              inputProps={{
                scale: 'sm',
              }}
              currencyValue={`${conversionValue} ${conversionUnit}`}
              placeholder="0.00"
              value={editingValue}
              unit={editingUnit}
              onUserInput={onUserInput}
              switchEditingUnits={toggleEditingCurrency}
              onFocus={onBalanceFocus}
            />
            <PricesWrap>
              <Button
                style={{ flex: 1 }}
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('100')}
              >
                $100
              </Button>
              <Button
                style={{ flex: 1 }}
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('1000')}
              >
                $1000
              </Button>
              <Button
                style={{ flex: 2 }}
                disabled={
                  !Number.isFinite(stakingTokenPrice) ||
                  !stakingTokenBalance.isFinite() ||
                  stakingTokenBalance.lte(0) ||
                  !account
                }
                scale="xs"
                p="4px 16px"
                width="128px"
                variant="tertiary"
                onClick={() =>
                  setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString())
                }
              >
                {t('My Balance').toLocaleUpperCase()}
              </Button>
              <Flex onClick={onPresent}>
                <HelpIcon width="16px" height="16px" color="textSubtle" />
              </Flex>
            </PricesWrap>
            {children || (
              <>
                <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
                  {t('Staked for')}
                </Text>
                <FullWidthButtonMenu activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
                  {DURATION.map((duration) => (
                    <ButtonMenuItem key={duration} variant="tertiary">
                      {duration}
                    </ButtonMenuItem>
                  ))}
                </FullWidthButtonMenu>
              </>
            )}
            {autoCompoundFrequency === 0 && (
              <>
                <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
                  {t('Compounding every')}
                </Text>
                <Flex alignItems="center">
                  <Flex flex="1">
                    <Checkbox scale="sm" checked={compounding} onChange={toggleCompounding} />
                  </Flex>
                  <Flex flex="6">
                    <FullWidthButtonMenu
                      disabled={!compounding}
                      activeIndex={activeCompoundingIndex}
                      onItemClick={setCompoundingFrequency}
                      scale="sm"
                    >
                      <ButtonMenuItem>{t('1D')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('7D')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('14D')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('30D')}</ButtonMenuItem>
                    </FullWidthButtonMenu>
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
          <AnimatedArrow calculatorState={state} />
          <Flex>
            <RoiCard
              earningTokenSymbol={earningTokenSymbol}
              calculatorState={state}
              setTargetRoi={setTargetRoi}
              setCalculatorMode={setCalculatorMode}
            />
          </Flex>
        </view>
        <RoiCalculatorFooter
          onDismiss={onDismiss}
          jumpToLiquidity={jumpToLiquidity}
          isFarm={isFarm}
          apr={apr}
          apy={apy}
          displayApr={displayApr}
          autoCompoundFrequency={autoCompoundFrequency}
          multiplier={multiplier}
          linkLabel={linkLabel}
          linkHref={linkHref}
          performanceFee={performanceFee}
        />
      </ScrollView>
    </FloatLayout>
  )
}

export default RoiCalculatorModal
