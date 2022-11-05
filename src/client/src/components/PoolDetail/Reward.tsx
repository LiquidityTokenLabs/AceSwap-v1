import styled from '@emotion/styled'
import { Logo } from '@liqlab/ui'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { FC } from 'react'

type Props = {
  reward: number
}

export const Reward: FC<Props> = ({ reward }) => {
  const chainId = '592'

  return (
    <Root>
      <Title>未請求の報酬</Title>
      <PriceWrapper>
        <Logo image={getBase64Src(chainId)} size={30} />
        <Price>{reward.toFixed(5)}</Price>
      </PriceWrapper>
    </Root>
  )
}

const Root = styled('div')({
  width: '380px',
})

const Title = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '32px',
})

const PriceWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Price = styled('div')({
  fontSize: '32px',
  fontWeight: 600,
})
