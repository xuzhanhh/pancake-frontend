import React from 'react'
import _VariableSizeList from './VariableSizeList'
import _FixedSizeList from './FixedSizeList'
import { ScrollView, View } from '@tarojs/components'

function convertPxToInt(style) {
  if (typeof style === 'string') {
    const str = style.toLowerCase()
    if (/px$/.test(str)) {
      return Number(str.replace(/px$/, ''))
    }
  }
  return style
}

const OuterScrollView = React.forwardRef((props, ref) => {
  const { style, onScroll, onScrollNative, layout, ...rest } = props
  const handleScroll = (event) => {
    onScroll({
      ...event,
      currentTarget: {
        ...event.detail,
        clientWidth: convertPxToInt(style.width),
        clientHeight: convertPxToInt(style.height),
      },
    })

    if (typeof onScrollNative === 'function') {
      onScrollNative(event)
    }
  }

  return React.createElement(ScrollView, {
    ref,
    style,
    scrollY: layout === 'vertical',
    scrollX: layout === 'horizontal',
    onScroll: handleScroll,
    ...rest,
  })
})

export const VariableSizeList = React.forwardRef((props, ref) => {
  const {
    direction = 'ltr',
    innerElementType = View,
    itemElementType = View,
    initialScrollOffset = 0,
    overscanCount = 1,
    ...rest
  } = props

  return React.createElement(_VariableSizeList, {
    ref,
    ...rest,
    itemElementType,
    innerElementType,
    outerElementType: OuterScrollView,
    direction,
    initialScrollOffset,
    overscanCount,
  })
})

export const FixedSizeList = React.forwardRef((props, ref) => {
  const {
    direction = 'ltr',
    innerElementType = View,
    itemElementType = View,
    initialScrollOffset = 0,
    overscanCount = 1,
    ...rest
  } = props

  return React.createElement(_FixedSizeList, {
    ref,
    ...rest,
    itemElementType,
    innerElementType,
    outerElementType: OuterScrollView,
    direction,
    initialScrollOffset,
    overscanCount,
  })
})
