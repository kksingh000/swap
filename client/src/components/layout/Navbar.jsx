import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

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

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const user = useAuthStore((s) => s.user)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl italic text-ivory" onClick={() => setOpen(false)}>
          Swap<span className="not-italic text-red-light">.</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </div>

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
      </nav>

      {/* Mobile drawer — full-screen slide-in on black */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grain flex h-[calc(100vh-4rem)] flex-col justify-between border-t border-white/10 bg-black-deep px-6 py-10 md:hidden"
          >
            <div className="flex flex-col gap-8">
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
