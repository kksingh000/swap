import { Link } from 'react-router-dom'
import Eyebrow from '../ui/Eyebrow'

const COLUMNS = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse listings', to: '/browse' },
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Swap value guide', to: '/browse' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Messages', to: '/chat' },
      { label: 'Sign in', to: '/auth' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Admin panel', to: '/admin' },
      { label: 'Component library', to: '/dev/components' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="grain relative border-t border-white/10 bg-black-deep">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl italic text-ivory">
              Swap<span className="not-italic text-red-light">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-mid">
              The clothing exchange atelier. List the pieces you no longer wear and trade them,
              value for value, with people in your city.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <Eyebrow tone="gray">{col.title}</Eyebrow>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-light transition-colors duration-200 hover:text-red-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-gray-line/60 pt-8 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid sm:flex-row sm:items-center">
          <span>© 2026 Swap — no money, just taste</span>
          <span>New Delhi · Mumbai · Bengaluru · 35 more cities</span>
        </div>
      </div>
    </footer>
  )
}
