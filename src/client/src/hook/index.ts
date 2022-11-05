import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { Contract, ethers, utils } from 'ethers'
import ROUTER_ABI from '@liqlab/contracts/artifacts/contracts/Router.sol/Router.json'
import POOL721_ABI from '@liqlab/contracts/artifacts/contracts/pool/SingleNativeNOPool.sol/SingleNativeNOPool.json'
import SampleNFT_ABI from '@liqlab/contracts/artifacts/contracts/SampleNFT.sol/SampleNFT.json'
import { Router } from '../../contracts/Router.sol'
import { Pool721 } from '../../contracts/Pool721.sol'
import { SampleNFT } from '../../contracts/SampleNFT.sol'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contractConfig = GoerliConfig
const routerInterface = new utils.Interface(ROUTER_ABI.abi)
export const routerContract = new Contract(
  contractConfig.RouterAddress,
  routerInterface,
  signer
) as Router
export const poolContract = new ethers.Contract(
  contractConfig.Pool721Address,
  POOL721_ABI.abi,
  signer
) as Pool721
export const nftContract = new ethers.Contract(
  contractConfig.TokenAddress,
  SampleNFT_ABI.abi,
  signer
) as SampleNFT
export const NFT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
