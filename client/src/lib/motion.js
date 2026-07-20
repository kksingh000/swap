// Shared Framer Motion variants — every scroll-reveal in the app uses these
// so the whole site moves with one voice.

export const EASE_OUT = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
}

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
}
