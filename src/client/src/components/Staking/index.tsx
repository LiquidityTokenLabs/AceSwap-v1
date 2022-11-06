import styled from '@emotion/styled'
import { Logo } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useCallback, useEffect, useState } from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'

import { Contract, ethers } from 'ethers'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'
import { useTx } from '../../context/transaction'
import { nftContract, NFT_ABI, poolContract } from '../../hook'
import { useStakeNFT } from '../../hook/StakeNFT'
import { showTransactionToast } from '../Toast'
import { StakeFT } from './StakeFT'
import { StakeNFT } from './StakeNFT'

type Props = {
  pageBack: () => void
  poolInfo: Pool | undefined
}

export const Staking: FC<Props> = ({ pageBack, poolInfo }) => {
  const contractConfig = GoerliConfig
  const { user } = useMoralis()
  const [stakeMode, setStakeMode] = useState<'NFT' | 'FT'>('NFT')
  const Web3Api = useMoralisWeb3Api()
  const [stakePrice, setStakePrice] = useState(1.05)
  const [delta, setDelta] = useState(Number(poolInfo?.delta))
  const [nfts, setNfts] = useState<Nft[]>([])
  const { send, success, error, loading, transactionHash } = useStakeNFT()
  const { setIsLoading } = useTx()
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  // TODO ユーザーが所持しているNFTを取得
  const fetchNFT = useCallback(async () => {
    if (!user) return
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const account = accounts[0]
    const tmpPoolInfo = await poolContract.getPoolInfo()
    const tmpSpotPrice = tmpPoolInfo.spotPrice
    const tmpSpread = tmpPoolInfo.spread
    const spread = Number(ethers.utils.formatEther(tmpSpread.toString()))
    const price = Number(ethers.utils.formatEther(tmpSpotPrice.toString()))
    const results = await nftContract.getAllHeldIds(account)

    const res = results!.map((nft) => {
      const r: Nft = {
        id: String(nft),
        price: price * (1 - spread),
        collectionName: 'AceSwap Girl',
        collectionAddr: contractConfig.TokenAddress,
        name: `AceSwap Girl #${nft}`,
        src: '',
      }
      return r
    })
    return res
  }, [user, Web3Api.account])

  // TODO staking nft
  const stakeNft = async (nfts: Nft[]) => {
    const ids = nfts.map((nft) => nft.id)
    const collectionAddrs = nfts.map((nft) => nft.collectionAddr)
    for (let i = 0; i < collectionAddrs.length; ++i) {
      const nftContract = new Contract(collectionAddrs[i], NFT_ABI, signer)
      await nftContract.approve(contractConfig.Pool721Address, ids[i])
    }
    await send(contractConfig.Pool721Address, ids, {
      gasLimit: '3000000',
    })
    console.log('stake nft :', nfts)
  }

  // TODO staking ft
  const stakeFt = (price: number) => {
    console.log('stake ft :', price)
  }

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
      if (!!tmp) {
        setNfts(tmp)
      }
    }
    f()
  }, [success])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  console.log({ nfts })

  return (
    <Root>
      <Header>
        <AiOutlineArrowLeft onClick={pageBack} />
        <Title>Staking</Title>
        <div></div>
      </Header>
      <Contents>
        <Left>
          <TokenName>{poolInfo?.name}</TokenName>
          <StakedInfo>
            <Text>stake</Text>
            <Wrapper>
              <StakedToken>
                <Logo image={getBase64Src(poolInfo?.id)} />
                <Text>1</Text>
              </StakedToken>
              <StakedToken>
                <Logo image={getBase64Src('1')} />
                <Text>1</Text>
              </StakedToken>
            </Wrapper>
          </StakedInfo>
          <SettingWrapper>
            <Settings>
              <Text>Bonding Curve</Text>
              <Text>{poolInfo?.curveType}</Text>
            </Settings>
            <Settings>
              <Text>spot price</Text>
              <Text>{poolInfo?.spotPrice}</Text>
            </Settings>
          </SettingWrapper>
          <SettingWrapper>
            <Settings>
              <Text>delta</Text>
              <Text>{poolInfo?.deltaNum}</Text>
            </Settings>
            <Settings>
              <Text>spread</Text>
              <Text>{poolInfo?.spreadNum}</Text>
            </Settings>
          </SettingWrapper>
          <StakeSelector>
            <StakeType
              isSelected={stakeMode === 'NFT'}
              onClick={() => setStakeMode('NFT')}>
              NFT
            </StakeType>
            <StakeType
              isSelected={stakeMode === 'FT'}
              onClick={() => setStakeMode('FT')}>
              FT
            </StakeType>
          </StakeSelector>
        </Left>
        <Right>
          {stakeMode === 'NFT' ? (
            <StakeNFT
              items={nfts}
              pool={poolInfo}
              staking={(nfts) => stakeNft(nfts)}
            />
          ) : (
            <StakeFT stakePrice={stakePrice} delta={delta} staking={stakeFt} />
          )}
        </Right>
      </Contents>
    </Root>
  )
}

const Root = styled('div')({
  width: '818px', // 870 - 52
  height: '498px', // 550 - 52
})

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${Color.white.seccondary}`,
  paddingBottom: '28px',
})

const Title = styled('div')({
  fontSize: '20px',
})

const Contents = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '16px',
})

const Left = styled('div')({
  width: 'calc(50% - 8px)',
  marginRight: '8px',

  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

const Right = styled('div')({
  width: 'calc(50% - 8px)',
  marginLeft: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

const TokenName = styled('div')({
  background: Color.white.primary,
  borderRadius: '16px',
  height: '44px',
  lineHeight: '44px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 600,
})

const Text = styled('div')({
  fontSize: '10px',
})

const StakedInfo = styled('div')({
  borderRadius: '16px',
  padding: '16px',

  display: 'flex',
  flexDirection: 'column',
  gap: '8px',

  background: Color.white.primary,
})

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
})

const StakedToken = styled('div')({
  height: '36px',
  width: 'calc(50% - 30px)',
  background: Color.white.seccondary,

  borderRadius: '6px',
  padding: '0px 8px',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Settings = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '120px',
})
const SettingWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0px 16px',
})

const StakeSelector = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
})

const StakeType = styled('div')((p: { isSelected: boolean }) => ({
  boxSizing: 'border-box',
  border: `2px solid ${
    p.isSelected ? Color.themes.primary.default : Color.status.disabled
  }`,
  fontSize: '32px',
  color: p.isSelected ? Color.themes.primary.default : Color.status.disabled,
  borderRadius: '16px',
  width: 'calc(50% - 8px)',
  height: '120px',
  cursor: 'pointer',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))
