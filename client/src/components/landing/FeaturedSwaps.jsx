import { useRef } from 'react'
import Tilt from 'react-parallax-tilt'
import { ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageFrame from '../ui/ImageFrame'
import { fairness } from '../../lib/swapValue'
import { formatRupees } from '../../lib/utils'

function SwapCard({ swap }) {
  const verdict = fairness(swap.a.swapValue, swap.b.swapValue)
  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      perspective={900}
      transitionSpeed={1600}
      glareEnable={false}
    >
      <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal p-5 shadow-material transition-all duration-300 hover:border-red/50 hover:shadow-glow">
        <div className="relative flex gap-3">
          {[swap.a, swap.b].map((item) => (
            <div key={item.id} className="w-1/2">
              <div className="aspect-[3/4] overflow-hidden border border-white/10">
                <ImageFrame src={item.image} alt={item.title} category={item.category} />
              </div>
              <p className="text-eyebrow mt-2.5 truncate text-[9px] text-gray-mid">{item.brand}</p>
              <p className="truncate font-display text-sm text-ivory">{item.title}</p>
              <p className="mt-1 font-mono text-[11px] text-red-light">
                ~{formatRupees(item.swapValue)}
              </p>
            </div>
          ))}
          <span className="absolute left-1/2 top-[34%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red text-ivory shadow-glow">
            <ArrowLeftRight className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-line/50 pt-3.5">
          <span className="rounded-full border border-red/40 bg-red/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-red-light">
            {verdict.label}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-gray-mid">
            {swap.a.city} ↔ {swap.b.city} · {swap.date}
          </span>
        </div>
      </article>
    </Tilt>
  )
}

// Horizontal scroll-snap carousel of completed exchanges.
export default function FeaturedSwaps({ swaps }) {
  const scroller = useRef(null)
  const nudge = (dir) =>
    scroller.current?.scrollBy({
      left: dir * scroller.current.clientWidth * 0.7,
      behavior: 'smooth',
    })

  return (
    <div className="relative">
      <div className="absolute -top-16 right-0 hidden gap-2 sm:flex">
        <button
          onClick={() => nudge(-1)}
          aria-label="Previous swaps"
          className="rounded-full border border-gray-line p-2.5 text-gray-light transition-all duration-200 hover:border-red hover:text-red-light"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => nudge(1)}
          aria-label="Next swaps"
          className="rounded-full border border-gray-line p-2.5 text-gray-light transition-all duration-200 hover:border-red hover:text-red-light"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {swaps.map((swap) => (
          <div key={swap.id} className="w-[86%] shrink-0 snap-start sm:w-[54%] lg:w-[31%]">
            <SwapCard swap={swap} />
          </div>
        ))}
      </div>
    </div>
  )
}
