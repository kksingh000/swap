import { cn, formatRupees } from '../../lib/utils'

// Mono-font value pill — the "appraisal" signal used on every listing.
export default function SwapValuePill({ value, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-ivory backdrop-blur-sm',
        className,
      )}
    >
      ~{formatRupees(value)}
      <span className="text-red-light">swap value</span>
    </span>
  )
}
