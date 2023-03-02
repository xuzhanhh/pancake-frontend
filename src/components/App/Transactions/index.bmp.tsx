import React from 'react'
import { HistoryIcon, IconButton, useModal } from '@pancakeswap/uikit'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
      <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
        <HistoryIcon color="textSubtle" width="24px" />
      </IconButton>
    </>
  )
}

export default Transactions
