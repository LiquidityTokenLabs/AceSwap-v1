import styled from '@emotion/styled'
import React, { FC } from 'react'
import { Color } from '@liqlab/utils/Color'

type Props = {
  label: string
}

export const Chip: FC<Props> = ({ label }) => {
  return <Root>{label}</Root>
}

const Root = styled('span')({
  background: Color.black.secondary,
  padding: '4px 16px',
  borderRadius: '12px',
  fontSize: '8px',
})
