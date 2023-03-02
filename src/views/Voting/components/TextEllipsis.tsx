import { styled } from '@pancakeswap/mp-styled-2'
import { Text } from '@pancakeswap/uikit'

const TextEllipsis = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default TextEllipsis
