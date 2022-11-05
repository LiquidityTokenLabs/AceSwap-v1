import { Contract, ethers } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'
import { Board } from '../../components/Board'

import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { PoolInfo } from '@liqlab/utils/Domain/PoolInfo'

import { showTransactionToast } from '../../components/Toast'
import { poolContract } from '../../hook'
import { useSwapNFTforFT } from '../../hook/SwapNFTforFT'
import { useTx } from '../../context/transaction'

const NFT_ABI = [
  'function approve(address to, uint256 tokenId) external',
  'function setApprovalForAll(address operator, bool _approved) external',
]

const Page: FC = () => {
  // FIXME Goerliでしか動かないので要修正
  const contractConfig = GoerliConfig // TODO
  const Web3Api = useMoralisWeb3Api()
  const { user, isAuthenticated } = useMoralis()
  const [nfts, setNfts] = useState<Nft[]>([])
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null)
  const {
    send: SwapNFTforFT,
    transactionHash,
    error,
    success,
    loading,
  } = useSwapNFTforFT()
  const { setIsLoading } = useTx()
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

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

  // TODO ユーザーが所持しているNFTを取得
  const fetchNFT = useCallback(async () => {
    if (!user) return

    const options: {
      chain: any
      address: any
      token_addresses: any
    } = await {
      chain: contractConfig.ChainName, //チェーン
      address: user.get('ethAddress'), //ロックされているコントラクトの場所
      token_addresses: contractConfig.TokenAddress, //filterここのアドレスのNFTのみが表示される
    }
    const tmpCtrItemList = await Web3Api.account.getNFTs(options) //NFT一覧が返ってくる
    const tmpPoolInfo = await poolContract.getPoolInfo()
    const tmpSpotPrice = tmpPoolInfo.spotPrice
    const tmpSpread = tmpPoolInfo.spread
    const tmpDelta = tmpPoolInfo.delta
    const price = Number(ethers.utils.formatEther(tmpSpotPrice.toString()))
    const spread = Number(ethers.utils.formatEther(tmpSpread.toString()))
    const delta = Number(ethers.utils.formatEther(tmpDelta.toString()))
    const results = tmpCtrItemList.result

    const res = results!.map((nft) => {
      const metadata = JSON.parse(nft.metadata!) || { name: '', src: '' }
      const r: Nft = {
        id: nft.token_id,
        price: (price - delta) * (1 - spread),
        collectionName: nft.name,
        collectionAddr: nft.token_address,
        name: metadata.name,
        src: metadata.image,
      }
      return r
    })
    return res
  }, [user, Web3Api.account])

  const submit = useCallback(
    async (selectedNfts: Nft[]) => {
      // TODO 引数のselectedNftsを売却する処理
      const ids = selectedNfts.map((nft) => nft.id)
      console.log(ids)
      const collectionAddrs = selectedNfts.map((nft) => nft.collectionAddr)
      console.log(collectionAddrs)
      if (ids.length === 0 || !poolInfo) {
        return
      }
      const spotPrice = ethers.utils.parseEther(`${poolInfo.spotPrice}`)
      const minExpectFee = await poolContract.getCalcSellInfo(
        ids.length,
        spotPrice
      )
      const expectFeeETH = ethers.utils.formatEther(minExpectFee.toString())
      const expectFeeWei = ethers.utils.parseEther(expectFeeETH.toString())
      console.log({ expectFeeETH })
      for (let i = 0; i < collectionAddrs.length; ++i) {
        const nftContract = new Contract(collectionAddrs[i], NFT_ABI, signer)
        await nftContract.approve(contractConfig.Pool721Address, ids[i])
      }
      await SwapNFTforFT(
        contractConfig.Pool721Address,
        ids,
        expectFeeWei,
        contractConfig.ProtocolAddress,
        {
          gasLimit: '3000000',
        }
      )
    },
    [poolInfo, SwapNFTforFT, signer]
  )

  useEffect(() => {
    if (success) {
      console.log({ hash: transactionHash })
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
          'https://docs.sss-symbol.com',
          'error'
        )
      }, 1000)
    }
  }, [success, error])

  useEffect(() => {
    const f = async () => {
      const tmp = await fetchNFT()
      if (!!tmp) {
        setNfts(tmp)
      }
      getPoolInfo()

      const tmpPoolInfo = await getPoolInfo()
      setPoolInfo(tmpPoolInfo)
    }
    f()
  }, [success])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  if (poolInfo === null) {
    return <>LOADING</>
  }

  return (
    <Board items={nfts} poolInfo={poolInfo} submit={submit} operation="SELL" />
  )
}

export default Page
