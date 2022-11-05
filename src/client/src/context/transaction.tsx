import { createContext, ReactNode, useContext, useState } from 'react'

type ContextType = {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const TxContext = createContext<ContextType>({
  isLoading: true,
  setIsLoading: () => {},
})
export const TxProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <TxContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}>
      {children}
    </TxContext.Provider>
  )
}

export const useTx = () => useContext(TxContext)
