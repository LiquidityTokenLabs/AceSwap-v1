import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'
import { FC } from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { toast } from 'react-toastify'
// import './toast.css'

type Props = {
  message: string
  linkMessage: string
  link: string
}

const Toast: FC<Props> = ({ message, linkMessage, link }) => {
  return (
    <Root>
      <Message>{message}</Message>
      <Transaction onClick={() => window.open(link, '_blank')}>
        {linkMessage}
      </Transaction>
    </Root>
  )
}

export const showTransactionToast = (
  message: string,
  link: string,
  type: 'success' | 'error'
) => {
  return toast.success(
    <Toast message={message} linkMessage="View Transaction" link={link} />,
    {
      icon: (
        <BsCheckCircle
          size="24px"
          color={type === 'success' ? Color.status.success : Color.status.error}
        />
      ),
      progressClassName: themeProgressColor,
    }
  )
}

const Root = styled('div')({
  marginLeft: '8px',
})

const Message = styled('div')({
  fontSize: '16px',
  color: Color.text.primary,
})

const Transaction = styled('div')({
  fontSize: '16px',
  color: Color.themes.primary.default,
})

const themeProgressColor = css({
  backgroundColor: Color.themes.primary.default,
})
