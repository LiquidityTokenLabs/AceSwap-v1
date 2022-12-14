import styled from '@emotion/styled'
import React, { FC } from 'react'

import {
  Chain,
  Menu,
  MenuItem,
  Mode,
  ModeSelector,
  NetworkSelector,
  YomiSwapLogo,
  ConnectWallet,
  Status,
} from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'

type Props = {
  modes: Mode[]
  menuItems: MenuItem[]
  currentChainId: number
  chains: Chain[]
  connectStatus: {
    status: Status
    address: string
    connection: () => void
  }
}

export const Header: FC<Props> = ({
  modes,
  menuItems,
  currentChainId,
  chains,
  connectStatus,
}) => {
  return (
    <Root>
      <LeftNav>
        <AceSwap>AceSwap</AceSwap>
      </LeftNav>
      <CenterNav>
        <ModeSelector modes={modes} />
      </CenterNav>
      <RightNav>
        <NetworkSelectorWrapper>
          <NetworkSelector currentChainId={currentChainId} chains={chains} />
        </NetworkSelectorWrapper>
        <WalletConnectWrapper>
          <ConnectWallet
            status={connectStatus.status}
            address={connectStatus.address}
            clickHandler={connectStatus.connection}
          />
        </WalletConnectWrapper>
        <IconWrapper>
          <Menu menuItems={menuItems} />
        </IconWrapper>
      </RightNav>
    </Root>
  )
}

const Root = styled('div')({
  width: '100vw',
  height: '78px',

  position: 'fixed',
  top: 0,
  zIndex: 10,
})

const Nav = styled('div')({
  position: 'absolute',
  top: '14px',
  height: '50px',

  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const LeftNav = styled(Nav)({
  left: '32px',
})
const CenterNav = styled(Nav)({
  left: '50%',
  transform: 'translate(-50%, 0)',
})
const RightNav = styled(Nav)({
  right: '32px',
})

const IconWrapper = styled('div')({
  // position: 'absolute',
  // right: '16px',

  background: Color.white.primary,
  borderRadius: '16px',
  width: '50px',
  height: '50px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const NetworkSelectorWrapper = styled('div')({
  height: '50px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
const WalletConnectWrapper = styled('div')({
  height: '50px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const AceSwap = styled('div')({
  color: Color.themes.primary.default,
  fontSize: '20px',
})
