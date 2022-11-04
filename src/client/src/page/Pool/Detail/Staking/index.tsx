import { Card } from '@liqlab/ui'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC } from 'react'
import { useNavigate } from 'react-router'
import { Staking } from '../../../../components/Staking'

const Page: FC = () => {
  const navi = useNavigate()

  // TODO プールのIDがURLから取得できるので、それを使ってプールの情報を取得する
  const poolInfo: Pool = {
    id: '123456',
    name: 'CloneX',
    curveType: 'Linear',
    delta: '10%',
    spread: '80%',
    spotPrice: 0.1,
    deltaNum: 0.1,
    spreadNum: 0.8,
  }

  const pageBack = () => {
    navi('/pool')
  }

  return (
    <Card padding="26px">
      <Staking poolInfo={poolInfo} pageBack={pageBack} />
    </Card>
  )
}

export default Page
