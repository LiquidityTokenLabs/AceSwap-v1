import styled from '@emotion/styled'
import { Logo } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useState } from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'

import { StakeFT } from './StakeFT'
import { StakeNFT } from './StakeNFT'

type Props = {
  pageBack: () => void
  poolInfo: Pool
}

export const Staking: FC<Props> = ({ pageBack, poolInfo }) => {
  const [stakeMode, setStakeMode] = useState<'NFT' | 'FT'>('NFT')

  const [stakePrice, setStakePrice] = useState(1.05)
  const [delta, setDelta] = useState(0.1)

  const items: Nft[] = [
    {
      id: '1',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #1',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
    {
      id: '2',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #2',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
    {
      id: '3',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #3',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
    {
      id: '4',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #4',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
    {
      id: '5',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #5',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
    {
      id: '6',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #6',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
    {
      id: '7',
      collectionName: 'CloneX',
      collectionAddr: '',
      name: 'CloneX #7',
      src: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png',
      price: -Infinity,
    },
  ]

  // TODO staking nft
  const stakeNft = (nfts: Nft[]) => {
    console.log('stake nft :', nfts)
  }

  // TODO staking ft
  const stakeFt = (price: number) => {
    console.log('stake ft :', price)
  }

  return (
    <Root>
      <Header>
        <AiOutlineArrowLeft onClick={pageBack} />
        <Title>Staking</Title>
        <div></div>
      </Header>
      <Contents>
        <Left>
          <TokenName>{poolInfo.name}</TokenName>
          <StakedInfo>
            <Text>stake</Text>
            <Wrapper>
              <StakedToken>
                <Logo image={getBase64Src(poolInfo.id)} />
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
              <Text>{poolInfo.curveType}</Text>
            </Settings>
            <Settings>
              <Text>spot price</Text>
              <Text>{poolInfo.spotPrice}</Text>
            </Settings>
          </SettingWrapper>
          <SettingWrapper>
            <Settings>
              <Text>delta</Text>
              <Text>{poolInfo.deltaNum}</Text>
            </Settings>
            <Settings>
              <Text>spread</Text>
              <Text>{poolInfo.spreadNum}</Text>
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
              items={items}
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
