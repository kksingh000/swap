import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import { Toaster } from './components/ui/Toast'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Browse from './pages/Browse'
import ItemDetail from './pages/ItemDetail'
import SwapRequest from './pages/SwapRequest'
import Chat from './pages/Chat'
import Dashboard from './pages/Dashboard'
import Showcase from './pages/Showcase'

// Admin carries Recharts — keep it out of the main bundle.
const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/swap/:id" element={<SwapRequest />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={
                    <div className="flex min-h-[60vh] items-center justify-center pt-16">
                      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                        Opening the back of house…
                      </span>
                    </div>
                  }
                >
                  <Admin />
                </Suspense>
              }
            />
            <Route path="/dev/components" element={<Showcase />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
      <Toaster />
    </div>
  )
}
