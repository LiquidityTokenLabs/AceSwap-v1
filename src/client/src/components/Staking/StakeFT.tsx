import styled from '@emotion/styled'
import { FixedButton, Logo } from '@liqlab/ui'
import { Color } from '@liqlab/utils/Color'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { round } from '@liqlab/utils/Format'
import { useEthers } from '@usedapp/core'
import { FC, useEffect, useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { poolContract } from '../../hook'

type Props = {
  stakePrice: number
  delta: number
  staking: (num: number) => void
  pool: Pool | undefined
}

export const StakeFT: FC<Props> = ({ stakePrice, delta, staking, pool }) => {
  const [count, setCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const { account } = useEthers()

  const increment = () => {
    setCount((prev) => prev + 1)
  }
  const decrement = () => {
    if (count === 0) return
    setCount((prev) => prev - 1)
  }

  useEffect(() => {
    const f = async () => {
      if (!pool) return
      const x = await poolContract.stakeFTprice()
      const y = pool?.deltaNum
      const total = count * (Number(x) - y) - (count * (count - 1) * y) / 2
      setTotalPrice(total)
    }
    if (account) {
      f()
    }
  }, [account, count])

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
