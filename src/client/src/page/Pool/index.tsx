import styled from '@emotion/styled'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useCallback, useEffect, useState } from 'react'
import { EmptyPool } from '../../components/EmptyPool'
import { PoolList } from '../../components/PoolList'

import { ethers } from 'ethers'
import { useNavigate } from 'react-router'
import { poolContract } from '../../hook'

const Page: FC = () => {
  const [pool, setPool] = useState<Pool>()

  const navi = useNavigate()

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
    const f = async () => {
      const tmpPoolInfo = await getPoolInfo()
      setPool(tmpPoolInfo)
    }
    f()
  }, [])

  const movePage = (id: string) => {
    navi(id)
  }

  if (!pool) {
    return (
      <Root>
        <EmptyPool />
      </Root>
    )
  }

  return (
    <Root>
      <PoolList pool={pool} movePage={movePage} />
    </Root>
  )
}

export default Page

const Root = styled('div')({
  width: '870px',
  height: '272px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
