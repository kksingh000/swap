import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Check, Scale } from 'lucide-react'
import ImageFrame from '../ui/ImageFrame'
import { fairness } from '../../lib/swapValue'
import { cn, formatRupees } from '../../lib/utils'

// Heavy, under-damped spring — the beam should settle like real mass,
// overshooting once before it rests. Never linear easing.
const SPRING = { stiffness: 48, damping: 11, mass: 1.5 }

function Pan({ listing, compact }) {
  if (!listing) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-line bg-black/40 px-2 text-center',
          compact ? 'h-14 w-20' : 'h-24 w-28',
        )}
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-gray-mid">
          Select a piece
        </span>
      </div>
    )
  }
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/10 bg-charcoal shadow-material-sm',
        compact ? 'w-20' : 'w-28',
      )}
    >
      {!compact && (
        <div className="h-20 w-full overflow-hidden">
          <ImageFrame src={listing.image} alt={listing.title} category={listing.category} />
        </div>
      )}
      <div className="px-2 py-1.5 text-center">
        <p className="truncate font-mono text-[8px] uppercase tracking-[0.1em] text-gray-mid">
          {listing.brand}
        </p>
        <p className="font-mono text-[11px] text-red-light">~{formatRupees(listing.swapValue)}</p>
      </div>
    </div>
  )
}

// BalanceScale3D — the signature swap-fairness visual. The beam tips toward
// the heavier side proportionally to the value delta, pans counter-rotate to
// hang plumb, and the whole assembly snaps level with a red glow once the
// values fall inside the fair threshold (85%).
export default function BalanceScale({ left, right, compact = false, className }) {
  const a = left?.swapValue ?? 0
  const b = right?.swapValue ?? 0
  const verdict = a > 0 && b > 0 ? fairness(a, b) : null
  const isFair = verdict?.verdict === 'fair'

  // Positive angle = right side heavier = beam rotates clockwise.
  const raw = a > 0 && b > 0 ? ((b - a) / Math.max(a, b)) * 26 : 0
  const angle = isFair ? 0 : Math.max(-12, Math.min(12, raw))

  // Spring-driven motion value: setting the target mid-flight re-springs from
  // the current velocity, so switching offers feels like re-loading the pans.
  const rotate = useSpring(0, SPRING)
  const counterRotate = useTransform(rotate, (v) => -v)
  useEffect(() => {
    rotate.set(angle)
  }, [angle, rotate])

  return (
    <div className={cn('flex flex-col items-center', className)} data-testid="balance-scale">
      <div className={cn('relative w-full', compact ? 'h-56 max-w-xs' : 'h-80 max-w-lg')}>
        {/* Pivot pin */}
        <div
          className={cn(
            'absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-500',
            compact ? 'h-8 w-8' : 'h-10 w-10',
            isFair
              ? 'border-red bg-red text-ivory shadow-glow-strong'
              : 'border-gray-line bg-charcoal text-gray-mid',
          )}
        >
          <Scale className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </div>

        {/* Pillar + base */}
        <div
          className={cn(
            'absolute left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-dark to-black',
            compact ? 'top-6 bottom-4' : 'top-7 bottom-4',
          )}
        />
        <div className="absolute bottom-2 left-1/2 h-2 w-28 -translate-x-1/2 rounded-full bg-gray-dark shadow-material-sm" />
        <div className="absolute bottom-0 left-1/2 h-1.5 w-40 -translate-x-1/2 rounded-full bg-black-deep" />

        {/* Beam — rotates as one; pans counter-rotate to stay plumb */}
        <motion.div
          data-testid="scale-beam"
          style={{ rotate, x: '-50%', transformOrigin: '50% 3px' }}
          className={cn(
            'absolute left-1/2',
            compact ? 'top-[22px] w-64' : 'top-[26px] w-[26rem] max-w-full',
          )}
        >
          <div
            className={cn(
              'h-1.5 w-full rounded-full transition-colors duration-500',
              isFair ? 'bg-red shadow-glow' : 'bg-gray-dark',
            )}
          />
          {[
            { item: left, pos: 'left-0' },
            { item: right, pos: 'right-0' },
          ].map(({ item, pos }, i) => (
            <div
              key={i}
              className={cn('absolute top-1.5 flex flex-col items-center', pos)}
              style={{ width: 0 }}
            >
              <div className={cn('w-px bg-gray-line', compact ? 'h-6' : 'h-9')} />
              <motion.div style={{ rotate: counterRotate, transformOrigin: '50% 0%' }}>
                <Pan listing={item} compact={compact} />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {verdict && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <span
            data-testid="scale-verdict"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-500',
              isFair
                ? 'bg-red text-ivory shadow-glow-strong'
                : verdict.verdict === 'close'
                  ? 'border border-red/40 bg-red/10 text-red-light'
                  : 'border border-gray-line text-gray-mid',
            )}
          >
            {isFair && <Check className="h-3 w-3" strokeWidth={3} />}
            {verdict.label}
          </span>
          <span className="font-mono text-[10px] text-gray-mid">
            Δ {formatRupees(verdict.delta)} · {Math.round(verdict.ratio * 100)}% matched
          </span>
        </div>
      )}
    </div>
  )
}
