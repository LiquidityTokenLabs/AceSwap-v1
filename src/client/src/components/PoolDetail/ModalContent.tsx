import styled from '@emotion/styled'
import { AstarLogo, EthLogo, FixedButton } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { Nft } from '@liqlab/utils/Domain/Nft'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { useCallback, useEffect } from 'react'
import { FC, useState } from 'react'

import Modal from 'react-modal'
import { useWithdrawNFT } from '../../hook/WithdrawNFT'
import { NftWrapper } from '../NftWrapper'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '16px',
  },
  overlay: {
    zIndex: '100',
    background: 'rgba(0, 0, 0, 0.4)',
  },
}

type Props = {
  open: boolean
  closeModal: () => void
  stakingNfts: Nft[]
  pool: Pool
  tokenName: string
  stakeFT: number
  stakeNFT: number
  reward: number
}

type PreviewNft = {
  info: Nft
  isActive: boolean
}

export const ModalContent: FC<Props> = ({
  open,
  closeModal,
  stakingNfts,
  tokenName,
  stakeFT,
  stakeNFT,
  reward,
}) => {
  const contractConfig = GoerliConfig
  const chainId = 5
  const { send: WithdrawNFT, success, error, loading } = useWithdrawNFT()

  const [previewNfts, setPreviewNfts] = useState<PreviewNft[]>([])
  const selectedNfts = previewNfts.filter((nft) => nft.isActive)

  const submit = useCallback(
    async (selectedNfts: Nft[]) => {
      const ids = selectedNfts.map((nft) => nft.id)
      await WithdrawNFT(contractConfig.Pool721Address, ids)
    },
    [WithdrawNFT]
  )

  useEffect(() => {
    const newNfts = stakingNfts.map((n) => {
      return {
        info: n,
        isActive: false,
      }
    })
    setPreviewNfts(newNfts)
  }, [])

  const select = (num: number) => {
    const newNfts = previewNfts.map((nft, i) => {
      if (i === num) {
        nft.isActive = !nft.isActive
      }
      return nft
    })
    setPreviewNfts(newNfts)
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}>
      <Root>
        <Contents>
          <Title>引き出すNFTを選択</Title>
          <Wrapper>
            <List>
              {previewNfts.map((nft, i) => {
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
                      chainId={chainId}
                      operation="NOPRICE"
                    />
                  </Item>
                )
              })}
            </List>
          </Wrapper>
        </Contents>
        <Contents>
          <Title>引き出されるステーキング</Title>
          <StakeWrapper>
            <Info>
              <Text>{stakeNFT}</Text>
              <TokenWrapper>
                <AstarLogo />
                <TokenName>{tokenName}</TokenName>
              </TokenWrapper>
            </Info>
          </StakeWrapper>
          <Title>流動性報酬</Title>
          <StakeWrapper>
            <Info>
              <Text>{reward.toFixed(5)}</Text>
              <TokenWrapper>
                <AstarLogo />
                <TokenName>ASTR</TokenName>
              </TokenWrapper>
            </Info>
          </StakeWrapper>
          <FixedButton
            label="流動性を解除する"
            clickHandler={() => submit(selectedNfts.map((nft) => nft.info))}
            width="100%"
            height="64px"
          />
        </Contents>
      </Root>
    </Modal>
  )
}

const Root = styled('div')({
  width: '870px',
  height: '498px',
  borderRadius: '16px',
  display: 'flex',
  gap: '32px',
})

const StakeWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '24px',
})

const Text = styled('div')({
  fontSize: '32px',
  fontWeight: 600,
})

const Info = styled('div')({
  background: Color.white.primary,
  width: '380px',
  height: '75px',
  padding: '20px 26px',

  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '12px',
})

const TokenName = styled('div')({
  fontSize: '20px',
  fontWeight: 600,
})

const TokenWrapper = styled('div')({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  width: '120px',
})

const Contents = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '400px',
})

const Title = styled('div')({
  fontSize: '16px',
  color: Color.text.primary,
  marginLeft: '12px',
  marginBottom: '16px',
})

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',

  height: '392px',
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
  gap: '16px 8px',
})

const Item = styled('div')({})
