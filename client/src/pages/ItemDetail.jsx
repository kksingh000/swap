import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowLeftRight, Calendar, Expand, MapPin, Star } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Section from '../components/layout/Section'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import MaterialCard from '../components/ui/MaterialCard'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import ImageFrame from '../components/ui/ImageFrame'
import { toast } from '../components/ui/Toast'
import SwapValuePill from '../components/listing/SwapValuePill'
import ListingCard from '../components/listing/ListingCard'
import BalanceScale from '../components/swap/BalanceScale'
import SwapValueCalculator from '../components/swap/SwapValueCalculator'
import { useSwapStore } from '../store/swapStore'
import { listings, users } from '../data/seed'
import { fadeUp, stagger } from '../lib/motion'
import { cn, formatRupees } from '../lib/utils'

// Fake a 3-shot gallery from one photo via crop positions — reads as
// full / detail / hem shots until multi-image uploads exist (step 6).
const CROPS = [
  { label: 'Full view', cls: 'object-center' },
  { label: 'Detail', cls: 'object-top' },
  { label: 'Finish', cls: 'object-bottom' },
]

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const createRequest = useSwapStore((s) => s.createRequest)

  const listing = listings.find((l) => l.id === id)
  const owner = users.find((u) => u.id === listing?.ownerId)

  // Demo closet: pieces "you" could offer. Ananya is the demo persona unless
  // she owns this listing, in which case Priya's closet stands in.
  const closet = useMemo(() => {
    if (!listing) return []
    const closetOwner = listing.ownerId === 'u-01' ? 'u-03' : 'u-01'
    return listings
      .filter((l) => l.ownerId === closetOwner)
      .sort(
        (x, y) =>
          Math.abs(x.swapValue - listing.swapValue) - Math.abs(y.swapValue - listing.swapValue),
      )
  }, [listing])

  const [offer, setOffer] = useState(closet[0] ?? null)
  const [crop, setCrop] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!listing) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-40">
          <EmptyState
            eyebrow="Not on the rack"
            title="This piece has moved on"
            copy="It may have been swapped already. The rack refreshes daily."
            actionLabel="Back to browse"
            onAction={() => navigate('/browse')}
          />
        </div>
      </PageTransition>
    )
  }

  const related = listings.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 4)

  const sendRequest = () => {
    const requestId = createRequest({ offeredId: offer.id, requestedId: listing.id })
    setConfirmOpen(false)
    toast(`Swap request sent to ${owner.name.split(' ')[0]} — ${listing.itemId} ⇄ ${offer.itemId}.`, {
      type: 'success',
    })
    navigate(`/swap/${requestId}`)
  }

  return (
    <PageTransition>
      <div className="grain relative">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid transition-colors duration-200 hover:text-red-light"
              >
                <ArrowLeft className="h-3 w-3" /> The rack
              </Link>
            </motion.div>

            <div className="mt-8 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              {/* ——— Gallery ——— */}
              <motion.div variants={fadeUp}>
                <button
                  onClick={() => setLightbox(true)}
                  className="group relative block w-full overflow-hidden border border-white/10 shadow-material-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light"
                  aria-label="Open image lightbox"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    <ImageFrame
                      src={listing.image}
                      alt={`${listing.brand} ${listing.title}`}
                      category={listing.category}
                      eager
                      className={cn('transition-all duration-500 group-hover:scale-[1.03]', CROPS[crop].cls)}
                    />
                  </div>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-gray-light opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                  <span className="absolute left-3 top-3">
                    <Badge condition={listing.condition} />
                  </span>
                </button>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {CROPS.map((c, i) => (
                    <button
                      key={c.label}
                      onClick={() => setCrop(i)}
                      className={cn(
                        'overflow-hidden border transition-all duration-200',
                        i === crop ? 'border-red shadow-glow-soft' : 'border-white/10 opacity-60 hover:opacity-100',
                      )}
                      aria-label={c.label}
                      aria-pressed={i === crop}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <ImageFrame
                          src={listing.image}
                          alt={c.label}
                          category={listing.category}
                          className={c.cls}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* ——— Details ——— */}
              <motion.div variants={fadeUp}>
                <div className="flex items-center justify-between gap-4">
                  <Eyebrow className="mb-0">{listing.brand}</Eyebrow>
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                    {listing.itemId}
                  </span>
                </div>
                <h1 className="mt-3 font-display text-4xl leading-tight text-ivory md:text-5xl">
                  {listing.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Badge condition={listing.condition} />
                  <span className="rounded-full border border-gray-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-light">
                    {listing.category}
                  </span>
                  <span className="rounded-full border border-gray-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-light">
                    Size {listing.size}
                  </span>
                </div>

                <div className="mt-6">
                  <SwapValuePill value={listing.swapValue} className="px-4 py-1.5 text-sm" />
                </div>

                <p className="mt-6 max-w-xl leading-relaxed text-gray-light">{listing.description}</p>

                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-gray-line/50 py-5 font-mono text-[11px] uppercase tracking-[0.12em] text-gray-mid">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-red-light" /> {listing.city}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-red-light" /> Listed{' '}
                    {new Date(listing.listedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Owner mini-profile */}
                <MaterialCard className="mt-6 flex items-center gap-4 p-5">
                  <Avatar name={owner.name} size="lg" online />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-ivory">{owner.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
                      {owner.city} · member since{' '}
                      {new Date(owner.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="inline-flex items-center gap-1 font-mono text-sm text-red-light">
                      <Star className="h-3.5 w-3.5 fill-current" /> {owner.rating.toFixed(1)}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
                      {owner.swapsCompleted} swaps
                    </p>
                  </div>
                </MaterialCard>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" magnetic icon={ArrowLeftRight} onClick={() => setConfirmOpen(true)} disabled={!offer}>
                    Propose a swap
                  </Button>
                  <Button size="lg" variant="outline" to="/chat">
                    Message {owner.name.split(' ')[0]}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ——— The appraisal: balance scale + calculator ——— */}
        <Section className="border-t border-white/10 bg-black-deep">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div variants={fadeUp} className="max-w-2xl">
              <Eyebrow>The appraisal</Eyebrow>
              <h2 className="font-display text-4xl text-ivory md:text-5xl">Weigh the trade</h2>
              <p className="mt-4 text-gray-mid">
                Pick a piece from your closet and watch the scale settle. Inside 85% of each
                other's value, it reads as a fair swap.
              </p>
            </motion.div>

            <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <motion.div variants={fadeUp}>
                <BalanceScale left={listing} right={offer} />

                {/* Closet picker */}
                <p className="text-eyebrow mb-4 mt-10 text-center text-[10px] text-gray-mid">
                  Weigh against your closet
                </p>
                <div className="flex snap-x gap-3 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {closet.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setOffer(item)}
                      aria-pressed={offer?.id === item.id}
                      className={cn(
                        'w-24 shrink-0 snap-start overflow-hidden rounded-xl border text-left transition-all duration-200',
                        offer?.id === item.id
                          ? 'border-red shadow-glow'
                          : 'border-white/10 opacity-70 hover:opacity-100',
                      )}
                    >
                      <div className="h-24 w-full overflow-hidden">
                        <ImageFrame src={item.image} alt={item.title} category={item.category} />
                      </div>
                      <div className="bg-charcoal px-2 py-1.5">
                        <p className="truncate font-mono text-[8px] uppercase tracking-[0.1em] text-gray-mid">
                          {item.brand}
                        </p>
                        <p className="font-mono text-[10px] text-red-light">
                          ~{formatRupees(item.swapValue)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <SwapValueCalculator listing={listing} />
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ——— Related ——— */}
        {related.length > 0 && (
          <Section className="grain">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div variants={fadeUp}>
                <Eyebrow>More {listing.category.toLowerCase()}</Eyebrow>
                <h2 className="font-display text-4xl text-ivory">You might also weigh</h2>
              </motion.div>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((l) => (
                  <motion.div key={l.id} variants={fadeUp}>
                    <ListingCard listing={l} />
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        )}
      </div>

      {/* Lightbox */}
      <Modal open={lightbox} onClose={() => setLightbox(false)} size="lg" title={listing.title}>
        <div className="overflow-hidden">
          <ImageFrame
            src={listing.image}
            alt={`${listing.brand} ${listing.title}`}
            category={listing.category}
            eager
            className="max-h-[60vh] w-full object-contain"
          />
        </div>
      </Modal>

      {/* Send-request confirmation */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        eyebrow="Confirm swap request"
        title={`Offer your ${offer?.title ?? 'piece'}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Not yet
            </Button>
            <Button icon={ArrowLeftRight} onClick={sendRequest} data-testid="confirm-request">
              Send request
            </Button>
          </>
        }
      >
        {offer && (
          <div>
            <BalanceScale left={listing} right={offer} compact />
            <p className="mt-4 text-center text-sm leading-relaxed text-gray-light">
              You are offering <span className="text-ivory">{offer.title}</span> (~
              {formatRupees(offer.swapValue)}) for {owner.name.split(' ')[0]}'s{' '}
              <span className="text-ivory">{listing.title}</span> (~{formatRupees(listing.swapValue)}).{' '}
              {owner.name.split(' ')[0]} has 48 hours to respond.
            </p>
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
