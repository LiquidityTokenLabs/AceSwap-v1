import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'

import { Color } from '@liqlab/utils/Color'

type Props = {
  children: ReactNode
  padding: string
}

export const Card: FC<Props> = ({ children, padding }) => {
  return <Root padding={padding}>{children}</Root>
}

const Root = styled('div')((p: { padding: string }) => ({
  background: Color.white.pure,
  padding: p.padding,
  borderRadius: '16px',
  boxShadow:
    'rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px',
}))
