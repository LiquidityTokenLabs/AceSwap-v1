import styled from '@emotion/styled'
import { Dispatch, FC, useEffect, useState } from 'react'
import { Frame } from '@liqlab/ui'
import { round } from '@liqlab/utils/Format'

type Props = {
  price: number
  src: string
  collection: string
  name: string
  isActive: boolean
  selectedCount: number
  anchorPrice: number
  setAnchorPrice: Dispatch<number>
  delta: number
  chainId: number
  operation: 'BUY' | 'SELL' | 'NOPRICE'
}

export const NftWrapper: FC<Props> = ({
  price,
  src,
  collection,
  name,
  isActive,
  selectedCount,
  anchorPrice,
  setAnchorPrice,
  delta,
  chainId,
  operation,
}) => {
  const [currentAmount, setCurrentAmount] = useState(0)
  const [prevSelectedCount, setPrevSelectedCount] = useState(0)
  const [prevIsActive, setPrevIsActive] = useState(false)

  const updateUp = round(price + prevSelectedCount * delta, 4)
  const updateDown = round(price - prevSelectedCount * delta, 4)
  const updatePrice = operation === 'BUY' ? updateUp : updateDown

  const downPrice = round(currentAmount - delta, 4)
  const upPrice = round(currentAmount + delta, 4)
  const selectChange = operation === 'BUY' ? upPrice : downPrice
  const unselectChange = operation === 'BUY' ? downPrice : upPrice

  const anchorCheck =
    operation === 'BUY'
      ? anchorPrice < currentAmount
      : anchorPrice > currentAmount

  useEffect(() => {
    setCurrentAmount(price)
    setPrevSelectedCount(selectedCount)
    setPrevIsActive(isActive)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (operation === 'NOPRICE') return

    if (prevSelectedCount === 0 && selectedCount === 0) return
    if (prevSelectedCount < selectedCount) {
      // 選択行動
      if (isActive) {
        // 選択済み
        if (prevIsActive) {
          // 以前から選択
        } else {
          // 新規で選択された
          const newCount = updatePrice
          setCurrentAmount(newCount)
        }
      } else {
        // 未選択　(以前も現在も未選択)
        const newAmount = selectChange
        setCurrentAmount(newAmount)
      }
    } else {
      // 解除行動
      if (isActive) {
        // 選択済み
        // 選択 (以前も今も選択済み)
        if (anchorCheck) {
          const newAmount = unselectChange
          setCurrentAmount(newAmount)
        }
      } else {
        // 未選択
        if (prevIsActive) {
          // 今解除した
          const newAmount =
            operation === 'BUY'
              ? round(updatePrice - delta, 4)
              : round(updatePrice + delta, 4)
          setCurrentAmount(newAmount)
        } else {
          // 以前から選択していない
          if (anchorCheck) {
            const newAmount = unselectChange
            setCurrentAmount(newAmount)
          }
        }
      }
    }
    setPrevIsActive(isActive)
    setPrevSelectedCount(selectedCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCount])

  const toggleSelect = () => {
    const isSelect = !isActive
    if (isSelect) {
    } else {
      setAnchorPrice(currentAmount)
    }
  }

  return (
    <Wrapper onClick={toggleSelect}>
      <Frame
        {...{ src, collection, name, isActive, chainId }}
        price={currentAmount}
      />
    </Wrapper>
  )
}

const Wrapper = styled('div')({})
