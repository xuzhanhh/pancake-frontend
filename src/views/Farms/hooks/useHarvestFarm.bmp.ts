import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { TransactionReceipt } from '@ethersproject/abstract-provider/src.ts/index'
import { useTracker } from 'contexts/AnalyticsContext'
import { HitBuilders } from 'utils/ga'

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef()
  const tracker = useTracker()

  const handleHarvest = useCallback(
    async (
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await harvestFarm(masterChefContract, farmPid)
      tracker.send(
        new HitBuilders.EventBuilder()
          .setCategory('farm')
          .setAction('harvest')
          .setLabel(JSON.stringify({ tx: tx.hash })) //  optional
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
    [farmPid, masterChefContract, tracker],
  )

  return { onReward: handleHarvest }
}

export default useHarvestFarm
