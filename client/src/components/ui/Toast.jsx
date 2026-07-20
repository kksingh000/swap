import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

let nextId = 0

export const useToastStore = create((set) => ({
  toasts: [],
  push: (t) => {
    const id = ++nextId
    set((s) => ({ toasts: [...s.toasts, { id, ...t }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
    }, t.duration ?? 4000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

export function toast(message, { type = 'info', duration } = {}) {
  useToastStore.getState().push({ message, type, duration })
}

// Success stays inside the palette: red accent + white, never green.
const ICONS = {
  success: { Icon: CheckCircle2, cls: 'text-red-light' },
  error: { Icon: AlertCircle, cls: 'text-red' },
  info: { Icon: Info, cls: 'text-gray-light' },
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const { Icon, cls } = ICONS[t.type] ?? ICONS.info
          return (
            <motion.button
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => dismiss(t.id)}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-charcoal px-4 py-3.5 text-left shadow-material-lg',
                t.type === 'success' && 'border-red/40',
              )}
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', cls)} />
              <span className="text-sm text-gray-light">{t.message}</span>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
