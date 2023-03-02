import { styled } from '@pancakeswap/mp-styled-2'

const Container = styled.div`
  background: ${({ theme }) => theme.colors.gradients.violetAlt};
  height: calc(100vh - 100px);
  overflow: hidden;
  position: relative;
`

export default Container
