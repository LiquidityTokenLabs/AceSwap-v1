import styled from '@emotion/styled'
import Link from 'next/link'
import React, { FC, ReactNode, useState } from 'react'

import { Color } from '@liqlab/utils/Color'
import { FaEllipsisH } from 'react-icons/fa'

export type MenuItem = {
  label: string
  available: boolean
  type: 'BUTTON' | 'LINK'
  linkInfo?: {
    href: string
    locale?: string
    isOutside?: boolean
  }
  action?: () => void
}

type Props = {
  menuItems: MenuItem[]
}

export const Menu: FC<Props> = ({ menuItems }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const openMenu = () => {
    setIsOpenMenu(true)
  }
  const closeMenu = () => {
    setIsOpenMenu(false)
  }

  const getContent = () => {
    if (!isOpenMenu) {
      return <></>
    }

    return (
      <MenuWrapper>
        {menuItems.map((item) => {
          return (
            <Item key={item.label} onClick={item.action}>
              {item.label}
            </Item>
          )
        })}
      </MenuWrapper>
    )
  }

  return (
    <Root onMouseOver={openMenu} onMouseLeave={closeMenu}>
      <IconWrapper>
        <FaEllipsisH size="20px" color={Color.themes.primary.default} />
      </IconWrapper>
      {getContent()}
    </Root>
  )
}

const IconWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  background: Color.white.pure,
  padding: '8px',
  boxSizing: 'border-box',
  border: `1px solid ${Color.themes.primary.default}`,
  borderRadius: '160px',

  cursor: 'pointer',
})

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  height: '50px',
  width: '50px',

  ':hover': {
    height: '150px',
  },
})

const MenuWrapper = styled('div')({
  position: 'absolute',
  top: '70px',
  right: '0px',
  background: Color.white.pure,
  boxSizing: 'border-box',
  border: `1px solid ${Color.themes.primary.default}`,
  borderRadius: '16px',
  width: '180px',
  padding: '8px',
})

const Item = styled('div')({
  padding: '4px 8px',
  cursor: 'pointer',
  borderRadius: '8px',
  ':hover': {
    background: Color.white.seccondary,
  },
})
