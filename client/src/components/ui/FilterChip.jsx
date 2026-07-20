import { cn } from '../../lib/utils'

export default function FilterChip({ active, count, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light',
        active
          ? 'border-red bg-red/15 text-red-light shadow-glow-soft'
          : 'border-gray-line text-gray-light hover:border-gray-mid hover:text-ivory',
        className,
      )}
    >
      {children}
      {count != null && (
        <span className={cn('font-mono text-[10px]', active ? 'text-red-light/80' : 'text-gray-mid')}>
          {count}
        </span>
      )}
    </button>
  )
}
