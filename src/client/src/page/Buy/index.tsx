import { ethers } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import { Board } from '../../components/Board'

import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { PoolInfo } from '@liqlab/utils/Domain/PoolInfo'

import { showTransactionToast } from '@liqlab/client/src/components/Toast'
import { useTx } from '../../context/transaction'
import { poolContract } from '../../hook'
import { useSwapFTforNFT } from '../../hook/SwapFTforNFT'
import { useEthers } from '@usedapp/core'

const Page: FC = () => {
  const contractConfig = GoerliConfig // TODO
  const { account } = useEthers()
  const [nfts, setNfts] = useState<Nft[]>([])
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null)
  const {
    send: SwapFTforNFT,
    transactionHash,
    error,
    success,
    loading,
  } = useSwapFTforNFT()
  const { isLoading, setIsLoading } = useTx()

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
      id: '',
      name: '',
      curveType: curveType,
      delta: delta,
      spread: spread,
      spotPrice: spotPrice,
      deltaNum: deltaNum,
      spreadNum: spreadNum,
    }
  }, [])

  // TODO プールにあるNFTを取得
  const fetchNFT = useCallback(async () => {
    const tmpPoolInfo = await poolContract.getPoolInfo()
    const tmpSpotPrice = tmpPoolInfo.spotPrice
    const price = Number(ethers.utils.formatEther(tmpSpotPrice.toString()))
    const results = await poolContract.getAllHoldIds()

    const res = results!.map((nft) => {
      const r: Nft = {
        id: String(nft),
        price: price,
        collectionName: 'AceSwap Girl',
        collectionAddr: contractConfig.TokenAddress,
        name: `AceSwap Girl #${nft}`,
        src: '',
      }
      return r
    })
    return res
  }, [poolContract])

  const submit = useCallback(
    async (selectedNfts: Nft[]) => {
      // TODO 引数のselectedNftsを購入する処理
      const ids = selectedNfts.map((nft) => nft.id)
      if (ids.length === 0 || !poolInfo) {
        return
      }
      const spotPrice = ethers.utils.parseEther(`${poolInfo.spotPrice}`)
      const tmpFee = await poolContract.getCalcBuyInfo(ids.length, spotPrice)
      const feeETH = ethers.utils.formatEther(tmpFee.toString())
      const feeWei = ethers.utils.parseEther(feeETH.toString())
      console.log({ feeETH })
      await SwapFTforNFT(
        contractConfig.Pool721Address,
        ids,
        contractConfig.ProtocolAddress,
        {
          value: feeWei,
          gasLimit: '3000000',
        }
      )
    },
    [poolInfo, SwapFTforNFT]
  )

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        showTransactionToast(
          'スワップ完了',
          `https://goerli.etherscan.io/tx/${transactionHash}`,
          'success'
        )
      }, 1000)
    } else if (error) {
      console.log({ error })
      setTimeout(() => {
        showTransactionToast(
          'スワップ失敗',
          `https://goerli.etherscan.io/tx/${transactionHash}`,
          'error'
        )
      }, 1000)
    }
  }, [success, error])

  useEffect(() => {
    const f = async () => {
      const tmp = await fetchNFT()
      setNfts(tmp)
      const tmpPoolInfo = await getPoolInfo()
      setPoolInfo(tmpPoolInfo)
    }
    if (account) {
      f()
    }
  }, [success, account])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  if (poolInfo === null) {
    return <>LOADING</>
  }

  return (
    <Board items={nfts} poolInfo={poolInfo} submit={submit} operation="BUY" />
  )
}

export default Page
