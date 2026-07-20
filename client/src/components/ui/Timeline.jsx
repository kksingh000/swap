import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { fadeUp, stagger } from '../../lib/motion'

// Vertical swap-history timeline: hairline spine, red nodes, mono dates.
export default function Timeline({ items, className }) {
  return (
    <motion.ol
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className={cn('relative space-y-8 border-l border-gray-line pl-6', className)}
    >
      {items.map((item, i) => (
        <motion.li key={i} variants={fadeUp} className="relative">
          <span
            className={cn(
              'absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-black',
              i === 0 ? 'bg-red shadow-glow' : 'bg-gray-dark',
            )}
          />
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">{item.date}</p>
          <h4 className="mt-1 font-display text-base text-ivory">{item.title}</h4>
          {item.description && <p className="mt-1 text-sm text-gray-mid">{item.description}</p>}
        </motion.li>
      ))}
    </motion.ol>
  )
}
