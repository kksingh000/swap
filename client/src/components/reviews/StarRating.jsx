import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

const SIZES = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-6 w-6' }

// Stars stay inside the palette: filled = red, empty = hairline gray.
// Read-only by default; pass onChange to make it an input.
export default function StarRating({ value = 0, onChange, size = 'md', className }) {
  const [hover, setHover] = useState(0)
  const readOnly = !onChange
  const active = hover || value

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role={readOnly ? 'img' : undefined} aria-label={readOnly ? `${value} out of 5 stars` : undefined}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active
        const star = (
          <Star
            className={cn(SIZES[size], filled ? 'fill-red text-red' : 'text-gray-line', !readOnly && 'transition-transform duration-150')}
            strokeWidth={1.5}
          />
        )
        if (readOnly) return <span key={n}>{star}</span>
        return (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(n)}
            className="rounded p-0.5 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light"
          >
            {star}
          </button>
        )
      })}
    </span>
  )
}
