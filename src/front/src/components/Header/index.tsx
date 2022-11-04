import { Header, MenuItem, Mode, Status } from '@liqlab/ui'
import { getChainInfoById } from '@liqlab/utils/Config/ChainConfig'
import React, { FC, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

declare global {
  interface Window {
    ethereum: any
  }
}

const Component: FC = () => {
  const { authenticate, isAuthenticated, user, logout } = useMoralis()
  const router = useRouter()

  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<Status>('INIT')
  const [chainId, setChainId] = useState(0)

  useEffect(() => {
    if (isAuthenticated && !!user) {
      const addr = user.get('ethAddress')
      setAddress(addr)
      setStatus('CONNECTED')
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    checkChain()
  }, [])

  const connect = () => {
    if (!isAuthenticated) {
      authenticate()
    }
  }

  const checkChain = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const tmpInfo = await provider.ready
    const tmpChainId = tmpInfo.chainId

    // console.log({ tmpChainId })
  }

  const signOut = () => {
    router.reload()
  }
  // =========================================

  const modes: Mode[] = [
    {
      label: 'Buy',
      isActive: false,
      action: () => router.push('/buy'),
    },
    {
      label: 'Sell',
      isActive: false,
      action: () => router.push('/sell'),
    },
    {
      label: 'Pool',
      isActive: false,
      action: () => router.push('/pool'),
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
      action: () => console.log('change goerli'),
    },
    {
      info: getChainInfoById(420),
      action: () => console.log('change optimism'),
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
