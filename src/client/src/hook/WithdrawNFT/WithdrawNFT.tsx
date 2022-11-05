import { useContractFunction } from '@usedapp/core'
import { routerContract } from '..'

export const useWithdrawNFT = () => {
  const { state, send } = useContractFunction(routerContract, 'withdrawNFT', {
    transactionName: 'WithdrawNFT',
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
