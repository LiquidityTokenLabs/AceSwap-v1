// import { Card } from '@liqlab/ui'
import { getChainInfoById } from '@liqlab/utils/Config/ChainConfig'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const info = getChainInfoById(5)
  // console.log({ info })
  return (
    <div>
      <h1>aaa</h1>
      {/* <Card padding="8px">
        <div>aaa</div>
      </Card> */}
    </div>
  )
}

export default Home
