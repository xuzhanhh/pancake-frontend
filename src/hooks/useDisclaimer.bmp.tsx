import React, { useEffect, useState } from 'react'
import { styled } from '@pancakeswap/mp-styled-2'
import { ScrollView } from '@binance/mp-components'
import mpService from '@binance/mp-service'
import { useModal, Button, Modal, Flex, Text, Checkbox } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const TextWrap = styled.div`
  .ba {
    font-size: 14px;
    margin-bottom: 4px;
  }
`
function DisclaimerModal(props) {
  const { t } = useTranslation()
  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [checked, setChecked] = useState(false)
  return (
    <Modal
      style={{ width: '80vw' }}
      hideCloseButton
      title="PancakeSwap Mini-Program User Service Agreement"
      headerBackground="gradients.cardHeader"
    >
      <ScrollView
        scrollY
        style={{ maxHeight: '50vh' }}
        onScrollToLower={() => {
          setConfirmDisabled(false)
        }}
      >
        <TextWrap>
          {Array.from({ length: 14 }, (_, index) => index).map((item) => (
            <Text key={item}>{t(`user-service-agreement-${item + 1}`)}</Text>
          ))}
        </TextWrap>
        <Flex paddingTop="16px" justifyContent="space-between" alignItems="center">
          <Flex>
            <Checkbox scale="sm" disabled={confirmDisabled} checked={checked} onChange={() => setChecked(!checked)} />
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
      </ScrollView>
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
    if (!isShowDisclaimerBefore) {
      handleClick()
    }
  }, [])
}

export { useDisclaimer }
