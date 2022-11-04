import { FC, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { Layout } from './Layout'
import { MobileLayout } from './MobileLayout'

const BuyPage = lazy(() => import('./page/Buy'))
const SellPage = lazy(() => import('./page/Sell'))
const PoolPage = lazy(() => import('./page/Pool'))
const PoolDetailPage = lazy(() => import('./page/Pool/Detail'))
const PoolStakingPage = lazy(() => import('./page/Pool/Detail/Staking'))
const PoolSelectPage = lazy(() => import('./page/Pool/Select'))

const MobileBuyPage = lazy(() => import('./mobile/page/Buy'))

export const Router: FC = () => {
  const { width } = useWindowSize()

  if (width < 1024) {
    // Mobile
    return (
      <Suspense>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MobileLayout />}>
              <Route index element={<MobileBuyPage />} />
              <Route path="/buy" element={<MobileBuyPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    )
  }

  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BuyPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/pool" element={<PoolPage />} />
            <Route path="/pool/:id" element={<PoolDetailPage />} />
            <Route path="/pool/select" element={<PoolSelectPage />} />
            <Route path="/pool/:id/staking" element={<PoolStakingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}
