import styled from '@emotion/styled'
import { FC, useEffect } from 'react'
import { MoralisProvider } from 'react-moralis'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import { BlueCloud } from './svg/BlueCloud'
import { PinkCloud } from './svg/PinkCloud'
import { WhiteCloud } from './svg/WhiteCloud'
import { YellowCloud } from './svg/YellowCloud'

export const Layout: FC = () => {
  const serverUrl = (import.meta.env.VITE_PUBLIC_SERVER_URL || '') as string
  const appId = (import.meta.env.VITE_PUBLIC_APP_ID || '') as string

  // console.log({ appId })
  return (
    <Root>
      <MoralisProvider serverUrl={serverUrl} appId={appId}>
        <Header />
        <Content>
          <Outlet />
        </Content>
      </MoralisProvider>
      <StyledToastContainer />
    </Root>
  )
}

const StyledToastContainer = styled(ToastContainer)({
  '.Toastify__toast': {
    borderRadius: '16px',
  },
})

const CloudWrapper = styled('div')({
  position: 'absolute',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  zIndex: -1,
  background: 'linear-gradient(269.82deg, #D2BAEE 0.04%, #A8C1F3 99.74%)',
  overflow: 'hidden',
})

const Root = styled('div')({
  width: '100%',
  height: '100%',
})
const Content = styled('div')({
  width: '100%',

  position: 'absolute',
  top: '100px',
  margin: '36px 0px',

  display: 'flex',
  justifyContent: 'center',
})
