import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Frame } from './Frame'

export default {
  title: 'Molecules/Frame',
  component: Frame,
} as ComponentMeta<typeof Frame>

const Template: ComponentStory<typeof Frame> = (args) => <Frame {...args} />

export const Primary = Template.bind({})
Primary.args = {
  src: 'https://pbs.twimg.com/profile_images/1149529883233570816/fR4eJZoz_400x400.jpg',
  isActive: false,
  price: 0.12,
}
export const Active = Template.bind({})
Active.args = {
  src: 'https://pbs.twimg.com/profile_images/1149529883233570816/fR4eJZoz_400x400.jpg',
  isActive: true,
  price: 0.12,
}
