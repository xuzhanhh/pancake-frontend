import React from 'react'
import { styled, keyframes } from '@pancakeswap/mp-styled-2'

const rotate = keyframes`
`

const StyledSVG = styled.div<{ size: string; stroke?: string }>`
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: rotate 2s linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5' strokeWidth='2.5' stroke='%231FC7D4' strokeLinecap='round' strokeLinejoin='round' /%3E%3C/svg%3E");
`

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function CircleLoader({
  size = '16px',
  stroke = '#1FC7D4',
  fill = 'none',
  ...rest
}: {
  size?: string
  stroke?: string
  [k: string]: any
}) {
  return <StyledSVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" size={size} {...rest} />
}
