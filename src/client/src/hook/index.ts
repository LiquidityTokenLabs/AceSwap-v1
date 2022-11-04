import { GoerliConfig } from '@liqlab/utils/Config/ContractConfig'
import { Contract, ethers, utils } from 'ethers'
// import ROUTER_ABI from '@liqlab/contracts/artifacts/contracts/Router.sol/Router.json'
import ROUTER_ABI from '../../../contracts/artifacts/contracts/Router.sol/Router.json'
import POOL721_ABI from '@liqlab/contracts/artifacts/contracts/pool/SingleNativeOPool.sol/SingleNativeOPool.json'
import { Router } from '../../contracts/Router.sol'
import { Pool721 } from '../../contracts/Pool721.sol'

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
