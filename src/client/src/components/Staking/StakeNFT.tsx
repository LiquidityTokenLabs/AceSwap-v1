import styled from '@emotion/styled'
import { FixedButton } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useEffect, useState } from 'react'
import { NftWrapper } from '../NftWrapper'

type Props = {
  items: Nft[]
  pool: Pool | undefined
  staking: (nfts: Nft[]) => void
}

type PreviewNft = {
  info: Nft
  isActive: boolean
}

export const StakeNFT: FC<Props> = ({ items, pool, staking }) => {
  const [nfts, setNfts] = useState<PreviewNft[]>([])

  const selectedNfts = nfts.filter((nft) => nft.isActive)

  useEffect(() => {
    const newNfts = items.map((n) => {
      return {
        info: n,
        isActive: false,
      }
    })
    setNfts(newNfts)
  }, [items])

  const select = (num: number) => {
    const newNfts = nfts.map((nft, i) => {
      if (i === num) {
        nft.isActive = !nft.isActive
      }
      return nft
    })
    setNfts(newNfts)
  }

  return (
    <Root>
      <Wrapper>
        <List>
          {nfts.map((nft, i) => {
            return (
              <Item key={nft.info.id} onClick={() => select(i)}>
                <NftWrapper
                  price={nft.info.price}
                  src="/aceswap-girl.png"
                  collection={nft.info.collectionName}
                  name={nft.info.name}
                  isActive={nft.isActive}
                  selectedCount={selectedNfts.length}
                  anchorPrice={-Infinity}
                  setAnchorPrice={() => ''}
                  delta={-Infinity}
                  chainId={5}
                  operation="NOPRICE"
                />
              </Item>
            )
          })}
        </List>
      </Wrapper>
      <ButtonWrapper>
        <FixedButton
          label="Staking"
          clickHandler={() => staking(selectedNfts.map((nft) => nft.info))}
          width="376px"
          height="64px"
        />
      </ButtonWrapper>
    </Root>
  )
}

const Root = styled('div')({
  width: '100%',
  height: '100%',
})

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',

  height: '308px',
  overflowY: 'scroll',

  '::-webkit-scrollbar-track': {
    background: Color.white.pure,
  },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    background: Color.black.secondary,
  },
  '::-webkit-scrollbar': {
    width: '4px',
    borderRadius: '4px',
  },
})

const List = styled('div')({
  width: '376px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

const Item = styled('div')({})

const ButtonWrapper = styled('div')({
  marginLeft: '8px',
  marginTop: '24px',
})
