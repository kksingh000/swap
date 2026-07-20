import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

// Mobile slide-over housing the FilterPanel.
export default function FilterDrawer({ open, onClose, children }) {
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
        <div className="fixed inset-0 z-[80] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black-deep/80 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="grain absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto border-r border-white/10 bg-black-deep px-6 pb-10 pt-4 shadow-material-lg"
            aria-label="Filters"
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="rounded-full p-2 text-gray-mid transition-colors duration-200 hover:bg-white/5 hover:text-ivory"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
