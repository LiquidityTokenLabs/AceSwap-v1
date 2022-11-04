import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'
import { getShortAddress } from '@liqlab/utils/Format'
import React, { FC } from 'react'

export type Status = 'INIT' | 'CONNECTED' | 'WAITING'

type Props = {
  status: Status
  address: string
  clickHandler: () => void
}

export const ConnectWallet: FC<Props> = ({ status, address, clickHandler }) => {
  if (status === 'CONNECTED') {
    return <Root>{getShortAddress(address)}</Root>
  }
  return <Root onClick={clickHandler}>ウォレットに接続</Root>
}

const Root = styled('div')({
  height: '50px',
  width: '160px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderRadius: '160px',
  boxSizing: 'border-box',
  border: `1px solid ${Color.themes.primary.default}`,

  background: Color.white.pure,
  cursor: 'pointer',
})
