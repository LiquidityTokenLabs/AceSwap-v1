import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FaBook, FaEllipsisH } from 'react-icons/fa'

import { Menu } from './Menu'
import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'

export default {
  title: 'Organisms/Menu',
  component: Menu,
} as ComponentMeta<typeof Menu>

const IconWrapper = styled('div')({
  position: 'absolute',
  right: '200px',

  background: Color.white.primary,
  borderRadius: '16px',
  width: '50px',
  height: '50px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Template: ComponentStory<typeof Menu> = (args) => (
  <IconWrapper>
    <Menu {...args} />
  </IconWrapper>
)

export const Primary = Template.bind({})
Primary.args = {
  icon: <FaEllipsisH size="20px" />,
  menuItems: [
    {
      label: 'Menu1',
      available: true,
      type: 'LINK',
      icon: FaBook,
      linkInfo: {
        href: '',
        locale: '',
        isOutside: true,
      },
      action: () => console.log('menu1'),
    },
    {
      label: 'Menu2',
      available: true,
      type: 'LINK',
      icon: FaBook,
      linkInfo: {
        href: '',
        locale: '',
        isOutside: true,
      },
      action: () => console.log('menu2'),
    },
    {
      label: 'Menu3',
      available: true,
      type: 'LINK',
      icon: FaBook,
      linkInfo: {
        href: '',
        locale: '',
        isOutside: true,
      },
      action: () => console.log('menu3'),
    },
  ],
}
