import styled from '@emotion/styled'
import React, { FC, useState } from 'react'
import { Color } from '@liqlab/utils/Color'

import { FaAngleDown } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'
import {
  ChainInfo,
  getChainInfoById,
  SUPPORTED_CHAINS_ID,
} from '@liqlab/utils/Config/ChainConfig'

import { MdExpandMore } from 'react-icons/md'
import { Logo } from '../../atoms'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'

export type Chain = {
  info: ChainInfo
  action: () => void
}

type Props = {
  currentChainId: number
  chains: Chain[]
}

export const NetworkSelector: FC<Props> = ({ currentChainId, chains }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }

  const getContent = () => {
    if (!isOpen) {
      return <></>
    }

    return (
      <MenuWrapper>
        {chains.map((item) => {
          // console.log('id', item.info.id)
          return (
            <Item key={item.info.id}>
              <NetworkWrapper onClick={item.action}>
                <Logo image={getBase64Src(`${item.info.id}`)} />
                <Text>{item.info.name}</Text>
              </NetworkWrapper>
            </Item>
          )
        })}
      </MenuWrapper>
    )
  }

  if (!SUPPORTED_CHAINS_ID.includes(currentChainId)) {
    return (
      <Root onMouseOver={openMenu} onMouseLeave={closeMenu}>
        <SwitchNetwork>
          <IoWarningOutline />
          <Text>Switch Network</Text>
          <FaAngleDown />
        </SwitchNetwork>
        {getContent()}
      </Root>
    )
  }

  const chainInfo = getChainInfoById(currentChainId)

  return (
    <Root onMouseOver={openMenu} onMouseLeave={closeMenu}>
      <CurrentChain>
        <NetworkWrapper>
          <Logo image={getBase64Src(`${currentChainId}`)} />
          <Text>{chainInfo.name}</Text>
        </NetworkWrapper>
        <MdExpandMore />
      </CurrentChain>
      {getContent()}
    </Root>
  )
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

const MenuWrapper = styled('div')({
  position: 'absolute',
  top: '70px',
  background: Color.white.pure,
  borderRadius: '16px',
  boxSizing: 'border-box',
  border: `1px solid ${Color.themes.primary.default}`,
  width: '184px',
  padding: '8px 16px',
})

const Item = styled('div')({
  padding: '8px',
  cursor: 'pointer',
  borderRadius: '8px',
  ':hover': {
    background: Color.white.seccondary,
  },
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
