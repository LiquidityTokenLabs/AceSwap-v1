import styled from '@emotion/styled'
import { FC } from 'react'

type Props = {
  image: string
  size?: number
}

export const Logo: FC<Props> = ({ image, size = 20 }) => {
  const scale = size / 20
  return (
    <SVG
      scale={`${scale}`}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none">
      <circle cx="10" cy="10" r="10" fill="url(#sid1)" />
      <defs>
        <pattern
          id="sid1"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1">
          <use href="#sid2" transform="scale(0.0078125)" />
        </pattern>
        <image id="sid2" width="128" height="128" href={image} />
      </defs>
    </SVG>
  )
}

const SVG = styled('svg')((p: { scale: string }) => ({
  transform: `scale(${p.scale})`,
}))
