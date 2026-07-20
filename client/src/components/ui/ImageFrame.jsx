import { Shirt, Footprints, Sparkles, Layers, Flower2, Watch } from 'lucide-react'
import { cn } from '../../lib/utils'

const CATEGORY_ICONS = {
  Outerwear: Layers,
  Denim: Shirt,
  Shirts: Shirt,
  Tees: Shirt,
  Knitwear: Shirt,
  Dresses: Sparkles,
  Ethnic: Flower2,
  Footwear: Footprints,
  Accessories: Watch,
}

// Sharp-cornered editorial image frame. Falls back to a garment-tone
// gradient with a category glyph when no photo is provided.
export default function ImageFrame({ src, alt, category, className, iconClassName, eager = false }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }
  const Icon = CATEGORY_ICONS[category] ?? Shirt
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-dark via-charcoal to-black-deep',
        className,
      )}
    >
      <Icon className={cn('h-10 w-10 text-gray-mid/50', iconClassName)} strokeWidth={1.1} />
    </div>
  )
}
