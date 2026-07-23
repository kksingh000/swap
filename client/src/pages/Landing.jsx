import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeftRight, Scale, Shirt } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Section from '../components/layout/Section'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import GradientBlobs from '../components/ui/GradientBlobs'
import StatCounter from '../components/ui/StatCounter'
import Avatar from '../components/ui/Avatar'
import MaterialCard from '../components/ui/MaterialCard'
import ListingCard from '../components/listing/ListingCard'
import CategoryTile from '../components/listing/CategoryTile'
import HeroVisual from '../components/landing/HeroVisual'
import FeaturedSwaps from '../components/landing/FeaturedSwaps'
import { fadeUp, stagger } from '../lib/motion'
import {
  listings,
  categories,
  departments,
  impactStats,
  featuredSwaps,
  testimonials,
} from '../data/seed'

const STEPS = [
  {
    n: '01',
    icon: Shirt,
    title: 'List your pieces',
    copy: 'Photograph what you no longer wear. The calculator appraises every piece by brand, category and condition — no guesswork, no haggling.',
  },
  {
    n: '02',
    icon: Scale,
    title: 'Match by value & city',
    copy: 'Browse the rack, filter to your city, and find pieces whose value balances against yours on the scale.',
  },
  {
    n: '03',
    icon: ArrowLeftRight,
    title: 'Negotiate & exchange',
    copy: 'Agree in chat, confirm the deal, and hand over in person at a metro swap point. No money changes hands.',
  },
]

export default function Landing() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150)
  }, [hash])

  const heroItems = [
    listings.find((l) => l.id === 'l-01'),
    listings.find((l) => l.id === 'l-10'),
    listings.find((l) => l.id === 'l-03'),
  ]

  return (
    <PageTransition>
      {/* ————— Hero ————— */}
      <section className="grain relative flex min-h-screen items-center overflow-hidden">
        <GradientBlobs />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pt-24">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <Eyebrow>The clothing exchange atelier</Eyebrow>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="max-w-3xl font-display text-5xl leading-[1.05] text-ivory sm:text-6xl xl:text-7xl"
            >
              Wear it again, <em className="text-red-light">beautifully</em>.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-gray-mid">
              List the pieces you no longer reach for and trade them, value for value, with
              people in your city. No money changes hands — just taste.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Button to="/auth" size="lg" magnetic iconRight={ArrowRight}>
                Start swapping
              </Button>
              <Button to="/browse" size="lg" variant="outline">
                Browse the rack
              </Button>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-8 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid"
            >
              No fees · No shipping · Meet at metro swap points
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroVisual items={heroItems} />
          </motion.div>
        </div>
      </section>

      {/* ————— Impact stats ————— */}
      <Section className="border-y border-white/10 bg-black-deep">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 md:grid-cols-4 lg:px-8">
          {impactStats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ————— How it works ————— */}
      <Section id="how-it-works" className="grain">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-display text-4xl text-ivory md:text-5xl">
              Three steps between your rack and theirs
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <motion.div key={step.n} variants={fadeUp}>
                <MaterialCard interactive className="h-full p-8">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red/30 bg-red/10">
                      <step.icon className="h-5 w-5 text-red-light" strokeWidth={1.8} />
                    </span>
                    <span className="font-mono text-xs text-gray-mid">{step.n}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-ivory">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-mid">{step.copy}</p>
                </MaterialCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ————— Featured swaps ————— */}
      <Section className="border-t border-white/10 bg-black-deep">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <Eyebrow>Sealed this month</Eyebrow>
            <h2 className="font-display text-4xl text-ivory md:text-5xl">Recent fair exchanges</h2>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-14">
            <FeaturedSwaps swaps={featuredSwaps} />
          </motion.div>
        </div>
      </Section>

      {/* ————— Shop by department ————— */}
      <Section className="grain">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <Eyebrow>Shop by department</Eyebrow>
            <h2 className="font-display text-4xl text-ivory md:text-5xl">Find your side of the rack</h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {departments.map((d) => (
              <motion.div key={d.name} variants={fadeUp}>
                <CategoryTile
                  category={d}
                  to={`/browse?department=${encodeURIComponent(d.name)}`}
                  subtitle={d.tagline}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ————— Fresh on the rack ————— */}
      <Section className="grain border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp} className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Fresh on the rack</Eyebrow>
              <h2 className="font-display text-4xl text-ivory md:text-5xl">Latest listings</h2>
            </div>
            <Button to="/browse" variant="ghost" size="sm" iconRight={ArrowRight} className="hidden sm:inline-flex">
              View all
            </Button>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listings.slice(0, 8).map((listing) => (
              <motion.div key={listing.id} variants={fadeUp}>
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ————— Categories ————— */}
      <Section className="border-t border-white/10 bg-black-deep">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp}>
            <Eyebrow>The collection</Eyebrow>
            <h2 className="font-display text-4xl text-ivory md:text-5xl">Shop by category</h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <motion.div key={category.name} variants={fadeUp}>
                <CategoryTile category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ————— Testimonials ————— */}
      <Section className="grain">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <Eyebrow>From the community</Eyebrow>
            <h2 className="font-display text-4xl text-ivory md:text-5xl">Word on the rack</h2>
          </motion.div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <motion.div key={t.id} variants={fadeUp}>
                <MaterialCard className="flex h-full flex-col p-8">
                  <span aria-hidden className="font-display text-6xl leading-none text-red">
                    “
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-light">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-gray-line/50 pt-5">
                    <Avatar name={t.name} size="md" />
                    <div>
                      <p className="text-sm text-ivory">{t.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
                        {t.city} · {t.swaps} swaps
                      </p>
                    </div>
                  </div>
                </MaterialCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ————— Final CTA — the ivory band ————— */}
      <Section className="grain bg-ivory">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.p variants={fadeUp} className="text-eyebrow mb-3 font-medium text-red">
            Join the exchange
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl leading-[1.08] text-black sm:text-5xl md:text-6xl"
          >
            Your wardrobe is someone else's <em className="text-red">wishlist</em>.
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-black/60">
            Listing your first piece takes two minutes. The right trade finds you.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <Button to="/auth" size="lg" magnetic iconRight={ArrowRight}>
              List your first piece
            </Button>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="mt-8 font-mono text-[10px] uppercase tracking-eyebrow text-black/40"
          >
            Free forever · 38 cities · 4,260 swaps sealed
          </motion.p>
        </div>
      </Section>
    </PageTransition>
  )
}
