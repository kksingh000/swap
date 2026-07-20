import { cn } from '../../lib/utils'

// The uppercase tracked label used above every section heading.
export default function Eyebrow({ children, className, tone = 'red' }) {
  return (
    <p
      className={cn(
        'text-eyebrow mb-3 font-medium',
        tone === 'red' ? 'text-red-light' : 'text-gray-mid',
        className,
      )}
    >
      {children}
    </p>
  )
}
