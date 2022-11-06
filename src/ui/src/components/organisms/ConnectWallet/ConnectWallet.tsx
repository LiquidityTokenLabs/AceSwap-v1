import styled from '@emotion/styled'
import { useTx } from '@liqlab/client/src/context/transaction'
import { Color } from '@liqlab/utils/Color'
import { getShortAddress } from '@liqlab/utils/Format'
import { FC } from 'react'

export type Status = 'INIT' | 'CONNECTED' | 'WAITING'

type Props = {
  address: string | undefined
  clickHandler: () => void
}

export const ConnectWallet: FC<Props> = ({ address, clickHandler }) => {
  const { isLoading } = useTx()
  if (address) {
    if (isLoading) {
      return (
        <RootLoading>
          {getShortAddress(address)}
          <Loading>1 保留中</Loading>
        </RootLoading>
      )
    } else {
      return <Root>{getShortAddress(address)}</Root>
    }
  } else {
    return <Root onClick={clickHandler}>ウォレットに接続</Root>
  }
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

const RootLoading = styled('div')({
  height: '50px',
  width: '240px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderRadius: '160px',
  background: Color.white.pure,
  cursor: 'pointer',
})

const Loading = styled('div')({
  height: '40px',
  width: '120px',
  padding: '0 12px 0 15px',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  color: Color.white.pure,
  borderRadius: '60px',
  background: '#D52D6F',
  cursor: 'pointer',

  ':after': {
    content: '""',
    display: 'block',
    width: '17px',
    height: '17px',
    borderRadius: '50%',
    border: `1px solid ${Color.white.pure}`,
  },
})
