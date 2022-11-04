import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { FaBook, FaEllipsisH } from 'react-icons/fa'

import { Header } from './Header'
import { getChainInfoById } from '@liqlab/utils/Config/ChainConfig'

export default {
  title: 'Organisms/Header',
  component: Header,
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />

export const Primary = Template.bind({})
Primary.args = {
  modes: [
    {
      label: 'Buy',
      isActive: false,
      action: () => '',
    },
    {
      label: 'Sell',
      isActive: true,
      action: () => '',
    },
    {
      label: 'Pool',
      isActive: false,
      action: () => '',
    },
  ],
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
  currentChainId: 0,
  chains: [
    {
      info: getChainInfoById(5),
      action: () => console.log('goerli'),
    },
    {
      info: getChainInfoById(420),
      action: () => console.log('optimism'),
    },
  ],
  connectStatus: {
    address: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
    status: 'CONNECTED',
    connection: () => console.log('connect'),
  },
}
