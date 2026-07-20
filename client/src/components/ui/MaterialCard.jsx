import { cn } from '../../lib/utils'

// Base elevated surface: charcoal on black with the two-layer shadow
// (ambient float + tight contact) and a 1px top edge-light.
export default function MaterialCard({
  as: Comp = 'div',
  interactive = false,
  className,
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'rounded-2xl border border-white/10 bg-charcoal shadow-material',
        interactive &&
          'transition-all duration-300 hover:border-red/50 hover:shadow-glow',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
