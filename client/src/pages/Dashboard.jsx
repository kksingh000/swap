import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  Check,
  LogOut,
  MessageSquare,
  Plus,
  Star,
  X,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import MaterialCard from '../components/ui/MaterialCard'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import ImageFrame from '../components/ui/ImageFrame'
import ImageUploader from '../components/ui/ImageUploader'
import Timeline from '../components/ui/Timeline'
import StatCounter from '../components/ui/StatCounter'
import { Field, Input, Select, Textarea } from '../components/ui/fields'
import { toast } from '../components/ui/Toast'
import ListingCard from '../components/listing/ListingCard'
import StatusChip from '../components/swap/StatusChip'
import { useAuthStore } from '../store/authStore'
import { useSwapStore } from '../store/swapStore'
import { useListingStore } from '../store/listingStore'
import { resolveRequest, DEMO_PERSONA_ID } from '../lib/requests'
import { CATEGORIES, CONDITIONS } from '../lib/swapValue'
import { listings } from '../data/seed'
import { fadeUp, stagger } from '../lib/motion'
import { cn } from '../lib/utils'

const TABS = ['My listings', 'Incoming', 'Outgoing', 'History']

function RequestRow({ convo, onAccept, onDecline }) {
  const actionable = convo.incoming && (convo.status === 'Requested' || convo.status === 'Negotiating')
  return (
    <MaterialCard className="flex flex-wrap items-center gap-4 p-4">
      <div className="flex shrink-0 -space-x-2">
        {[convo.mine, convo.theirs].map((item) => (
          <span key={item.id} className="h-12 w-12 overflow-hidden rounded-lg border border-gray-line">
            <ImageFrame src={item.image} alt={item.title} category={item.category} />
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ivory">
          {convo.incoming
            ? `${convo.counterpart.name.split(' ')[0]} wants your ${convo.mine.title}`
            : `Your ${convo.mine.title} → ${convo.counterpart.name.split(' ')[0]}`}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
          {convo.mine.itemId} ⇄ {convo.theirs.itemId} ·{' '}
          {new Date(convo.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
      </div>
      <StatusChip status={convo.status} />
      <div className="flex items-center gap-2">
        {actionable && (
          <>
            <button
              onClick={onAccept}
              aria-label="Accept request"
              className="rounded-full bg-red p-2 text-ivory transition-all duration-200 hover:bg-red-light hover:shadow-glow"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={onDecline}
              aria-label="Decline request"
              className="rounded-full border border-gray-line p-2 text-gray-mid transition-all duration-200 hover:border-red hover:text-red-light"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
        <Link
          to={`/chat?request=${convo.id}`}
          aria-label="Open chat"
          className="rounded-full border border-gray-line p-2 text-gray-mid transition-all duration-200 hover:border-red hover:text-red-light"
        >
          <MessageSquare className="h-4 w-4" />
        </Link>
        <Link
          to={`/swap/${convo.id}`}
          aria-label="Open swap summary"
          className="rounded-full border border-gray-line p-2 text-gray-mid transition-all duration-200 hover:border-red hover:text-red-light"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Link>
      </div>
    </MaterialCard>
  )
}

const EMPTY_DRAFT = { title: '', brand: '', category: 'Denim', size: '', condition: 'Gently used', description: '' }

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const requests = useSwapStore((s) => s.requests)
  const updateStatus = useSwapStore((s) => s.updateRequestStatus)
  const { userListings, addListing } = useListingStore()

  const [tab, setTab] = useState(TABS[0])
  const [listingOpen, setListingOpen] = useState(false)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [images, setImages] = useState([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!user) navigate('/auth', { replace: true })
  }, [user, navigate])

  const resolved = useMemo(
    () => requests.map(resolveRequest).filter((r) => r.offered && r.requested),
    [requests],
  )
  const incoming = resolved.filter((r) => r.incoming && !['Completed', 'Declined'].includes(r.status))
  const outgoing = resolved.filter((r) => !r.incoming && !['Completed', 'Declined'].includes(r.status))
  const history = resolved.filter((r) => ['Completed', 'Declined'].includes(r.status))
  const completedCount = history.filter((r) => r.status === 'Completed').length

  const myListings = [...userListings, ...listings.filter((l) => l.ownerId === DEMO_PERSONA_ID)]

  if (!user) return null

  const draftErrors = {
    title: !draft.title.trim() && 'Give it a title',
    brand: !draft.brand.trim() && 'Which brand?',
    size: !draft.size.trim() && 'Add a size',
  }
  const hasErrors = Object.values(draftErrors).some(Boolean)

  const submitListing = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors) return
    addListing({
      ...draft,
      title: draft.title.trim(),
      brand: draft.brand.trim(),
      size: draft.size.trim(),
      city: user.city,
      ownerId: 'me',
      image: images[0]?.url ?? null,
    })
    setListingOpen(false)
    setDraft(EMPTY_DRAFT)
    setImages([])
    setSubmitted(false)
    setTab('My listings')
    toast('Listed — your piece is on the rack.', { type: 'success' })
  }

  const stats = [
    { label: 'Pieces listed', value: myListings.length },
    { label: 'Swaps completed', value: (user.swapsCompleted ?? 0) + completedCount },
    { label: 'Kg textile saved', value: Math.round(((user.swapsCompleted ?? 0) + completedCount) * 2.1) },
    { label: 'Open negotiations', value: incoming.length + outgoing.length },
  ]

  return (
    <PageTransition>
      <div className="grain relative">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="show">
            {/* Profile header */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6">
              <Avatar name={user.name} size="xl" online />
              <div className="min-w-0 flex-1">
                <Eyebrow className="mb-1">My atelier</Eyebrow>
                <h1 className="truncate font-display text-4xl text-ivory md:text-5xl">{user.name}</h1>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                  {user.city} · member since{' '}
                  {new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}{' '}
                  ·{' '}
                  <span className="inline-flex items-center gap-1 text-red-light">
                    <Star className="h-3 w-3 fill-current" /> {(user.rating ?? 5).toFixed(1)}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <Button icon={Plus} magnetic onClick={() => setListingOpen(true)}>
                  List a piece
                </Button>
                <Button
                  variant="ghost"
                  icon={LogOut}
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                >
                  Sign out
                </Button>
              </div>
            </motion.div>

            {/* Impact stats */}
            <motion.div variants={fadeUp} className="mt-12">
              <MaterialCard className="grid grid-cols-2 gap-8 p-8 md:grid-cols-4">
                {stats.map((s) => (
                  <StatCounter key={s.label} value={s.value} label={s.label} numberClassName="text-3xl md:text-4xl" />
                ))}
              </MaterialCard>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={fadeUp} className="mt-14 flex gap-8 overflow-x-auto border-b border-gray-line/60">
              {TABS.map((t) => {
                const count =
                  t === 'Incoming' ? incoming.length : t === 'Outgoing' ? outgoing.length : t === 'History' ? history.length : myListings.length
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    aria-selected={tab === t}
                    role="tab"
                    className={cn(
                      'relative shrink-0 pb-4 text-sm font-medium transition-colors duration-200',
                      tab === t ? 'text-ivory' : 'text-gray-mid hover:text-gray-light',
                    )}
                  >
                    {t}
                    <span className="ml-1.5 font-mono text-[10px] text-gray-mid">{count}</span>
                    {tab === t && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red shadow-glow" />}
                  </button>
                )
              })}
            </motion.div>

            {/* Tab content */}
            <motion.div variants={fadeUp} className="mt-10">
              {tab === 'My listings' &&
                (myListings.length === 0 ? (
                  <EmptyState
                    eyebrow="Empty rack"
                    title="Nothing listed yet"
                    copy="Photograph a piece you no longer wear and put it up for trade."
                    actionLabel="List a piece"
                    onAction={() => setListingOpen(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {myListings.map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                ))}

              {tab === 'Incoming' &&
                (incoming.length === 0 ? (
                  <EmptyState
                    eyebrow="Quiet for now"
                    title="No incoming offers"
                    copy="When someone weighs a piece against yours, it lands here."
                  />
                ) : (
                  <div className="space-y-4">
                    {incoming.map((c) => (
                      <RequestRow
                        key={c.id}
                        convo={c}
                        onAccept={() => {
                          updateStatus(c.id, 'Accepted')
                          toast(`Accepted — arrange the exchange with ${c.counterpart.name.split(' ')[0]}.`, { type: 'success' })
                        }}
                        onDecline={() => {
                          updateStatus(c.id, 'Declined')
                          toast('Request declined.', { type: 'error' })
                        }}
                      />
                    ))}
                  </div>
                ))}

              {tab === 'Outgoing' &&
                (outgoing.length === 0 ? (
                  <EmptyState
                    eyebrow="Nothing pending"
                    title="No outgoing requests"
                    copy="Found something you love? Propose a swap from its listing page."
                    actionLabel="Browse the rack"
                    onAction={() => navigate('/browse')}
                  />
                ) : (
                  <div className="space-y-4">
                    {outgoing.map((c) => (
                      <RequestRow key={c.id} convo={c} />
                    ))}
                  </div>
                ))}

              {tab === 'History' &&
                (history.length === 0 ? (
                  <EmptyState eyebrow="Fresh start" title="No swap history yet" copy="Completed and declined swaps are archived here." />
                ) : (
                  <div className="max-w-xl">
                    <Timeline
                      items={history.map((c) => ({
                        date: new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                        title: `${c.mine.itemId} ⇄ ${c.theirs.itemId} — ${c.status}`,
                        description: `${c.mine.title} for ${c.counterpart.name.split(' ')[0]}'s ${c.theirs.title}.`,
                      }))}
                    />
                  </div>
                ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* New listing modal */}
      <Modal
        open={listingOpen}
        onClose={() => setListingOpen(false)}
        eyebrow="New listing"
        title="Put a piece on the rack"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setListingOpen(false)}>
              Cancel
            </Button>
            <Button icon={Plus} onClick={submitListing} data-testid="submit-listing">
              List it
            </Button>
          </>
        }
      >
        <form onSubmit={submitListing} className="space-y-5" noValidate>
          <ImageUploader max={5} onChange={setImages} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" error={submitted && draftErrors.title} htmlFor="nl-title">
              <Input
                id="nl-title"
                placeholder="Wool Overshirt, Rust Check"
                value={draft.title}
                error={submitted && draftErrors.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
            </Field>
            <Field label="Brand" error={submitted && draftErrors.brand} htmlFor="nl-brand">
              <Input
                id="nl-brand"
                placeholder="Uniqlo"
                value={draft.brand}
                error={submitted && draftErrors.brand}
                onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}
              />
            </Field>
            <Field label="Category" htmlFor="nl-category">
              <Select id="nl-category" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Size" error={submitted && draftErrors.size} htmlFor="nl-size">
                <Input
                  id="nl-size"
                  placeholder="M"
                  value={draft.size}
                  error={submitted && draftErrors.size}
                  onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))}
                />
              </Field>
              <Field label="Condition" htmlFor="nl-condition">
                <Select id="nl-condition" value={draft.condition} onChange={(e) => setDraft((d) => ({ ...d, condition: e.target.value }))}>
                  {CONDITIONS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
          <Field label="Description" hint="Honest condition notes build trust — mention every scuff.">
            <Textarea
              placeholder="Tell the story of this piece…"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </Field>
        </form>
      </Modal>
    </PageTransition>
  )
}
