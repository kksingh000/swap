import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { cn } from '../../lib/utils'
import { EASE_OUT } from '../../lib/motion'

// Animated count-up stat: mono digits (the "appraisal" voice), eyebrow label.
export default function StatCounter({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = 1.8,
  className,
  numberClassName,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <div ref={ref} className={cn('text-center', className)}>
      <div className={cn('font-mono text-4xl font-medium text-ivory md:text-5xl', numberClassName)}>
        {prefix}
        {display.toLocaleString('en-IN')}
        {suffix}
      </div>
      <p className="text-eyebrow mt-3 text-gray-mid">{label}</p>
    </div>
  )
}
