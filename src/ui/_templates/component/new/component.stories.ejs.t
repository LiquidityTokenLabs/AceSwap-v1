---
to: "<%= require_storybook ? `src/components/${atomic}/${h.changeCase.pascal(component_name)}/${h.changeCase.pascal(component_name)}.stories.tsx` : null %>"
---

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { <%= h.changeCase.pascal(component_name) %> } from './<%= h.changeCase.pascal(component_name)%>';

export default {
  title: '<%= h.changeCase.pascal(atomic) %>/<%= h.changeCase.pascal(component_name) %>',
  component: <%= h.changeCase.pascal(component_name) %>,
} as ComponentMeta<typeof <%= h.changeCase.pascal(component_name) %>>;

const Template: ComponentStory<typeof <%= h.changeCase.pascal(component_name) %>> = (args) => <<%= h.changeCase.pascal(component_name) %> {...args} />;

export const Primary = Template.bind({});
Primary.args = {};