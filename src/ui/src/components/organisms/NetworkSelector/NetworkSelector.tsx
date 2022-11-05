import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'
import { FC } from 'react'

import { ChainInfo, getChainInfoById } from '@liqlab/utils/Config/ChainConfig'
import { FaAngleDown } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'

import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'
import { convertDec2Hex } from '@liqlab/utils/Format'
import { Logo } from '../../atoms'

export type Chain = {
  info: ChainInfo
  action: () => void
}

type Props = {
  currentChainId: number
  chains: Chain[]
}

export const NetworkSelector: FC<Props> = ({ currentChainId, chains }) => {
  const changeChain = async (id: number) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: convertDec2Hex(id),
          },
        ],
      })
    } catch (Exeption) {
      try {
        const networkInfo = getChainInfoById(id)
        const params = {
          chainId: convertDec2Hex(id),
          chainName: networkInfo.network,
          nativeCurrency: networkInfo.nativeCurrency,
          rpcUrls: [networkInfo.rpcUrl],
        }
        // console.log({ params })
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })
      } catch (Exeption) {}
    } finally {
      window.location.reload() // TODO
    }
  }

  if (currentChainId == 592) {
    return (
      <Root>
        <CurrentChain>
          <NetworkWrapper>
            <Logo image={getBase64Src(`${currentChainId}`)} />
            <Text>ASTAR</Text>
          </NetworkWrapper>
        </CurrentChain>
      </Root>
    )
  } else {
    return (
      <Root>
        <SwitchNetwork onClick={() => changeChain(592)}>
          <IoWarningOutline />
          <Text>Switch Network</Text>
          <FaAngleDown />
        </SwitchNetwork>
      </Root>
    )
  }
}

const SwitchNetwork = styled('div')({
  background: Color.status.error,
  color: Color.white.pure,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '200px',
  height: '50px',
  padding: '8px 16px',
  borderRadius: '160px',
})

const CurrentChain = styled('div')({
  background: Color.white.pure,
  color: Color.black.primary,
  padding: '8px 16px',
  borderRadius: '160px',
  boxSizing: 'border-box',
  border: `1px solid ${Color.themes.primary.default}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '180px',
  height: '50px',
  cursor: 'pointer',
})

const NetworkWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const Img = styled('div')({
  width: '20px',
  height: '20px',
  background: Color.black.secondary,
  borderRadius: '10px',
})

const Text = styled('div')({
  fontSize: '16px',
  minWidth: '100px',
})

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  height: '50px',

  ':hover': {
    height: '150px',
  },
})
