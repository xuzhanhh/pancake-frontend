import React from 'react'
import { CloseIcon, Overlay, Text, IconButton } from '@pancakeswap/uikit'
import { styled } from '@pancakeswap/mp-styled-2'

const OverlayInner = styled.div`
  background-color: ${({ theme }) => theme.modal.background};
  position: absolute;
  top: 50%;
  width: 80%;
  border-radius: 10px;
  margin: auto;
  padding: 16px;
  left: 0;
  right: 0;
  transform: translateY(-50%);
`
const Tooltip = ({ visible, onClose, children }) => {
  if (visible) {
    return (
      <Overlay onClick={onClose} style={{ height: '100vh', zIndex: 1111 }}>
        <OverlayInner>
          <Text style={{ marginRight: 20 }}>{children}</Text>
          <IconButton
            variant="text"
            style={{ position: 'absolute', top: 0, right: 0 }}
            onClick={onClose}
            aria-label="close the dialog"
          >
            <CloseIcon color="text" width="24px" />
          </IconButton>
        </OverlayInner>
      </Overlay>
    )
  }
  return null
}
export default Tooltip
