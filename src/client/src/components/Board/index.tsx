import styled from '@emotion/styled'
import { Card, PrimaryButton } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useEffect, useState } from 'react'
import { NftWrapper } from '../NftWrapper'

type Props = {
  items: Nft[]
  poolInfo: Pool
  submit: (selectedNfts: Nft[]) => void
  operation: 'BUY' | 'SELL'
}

type PreviewNft = {
  info: Nft
  isActive: boolean
}

export const Board: FC<Props> = ({ items, poolInfo, submit, operation }) => {
  const [nfts, setNfts] = useState<PreviewNft[]>([])

  const [anchorPrice, setAnchorPrice] = useState(0)

  const selectedNfts = nfts.filter((nft) => nft.isActive)

  const operationText = operation === 'BUY' ? 'Buy' : 'Sell'

  const totalPrice = (() => {
    const n = selectedNfts.length
    const x = poolInfo.spotPrice
    const y = poolInfo.deltaNum
    const totalBuyFee = n * x + (n * (n - 1) * y) / 2
    const totalSellFee = n * (x - y) - (n * (n - 1) * y) / 2
    return operation === 'BUY'
      ? totalBuyFee
      : totalSellFee * (1 - Number(poolInfo.spread))
  })()

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
    <Card padding="26px">
      <Root>
        <Header>
          <Title>{operationText}</Title>
        </Header>
        <Content>
          {nfts.map((nft, i) => {
            return (
              <Item key={nft.info.id} onClick={() => select(i)}>
                <NftWrapper
                  src={nft.info.src}
                  collection={nft.info.collectionName}
                  name={nft.info.name}
                  isActive={nft.isActive}
                  chainId={5}
                  price={nft.info.price}
                  selectedCount={selectedNfts.length}
                  setAnchorPrice={setAnchorPrice}
                  anchorPrice={anchorPrice}
                  delta={poolInfo.deltaNum}
                  operation={operation}
                />
              </Item>
            )
          })}
        </Content>
        <Footer>
          <TotalPrice>Total Fee {totalPrice.toFixed(3)} ASTR</TotalPrice>
          <PrimaryButton
            label={operationText}
            clickHandler={() => submit(selectedNfts.map((nft) => nft.info))}
          />
        </Footer>
      </Root>
    </Card>
  )
}

const Root = styled('div')({
  width: '818px', // 870 - 52
  height: '498px', // 550 - 52
})

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  height: '50px',
})

const Footer = styled('div')({
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
})

const TotalPrice = styled('div')({
  fontSize: '16px',
  color: Color.text.secondary,
})

const Title = styled('div')({
  fontSize: '24px',
  color: Color.black.primary,
})

const Content = styled('div')({
  display: 'flex',
  gap: '18px',
  height: '370px',
  overflowY: 'scroll',
  flexWrap: 'wrap',
  '::-webkit-scrollbar-track': {
    background: Color.white.primary,
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

const Item = styled('div')({})
