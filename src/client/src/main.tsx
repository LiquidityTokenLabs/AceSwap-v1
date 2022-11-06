import { Config, DAppProvider } from '@usedapp/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TxProvider } from './context/transaction'
import './index.css'
import { Router } from './Router'

const config: Config = {
  readOnlyChainId: 592,
  readOnlyUrls: {
    [592]:
      'https://astar-mainnet.g.alchemy.com/v2/veOk1L93_b9BdS79Nne9zFho1fzIHnGr',
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
