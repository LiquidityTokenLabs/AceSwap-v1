import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ConnectWallet } from './ConnectWallet'

export default {
  title: 'Organisms/ConnectWallet',
  component: ConnectWallet,
} as ComponentMeta<typeof ConnectWallet>

const Template: ComponentStory<typeof ConnectWallet> = (args) => (
  <ConnectWallet {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  text: 'ウォレットに接続',
}
export const Connected = Template.bind({})
Connected.args = {
  text: '0xa1eAE299cD29D472E24B17162919cB539Af24C46',
  status: 'CONNECTED',
}
