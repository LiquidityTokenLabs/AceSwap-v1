import React, { FC } from 'react'
import { Button } from './Button'
import { css } from '@emotion/css'
import { ColorPallet } from '@liqlab/utils/Color'

type Props = {
  label: string
  color: ColorPallet
  padding?: string
  fontSize?: string
  fontWeight?: number
  clickHandler: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const StyledButton: FC<Props> = ({
  color,
  label,
  padding = '12px 72px',
  fontSize = '16px',
  fontWeight = 400,
  clickHandler,
  onMouseEnter,
  onMouseLeave,
}) => {
  const colorStyle = css({
    color: color.text,
    background: color.background,
  })

  const fontStyle = css({
    fontSize,
    fontWeight,
  })

  const baseStyle = css({
    borderRadius: '16px',
    border: 'none',

    padding: padding,

    cursor: 'pointer',
  })

  return (
    <Button
      styles={[colorStyle, fontStyle, baseStyle]}
      {...{ label, clickHandler, onMouseEnter, onMouseLeave }}
    />
  )
}
