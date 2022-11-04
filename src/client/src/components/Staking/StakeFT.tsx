import styled from '@emotion/styled'
import { FixedButton, Logo } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { round } from '@liqlab/utils/Format'
import { FC, useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

type Props = {
  stakePrice: number
  delta: number
  staking: (num: number) => void
}

export const StakeFT: FC<Props> = ({ stakePrice, delta, staking }) => {
  const [count, setCount] = useState(0)

  const totalPrice = (() => {
    const res = count * stakePrice + ((count / 2) * (count + 1) - count) * delta
    return round(res, 4)
  })()

  const increment = () => {
    setCount((prev) => prev + 1)
  }
  const decrement = () => {
    if (count === 0) return
    setCount((prev) => prev - 1)
  }

  return (
    <Root>
      <Wrapper>
        <Label>ステーキング</Label>
        <Frame height="80px">
          <IconWrapper onClick={decrement} disabled={count === 0}>
            <AiOutlineMinus />
          </IconWrapper>
          <Text>{count}</Text>
          <IconWrapper onClick={increment} disabled={false}>
            <AiOutlinePlus />
          </IconWrapper>
        </Frame>
      </Wrapper>
      <Wrapper>
        <Label>Total</Label>
        <Frame height="56px">
          <Text>{totalPrice}</Text>
          <Chain>
            <Logo image={getBase64Src('1')} />
            <Text>ETH</Text>
          </Chain>
        </Frame>
      </Wrapper>
      <ButtonWrapper>
        <FixedButton
          label="Staking"
          clickHandler={() => staking(totalPrice)}
          width="384px"
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
  flexDirection: 'column',
  gap: '8px',
  margin: '8px',
})

const Label = styled('div')({
  fontSize: '12px',
  fontWeight: 600,
})

const Frame = styled('div')((p: { height: string }) => ({
  border: `1px solid ${Color.black.secondary}`,
  borderRadius: '16px',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: p.height,
  padding: '20px',
}))

const IconWrapper = styled('div')((p: { disabled: boolean }) => ({
  cursor: p.disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  color: p.disabled ? Color.status.disabled : Color.text.primary,
  background: Color.white.primary,
  width: '36px',
  height: '36px',
}))

const Text = styled('div')({
  fontSize: '24px',
  fontWeight: 600,
})

const Chain = styled('div')({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
})

const ButtonWrapper = styled('div')({
  marginLeft: '8px',
  marginTop: '24px',
})
