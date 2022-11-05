import { History } from '@liqlab/utils/Domain/History'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { ethers } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PoolDetail } from '../../../components/PoolDetail'
import { poolContract } from '../../../hook'

const Page: FC = () => {
  const { id } = useParams()
  const [pool, setPool] = useState<Pool | null>(null)
  const [stakeFT, setStakeFT] = useState(0)
  const [stakeNFT, setStakeNFT] = useState(0)
  const [reward, setReward] = useState(0)
  const [histories, setHistories] = useState<History[]>([])

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
      name: 'AceSwap Girl',
      curveType: curveType,
      delta: delta,
      spread: spread,
      spotPrice: spotPrice,
      deltaNum: deltaNum,
      spreadNum: spreadNum,
    }
  }, [])

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

    const f = async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const account = accounts[0]
      const tmpPoolInfo = await getPoolInfo()
      const tmpNFTFee = await poolContract.getUserStakeFee()
      const rwd = Number(ethers.utils.formatEther(tmpNFTFee.toString()))
      const userInfo = await poolContract.getUserInfo()
      const nft = userInfo.initBuyNum
      const ft = userInfo.initSellNum
      setPool(tmpPoolInfo)
      setStakeNFT(Number(nft))
      setStakeFT(Number(ft))
      setReward(rwd)
    }
    f()

    setHistories(h)
  }, [])

  useEffect(() => {}, [])
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
