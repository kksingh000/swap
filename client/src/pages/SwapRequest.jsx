import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import MaterialCard from '../components/ui/MaterialCard'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import ImageFrame from '../components/ui/ImageFrame'
import StatusStepper, { SWAP_STEPS } from '../components/ui/StatusStepper'
import { toast } from '../components/ui/Toast'
import StatusChip from '../components/swap/StatusChip'
import BalanceScale from '../components/swap/BalanceScale'
import { useSwapStore } from '../store/swapStore'
import { resolveRequest } from '../lib/requests'
import { fadeUp, stagger } from '../lib/motion'
import { formatRupees } from '../lib/utils'

function ItemPanel({ listing, label }) {
  return (
    <MaterialCard className="flex-1 overflow-hidden">
      <div className="border-b border-gray-line/50 px-5 py-3">
        <p className="text-eyebrow text-[9px] text-gray-mid">{label}</p>
      </div>
      <Link to={`/item/${listing.id}`} className="group block">
        <div className="relative m-4 aspect-[4/3] overflow-hidden">
          <ImageFrame
            src={listing.image}
            alt={listing.title}
            category={listing.category}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-2 top-2">
            <Badge condition={listing.condition} />
          </span>
        </div>
        <div className="px-5 pb-5">
          <p className="text-eyebrow text-[9px] text-gray-mid">{listing.brand}</p>
          <h3 className="mt-1 truncate font-display text-lg text-ivory">{listing.title}</h3>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
            <span className="text-red-light">~{formatRupees(listing.swapValue)}</span>
            <span className="uppercase tracking-[0.12em] text-gray-mid">
              {listing.itemId} · {listing.size}
            </span>
          </div>
        </div>
      </Link>
    </MaterialCard>
  )
}

export default function SwapRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const requests = useSwapStore((s) => s.requests)
  const updateStatus = useSwapStore((s) => s.updateRequestStatus)
  const addMessage = useSwapStore((s) => s.addMessage)

  const stored = requests.find((r) => r.id === id)
  const request = stored ? resolveRequest(stored) : null

  if (!request || !request.offered || !request.requested) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-40">
          <EmptyState
            eyebrow="Not found"
            title="This negotiation has closed"
            copy="The request may have been withdrawn, or the link is stale."
            actionLabel="Back to dashboard"
            onAction={() => navigate('/dashboard')}
          />
        </div>
      </PageTransition>
    )
  }

  const { mine, theirs, counterpart, incoming, status } = request
  const stepIndex = SWAP_STEPS.indexOf(status)
  const declined = status === 'Declined'

  const setStatus = (next, note) => {
    updateStatus(request.id, next)
    if (note) {
      addMessage(request.id, {
        id: `m-${Date.now()}`,
        from: 'system',
        text: note,
        time: '',
      })
    }
    toast(`Request ${request.id.toUpperCase()} is now “${next}”.`, {
      type: next === 'Declined' ? 'error' : 'success',
    })
  }

  const firstName = counterpart.name.split(' ')[0]

  return (
    <PageTransition>
      <div className="grain relative">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid transition-colors duration-200 hover:text-red-light"
              >
                <ArrowLeft className="h-3 w-3" /> My atelier
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                {request.id} ·{' '}
                {new Date(request.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>The negotiation</Eyebrow>
                <h1 className="font-display text-4xl text-ivory md:text-5xl">
                  {incoming ? `${firstName}'s offer` : `Your offer to ${firstName}`}
                </h1>
              </div>
              <StatusChip status={status} className="px-4 py-1.5 text-[10px]" />
            </motion.div>

            {/* Lifecycle stepper */}
            <motion.div variants={fadeUp} className="mt-10">
              {declined ? (
                <MaterialCard className="flex items-center gap-4 border-gray-line p-5">
                  <X className="h-5 w-5 shrink-0 text-gray-mid" />
                  <p className="text-sm text-gray-mid">
                    This request was declined. Both pieces are back on the rack.
                  </p>
                </MaterialCard>
              ) : (
                <StatusStepper current={stepIndex} />
              )}
            </motion.div>

            {/* Side-by-side comparison */}
            <motion.div variants={fadeUp} className="relative mt-12 flex flex-col gap-6 sm:flex-row">
              <ItemPanel listing={mine} label="Your piece" />
              <span className="absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red text-ivory shadow-glow-strong sm:flex">
                <ArrowLeftRight className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <ItemPanel listing={theirs} label={`${firstName}'s piece`} />
            </motion.div>

            <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_0.9fr]">
              {/* Compact scale */}
              <motion.div variants={fadeUp}>
                <BalanceScale left={mine} right={theirs} compact />
              </motion.div>

              {/* Counterpart + actions */}
              <motion.div variants={fadeUp} className="space-y-6">
                <MaterialCard className="flex items-center gap-4 p-5">
                  <Avatar name={counterpart.name} size="lg" online />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-ivory">{counterpart.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
                      {counterpart.city} · {counterpart.swapsCompleted} swaps
                    </p>
                  </div>
                  <p className="inline-flex items-center gap-1 font-mono text-sm text-red-light">
                    <Star className="h-3.5 w-3.5 fill-current" /> {counterpart.rating.toFixed(1)}
                  </p>
                </MaterialCard>

                <MaterialCard className="p-5">
                  <p className="text-eyebrow mb-3 text-[10px] text-gray-mid">Exchange point</p>
                  <p className="inline-flex items-center gap-2 text-sm text-gray-light">
                    <MapPin className="h-4 w-4 text-red-light" />
                    {theirs.city === mine.city
                      ? `${mine.city} metro swap point — agree on a gate in chat`
                      : `${mine.city} ↔ ${theirs.city} — agree on a midpoint in chat`}
                  </p>
                  <p className="mt-3 inline-flex items-start gap-2 text-xs leading-relaxed text-gray-mid">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-light" />
                    Inspect the piece before you hand over yours. Swaps confirmed in chat are
                    binding on both closets.
                  </p>
                </MaterialCard>

                {/* Actions per lifecycle stage */}
                <div className="flex flex-wrap gap-3">
                  {(status === 'Requested' || status === 'Negotiating') && (
                    <>
                      <Button
                        icon={Check}
                        magnetic
                        onClick={() => setStatus('Accepted', 'Offer accepted — arrange the exchange.')}
                      >
                        Accept offer
                      </Button>
                      <Button
                        variant="outline"
                        icon={MessageSquare}
                        to={`/chat?request=${request.id}`}
                      >
                        {status === 'Requested' ? 'Counter in chat' : 'Open chat'}
                      </Button>
                      <Button
                        variant="danger"
                        icon={X}
                        onClick={() => setStatus('Declined', 'Request declined.')}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {status === 'Accepted' && (
                    <>
                      <Button
                        icon={ArrowLeftRight}
                        magnetic
                        onClick={() =>
                          setStatus('Exchanged', 'Pieces exchanged in person — confirm to close.')
                        }
                      >
                        Mark as exchanged
                      </Button>
                      <Button variant="outline" icon={MessageSquare} to={`/chat?request=${request.id}`}>
                        Open chat
                      </Button>
                    </>
                  )}
                  {status === 'Exchanged' && (
                    <Button
                      icon={Check}
                      magnetic
                      onClick={() => setStatus('Completed', 'Swap completed. Wear it well.')}
                    >
                      Confirm completion
                    </Button>
                  )}
                  {status === 'Completed' && (
                    <Button variant="outline" to="/browse">
                      Browse the rack again
                    </Button>
                  )}
                  {declined && (
                    <Button variant="outline" to="/browse">
                      Back to the rack
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
