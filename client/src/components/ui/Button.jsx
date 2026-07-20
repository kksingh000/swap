import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import useMagnetic from '../../hooks/useMagnetic'

const MotionLink = motion(Link)

const VARIANTS = {
  primary:
    'bg-red text-ivory font-semibold shadow-cta-rest hover:bg-red-light hover:shadow-glow active:bg-red-deep',
  outline:
    'border border-white/30 text-ivory hover:border-red hover:text-red-light',
  ghost: 'text-gray-light hover:text-ivory hover:bg-white/5',
  ivory: 'bg-ivory text-black font-semibold hover:bg-white hover:shadow-glow-soft',
  danger:
    'border border-red/50 text-red-light hover:bg-red/10 hover:border-red',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-3.5 text-sm gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  to,
  href,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...props
}) {
  const magnet = useMagnetic(0.25)

  const Comp = to ? MotionLink : href ? motion.a : motion.button

  const magneticProps = magnetic
    ? {
        style: { x: magnet.x, y: magnet.y },
        onMouseMove: magnet.onMouseMove,
        onMouseLeave: magnet.onMouseLeave,
      }
    : {}

  return (
    <Comp
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-full transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...(to ? { to } : {})}
      {...(href ? { href } : {})}
      {...magneticProps}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
      {children}
      {IconRight && <IconRight className="h-4 w-4" strokeWidth={2} />}
    </Comp>
  )
}
