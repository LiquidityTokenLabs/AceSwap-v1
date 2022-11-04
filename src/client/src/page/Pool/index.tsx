import styled from '@emotion/styled'
import { Pool } from '@liqlab/utils/Domain/Pool'
import { FC, useEffect, useState } from 'react'
import { EmptyPool } from '../../components/EmptyPool'
import { PoolList } from '../../components/PoolList'

import { useNavigate } from 'react-router'

const Page: FC = () => {
  const [pools, setPools] = useState<Pool[]>([])

  const navi = useNavigate()

  useEffect(() => {
    // TODO get pool list
    const newPools = [
      {
        id: '1234',
        name: 'CloneX',
        curveType: 'Linear',
        delta: '10%',
        spread: '10%',
        spotPrice: 0.1,
        deltaNum: 0.01,
        spreadNum: 0.8,
      },
      {
        id: '1235',
        name: 'CloneX',
        curveType: 'Linear',
        delta: '15%',
        spread: '15%',
        spotPrice: 0.1,
        deltaNum: 0.01,
        spreadNum: 0.8,
      },
      {
        id: '1236',
        name: 'CloneX',
        curveType: 'Linear',
        delta: '20%',
        spread: '20%',
        spotPrice: 0.1,
        deltaNum: 0.01,
        spreadNum: 0.8,
      },
    ]

    setPools(newPools)
  }, [])

  const movePage = (id: string) => {
    navi(id)
  }

  if (pools.length === 0) {
    return (
      <Root>
        <EmptyPool />
      </Root>
    )
  }

  return (
    <Root>
      <PoolList pools={pools} movePage={movePage} />
    </Root>
  )
}

export default Page

const Root = styled('div')({
  width: '870px',
  height: '272px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
