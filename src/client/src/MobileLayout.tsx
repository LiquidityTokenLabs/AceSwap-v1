import { FC } from 'react'
import { Outlet } from 'react-router'
import { MobileHeader } from './mobile/components/MobileHeader'

export const MobileLayout: FC = () => {
  return (
    <div>
      <MobileHeader />
      <Outlet />
    </div>
  )
}
