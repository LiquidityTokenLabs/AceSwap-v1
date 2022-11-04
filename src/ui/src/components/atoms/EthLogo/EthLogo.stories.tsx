import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EthLogo } from './EthLogo';

export default {
  title: 'Atoms/EthLogo',
  component: EthLogo,
} as ComponentMeta<typeof EthLogo>;

const Template: ComponentStory<typeof EthLogo> = (args) => <EthLogo {...args} />;

export const Primary = Template.bind({});
Primary.args = {};