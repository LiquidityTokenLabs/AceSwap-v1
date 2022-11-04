import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Chip } from './Chip'

export default {
  title: 'Atoms/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'x10',
}
