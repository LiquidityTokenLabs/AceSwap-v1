import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { NetworkSelector } from './NetworkSelector'
import { getChainInfoById } from '@liqlab/utils/Config/ChainConfig'
import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'

export default {
  title: 'Organisms/NetworkSelector',
  component: NetworkSelector,
} as ComponentMeta<typeof NetworkSelector>

const IconWrapper = styled('div')({
  position: 'absolute',
  right: '200px',

  background: Color.white.primary,
  borderRadius: '16px',
  width: '50px',
  height: '50px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Template: ComponentStory<typeof NetworkSelector> = (args) => (
  <IconWrapper>
    <NetworkSelector {...args} />
  </IconWrapper>
)

export const Optimism = Template.bind({})
Optimism.args = {
  currentChainId: 420,
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
}
export const Goerli = Template.bind({})
Goerli.args = {
  currentChainId: 5,
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
}
export const NotSupport = Template.bind({})
NotSupport.args = {
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
}
