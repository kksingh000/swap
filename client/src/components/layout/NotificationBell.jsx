import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftRight, Bell, Check, MessageSquare, Star, CheckCheck } from 'lucide-react'
import { cn } from '../../lib/utils'
import { timeAgo } from '../../lib/utils'
import { useNotificationStore, unreadSelector } from '../../store/notificationStore'

const ICONS = {
  request: ArrowLeftRight,
  message: MessageSquare,
  review: Star,
  status: Check,
  info: Bell,
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const notifications = useNotificationStore((s) => s.notifications)
  const unread = useNotificationStore(unreadSelector)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openItem = (n) => {
    markRead(n.id)
    setOpen(false)
    if (n.to) navigate(n.to)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative rounded-full p-2 text-gray-mid transition-colors duration-200 hover:bg-white/5 hover:text-ivory"
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 font-mono text-[9px] font-semibold text-ivory shadow-glow">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-16 z-[60] origin-top rounded-2xl border border-white/10 bg-charcoal shadow-material-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-80"
          >
            <div className="flex items-center justify-between border-b border-gray-line/60 px-4 py-3">
              <p className="text-eyebrow font-medium text-gray-mid">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-red-light transition-colors duration-200 hover:text-ivory"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-1 sm:max-h-96">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-mid">You're all caught up.</p>
              ) : (
                notifications.map((n) => {
                  const Icon = ICONS[n.type] ?? Bell
                  return (
                    <button
                      key={n.id}
                      onClick={() => openItem(n)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-white/5',
                        !n.read && 'bg-red/[0.04]',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                          n.read ? 'border-gray-line text-gray-mid' : 'border-red/40 bg-red/10 text-red-light',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug text-gray-light">{n.text}</span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red shadow-glow" />}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
