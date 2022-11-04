import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'
import { FC } from 'react'
import { Hoge } from '../components/Hoge'

const Page: FC = () => {
  return (
    <Root>
      Mobile Buy Page <Hoge />
    </Root>
  )
}

export default Page

const Root = styled('div')({
  background: Color.white.primary,
})
