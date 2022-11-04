import styled from '@emotion/styled'
import { Color } from '@liqlab/utils/Color'
import { History } from '@liqlab/utils/Domain/History'
import { getShortAddress } from '@liqlab/utils/Format'
import { FC } from 'react'

type Props = {
  histories: History[]
}

export const Histories: FC<Props> = ({ histories }) => {
  return (
    <Table>
      <TableHeader>
        <TableHeaderItem width="60px" isTop>
          EventId
        </TableHeaderItem>
        <TableHeaderItem width="100px">Event</TableHeaderItem>
        <TableHeaderItem width="110px">Address</TableHeaderItem>
        <TableHeaderItem width="70px">Token num</TableHeaderItem>
      </TableHeader>
      {histories.map((h, i) => {
        return (
          <TableRow
            key={h.id}
            color={i % 2 === 0 ? Color.white.primary : Color.white.pure}>
            <TableItem width="60px" isTop>
              {h.id}
            </TableItem>
            <TableItem width="100px">{h.type}</TableItem>
            <TableItem width="110px">{getShortAddress(h.address)}</TableItem>
            <TableItem width="70px">{h.tokenIds.length}item</TableItem>
          </TableRow>
        )
      })}
    </Table>
  )
}

const Table = styled('div')({
  height: '430px',

  overflowY: 'scroll',
  '::-webkit-scrollbar-track': {
    background: Color.white.pure,
  },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    background: Color.black.secondary,
  },
  '::-webkit-scrollbar': {
    width: '4px',
    borderRadius: '4px',
  },
})

const TableHeader = styled('div')({
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
})
const TableRow = styled('div')((p: { color: string }) => ({
  display: 'flex',
  gap: '8px',
  background: p.color,
  padding: '8px 0px',
}))
const TableHeaderItem = styled('div')(
  (p: { width: string; isTop?: boolean }) => ({
    width: p.width,
    fontSize: '10px',
    fontWeight: 600,
    paddingLeft: p.isTop ? '8px' : '0px',
  })
)
const TableItem = styled('div')((p: { width: string; isTop?: boolean }) => ({
  width: p.width,
  fontSize: '14px',
  fontWeight: 400,
  paddingLeft: p.isTop ? '8px' : '0px',
}))
