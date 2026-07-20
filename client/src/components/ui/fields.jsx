import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

// Form primitives with the atelier treatment: eyebrow labels, hairline
// borders, red focus ring, inline validation messaging.

export function Field({ label, error, hint, htmlFor, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="text-eyebrow mb-2 block font-medium text-gray-mid">
          {label}
        </label>
      )}
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-light"
            role="alert"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p key="hint" className="mt-2 text-xs text-gray-mid">
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

const baseInput =
  'w-full rounded-xl border bg-black/60 px-4 py-3 text-sm text-ivory placeholder:text-gray-mid transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-light/70 focus:border-red/60'

export const Input = forwardRef(function Input({ error, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(baseInput, error ? 'border-red/70' : 'border-gray-line', className)}
      {...props}
    />
  )
})

export const Textarea = forwardRef(function Textarea({ error, className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(baseInput, 'min-h-28 resize-y', error ? 'border-red/70' : 'border-gray-line', className)}
      {...props}
    />
  )
})

export const Select = forwardRef(function Select({ error, className, children, ...props }, ref) {
  return (
    <span className="relative block">
      <select
        ref={ref}
        className={cn(
          baseInput,
          'appearance-none pr-10',
          error ? 'border-red/70' : 'border-gray-line',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-mid" />
    </span>
  )
})
