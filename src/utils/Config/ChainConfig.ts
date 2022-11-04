export type ChainInfo = {
  id: number
  name: string
  network: string
  icon: string
  rpcUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

const GOERLI_INFO: ChainInfo = {
  id: 5,
  name: 'goerli',
  network: 'Goerli Test Network',
  icon: '/icons/ethereum.png',
  rpcUrl: 'https://goerli.infura.io/v3/b6bd2687441744b09692911a87f48cb3',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
}
const OPTIMISM_GOERLI_INFO: ChainInfo = {
  id: 420,
  name: 'optimism',
  network: 'Optimism Goerli',
  icon: '/icons/optimism.png',
  rpcUrl: 'https://goerli.optimism.io/',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
}

const SUPPORTED_CHAINS_DEV = [GOERLI_INFO, OPTIMISM_GOERLI_INFO]
const SUPPORTED_CHAINS_ID_DEV = SUPPORTED_CHAINS_DEV.map((c) => c.id)

export const SUPPORTED_CHAINS_ID = SUPPORTED_CHAINS_ID_DEV
export const SUPPORTED_CHAINS = SUPPORTED_CHAINS_DEV

export const getChainInfoById = (id: number): ChainInfo => {
  return SUPPORTED_CHAINS.filter((chain) => chain.id === id)[0]
}
