import { DAppProvider } from '@usedapp/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TxProvider } from './context/transaction'
import './index.css'
import { Router } from './Router'

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
