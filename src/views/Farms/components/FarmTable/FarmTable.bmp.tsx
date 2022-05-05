import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useTable, Button, ChevronUpIcon, ColumnType } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import { remove } from 'lodash'
import Row, { RowProps } from './Row'
import { VariableSizeList, FixedSizeList } from 'views/bmp/BmpPage/components/VirtualList'
import { FarmsContext } from 'views/Farms'
import { useDidShow } from '@binance/mp-service'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
  margin: 8px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.div`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.div`
  & div {
    font-size: 16px;
    vertical-align: middle;
  }
`

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

export let expandIndex = []
const setExpandIndex = (func) => {
  const result = func(expandIndex)
  expandIndex = result
}

const FarmTable: React.FC<ITableProps> = (props) => {
  // const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const { setVisible, height } = useContext(FarmsContext)
  const { data, columns, userDataReady } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })
  const [reRender, triggerReRender] = useState(0)
  const virtualListRef = useRef()
  useDidShow(() => {
    triggerReRender((n) => n + 1)
  })
  useEffect(() => {
    triggerReRender((n) => n + 1)
  }, [data])
  const toggleExpand = (index) => () => {
    setExpandIndex((expandIndex) => {
      if (expandIndex.includes(index)) {
        const newArray = [...expandIndex]
        remove(newArray, (n) => n === index)
        return newArray
      } else {
        return [...expandIndex, index]
        // setExpandIndex(array => [...array, index])
      }
    })
    virtualListRef.current?.resetAfterIndex(index)
  }

  const VirtualListRow = React.memo(
    useCallback(
      ({ data, index, style }) => {
        const row = data[index]
        return (
          <Row
            {...row.original}
            userDataReady={userDataReady}
            index={index}
            toggleExpand={toggleExpand(index)}
            expand={expandIndex.includes(index)}
          />
        )
        // return <view>{index}</view>
      },
      [userDataReady],
    ),
  )

  const VariableList = useMemo(() => {
    return (
      <VariableSizeList
        height={height || 500}
        // height={500}
        ref={virtualListRef}
        width="100%"
        itemData={rows}
        itemCount={rows.length}
        itemSize={(index) => {
          let origin = expandIndex.includes(index) ? 636 : 135
          if (rows[index]?.original?.earned?.earnings) {
            origin += 10
          }

          return origin
        }}
        overscanCount={4}
        // itemSize={127}
        // onScrollToLower={() => {
        //   console.log('??? onScrollToLower')
        //   setVisible()
        // }}
      >
        {VirtualListRow}
      </VariableSizeList>
    )
  }, [rows])
  return (
    <Container id="farms-table">
      <TableContainer id="table-container">
        <TableWrapper id="table-wrapper">
          <StyledTable id="styled-table">
            <TableBody id="table-body">
              {VariableList}
              {/* {rows.map((row) => { */}
              {/*   return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} /> */}
              {/* })} */}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        {/* <ScrollButtonContainer> */}
        {/*   <Button variant="text" onClick={() => { }}> */}
        {/*     {t('To Top')} */}
        {/*     <ChevronUpIcon color="primary" /> */}
        {/*   </Button> */}
        {/* </ScrollButtonContainer> */}
      </TableContainer>
    </Container>
  )
}

export default FarmTable
