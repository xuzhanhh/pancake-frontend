import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { ScrollView } from '@binance/mp-components'
import mpService from '@binance/mp-service'
import { useModal, Button, Modal, Flex, Text, Checkbox } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import debounce from 'lodash.debounce'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import './useDisclaimer.css'

const { platform } = getSystemInfoSync()
const TextWrap = styled.div`
  .ba {
    font-size: 14px;
    margin-bottom: 4px;
  }
`

const Mask = styled.div`
  position: absolute;
  height: 40px;
  width: 100%;
  bottom: 0px;
  background: ${({ theme }) =>
    `linear-gradient(180deg, ${theme.colors.backgroundAlt} 0%, rgba(255, 255, 255, 0) 100%)`};
  transform: rotate(-180deg);
  z-index: 2;
`

const ScrollBar = styled.div`
  position: absolute;
  height: 100%;
  width: 3px;
  background: #a6a6a6;
  top: 0px;
  right: 3px;
  border-radius: 8px;
  // transition: transform 0.1s;
`
function DisclaimerModal(props) {
  const { t } = useTranslation()
  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [checked, setChecked] = useState(false)
  const [showMask, setShowMask] = useState(true)
  const [currentHeight, setCurrentHeight] = useState(0)
  const [scrollViewHeight, setScrollViewHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [showScrollBar, setShowScrollBar] = useState(true)

  const show = useCallback(
    debounce(() => {
      setShowScrollBar(true)
    }, 600),
    [],
  )
  const scrollBarHeight = (scrollViewHeight * scrollViewHeight) / containerHeight || 0
  const scrollBarTop = (currentHeight / containerHeight) * scrollViewHeight + 3 || 0
  useEffect(() => {
    setTimeout(() => {
      bn.createSelectorQuery()
        .selectAll('.disclaimer-container')
        .boundingClientRect(function (rect) {
          setContainerHeight(rect[0].height)
        })
        .exec()

      bn.createSelectorQuery()
        .selectAll('#scrollview')
        .boundingClientRect(function (rect) {
          setScrollViewHeight(rect[0].height)
        })
        .exec()
    }, 100)
  }, [])
  return (
    <Modal
      style={{ width: '80vw', position: 'relative' }}
      hideCloseButton
      title="PancakeSwap Mini-Program User Service Agreement"
      headerBackground="gradients.cardHeader"
      className="disclaimer-modal"
    >
      <view style={{ position: 'relative', marginRight: '-14px' }}>
        <ScrollView
          id="scrollview"
          className="scroll-area"
          scrollY
          style={{ maxHeight: '50vh' }}
          onScrollToLower={() => {
            setConfirmDisabled(false)
            setShowMask(false)
          }}
          onScroll={(e) => {
            if (platform === 'android') {
              setCurrentHeight(e.detail.scrollTop)
            } else {
              setShowScrollBar(false)
              setCurrentHeight(e.detail.scrollTop)
              show()
            }
          }}
        >
          <view className="disclaimer-container" pl="4px" style={{ paddingRight: '14px' }}>
            <TextWrap>
              {Array.from({ length: 14 }, (_, index) => index).map((item) => (
                <Text key={item}>{t(`user-service-agreement-${item + 1}`)}</Text>
              ))}
            </TextWrap>
            <Flex paddingTop="16px" justifyContent="space-between" alignItems="center">
              <Flex>
                <Checkbox
                  scale="sm"
                  disabled={confirmDisabled}
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
                <Text style={{ marginLeft: '8px' }}>I understand</Text>
              </Flex>
              <Button
                width="132px"
                onClick={() => {
                  if (props.onClick) props.onClick()
                  props.onDismiss()
                }}
                disabled={!checked}
              >
                Start
              </Button>
            </Flex>
          </view>
        </ScrollView>

        {showScrollBar && (
          <ScrollBar
            style={{
              transform: `translateY(${scrollBarTop}px)`,
              height: scrollBarHeight,
            }}
          />
        )}
        {showMask && <Mask />}
      </view>
    </Modal>
  )
}
const MemoModal = React.memo(DisclaimerModal)
const key = 'isShowDisclaimerBefore'
let isShowDisclaimerBefore = mpService.getStorageSync(key) || false
const useDisclaimer = () => {
  const handleModalClick = () => {
    mpService.setStorage({ key, data: true })
    isShowDisclaimerBefore = true
  }
  const [handleClick] = useModal(<MemoModal onClick={handleModalClick} />, false)
  useEffect(() => {
    // if (!isShowDisclaimerBefore) {
    handleClick()
    // }
  }, [])
}

export { useDisclaimer }
