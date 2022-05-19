import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { useHandleTrack } from 'hooks/bmp/useHandleTrack'

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef()
  const { trackFarmStake } = useHandleTrack()

  const handleStake = useCallback(
    async (
      amount: string,
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await stakeFarm(masterChefContract, pid, amount)
      trackFarmStake(tx.hash)
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
      } else {
        onError(receipt)
      }
    },
    [masterChefContract, pid, trackFarmStake],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
