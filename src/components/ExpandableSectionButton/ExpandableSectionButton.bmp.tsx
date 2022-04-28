import react from 'react'
import styled from 'styled-components'
import { chevrondownicon, chevronupicon, text } from '@pancakeswap/uikit'
import { usetranslation } from 'contexts/localization'

export interface expandablesectionbuttonprops {
  onclick?: () => void
  expanded?: boolean
}

const wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const expandablesectionbutton: react.fc<expandablesectionbuttonprops> = ({ onclick, expanded = false }) => {
  const { t } = usetranslation()

  return (
    <wrapper aria-label={t('hide or show expandable content')} role="button" onclick={() => onclick()}>
      <text color="primary" bold>
        {expanded ? t('hide') : t('details')}
      </text>
      {expanded ? <chevronupicon color="primary" /> : <chevrondownicon color="primary" />}
    </wrapper>
  )
}

export default expandablesectionbutton
