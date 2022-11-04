import { FC, useEffect, useState } from 'react'
import { PoolDetail } from '../../../components/PoolDetail'
import { useParams } from 'react-router'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { PoolInfo } from '@liqlab/utils/Domain/PoolInfo'
import { useNavigate } from 'react-router'
import { History } from '@liqlab/utils/Domain/History'
const Page: FC = () => {
  const { id } = useParams()

  const [pool, setPool] = useState<Pool | null>(null)
  const [stakeFT, setStakeFT] = useState(0)
  const [stakeNFT, setStakeNFT] = useState(0)
  const [reward, setReward] = useState(0)
  const [histories, setHistories] = useState<History[]>([])

  const navi = useNavigate()

  useEffect(() => {
    // TODO get history
    const h: History[] = [
      {
        id: 0,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 1,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 2,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 3,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 4,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 5,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 6,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
      {
        id: 7,
        address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
        type: 'Stake',
        tokenIds: ['0', '1', '2'],
      },
    ]

    // TODO get info
    const p: Pool = {
      id: id || '',
      name: 'CloneX',
      curveType: 'Linear',
      delta: '10%',
      spread: '10%',
      spotPrice: 0.1,
      deltaNum: 0.01,
      spreadNum: 0.8,
    }
    const ft = 2.827
    const nft = 5
    const rwd = 1.203

    setHistories(h)

    setPool(p)
    setStakeFT(ft)
    setStakeNFT(nft)
    setReward(rwd)
  }, [])
  if (pool === null) {
    return <></>
  }

  const pageBack = () => {
    navi('/pool')
  }

  return (
    <PoolDetail {...{ pool, stakeFT, stakeNFT, reward, histories, pageBack }} />
  )
}

export default Page
