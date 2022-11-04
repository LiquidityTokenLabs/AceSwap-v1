import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { EthLogo } from './AstarLogo'

export default {
  title: 'Atoms/AstarLogo',
  component: EthLogo,
} as ComponentMeta<typeof EthLogo>

const Template: ComponentStory<typeof EthLogo> = (args) => <EthLogo {...args} />

export const Primary = Template.bind({})
Primary.args = {}
