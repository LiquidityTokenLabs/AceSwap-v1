import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ModeSelector } from './ModeSelector'

export default {
  title: 'Molecules/ModeSelector',
  component: ModeSelector,
} as ComponentMeta<typeof ModeSelector>

const Template: ComponentStory<typeof ModeSelector> = (args) => (
  <ModeSelector {...args} />
)

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
}
