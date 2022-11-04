import React, { FC } from 'react'
import styled from '@emotion/styled'

type Props = {
  label: string
  styles: string[]

  clickHandler: () => void

  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const Button: FC<Props> = ({
  label,
  styles,
  clickHandler,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Root
      onClick={clickHandler}
      className={styles.join(' ')}
      {...{ onMouseEnter, onMouseLeave }}>
      {label}
    </Root>
  )
}

const Root = styled('button')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
