import { motion } from 'framer-motion'
import PageTransition from './PageTransition'
import Eyebrow from '../ui/Eyebrow'
import GradientBlobs from '../ui/GradientBlobs'
import { fadeUp, stagger } from '../../lib/motion'

// Temporary stub used while pages are built out in steps 2–5.
export default function PagePlaceholder({ eyebrow, title, step }) {
  return (
    <PageTransition>
      <section className="grain relative flex min-h-[70vh] items-center overflow-hidden">
        <GradientBlobs />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-8"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1 variants={fadeUp} className="max-w-2xl font-display text-5xl text-ivory md:text-6xl">
            {title}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 font-mono text-xs uppercase tracking-eyebrow text-gray-mid">
            In tailoring — arrives with build step {step}
          </motion.p>
        </motion.div>
      </section>
    </PageTransition>
  )
}
