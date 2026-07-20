import { cn } from '../../lib/utils'

const SIZES = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

export default function Avatar({ name = '', src, size = 'md', online, className }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover ring-1 ring-gray-line', SIZES[size])}
        />
      ) : (
        <span
          aria-label={name}
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gray-dark to-black-deep font-display text-gray-light ring-1 ring-gray-line',
            SIZES[size],
          )}
        >
          {initials || '?'}
        </span>
      )}
      {online != null && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-charcoal',
            online ? 'bg-red-light shadow-glow' : 'bg-gray-dark',
          )}
        />
      )}
    </span>
  )
}
