import { Image } from '@pancakeswap/uikit'
import { styled } from '@pancakeswap/mp-styled-2'

const DesktopImage = styled(Image)`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

export default DesktopImage
