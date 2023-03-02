import React from 'react'
import { AtFloatLayout } from 'taro-ui'
import 'taro-ui/dist/style/components/float-layout.scss'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import { styled, useTheme } from '@pancakeswap/mp-styled-2'
import { Box, ModalHeader, ModalBackButton, ModalTitle, Heading, ModalCloseButton } from '@pancakeswap/uikit'
import { View } from '@binance/mp-components'
import './FloatLayout.scss'
const {
  safeArea: { bottom },
  windowHeight,
} = getSystemInfoSync()

export const DefaultPaddingBottom = windowHeight - bottom > 10 ? windowHeight - bottom : 10
// console.log('???', DefaultPaddingBottom)
export const FloatContainer = styled(Box)`
  background: ${({ theme }) => theme.modal.background};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
`

// padding:${({ customPadding }) => (customPadding ? customPadding : `0px 15px ${DefaultPaddingBottom}px 15px`)};
interface FloatLayoutProps {
  onDismiss: () => void
  onBack?: () => void
  title?: string
}
export const FloatLayout: React.FC<FloatLayoutProps> = ({ children, onBack, onDismiss, title }) => {
  const theme = useTheme()
  return (
    <View style={{ '--content-height': windowHeight - 110, '--container-background-color': theme.modal.background }}>
      <AtFloatLayout isOpened={true} onClose={onDismiss}>
        <FloatContainer>
          {title && (
            <FloatHeader>
              <ModalTitle>
                {onBack && <ModalBackButton onBack={onBack} />}
                <Heading>{title}</Heading>
              </ModalTitle>
              <ModalCloseButton onDismiss={onDismiss} />
            </FloatHeader>
          )}
          <scroll-view
            style={{ maxHeight: windowHeight - 110 - 58 - 34 }}
            scroll-y="true"
            upper-threshold="50"
            lower-threshold="50"
            scroll-with-animation="false"
            enable-back-to-top="false"
            enable-flex="false"
            scroll-anchoring="false"
            refresher-enabled="false"
            refresher-threshold="45"
            refresher-default-style="black"
            refresher-background="#FFF"
            refresher-triggered="false"
            bounces="true"
            show-scrollbar="true"
            paging-enabled="false"
          >
            {children}
          </scroll-view>
          <Box style={{ paddingBottom: DefaultPaddingBottom }} />
        </FloatContainer>
      </AtFloatLayout>
    </View>
  )
}

// export const FloatHeader: React.FC<{}> = ({ children }) => {
//   return <ModalHeader style={{ padding: '10px 10px 0px 20px', borderBottom: 'unset' }}>{children}</ModalHeader>
// }

export const FloatHeader = styled(ModalHeader)`
  padding: 10px 10px 0px 20px !important;
  border-bottom: unset !important;
  background: ${({ theme }) => theme.modal.background}!important;
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
`
