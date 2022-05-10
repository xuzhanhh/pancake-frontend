import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { useTracker } from 'contexts/AnalyticsContext'
import { HitBuilders } from 'utils/ga'

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef()
  const tracker = useTracker()

  const handleStake = useCallback(
    async (
      amount: string,
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await stakeFarm(masterChefContract, pid, amount)
      tracker.send(
        new HitBuilders.EventBuilder()
          .setCategory('farm')
          .setAction('stake')
          .setLabel(JSON.stringify({ tx })) //  optional
          .setValue(1)
          .build(),
      )
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
      } else {
        onError(receipt)
      }
    },
    [masterChefContract, pid, tracker],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
