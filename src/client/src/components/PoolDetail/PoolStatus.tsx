import styled from '@emotion/styled'
import { AstarLogo } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { FC } from 'react'

type Props = {
  id: string
  tokenName: string
  stakeFT: number
  stakeNFT: number
  reward: number
}

export const PoolStatus: FC<Props> = ({
  id,
  tokenName,
  stakeFT,
  stakeNFT,
  reward,
}) => {
  return (
    <CardContents>
      <CardHeader>Your stake status</CardHeader>
      <Wrapper>
        <Info>
          <Text>{stakeNFT}</Text>
          <TokenWrapper>
            <AstarLogo />
            <Name>{tokenName}</Name>
          </TokenWrapper>
        </Info>
      </Wrapper>
    </CardContents>
  )
}

const CardHeader = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
  paddingBottom: '15px',
})

const CardContents = styled('div')({
  width: '380px',
})

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
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

const Text = styled('div')({
  fontSize: '32px',
  fontWeight: 600,
})
const Name = styled('div')({
  fontSize: '20px',
  fontWeight: 600,
})

const TokenWrapper = styled('div')({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  width: '120px',
})
