import React from 'react'
import styled from 'styled-components'
import { Text, Box, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
// import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: () => void
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
      <Flex width="100%" alignItems="center">
        {backTo && (
          <Box onClick={backTo} style={{ width: '48px' }}>
            <ArrowBackIcon width="32px" />
          </Box>
        )}
        <Flex width="100%" flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h2" mb="8px">
              {title}
            </Heading>
            {!noConfig && (
              <Flex alignItems="center">
                <NotificationDot show={expertMode}>
                  <GlobalSettings color="textSubtle" mr="0" />
                </NotificationDot>
                <Transactions />
              </Flex>
            )}
          </Flex>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
            <Text color="textSubtle" fontSize="14px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
