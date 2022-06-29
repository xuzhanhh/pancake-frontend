import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { styled } from '@pancakeswap/mp-styled-2'
import { Text, Button, OpenNewIcon, Link } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { jumpToSwap } from 'utils/bmp/jump'
import { FloatLayout } from 'components/FloatLayout/index.bmp'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <FloatLayout
      title={t('%symbol% required', { symbol: tokenSymbol })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <view style={{ padding: '24px' }}>
        <Text color="failure" bold>
          {t('Insufficient %symbol% balance', { symbol: tokenSymbol })}
        </Text>
        <Text mt="24px">{t('You’ll need %symbol% to stake in this pool!', { symbol: tokenSymbol })}</Text>
        <Text>
          {t('Buy some %symbol%, or make sure your %symbol% isn’t in another pool or LP.', {
            symbol: tokenSymbol,
          })}
        </Text>
        <Button mt="24px" style={{ width: '100%' }} onClick={() => jumpToSwap()}>
          {t('Buy')} {tokenSymbol}
        </Button>
        <StyledLink href="https://yieldwatch.net" external>
          <Button variant="secondary" mt="8px" width="100%">
            {t('Locate Assets')}
            <OpenNewIcon color="primary" ml="4px" />
          </Button>
        </StyledLink>
        <Button variant="text" style={{ width: '100%' }} onClick={onDismiss}>
          {t('Close Window')}
        </Button>
      </view>
    </FloatLayout>
  )
}

export default NotEnoughTokensModal
