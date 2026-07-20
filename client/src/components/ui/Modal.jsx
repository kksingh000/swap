import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import Eyebrow from './Eyebrow'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({ open, onClose, eyebrow, title, size = 'md', children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black-deep/80 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full rounded-2xl border border-white/10 bg-charcoal shadow-material-lg',
              SIZES[size],
            )}
          >
            <div className="flex items-start justify-between border-b border-gray-line/60 px-6 py-5">
              <div>
                {eyebrow && <Eyebrow className="mb-1">{eyebrow}</Eyebrow>}
                {title && <h3 className="font-display text-xl text-ivory">{title}</h3>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full p-2 text-gray-mid transition-colors duration-200 hover:bg-white/5 hover:text-ivory"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex justify-end gap-3 border-t border-gray-line/60 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
