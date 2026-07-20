import { motion } from 'framer-motion'

// Route-level cross-fade + slight lift, driven by AnimatePresence in App.jsx.
export default function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}
