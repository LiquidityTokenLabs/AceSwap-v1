import { FC } from 'react'
import styled from '@emotion/styled'
import { Card, Chip, Logo, PrimaryButton } from '@liqlab/ui'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { Color } from '@liqlab/utils/Color'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { useNavigate } from 'react-router'

type Props = {
  pool: Pool
  movePage: (id: string) => void
}

export const PoolList: FC<Props> = ({ pool, movePage }) => {
  const navi = useNavigate()
  const src = getBase64Src(pool.id)

  // TODO プールのIDを使ってページ遷移
  // FIXME コンポーネントの外で定義
  const clickStaking = () => {
    navi('/pool/1234567890/staking')
  }
  return (
    <Root>
      <Header>
        <Title>Pool</Title>
        <PrimaryButton label="Staking" clickHandler={clickStaking} />
      </Header>
      <Card padding="8px">
        <ContentTitle>Pool (1)</ContentTitle>
        <PoolWrapper>
          <Item key={pool.id} onClick={() => movePage(pool.id)}>
            <Flexleft gap="8px">
              <Logo image={src} />
              <Text color={Color.text.primary} size="20px">
                {pool.name}
              </Text>
              <Chip label={'x3'} />
            </Flexleft>
            <Flexleft gap="20px">
              <Flexleft gap="0px">
                <Text color={Color.text.secondary} size="16px">
                  Bonding Curve:
                </Text>
                <Text color={Color.text.primary} size="16px">
                  {pool.curveType}
                </Text>
              </Flexleft>
              <Flexleft gap="0px">
                <Text color={Color.text.secondary} size="16px">
                  Delta:
                </Text>
                <Text color={Color.text.primary} size="16px">
                  {pool.delta}
                </Text>
              </Flexleft>
              <Flexleft gap="0px">
                <Text color={Color.text.secondary} size="16px">
                  Spread:
                </Text>
                <Text color={Color.text.primary} size="16px">
                  {pool.spread}
                </Text>
              </Flexleft>
            </Flexleft>
          </Item>
        </PoolWrapper>
      </Card>
    </Root>
  )
}

const Root = styled('div')({
  width: '854px',
  height: '100%',
})

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '36px',
  paddingBottom: '24px',
})

const Title = styled('div')({})

const Text = styled('div')((p: { color: string; size: string }) => ({
  fontSize: p.size,
  color: p.color,
}))

const ContentTitle = styled('div')({
  height: '36px',
  fontSize: '16px',
  marginLeft: '8px',

  display: 'flex',
  alignItems: 'center',
})

const Item = styled('div')({
  background: Color.white.primary,
  padding: '20px',
  gap: '10px',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
})

const Flexleft = styled('div')((p: { gap: string }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: p.gap,
}))

const PoolWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})
