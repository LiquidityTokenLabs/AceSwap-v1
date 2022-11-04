import { useLogs } from '@usedapp/core'
import { useEffect, useMemo, useState } from 'react'
import { routerContract } from '..'

export type EmitItem = {
  user: string
  pool: string
  tokenIds: number
  totalFee: number
  supporter: string
}

export const useEmits = () => {
  const [account, setAccount] = useState()
  const logs = useLogs({
    contract: routerContract,
    event: 'SwapNFTforFT',
    args: [account],
  })

  useEffect(() => {
    const f = async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(accounts[0])
    }
    f()
  }, [])

  const emits = useMemo(() => {
    return (
      logs?.value?.map((log) => {
        const emit: EmitItem = {
          user: log.data.user,
          pool: log.data.pool,
          tokenIds: log.data.tokenIds,
          totalFee: log.data.totalFee,
          supporter: log.data.supporter,
        }
        return emit
      }) || []
    )
  }, [logs?.value])
  return { emits }
}
