import { Card } from '@liqlab/ui'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { ethers } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Staking } from '../../../../components/Staking'
import { poolContract } from '../../../../hook'

const Page: FC = () => {
  const navi = useNavigate()
  const [pool, setPool] = useState<Pool>()

  // TODO プールのIDがURLから取得できるので、それを使ってプールの情報を取得する
  const poolInfo: Pool = {
    id: '123456',
    name: 'CloneX',
    curveType: 'Linear',
    delta: '10%',
    spread: '80%',
    spotPrice: 0.1,
    deltaNum: 0.1,
    spreadNum: 0.8,
  }
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
      name: 'AceSwap Girl',
      curveType: curveType,
      delta: delta,
      spread: spread,
      spotPrice: spotPrice,
      deltaNum: deltaNum,
      spreadNum: spreadNum,
    }
  }, [])

  const pageBack = () => {
    navi('/pool')
  }

  useEffect(() => {
    const f = async () => {
      const tmpPoolInfo = await getPoolInfo()
      setPool(tmpPoolInfo)
    }
    f()
  }, [])

  return (
    <Card padding="26px">
      <Staking poolInfo={poolInfo} pageBack={pageBack} />
    </Card>
  )
}

export default Page
