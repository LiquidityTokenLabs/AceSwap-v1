import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { Contract, ethers, utils } from 'ethers'
import ROUTER_ABI from '../../contracts/Router.sol/Router.json'
import POOL721_ABI from '../../contracts/Pool721.sol/Pool721.json'
import NFT_ABI from '../../contracts/SampleNFT.sol/SampleNFT.json'
import { Router } from '../../contracts/Router.sol'
import { Pool721 } from '../../contracts/Pool721.sol'
import { SampleNFT } from '../../contracts/SampleNFT.sol'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contractConfig = GoerliConfig
const routerInterface = new utils.Interface(ROUTER_ABI.abi)
const poolInterface = new utils.Interface(POOL721_ABI.abi)
const nftInterface = new utils.Interface(NFT_ABI.abi)
export const routerContract = new Contract(
  contractConfig.RouterAddress,
  routerInterface,
  signer
) as Router
export const poolContract = new ethers.Contract(
  contractConfig.Pool721Address,
  poolInterface,
  signer
) as Pool721
export const nftContract = new ethers.Contract(
  contractConfig.TokenAddress,
  nftInterface,
  signer
) as SampleNFT
