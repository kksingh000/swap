import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { stagger } from '../../lib/motion'

// Scroll-reveal section wrapper: children using the shared `fadeUp`/`scaleIn`
// variants stagger in as the section enters the viewport.
export default function Section({ as = 'section', className, children, ...props }) {
  const Comp = motion[as] ?? motion.section
  return (
    <Comp
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={cn('relative py-24 md:py-32', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}
