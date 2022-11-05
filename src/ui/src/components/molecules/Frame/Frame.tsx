import styled from '@emotion/styled'
import { FC } from 'react'
import { Color } from '@liqlab/utils/Color'
import { Logo } from '../../atoms'
import { getBase64Src } from '@liqlab/utils/Config/TokenConfig'

type Props = {
  price?: number
  src: string
  collection: string
  name: string
  isActive: boolean
  chainId: number
}

export const Frame: FC<Props> = ({
  price = -Infinity,
  src,
  collection,
  name,
  isActive,
  chainId,
}) => {
  return (
    <Root isActive={isActive}>
      <Contents>
        <NftImage>
          <Img src="/aceswap-girl.png" />
        </NftImage>
        <Collection>{collection}</Collection>
        <Name>{name}</Name>
        <Wrapper>
          {price !== -Infinity && (
            <IconWrapper>
              <Logo image={getBase64Src(String(chainId))} />
            </IconWrapper>
          )}
          {price !== -Infinity && <Text>{price.toFixed(3)}</Text>}
        </Wrapper>
      </Contents>
    </Root>
  )
}

const Wrapper = styled('div')({
  marginTop: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

const Text = styled('span')({
  fontSize: '16px',
  lineHeight: '19px',
})

const Contents = styled('div')({
  marginTop: '6px',
  marginRight: '6px',
  marginLeft: '6px',
})

const NftImage = styled('div')({
  width: '108px',
  height: '108px',
  borderRadius: '16px',
})

const Img = styled('img')({
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  objectFit: 'contain',
})

const IconWrapper = styled('div')({
  width: '20px',
  height: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Root = styled('div')((p: { isActive: boolean }) => ({
  background: Color.white.primary,
  cursor: 'pointer',
  width: '120px',
  height: '188px',
  border: `2px solid ${
    p.isActive ? Color.themes.primary.default : Color.white.primary
  }`,
  borderRadius: '16px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  ':hover': {
    border: `2px solid ${
      p.isActive ? Color.themes.primary.default : Color.black.secondary
    }`,
  },
}))

const Collection = styled('div')({
  fontSize: '8px',
  marginTop: '8px',
})
const Name = styled('div')({
  fontSize: '12px',
})
