import { useState } from 'react'
import { ArrowRight, Heart } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import MaterialCard from '../components/ui/MaterialCard'
import Badge from '../components/ui/Badge'
import FilterChip from '../components/ui/FilterChip'
import Modal from '../components/ui/Modal'
import { toast } from '../components/ui/Toast'
import Avatar from '../components/ui/Avatar'
import { Field, Input, Select, Textarea } from '../components/ui/fields'
import StatCounter from '../components/ui/StatCounter'
import StatusStepper from '../components/ui/StatusStepper'
import DataTable from '../components/ui/DataTable'
import Timeline from '../components/ui/Timeline'
import ImageUploader from '../components/ui/ImageUploader'
import ListingCard from '../components/listing/ListingCard'
import CategoryTile from '../components/listing/CategoryTile'
import SwapValuePill from '../components/listing/SwapValuePill'
import ChatBubble, { TypingIndicator } from '../components/chat/ChatBubble'
import { CONDITIONS } from '../lib/swapValue'
import { listings, categories, users, sampleMessages, sampleTimeline, impactStats } from '../data/seed'

function Block({ title, children }) {
  return (
    <section className="border-t border-gray-line/50 py-14 first:border-0">
      <Eyebrow tone="gray">{title}</Eyebrow>
      {children}
    </section>
  )
}

// Internal QA page (/dev/components): every shared primitive rendered live,
// so regressions in the design system are visible at a glance.
export default function Showcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeChips, setActiveChips] = useState(['Denim'])
  const [email, setEmail] = useState('')

  const emailError =
    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email address' : null

  const toggleChip = (name) =>
    setActiveChips((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]))

  return (
    <PageTransition>
      <div className="grain relative">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
          <Eyebrow>Internal — design system QA</Eyebrow>
          <h1 className="font-display text-5xl text-ivory">Component library</h1>
          <p className="mt-4 max-w-xl text-gray-mid">
            Every shared primitive, rendered live. If it looks wrong here, it looks wrong everywhere.
          </p>

          <Block title="Buttons">
            <div className="flex flex-wrap items-center gap-4">
              <Button magnetic iconRight={ArrowRight}>Primary · magnetic</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="ivory">Ivory</Button>
              <Button variant="danger">Danger</Button>
              <Button size="sm">Small</Button>
              <Button size="lg" magnetic>Large · magnetic</Button>
            </div>
          </Block>

          <Block title="Badges · condition scale (red intensity, never green)">
            <div className="flex flex-wrap gap-3">
              {CONDITIONS.map((c) => (
                <Badge key={c} condition={c} />
              ))}
              <SwapValuePill value={1250} />
            </div>
          </Block>

          <Block title="Filter chips">
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <FilterChip
                  key={c.name}
                  active={activeChips.includes(c.name)}
                  count={c.count}
                  onClick={() => toggleChip(c.name)}
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>
          </Block>

          <Block title="Listing cards · 3D tilt + red edge-glow on hover">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {listings.slice(4, 8).map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </Block>

          <Block title="Category tiles">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((c) => (
                <CategoryTile key={c.name} category={c} />
              ))}
            </div>
          </Block>

          <Block title="Material card + stat counters">
            <MaterialCard className="grid grid-cols-2 gap-8 p-10 md:grid-cols-4">
              {impactStats.map((s) => (
                <StatCounter key={s.label} value={s.value} label={s.label} />
              ))}
            </MaterialCard>
          </Block>

          <Block title="Status stepper · swap lifecycle">
            <div className="space-y-10">
              <StatusStepper current={2} />
              <div className="max-w-sm">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                  Compact variant
                </p>
                <StatusStepper current={3} compact />
              </div>
            </div>
          </Block>

          <Block title="Chat bubbles + typing indicator">
            <MaterialCard className="max-w-md space-y-4 p-6">
              {sampleMessages.map((m) => (
                <ChatBubble key={m.id} text={m.text} time={m.time} mine={m.from === 'u-01'} />
              ))}
              <TypingIndicator />
            </MaterialCard>
          </Block>

          <Block title="Avatars">
            <div className="flex flex-wrap items-end gap-6">
              {users.slice(0, 4).map((u, i) => (
                <div key={u.id} className="flex flex-col items-center gap-2">
                  <Avatar name={u.name} size={['sm', 'md', 'lg', 'xl'][i]} online={i % 2 === 0} />
                  <span className="text-xs text-gray-mid">{u.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Form fields · inline validation">
            <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
              <Field label="Email" error={emailError} htmlFor="sc-email">
                <Input
                  id="sc-email"
                  placeholder="you@example.com"
                  value={email}
                  error={emailError}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Category" htmlFor="sc-cat">
                <Select id="sc-cat" defaultValue="Denim">
                  {categories.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description" hint="Honest condition notes build trust.">
                  <Textarea placeholder="Tell the story of this piece…" />
                </Field>
              </div>
            </div>
          </Block>

          <Block title="Modal + toasts">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              <Button variant="outline" onClick={() => toast('Swap request sent to Ananya.', { type: 'success' })}>
                Success toast
              </Button>
              <Button variant="outline" onClick={() => toast('That listing is no longer available.', { type: 'error' })}>
                Error toast
              </Button>
            </div>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              eyebrow="Confirm swap"
              title="Send this swap request?"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    icon={Heart}
                    onClick={() => {
                      setModalOpen(false)
                      toast('Request sent — Rohan has 48h to respond.', { type: 'success' })
                    }}
                  >
                    Send request
                  </Button>
                </>
              }
            >
              <p className="text-sm leading-relaxed text-gray-light">
                You are offering your <span className="text-ivory">Levi's Trucker Jacket</span> (~₹1,430)
                for Rohan's <span className="text-ivory">Samba OG</span> (~₹1,410). The scale reads this
                as a fair swap.
              </p>
            </Modal>
          </Block>

          <Block title="Data table · sortable">
            <DataTable
              initialSort={{ key: 'swapsCompleted', dir: 'desc' }}
              columns={[
                {
                  key: 'name',
                  header: 'Member',
                  sortable: true,
                  render: (u) => (
                    <span className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <span className="text-ivory">{u.name}</span>
                    </span>
                  ),
                },
                { key: 'city', header: 'City', sortable: true },
                {
                  key: 'swapsCompleted',
                  header: 'Swaps',
                  sortable: true,
                  className: 'font-mono',
                },
                {
                  key: 'rating',
                  header: 'Rating',
                  sortable: true,
                  render: (u) => <span className="font-mono text-red-light">{u.rating.toFixed(1)}</span>,
                },
              ]}
              rows={users}
            />
          </Block>

          <Block title="Timeline · swap history">
            <div className="max-w-lg">
              <Timeline items={sampleTimeline} />
            </div>
          </Block>

          <Block title="Image uploader · drag & drop">
            <div className="max-w-lg">
              <ImageUploader />
            </div>
          </Block>
        </div>
      </div>
    </PageTransition>
  )
}
