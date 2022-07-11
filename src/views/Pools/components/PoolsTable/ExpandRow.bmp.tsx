import React from 'react'
import { useState, memo, ReactNode, useCallback } from 'react'
import styled from 'styled-components'
// import useDelayedUnmount from 'hooks/useDelayedUnmount'
// import { useMatchBreakpointsContext } from '@pancakeswap/uikit'

import ExpandActionCell from './Cells/ExpandActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const ExpandRow: React.FC<{
  children: ReactNode
  panel: ReactNode
  expanded: boolean
  toggleExpand: () => void
}> = ({ children, panel, expanded, toggleExpand }) => {
  // const { isTablet, isDesktop } = useMatchBreakpointsContext()

  // const [expanded, setExpanded] = useState(false)
  // const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  // const toggleExpanded = useCallback(() => {
  //   setExpanded((prev) => !prev)
  // }, [])

  return (
    <>
      <StyledRow role="row" onClick={toggleExpand}>
        {children}
        <ExpandActionCell expanded={expanded} isFullLayout={false} />
      </StyledRow>
      {expanded && panel}
    </>
  )
}

export default memo(ExpandRow)
