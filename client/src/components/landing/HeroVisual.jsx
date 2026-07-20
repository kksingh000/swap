import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
import ImageFrame from '../ui/ImageFrame'
import { cn, formatRupees } from '../../lib/utils'

// One floating editorial frame in the 3D stack. `z` is real translateZ —
// the parent's mouse-driven rotation turns depth into parallax.
function FloatFrame({ listing, z, float = 10, delay = 0, className }) {
  return (
    <motion.div style={{ z }} className={cn('absolute', className)}>
      <motion.div
        animate={{ y: [0, -float, 0] }}
        transition={{ duration: 7, delay, repeat: Infinity, ease: 'easeInOut' }}
        className="border border-white/10 bg-charcoal shadow-material-lg"
      >
        <div className="aspect-[3/4] w-full overflow-hidden">
          <ImageFrame src={listing.image} alt={listing.title} category={listing.category} eager />
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <span className="text-eyebrow truncate text-[9px] text-gray-mid">{listing.brand}</span>
          <span className="whitespace-nowrap font-mono text-[10px] text-red-light">
            ~{formatRupees(listing.swapValue)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// The hero's 3D floating-garment composition: three tilted frames at
// different depths, rotating toward the cursor with spring physics.
export default function HeroVisual({ items }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 80,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), {
    stiffness: 80,
    damping: 20,
  })

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const [a, b, c] = items

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      className="relative h-[420px] w-full sm:h-[500px] lg:h-[580px] [perspective:1400px]"
      aria-hidden
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        <FloatFrame listing={a} z={30} float={10} className="left-[10%] top-[4%] w-[52%] rotate-[-5deg]" />
        <FloatFrame listing={b} z={90} float={13} delay={1.2} className="bottom-[0%] left-[0%] w-[38%] rotate-[4deg]" />
        <FloatFrame listing={c} z={60} float={8} delay={0.6} className="right-[2%] top-[16%] w-[34%] rotate-[7deg]" />

        {/* The exchange mark, floating closest to the viewer */}
        <motion.div
          style={{ z: 130 }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[26%] left-[36%] flex h-14 w-14 items-center justify-center rounded-full bg-red text-ivory shadow-glow-strong"
        >
          <ArrowLeftRight className="h-6 w-6" strokeWidth={2.2} />
        </motion.div>
      </motion.div>
    </div>
  )
}
