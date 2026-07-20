import { cn } from '../../lib/utils'

// Condition badges vary by red intensity + gray only — the palette has one
// accent, so "better condition" reads as "more red", never green/gold.
const CONDITION_STYLES = {
  'New with tags': 'border-transparent bg-red text-ivory',
  'Like new': 'border-red/50 bg-red/10 text-red-light',
  'Gently used': 'border-gray-line bg-black/60 text-gray-light backdrop-blur-sm',
  'Well loved': 'border-gray-line bg-black/40 text-gray-mid backdrop-blur-sm',
}

export default function Badge({ condition, children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]',
        CONDITION_STYLES[condition] ?? 'border-gray-line bg-black/60 text-gray-light',
        className,
      )}
    >
      {children ?? condition}
    </span>
  )
}
