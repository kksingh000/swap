import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function TypingIndicator({ className }) {
  return (
    <div className={cn('flex justify-start', className)}>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-charcoal px-4 py-3 shadow-material-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-typing rounded-full bg-gray-mid"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatBubble({ text, time, mine = false, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex', mine ? 'justify-end' : 'justify-start', className)}
    >
      <div
        className={cn(
          'max-w-[78%] px-4 py-2.5 text-sm shadow-material-sm',
          mine
            ? 'rounded-2xl rounded-br-sm bg-red text-ivory'
            : 'rounded-2xl rounded-bl-sm border border-white/10 bg-charcoal text-gray-light',
        )}
      >
        <p className="leading-relaxed">{text}</p>
        {time && (
          <span
            className={cn(
              'mt-1 block text-right font-mono text-[10px]',
              mine ? 'text-ivory/60' : 'text-gray-mid',
            )}
          >
            {time}
          </span>
        )}
      </div>
    </motion.div>
  )
}
