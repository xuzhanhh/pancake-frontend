import { trackConfigs } from 'config/constants/bmp/track'
import { useTracker } from 'contexts/AnalyticsContext'
import { useCallback } from 'react'
import { HitBuilders } from 'utils/ga'

interface HandlerParams {
  label?: string
  value?: number
  config: {
    category: string
    action: string
  }
}
export function useHandleTrack() {
  const tracker = useTracker()
  const trackHandle = useCallback(
    ({ label, value = 1, config }: HandlerParams) => {
      tracker.send(
        new HitBuilders.EventBuilder()
          .setCategory(config.category)
          .setAction(config.action)
          .setLabel(label) //  optional
          .setValue(value)
          .build(),
      )
    },
    [tracker],
  )
  const trackPoolsAdd = useCallback(
    (txHash: string) => {
      trackHandle({ label: JSON.stringify({ txHash }), value: 1, config: trackConfigs.poolsAdd })
    },
    [trackHandle],
  )
  const trackPoolsRemove = useCallback(
    (txHash: string) => {
      trackHandle({ label: JSON.stringify({ txHash }), value: 1, config: trackConfigs.poolsRemove })
    },
    [trackHandle],
  )
  const trackPoolsAddLocked = useCallback(
    (txHash: string) => {
      trackHandle({ label: JSON.stringify({ txHash }), value: 1, config: trackConfigs.poolsAddLocked })
    },
    [trackHandle],
  )
  const trackSwapSubmitted = useCallback(
    (label: string, value: number) => {
      trackHandle({ label, value, config: trackConfigs.swapSubmitted })
    },
    [trackHandle],
  )
  const trackSwapClickSwap = useCallback(() => {
    trackHandle({ config: trackConfigs.swapClickSwap })
  }, [trackHandle])
  const trackLiquidityRemove = useCallback(
    (txHash: string) => {
      trackHandle({ config: trackConfigs.liquidityRemove, label: JSON.stringify({ txHash }), value: 1 })
    },
    [trackHandle],
  )
  const trackLiquidityAdd = useCallback(
    (txHash: string) => {
      trackHandle({ config: trackConfigs.liquidityAdd, label: JSON.stringify({ txHash }), value: 1 })
    },
    [trackHandle],
  )
  const trackFarmStake = useCallback(
    (tx: string) => {
      trackHandle({ config: trackConfigs.farmStake, label: JSON.stringify({ tx }), value: 1 })
    },
    [trackHandle],
  )
  const trackFarmHarvest = useCallback(
    (tx: string) => {
      trackHandle({ config: trackConfigs.farmHarvest, label: JSON.stringify({ tx }), value: 1 })
    },
    [trackHandle],
  )
  return {
    trackPoolsAdd,
    trackPoolsRemove,
    trackPoolsAddLocked,
    trackSwapSubmitted,
    trackSwapClickSwap,
    trackLiquidityRemove,
    trackLiquidityAdd,
    trackFarmStake,
    trackFarmHarvest,
  }
}
