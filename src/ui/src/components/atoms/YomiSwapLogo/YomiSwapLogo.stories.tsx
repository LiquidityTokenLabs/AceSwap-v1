import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { YomiSwapLogo } from './YomiSwapLogo'

export default {
  title: 'Atoms/YomiSwapLogo',
  component: YomiSwapLogo,
} as ComponentMeta<typeof YomiSwapLogo>

const Template: ComponentStory<typeof YomiSwapLogo> = (args) => (
  <YomiSwapLogo {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  height: '32px',
  width: 'auto',
}
