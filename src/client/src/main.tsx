import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router } from './Router'
import './index.css'
import { DAppProvider, Goerli } from '@usedapp/core'
import { TxProvider } from './context/transaction'

const config = {
  readOnlyChainId: 592,
  readOnlyUrls: {
    [592]:
      'https://eth-goerli.g.alchemy.com/v2/OYnMi37YD5FIQHqIFIrbftfKI2DCUwS_',
  },
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <TxProvider>
        <Router />
      </TxProvider>
    </DAppProvider>
  </React.StrictMode>
)
