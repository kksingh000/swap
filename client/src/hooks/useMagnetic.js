import { useMotionValue, useSpring } from 'framer-motion'

// Magnetic hover: the element drifts a few px toward the cursor and
// springs back to rest on leave. Attach the returned handlers + style.
export default function useMagnetic(strength = 0.25) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.6 })

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - rect.left - rect.width / 2) * strength)
    rawY.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return { x, y, onMouseMove, onMouseLeave }
}
