import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export const SWAP_STEPS = ['Requested', 'Negotiating', 'Accepted', 'Exchanged', 'Completed']

// Swap lifecycle progress. `current` is the index of the active step;
// everything before it reads as done (red), after it as upcoming (gray).
export default function StatusStepper({ steps = SWAP_STEPS, current = 0, compact = false, className }) {
  return (
    <ol
      className={cn('flex items-start', compact ? 'gap-0' : 'gap-0 overflow-x-auto pb-1', className)}
      aria-label="Swap status"
    >
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step} className={cn('flex flex-1 flex-col items-center', compact ? 'min-w-12' : 'min-w-20')}>
            <div className="flex w-full items-center">
              <span
                className={cn(
                  'h-px flex-1 transition-colors duration-300',
                  i === 0 ? 'bg-transparent' : done || active ? 'bg-red' : 'bg-gray-line',
                )}
              />
              <span
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full border font-mono transition-all duration-300',
                  compact ? 'h-6 w-6 text-[9px]' : 'h-8 w-8 text-[10px]',
                  done && 'border-red bg-red text-ivory',
                  active && 'animate-pulse-soft border-red bg-red/15 text-red-light shadow-glow',
                  !done && !active && 'border-gray-line bg-charcoal text-gray-mid',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  'h-px flex-1 transition-colors duration-300',
                  i === steps.length - 1 ? 'bg-transparent' : done ? 'bg-red' : 'bg-gray-line',
                )}
              />
            </div>
            <span
              className={cn(
                'mt-2 text-center font-mono uppercase tracking-[0.12em]',
                compact ? 'text-[8px]' : 'text-[10px]',
                active ? 'text-red-light' : done ? 'text-gray-light' : 'text-gray-mid',
              )}
            >
              {step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
