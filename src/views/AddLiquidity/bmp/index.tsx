import React, { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@pancakeswap/sdk'
import { Button, Text, Flex, AddIcon, CardBody, Message, useModal, Box, Card } from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useTranslation } from 'contexts/Localization'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import { useLiquidity, LiquidityPage } from 'views/bmp/liquidity/liquidityContext'
import { AddLiquidityTip } from 'views/Pool/index.bmp'
import { CHAIN_ID } from 'config/constants/networks'
import { useHandleTrack } from 'hooks/bmp/useHandleTrack'
// import { useRouter } from 'next/router'
import { AppDispatch } from '../../../state'
import { LightCard } from '../../../components/Card'
import { AutoColumn, ColumnCenter } from '../../../components/Layout/Column'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from '../../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import { DoubleCurrencyLogo } from '../../../components/Logo'
import { AppHeader, AppBody } from '../../../components/App'
import { MinimalPositionCard } from '../../../components/PositionCard'
import Row, { RowBetween } from '../../../components/Layout/Row'
import ConnectWalletButton from '../../../components/ConnectWalletButton'
import Providers from '../../../PageProvider.bmp'
import ErrorBoundary from '../../../components/ErrorBoundary'

import { ROUTER_ADDRESS } from '../../../config/constants'
import { PairState } from '../../../hooks/usePairs'
import { useCurrency } from '../../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import { Field, resetMintState } from '../../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../../state/mint/hooks'

