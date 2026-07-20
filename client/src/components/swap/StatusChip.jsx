import { cn } from '../../lib/utils'

// One accent color only — progress reads as increasing red intensity.
const STYLES = {
  Requested: 'border border-gray-line text-gray-light',
  Negotiating: 'border border-red/40 bg-red/10 text-red-light',
  Accepted: 'bg-red/80 text-ivory',
  Exchanged: 'bg-red text-ivory',
  Completed: 'bg-red text-ivory shadow-glow',
  Declined: 'border border-gray-line text-gray-mid opacity-70',
}

export default function StatusChip({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em]',
        STYLES[status] ?? STYLES.Requested,
        className,
      )}
    >
      {status}
    </span>
  )
}
