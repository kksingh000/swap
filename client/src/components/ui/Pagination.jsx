import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const navBtn =
    'flex h-9 w-9 items-center justify-center rounded-full border border-gray-line text-gray-light transition-all duration-200 hover:border-red hover:text-red-light disabled:pointer-events-none disabled:opacity-30'

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page" className={navBtn}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'h-9 w-9 rounded-full font-mono text-xs transition-all duration-200',
            p === page
              ? 'bg-red text-ivory shadow-glow'
              : 'border border-gray-line text-gray-light hover:border-red hover:text-red-light',
          )}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page" className={navBtn}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
