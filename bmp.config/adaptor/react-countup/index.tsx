import React from 'react'

function CountUp({ prefix, end, decimals, suffix }) {
  if (typeof end === 'number') {
    return (
      <view>
        {prefix}
        {end.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        {suffix}
      </view>
    )
  }
  return <view />
}
export default CountUp
