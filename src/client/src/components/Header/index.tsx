import { Header, MenuItem, Mode } from '@liqlab/ui'
import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

declare global {
  interface Window {
    ethereum: any
  }
}

const INDEX_PATH = '/'
const BUY_PATH = '/buy'
const SELL_PATH = '/sell'
const POOL_PATH = '/pool'

const Component: FC = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers()
  const location = useLocation()
  const navi = useNavigate()
  const path = location.pathname
  const [chainId, setChainId] = useState(0)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const modes: Mode[] = [
    {
      label: 'Buy',
      isActive: path.startsWith(BUY_PATH) || path === INDEX_PATH,
      action: () => navi('/buy'),
    },
    {
      label: 'Sell',
      isActive: path.startsWith(SELL_PATH),
      action: () => navi('/sell'),
    },
    {
      label: 'Pool',
      isActive: path.startsWith(POOL_PATH),
      action: () => navi('/pool'),
    },
  ]

  const menuItems: MenuItem[] = [
    {
      label: 'Logout',
      available: true,
      type: 'BUTTON',
      action: deactivate,
    },
  ]

  const checkChain = useCallback(async () => {
    const { chainId } = await provider.getNetwork()

    setChainId(chainId)
  }, [provider])

  useEffect(() => {
    checkChain()
  }, [provider])

  return (
    <Header
      modes={modes}
      menuItems={menuItems}
      currentChainId={chainId}
      connectStatus={{
        address: account,
        connection: activateBrowserWallet,
      }}
    />
  )
}

export default Component
