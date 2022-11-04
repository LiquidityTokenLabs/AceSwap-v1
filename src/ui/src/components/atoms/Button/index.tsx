import { css } from '@emotion/css'
import React, { FC, useState } from 'react'
import { Button } from './Button'

import {
  MainButtonColorPallet,
  MainButtonHoverColorPallet,
} from './ButtonColor'

import { StyledButton } from './StyledButton'

type PrimaryButtonProps = {
  label: string
  clickHandler: () => void
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  label,
  clickHandler,
}) => {
  const [isHover, setIsHover] = useState(false)

  const hoverOn = () => {
    setIsHover(true)
  }

  const hoverOff = () => {
    setIsHover(false)
  }

  return (
    <span onMouseLeave={hoverOff}>
      <StyledButton
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        {...{ clickHandler, label }}
        color={isHover ? MainButtonHoverColorPallet : MainButtonColorPallet}
      />
    </span>
  )
}

type FixedButtonProps = {
  label: string
  clickHandler: () => void
  width: string
  height: string
}

export const FixedButton: FC<FixedButtonProps> = ({
  label,
  clickHandler,
  width,
  height,
}) => {
  const [isHover, setIsHover] = useState(false)

  const onMouseEnter = () => {
    setIsHover(true)
  }

  const onMouseLeave = () => {
    setIsHover(false)
  }

  const color = isHover ? MainButtonHoverColorPallet : MainButtonColorPallet

  const colorStyle = css({
    color: color.text,
    background: color.background,
  })

  const sizeStyle = css({
    width,
    height,
  })

  const baseStyle = css({
    borderRadius: '16px',
    border: 'none',
    fontSize: '20px',

    cursor: 'pointer',
  })

  return (
    <Button
      styles={[colorStyle, baseStyle, sizeStyle]}
      {...{ label, clickHandler, onMouseEnter, onMouseLeave }}
    />
  )
}
