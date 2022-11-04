---
to: src/components/<%= atomic %>/<%= h.changeCase.pascal(component_name) %>/<%= h.changeCase.pascal(component_name) %>.tsx
---

import React, { FC } from 'react'

type Props = {

}

export const <%= h.changeCase.pascal(component_name) %>: FC<Props> = ({}) => {
  return (
    <></>
  )
}