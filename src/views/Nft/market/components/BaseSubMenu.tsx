import { SubMenuItems } from '@pancakeswap/uikit'
import { styled } from '@pancakeswap/mp-styled-2'

const BaseSubMenu = styled(SubMenuItems)`
  background-color: transparent;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

export default BaseSubMenu
