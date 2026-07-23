import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/authStore'
import { departments } from '../../data/seed'
import Button from '../ui/Button'
import NotificationBell from './NotificationBell'

const LINKS = [
  { to: '/browse', label: 'Browse' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/chat', label: 'Chat' },
]

function NavItem({ to, label, onClick, mobile = false }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group relative font-medium transition-colors duration-200',
          mobile ? 'font-display text-3xl' : 'text-eyebrow',
          isActive ? 'text-ivory' : 'text-gray-mid hover:text-ivory',
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {/* red underline grows from center on hover / stays on active */}
          <span
            className={cn(
              'absolute -bottom-1.5 left-1/2 h-px -translate-x-1/2 bg-red-light transition-all duration-300',
              isActive ? 'w-full' : 'w-0 group-hover:w-full',
            )}
          />
        </>
      )}
    </NavLink>
  )
}

// Desktop "Shop" dropdown — the department entry points.
function ShopMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-eyebrow group inline-flex items-center gap-1 font-medium text-gray-mid transition-colors duration-200 hover:text-ivory"
      >
        Shop
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-charcoal p-2 shadow-material-lg"
          >
            {departments.map((d) => (
              <Link
                key={d.name}
                to={`/browse?department=${encodeURIComponent(d.name)}`}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-white/5"
              >
                <span>
                  <span className="block font-display text-lg text-ivory">{d.name}</span>
                  <span className="block text-xs text-gray-mid">{d.count} pieces on the rack</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid transition-colors duration-150 group-hover:text-red-light">
                  View
                </span>
              </Link>
            ))}
            <Link
              to="/browse"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl border-t border-gray-line/50 px-3 py-2.5 text-eyebrow font-medium text-red-light transition-colors duration-150 hover:bg-white/5"
            >
              All listings →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const user = useAuthStore((s) => s.user)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl italic text-ivory" onClick={() => setOpen(false)}>
          Swap<span className="not-italic text-red-light">.</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <ShopMenu />
          {LINKS.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <NotificationBell />
          <div className="hidden md:block">
            <Button to={user ? '/dashboard' : '/auth'} size="sm" magnetic>
              {user ? 'My atelier' : 'Join the exchange'}
            </Button>
          </div>

          <button
            className="rounded-full p-2 text-ivory transition-colors duration-200 hover:bg-white/5 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer — full-screen slide-in on black */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grain flex h-[calc(100vh-4rem)] flex-col justify-between overflow-y-auto border-t border-white/10 bg-black-deep px-6 py-10 md:hidden"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {departments.map((d) => (
                  <Link
                    key={d.name}
                    to={`/browse?department=${encodeURIComponent(d.name)}`}
                    onClick={() => setOpen(false)}
                    className="font-mono text-xs uppercase tracking-eyebrow text-gray-mid transition-colors duration-200 hover:text-red-light"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
              {LINKS.map((l) => (
                <NavItem key={l.to} {...l} mobile onClick={() => setOpen(false)} />
              ))}
            </div>
            <Button to={user ? '/dashboard' : '/auth'} size="lg" onClick={() => setOpen(false)}>
              {user ? 'My atelier' : 'Join the exchange'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
