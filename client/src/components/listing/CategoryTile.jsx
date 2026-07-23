import Tilt from 'react-parallax-tilt'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ImageFrame from '../ui/ImageFrame'

export default function CategoryTile({ category, to, subtitle, className }) {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={900}
      transitionSpeed={1600}
      scale={1.02}
      glareEnable={false}
    >
      <Link
        to={to ?? `/browse?category=${encodeURIComponent(category.name)}`}
        className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-charcoal shadow-material transition-all duration-300 hover:border-red/60 hover:shadow-glow ${className ?? ''}`}
      >
        <ImageFrame
          src={category.image}
          alt={category.name}
          category={category.name}
          className="transition-transform duration-500 group-hover:scale-105"
          iconClassName="h-14 w-14"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div className="min-w-0 pr-2">
            <h3 className="font-display text-xl text-ivory">{category.name}</h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
              {subtitle ?? `${category.count} pieces`}
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-mid transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-light" />
        </div>
      </Link>
    </Tilt>
  )
}
