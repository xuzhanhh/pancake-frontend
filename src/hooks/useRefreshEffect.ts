import { useDidHide, useDidShow } from '@binance/mp-service'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { DependencyList, EffectCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export function useFastRefreshEffect(effect: EffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([FAST_INTERVAL, 'blockNumber'])

  const [show, setShow] = useState(true)

  useDidShow(() => {
    setShow(true)
  })
  useDidHide(() => {
    setShow(false)
  })

  const depsMemo = useMemo(() => [data, ...(deps || [])], [data, deps])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (show) {
      const result = effect()
      return result
    }
  }, depsMemo)
}

export function useSlowRefreshEffect(effect: EffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([SLOW_INTERVAL, 'blockNumber'])

  const [show, setShow] = useState(true)

  useDidShow(() => {
    setShow(true)
  })
  useDidHide(() => {
    setShow(false)
  })

  const depsMemo = useMemo(() => [data, ...(deps || [])], [data, deps])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (show) {
      const result = effect()
      return result
    }
  }, depsMemo)
}
