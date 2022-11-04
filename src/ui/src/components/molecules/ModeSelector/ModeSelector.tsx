import React, { FC } from 'react'
import styled from '@emotion/styled'

import { Color } from '@liqlab/utils/Color'

export type Mode = {
  label: string
  isActive: boolean
  action: () => void
}

type Props = {
  modes: Mode[]
}

export const ModeSelector: FC<Props> = ({ modes }) => {
  return (
    <Root>
      {modes.map((mode) => {
        return (
          <ClickArea
            isActive={mode.isActive}
            key={mode.label}
            onClick={mode.action}>
            <Select isActive={mode.isActive}>{mode.label}</Select>
          </ClickArea>
        )
      })}
    </Root>
  )
}

const Root = styled('span')({
  display: 'inline-flex',
  gap: '8px',
  padding: '2px',
  borderRadius: '160px',
  boxSizing: 'border-box',
  border: `1px solid ${Color.themes.primary.default}`,

  background: Color.white.pure,
  height: '50px',
})

const ClickArea = styled('div')((p: { isActive: boolean }) => ({
  borderRadius: '160px',

  cursor: 'pointer',
  ':hover': {
    color: Color.black.primary,
  },
  background: p.isActive ? Color.white.primary : Color.white.pure,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

const Select = styled('div')((p: { isActive: boolean }) => ({
  margin: '0px 12px',
  fontSize: '16px',
  fontWeight: p.isActive ? 600 : 400,
  ':hover': {
    color: Color.black.primary,
  },
  color: p.isActive ? Color.black.primary : Color.black.secondary,
}))
