import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'
import { FC, useEffect, useState } from 'react'
import { poolContract } from '../../hook'

type Props = {
  curveType: string
  spotPrice: number
  delta: number
  spread: number
}

export const PoolSetting: FC<Props> = ({
  curveType,
  spotPrice,
  delta,
  spread,
}) => {
  const [buyNum, setBuyNum] = useState('0')
  const [sellNum, setSellNum] = useState('0')

  useEffect(() => {
    const f = async () => {
      const poolInfo = await poolContract.getPoolInfo()
      const buy = poolInfo.buyNum
      const sell = poolInfo.sellNum
      setBuyNum(String(buy))
      setSellNum(String(sell))
    }
    f()
  }, [])
  return (
    <CardContents>
      <CardHeader>Pool Setting</CardHeader>
      <Wrapper>
        <SettingInfo>
          <Text isLabel>Bonding Curve</Text>
          <Text isLabel={false}>{curveType}</Text>
        </SettingInfo>
        <SettingInfo>
          <Text isLabel>Spot Price</Text>
          <Text isLabel={false}>{spotPrice}</Text>
        </SettingInfo>
        <SettingInfo>
          <Text isLabel>Volatility</Text>
          <Text isLabel={false}>{delta}</Text>
        </SettingInfo>
        <SettingInfo>
          <Text isLabel>Spread</Text>
          <Text isLabel={false}>{spread}</Text>
        </SettingInfo>
        <SettingInfo>
          <Text isLabel>BuyNum</Text>
          <Text isLabel={false}>{buyNum}</Text>
        </SettingInfo>
        <SettingInfo>
          <Text isLabel>SellNum</Text>
          <Text isLabel={false}>{sellNum}</Text>
        </SettingInfo>
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
  justifyContent: 'space-between',
  gap: '13px',

  flexWrap: 'wrap',
})

const SettingInfo = styled('div')({
  background: Color.white.primary,
  width: '183px',
  height: '75px',
  padding: '20px 16px',

  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  borderRadius: '12px',
})

const Text = styled('div')((p: { isLabel: boolean }) => ({
  fontSize: p.isLabel ? '10px' : '16px',
  fontWeight: p.isLabel ? 400 : 600,
}))
