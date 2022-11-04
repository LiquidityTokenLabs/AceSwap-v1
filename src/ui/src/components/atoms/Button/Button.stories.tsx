import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { PrimaryButton } from './'

export default {
  title: 'Atoms/PrimaryButton',
  component: PrimaryButton,
} as ComponentMeta<typeof PrimaryButton>

const Template: ComponentStory<typeof PrimaryButton> = (args) => (
  <PrimaryButton {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  label: 'Buy',
}
