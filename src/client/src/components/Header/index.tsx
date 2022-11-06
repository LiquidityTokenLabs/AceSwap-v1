import { Header, MenuItem, Mode, Status } from '@liqlab/ui'
import { getChainInfoById } from '@liqlab/utils/Config/ChainConfig'
import { convertDec2Hex } from '@liqlab/utils/Format'
import { ethers } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
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
  const { authenticate, isAuthenticated, user, logout } = useMoralis()
  const location = useLocation()
  const navi = useNavigate()
  const path = location.pathname

  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<Status>('INIT')
  const [chainId, setChainId] = useState(0)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  useEffect(() => {
    if (isAuthenticated && !!user) {
      const addr = user.get('ethAddress')
      setAddress(addr)
      setStatus('CONNECTED')
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    checkChain()
  }, [provider])

  const connect = () => {
    if (!isAuthenticated) {
      authenticate()
    }
  }

  const checkChain = useCallback(async () => {
    const tmpInfo = await provider.ready
    const tmpChainId = tmpInfo.chainId

    setChainId(tmpChainId)
  }, [provider])

  const changeChain = async (id: number) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: convertDec2Hex(id),
          },
        ],
      })
    } catch (Exeption) {
      try {
        const networkInfo = getChainInfoById(id)
        const params = {
          chainId: convertDec2Hex(id),
          chainName: networkInfo.network,
          nativeCurrency: networkInfo.nativeCurrency,
          rpcUrls: [networkInfo.rpcUrl],
        }
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })
      } catch (Exeption) {}
    } finally {
      window.location.reload() // TODO
    }
  }

  // TODO
  const signOut = () => {
    logout()
    window.location.reload()
    // navi(location.pathname)
  }
  // =========================================

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
      action: signOut,
    },
  ]

  const chains = [
    {
      info: getChainInfoById(5),
      action: () => changeChain(5),
    },
    {
      info: getChainInfoById(420),
      action: () => changeChain(420),
    },
  ]

  return (
    <Header
      modes={modes}
      menuItems={menuItems}
      currentChainId={chainId}
      chains={chains}
      connectStatus={{
        status: status,
        address: address,
        connection: connect,
      }}
    />
  )
}

export default Component
