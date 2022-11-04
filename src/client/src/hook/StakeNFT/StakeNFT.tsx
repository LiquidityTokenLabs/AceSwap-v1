import { useContractFunction } from '@usedapp/core'
import { routerContract } from '..'

export const useStakeNFT = () => {
  const { state, send } = useContractFunction(routerContract, 'stakeNFT', {
    transactionName: 'StakeNFT',
  })
  const loading =
    state.status === 'PendingSignature' || state.status === 'Mining'
  const success = state.status === 'Success'
  const error = state.status === 'Fail' || state.status === 'Exception'
  const transactionHash = state.receipt?.transactionHash

  return {
    loading,
    success,
    error,
    transactionHash,
    send,
  }
}
