import mpService from '@binance/mp-service'
import { useMemo } from 'react'
import { ParsedUrlQuery } from 'querystring'

export default function useParsedQueryString(): ParsedUrlQuery {
  return useMemo(() => {
    const params = mpService.getCurrentInstance().router?.params
    return params
  }, [])
}
