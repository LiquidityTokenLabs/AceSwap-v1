import styled from '@emotion/styled'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useCallback, useEffect, useState } from 'react'
import { EmptyPool } from '../../components/EmptyPool'
import { PoolList } from '../../components/PoolList'

import { PrimaryButton } from '@liqlab/ui'
import { ethers } from 'ethers'
import { useMoralis } from 'react-moralis'
import { useNavigate } from 'react-router'
import { poolContract } from '../../hook'

const Page: FC = () => {
  const { user, isAuthenticated } = useMoralis()
  const [pool, setPool] = useState<Pool>()
  const [owner, setOwner] = useState<string>('')
  const navi = useNavigate()
  const [address, setAddress] = useState('')

  const getPoolInfo = useCallback(async () => {
    const tmpPoolInfo = await poolContract.getPoolInfo()
    const curveType = 'Linear'
    const delta = ethers.utils.formatEther(tmpPoolInfo.spread.toString())
    const spread = ethers.utils.formatEther(tmpPoolInfo.spread.toString())
    const spotPrice = Number(
      ethers.utils.formatEther(tmpPoolInfo.spotPrice.toString())
    )
    const deltaNum = Number(
      ethers.utils.formatEther(tmpPoolInfo.delta.toString())
    )
    const spreadNum = Number(
      ethers.utils.formatEther(tmpPoolInfo.spread.toString())
    )

    return {
      id: '1234',
      name: 'ASG',
      curveType: curveType,
      delta: delta,
      spread: spread,
      spotPrice: spotPrice,
      deltaNum: deltaNum,
      spreadNum: spreadNum,
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && !!user) {
      const addr = user.get('ethAddress')
      setAddress(addr)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    const f = async () => {
      const tmpPoolInfo = await getPoolInfo()
      setPool(tmpPoolInfo)
      const owner = await poolContract.owner()
      setOwner(owner)
    }
    f()
  }, [address])

  const movePage = (id: string | undefined) => {
    if (!id) return
    navi(id)
  }

  if (address !== '0x93ab41e27756C9987a66f9d9FBd895dDD60641A1') {
    return (
      <Root>
        <Header>
          <Title>Pool</Title>
          <PrimaryButton
            label="Staking"
            clickHandler={() => navi('/pool/1234567890/staking')}
          />
        </Header>
        <EmptyPool />
      </Root>
    )
  } else if (!pool) {
    return (
      <Root>
        <EmptyPool />
      </Root>
    )
  } else {
    return (
      <Root>
        <PoolList pool={pool} movePage={movePage} />
      </Root>
    )
  }
}

export default Page

const Root = styled('div')({
  width: '870px',
  height: '272px',
})

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '36px',
  paddingBottom: '24px',
})

const Title = styled('div')({})
