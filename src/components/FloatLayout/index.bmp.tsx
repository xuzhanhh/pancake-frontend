import React from 'react'
import { AtFloatLayout } from 'taro-ui'
import 'taro-ui/dist/style/components/float-layout.scss'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import styled, { useTheme } from 'styled-components'
import { Box, ModalHeader, ModalBackButton, ModalTitle, Heading, ModalCloseButton } from '@pancakeswap/uikit'

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
    <AtFloatLayout isOpened={true} onClose={onDismiss}>
      <style
        dangerouslySetInnerHTML={{
          __html: `.layout-body__content{min-height: 100px!important; max-height: ${
            windowHeight - 110
          }px!important}.layout-body{padding: 0px!important; min-height:100px!important}.at-float-layout__container{background-color: ${
            theme.modal.background
          }; border-top-left-radius: 32px; border-top-right-radius: 32px; min-height: 100px;  }`,
        }}
      />
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
  )
}

// export const FloatHeader: React.FC<{}> = ({ children }) => {
//   return <ModalHeader style={{ padding: '10px 10px 0px 20px', borderBottom: 'unset' }}>{children}</ModalHeader>
// }

export const FloatHeader = styled(ModalHeader)`
  padding: 10px 10px 0px 20px;
  border-bottom: unset;
  background: ${({ theme }) => theme.modal.background};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
`
