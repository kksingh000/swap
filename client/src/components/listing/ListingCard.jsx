import Tilt from 'react-parallax-tilt'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Badge from '../ui/Badge'
import ImageFrame from '../ui/ImageFrame'
import SwapValuePill from './SwapValuePill'

// Signature listing card: 3D mouse-reactive tilt (max 8°, spring return),
// two-layer material shadow, red edge-glow on hover — never a color fill.
export default function ListingCard({ listing }) {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={900}
      transitionSpeed={1600}
      scale={1.02}
      glareEnable={false}
      className="h-full"
    >
      <Link
        to={`/item/${listing.id}`}
        className="group block h-full focus-visible:outline-none"
        aria-label={`${listing.brand} — ${listing.title}`}
      >
        <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-charcoal shadow-material transition-all duration-300 group-hover:border-red/60 group-hover:shadow-glow group-focus-visible:border-red/60 group-focus-visible:shadow-glow">
          {/* Editorial image frame: sharp corners inside the rounded chrome */}
          <div className="relative m-3 aspect-[3/4] overflow-hidden rounded-none">
            <ImageFrame
              src={listing.image}
              alt={`${listing.brand} ${listing.title}`}
              category={listing.category}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3">
              <Badge condition={listing.condition} />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent" />
            <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-eyebrow text-gray-light/80">
              {listing.itemId}
            </span>
          </div>

          <div className="px-5 pb-5 pt-1">
            <p className="text-eyebrow text-[10px] text-gray-mid">{listing.brand}</p>
            <h3 className="mt-1.5 truncate font-display text-lg leading-snug text-ivory">
              {listing.title}
            </h3>
            <div className="mt-3 flex items-center justify-between gap-2">
              <SwapValuePill value={listing.swapValue} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-line/50 pt-3 text-xs text-gray-mid">
              <span>Size {listing.size}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {listing.city}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </Tilt>
  )
}
