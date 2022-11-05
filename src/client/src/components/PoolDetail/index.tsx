import styled from '@emotion/styled'
import { FC, useCallback, useEffect, useState } from 'react'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { Color } from '@liqlab/utils/Color'
import { Card, FixedButton, Mode, ModeSelector } from '@liqlab/ui'
import { PoolSetting } from './PoolSetting'
import { PoolStatus } from './PoolStatus'
import { Reward } from './Reward'
import { History } from '@liqlab/utils/Domain/History'
import { Histories } from './Histories'

import { HiArrowNarrowLeft } from 'react-icons/hi'
import { ModalContent } from './ModalContent'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { useMoralisWeb3Api } from 'react-moralis'
import { poolContract } from '../../hook'
import { ethers } from 'ethers'
import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'

type Props = {
  pool: Pool
  stakeFT: number
  stakeNFT: number
  reward: number
  histories: History[]
  pageBack: () => void
}

export const PoolDetail: FC<Props> = ({
  pool,
  stakeFT,
  stakeNFT,
  reward,
  histories,
  pageBack,
}) => {
  const contractConfig = GoerliConfig
  const Web3Api = useMoralisWeb3Api()
  const [mode, setMode] = useState<'INFO' | 'EVENT'>('INFO')
  const [openModal, setModalOpen] = useState(false)
  const [nfts, setNfts] = useState<Nft[]>([])

  const modalClose = () => {
    setModalOpen(false)
  }
  const modalOpen = () => {
    setModalOpen(true)
  }

  const modes: Mode[] = [
    {
      label: '基本情報',
      isActive: mode === 'INFO',
      action: () => {
        setMode('INFO')
      },
    },
    {
      label: 'イベント履歴',
      isActive: mode === 'EVENT',
      action: () => {
        setMode('EVENT')
      },
    },
  ]

  // TODO ステークしているNFT一覧
  const fetchNFT = useCallback(async () => {
    const options: {
      chain: any
      address: any
      token_addresses: any
    } = await {
      chain: contractConfig.ChainName, //チェーン
      address: contractConfig.Pool721Address, //ロックされているコントラクトの場所
      token_addresses: contractConfig.TokenAddress, //filterここのアドレスのNFTのみが表示される
    }
    const tmpCtrItemList = await Web3Api.account.getNFTs(options) //NFT一覧が返ってくる
    const tmpPoolInfo = await poolContract.getPoolInfo()
    const tmpSpotPrice = tmpPoolInfo.spotPrice
    const price = Number(ethers.utils.formatEther(tmpSpotPrice.toString()))
    const results = tmpCtrItemList.result

    const res = results!.map((nft) => {
      const metadata = JSON.parse(nft.metadata!)
      const r: Nft = {
        id: nft.token_id,
        price: price,
        collectionName: nft.name,
        collectionAddr: nft.token_address,
        name: metadata.name,
        src: metadata.image,
      }
      return r
    })
    return res
  }, [Web3Api.account, poolContract])

  useEffect(() => {
    const f = async () => {
      const tmp = await fetchNFT()
      setNfts(tmp)
    }
    f()
  }, [])

  return (
    <Root>
      <Back onClick={pageBack}>
        <HiArrowNarrowLeft />
        Back to PoolList
      </Back>
      <Header>
        <div>{pool.name}</div>
        <ModeSelector modes={modes} />
      </Header>
      <Contents>
        <Left>
          <Card padding="20px">
            {mode === 'INFO' ? (
              <PoolSetting
                curveType={pool.curveType}
                spotPrice={pool.spotPrice}
                delta={pool.deltaNum}
                spread={pool.spreadNum}
              />
            ) : (
              <Histories histories={histories} />
            )}
          </Card>
        </Left>
        <Right>
          <Card padding="20px">
            <PoolStatus
              id={pool.id}
              tokenName={pool.name}
              stakeFT={stakeFT}
              stakeNFT={stakeNFT}
              reward={reward}
            />
          </Card>

          <Card padding="20px">
            <Reward reward={reward} />
          </Card>

          <BtnWrapper>
            <FixedButton
              label="流動性を解除する"
              clickHandler={modalOpen}
              width="420px"
              height="64px"
            />
          </BtnWrapper>
        </Right>
      </Contents>
      <ModalContent
        closeModal={modalClose}
        open={openModal}
        stakingNfts={nfts}
        pool={pool}
        tokenName={pool.name}
        stakeFT={stakeFT}
        stakeNFT={stakeNFT}
        reward={reward}
      />
    </Root>
  )
}

const Root = styled('div')({
  width: '854px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

const Back = styled('div')({
  fontSize: '20px',
  color: Color.text.secondary,
  cursor: 'pointer',
  height: '24px',

  display: 'flex',
  gap: '12px',
  alignItems: 'center',
})

const Header = styled('div')({
  fontSize: '36px',
  fontColor: Color.black.primary,

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Contents = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
})

const Right = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

const BtnWrapper = styled('div')({
  width: '420px',
})

const Left = styled('div')({
  height: '100%',
  width: '420px',
})