import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useGasPrice, useIsExpertMode, useUserSlippageTolerance } from '../../../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../../utils'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../../utils/wrappedCurrency'
import Dots from '../../../components/Loader/Dots'
import ConfirmAddModalBottom from '../ConfirmAddModalBottom'
import { currencyId } from '../../../utils/currencyId'
import PoolPriceBar from '../PoolPriceBar'
import { EVENT_IDS, track } from 'utils/bmp/report'
import { captureException } from '@binance/sentry-miniapp'
function AddLiquidity() {
  // const router = useRouter()
  // const [currencyIdA, currencyIdB] = router.query.currency || []
  const {
    state: { currency1, currency2 },
    dispatch: liquidityDispatch,
  } = useLiquidity()
  const [currencyIdA, currencyIdB] = [currency1, currency2]

  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId]))),
  )

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm
  const [liquidityErrorMessage, setLiquidityErrorMessage] = useState<string | undefined>(undefined)
  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[CHAIN_ID])
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[CHAIN_ID])

  const addTransaction = useTransactionAdder()

  const { trackLiquidityAdd } = useHandleTrack()
  async function onAdd() {
    if (!chainId || !library || !account) return
    const routerContract = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    setLiquidityErrorMessage(undefined)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          })

          trackLiquidityAdd(response.hash)
          track.click(EVENT_IDS.INVOKE_CONTRACT_METHODS, {
            df_8: account,
            df_9: 'supply-lp_success',
            df_11: JSON.stringify({
              txHash: response.hash,
              args,
            }),
          })
          setTxHash(response.hash)
        }),
      )
      .catch((err) => {
        console.log('error caught')
        console.error(err)
        setAttemptingTxn(false)
        setLiquidityErrorMessage(err && err.code !== 4001 ? `Add Liquidity failed: ${err.message}` : undefined)
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err)
        }
        captureException(err)
        track.click(EVENT_IDS.INVOKE_CONTRACT_METHODS, {
          df_8: account,
          df_9: 'supply-lp_fail',
          df_11: JSON.stringify({
            args,
          }),
          df_12: err.toString(),
        })
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <Flex alignItems="center">
        <Text fontSize="48px" marginRight="10px">
          {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
        </Text>
        <DoubleCurrencyLogo
          currency0={currencies[Field.CURRENCY_A]}
          currency1={currencies[Field.CURRENCY_B]}
          size={30}
        />
      </Flex>
    ) : (
      <AutoColumn>
        <Flex alignItems="center">
          <Text fontSize="48px" marginRight="10px">
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </Flex>
        <Row>
          <Text fontSize="24px">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
          </Text>
        </Row>
        <Text small textAlign="left" my="24px">
          {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
            slippage: allowedSlippage / 100,
          })}
        </Text>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        liquidityDispatch({ type: 'setCurrency', currency1: currencyIdB, currency2: currencyIdA })
        // router.replace(`/add/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
      } else if (currencyIdB) {
        liquidityDispatch({ type: 'setCurrency', currency1: newCurrencyIdA, currency2: currencyIdB })
        // router.replace(`/add/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
      } else {
        liquidityDispatch({ type: 'setCurrency', currency1: newCurrencyIdA, currency2: null })
        // router.replace(`/add/${newCurrencyIdA}`, undefined, { shallow: true })
      }
    },
    [currencyIdB, currencyIdA, liquidityDispatch],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          liquidityDispatch({ type: 'setCurrency', currency1: currencyIdB, currency2: newCurrencyIdB })
          // router.replace(`/add/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
        } else {
          liquidityDispatch({ type: 'setCurrency', currency1: newCurrencyIdB, currency2: null })
          // router.replace(`/add/${newCurrencyIdB}`, undefined, { shallow: true })
        }
      } else {
        liquidityDispatch({ type: 'setCurrency', currency1: currencyIdA || 'BNB', currency2: newCurrencyIdB })
        // router.replace(`/add/${currencyIdA || 'BNB'}/${newCurrencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, liquidityDispatch],
  )

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
    setLiquidityErrorMessage(undefined)
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const [onPresentAddLiquidityModal] = useModal(
    <TransactionConfirmationModal
      title={
        noLiquidity
          ? t('You are creating a pool')
          : `${t('You will receive')} ${currencyA?.symbol}-${currencyB?.symbol} LP`
      }
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      liquidityErrorMessage={liquidityErrorMessage}
      content={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  return (
    <view>
      <AppBody>
        <AppHeader
          title={t('Add Liquidity')}
          subtitle={t('Add liquidity to receive LP tokens')}
          helper={t(
            'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
          )}
          backTo={() => {
            liquidityDispatch({ type: 'setPage', page: LiquidityPage.Pool })
          }}
          // backTo="/liquidity"
        />
        <CardBody>
          <AutoColumn gap="20px">
            {noLiquidity && (
              <ColumnCenter>
                <Message variant="warning">
                  <Box>
                    <Text bold mb="8px">
                      {t('You are the first liquidity provider.')}
                    </Text>
                    <Text mb="8px">{t('The ratio of tokens you add will set the price of this pool.')}</Text>
                    <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
                  </Box>
                </Message>
              </ColumnCenter>
            )}
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <ColumnCenter>
              <AddIcon width="16px" />
            </ColumnCenter>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <LightCard padding="0px" borderRadius="20px">
                  <RowBetween padding="1rem">
                    <Text fontSize="14px">
                      {noLiquidity ? t('Initial prices and pool share') : t('Prices and pool share')}
                    </Text>
                  </RowBetween>{' '}
                  <LightCard padding="1rem" borderRadius="20px">
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </LightCard>
                </LightCard>
              </>
            )}

            {addIsUnsupported ? (
              <Button disabled mb="4px">
                {t('Unsupported Asset')}
              </Button>
            ) : !account ? (
              <ConnectWalletButton />
            ) : (
              <AutoColumn gap="md">
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <Button
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                          )}
                        </Button>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <Button
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                          )}
                        </Button>
                      )}
                    </RowBetween>
                  )}
                <Button
                  variant={
                    !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                      ? 'danger'
                      : 'primary'
                  }
                  onClick={() => {
                    if (expertMode) {
                      onAdd()
                    } else {
                      onPresentAddLiquidityModal()
                    }
                  }}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                >
                  {error ?? t('Supply')}
                </Button>
              </AutoColumn>
            )}
          </AutoColumn>
        </CardBody>
      </AppBody>
      <Card mt="24px">
        <AddLiquidityTip mt="16px" mx="20px" />
      </Card>
    </view>
  )
}
export default function Index() {
  return (
    <ErrorBoundary name="addLiquidity">
      <AddLiquidity />
    </ErrorBoundary>
  )
}
