import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Ban, Check, RotateCcw, Scale, ShieldAlert, Trash2 } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Eyebrow from '../components/ui/Eyebrow'
import MaterialCard from '../components/ui/MaterialCard'
import Avatar from '../components/ui/Avatar'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ImageFrame from '../components/ui/ImageFrame'
import StatCounter from '../components/ui/StatCounter'
import { toast } from '../components/ui/Toast'
import { useAdminStore } from '../store/adminStore'
import { useSwapStore } from '../store/swapStore'
import { useListingStore } from '../store/listingStore'
import { listings, users, disputes, analyticsSeries } from '../data/seed'
import { fadeUp, stagger } from '../lib/motion'
import { cn, formatRupees } from '../lib/utils'

const SECTIONS = ['Analytics', 'Users', 'Listings', 'Disputes']

// Recharts, restyled to the palette — no default chart colors anywhere.
const AXIS = { stroke: '#8A8A85', tickLine: false, tick: { fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#8A8A85' } }
const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#161616',
    border: '1px solid #333333',
    borderRadius: 12,
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#F5F3EF',
  },
  labelStyle: { color: '#8A8A85', fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase' },
}

function Pill({ children, tone = 'gray' }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]',
        tone === 'red' && 'border border-red/40 bg-red/10 text-red-light',
        tone === 'solid' && 'bg-red text-ivory',
        tone === 'gray' && 'border border-gray-line text-gray-light',
        tone === 'dim' && 'border border-gray-line text-gray-mid opacity-70',
      )}
    >
      {children}
    </span>
  )
}

export default function Admin() {
  const [section, setSection] = useState(SECTIONS[0])
  const {
    suspendedUserIds,
    removedListingIds,
    resolvedDisputes,
    toggleUserSuspended,
    toggleListingRemoved,
    resolveDispute,
  } = useAdminStore()
  const requests = useSwapStore((s) => s.requests)
  const userListings = useListingStore((s) => s.userListings)

  const allListings = useMemo(() => [...userListings, ...listings], [userListings])
  const completed = requests.filter((r) => r.status === 'Completed').length
  const conversion = requests.length ? Math.round((completed / requests.length) * 100) : 0
  const openDisputes = disputes.filter((d) => !resolvedDisputes[d.id])

  const statusData = useMemo(() => {
    const counts = {}
    for (const r of requests) counts[r.status] = (counts[r.status] ?? 0) + 1
    return ['Requested', 'Negotiating', 'Accepted', 'Exchanged', 'Completed', 'Declined'].map(
      (status) => ({ status: status.slice(0, 6), full: status, count: counts[status] ?? 0 }),
    )
  }, [requests])

  const kpis = [
    { label: 'Listings live', value: allListings.length - removedListingIds.length },
    { label: 'Swaps completed', value: 14 + completed },
    { label: 'Conversion rate', value: conversion, suffix: '%' },
    { label: 'Active members', value: users.length - suspendedUserIds.length },
  ]

  return (
    <PageTransition>
      <div className="grain relative">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Back of house</Eyebrow>
                <h1 className="font-display text-4xl text-ivory md:text-5xl">Admin panel</h1>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                Signed in as demo admin · read/write
              </span>
            </motion.div>

            {/* Section nav */}
            <motion.div variants={fadeUp} className="mt-10 flex gap-8 overflow-x-auto border-b border-gray-line/60">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  role="tab"
                  aria-selected={section === s}
                  className={cn(
                    'relative shrink-0 pb-4 text-sm font-medium transition-colors duration-200',
                    section === s ? 'text-ivory' : 'text-gray-mid hover:text-gray-light',
                  )}
                >
                  {s}
                  {s === 'Disputes' && openDisputes.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-red px-1.5 py-0.5 font-mono text-[9px] text-ivory">
                      {openDisputes.length}
                    </span>
                  )}
                  {section === s && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red shadow-glow" />}
                </button>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10">
              {/* ————— Analytics ————— */}
              {section === 'Analytics' && (
                <div className="space-y-8">
                  <MaterialCard className="grid grid-cols-2 gap-8 p-8 md:grid-cols-4">
                    {kpis.map((k) => (
                      <StatCounter key={k.label} value={k.value} suffix={k.suffix ?? ''} label={k.label} numberClassName="text-3xl md:text-4xl" />
                    ))}
                  </MaterialCard>

                  <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                    <MaterialCard className="p-7">
                      <Eyebrow tone="gray">Growth · last six months</Eyebrow>
                      <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsSeries} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                            <defs>
                              <linearGradient id="redFade" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A6192E" stopOpacity={0.45} />
                                <stop offset="100%" stopColor="#A6192E" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#333333" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" {...AXIS} axisLine={{ stroke: '#333333' }} />
                            <YAxis {...AXIS} axisLine={false} />
                            <Tooltip {...TOOLTIP_STYLE} cursor={{ stroke: '#6E1120' }} />
                            <Area type="monotone" dataKey="listings" name="Listings" stroke="#D33F52" strokeWidth={2} fill="url(#redFade)" />
                            <Area type="monotone" dataKey="swaps" name="Swaps sealed" stroke="#8A8A85" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-gray-mid">
                        <span className="text-red-light">— listings</span> · <span>- - swaps sealed</span>
                      </p>
                    </MaterialCard>

                    <MaterialCard className="p-7">
                      <Eyebrow tone="gray">Requests by stage</Eyebrow>
                      <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={statusData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                            <CartesianGrid stroke="#333333" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="status" {...AXIS} axisLine={{ stroke: '#333333' }} />
                            <YAxis {...AXIS} axisLine={false} allowDecimals={false} />
                            <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'rgba(166,25,46,0.08)' }} />
                            <Bar dataKey="count" name="Requests" fill="#A6192E" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </MaterialCard>
                  </div>
                </div>
              )}

              {/* ————— Users ————— */}
              {section === 'Users' && (
                <DataTable
                  initialSort={{ key: 'swapsCompleted', dir: 'desc' }}
                  columns={[
                    {
                      key: 'name',
                      header: 'Member',
                      sortable: true,
                      render: (u) => (
                        <span className={cn('flex items-center gap-3', suspendedUserIds.includes(u.id) && 'opacity-50')}>
                          <Avatar name={u.name} size="sm" />
                          <span className="text-ivory">{u.name}</span>
                        </span>
                      ),
                    },
                    { key: 'city', header: 'City', sortable: true },
                    { key: 'swapsCompleted', header: 'Swaps', sortable: true, className: 'font-mono' },
                    {
                      key: 'rating',
                      header: 'Rating',
                      sortable: true,
                      render: (u) => <span className="font-mono text-red-light">{u.rating.toFixed(1)}</span>,
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      accessor: (u) => (suspendedUserIds.includes(u.id) ? 1 : 0),
                      render: (u) =>
                        suspendedUserIds.includes(u.id) ? <Pill tone="dim">Suspended</Pill> : <Pill tone="red">Active</Pill>,
                    },
                    {
                      key: 'actions',
                      header: '',
                      render: (u) => {
                        const suspended = suspendedUserIds.includes(u.id)
                        return (
                          <button
                            onClick={() => {
                              toggleUserSuspended(u.id)
                              toast(suspended ? `${u.name} restored.` : `${u.name} suspended.`, { type: suspended ? 'success' : 'error' })
                            }}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-200',
                              suspended
                                ? 'border-gray-line text-gray-light hover:border-red hover:text-red-light'
                                : 'border-red/40 text-red-light hover:bg-red/10',
                            )}
                          >
                            {suspended ? <RotateCcw className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                            {suspended ? 'Restore' : 'Suspend'}
                          </button>
                        )
                      },
                    },
                  ]}
                  rows={users}
                />
              )}

              {/* ————— Listings ————— */}
              {section === 'Listings' && (
                <DataTable
                  initialSort={{ key: 'swapValue', dir: 'desc' }}
                  columns={[
                    {
                      key: 'title',
                      header: 'Item',
                      sortable: true,
                      render: (l) => (
                        <span className={cn('flex items-center gap-3', removedListingIds.includes(l.id) && 'opacity-50')}>
                          <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-line">
                            <ImageFrame src={l.image} alt={l.title} category={l.category} />
                          </span>
                          <span>
                            <span className="block max-w-48 truncate text-ivory">{l.title}</span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-gray-mid">
                              {l.itemId} · {l.brand}
                            </span>
                          </span>
                        </span>
                      ),
                    },
                    { key: 'category', header: 'Category', sortable: true },
                    { key: 'city', header: 'City', sortable: true },
                    {
                      key: 'swapValue',
                      header: 'Value',
                      sortable: true,
                      render: (l) => <span className="font-mono text-red-light">~{formatRupees(l.swapValue)}</span>,
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      accessor: (l) => (removedListingIds.includes(l.id) ? 1 : 0),
                      render: (l) =>
                        removedListingIds.includes(l.id) ? <Pill tone="dim">Removed</Pill> : <Pill tone="gray">Available</Pill>,
                    },
                    {
                      key: 'actions',
                      header: '',
                      render: (l) => {
                        const removed = removedListingIds.includes(l.id)
                        return (
                          <button
                            onClick={() => {
                              toggleListingRemoved(l.id)
                              toast(removed ? `${l.itemId} restored to the rack.` : `${l.itemId} removed from the rack.`, { type: removed ? 'success' : 'error' })
                            }}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-200',
                              removed
                                ? 'border-gray-line text-gray-light hover:border-red hover:text-red-light'
                                : 'border-red/40 text-red-light hover:bg-red/10',
                            )}
                          >
                            {removed ? <RotateCcw className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                            {removed ? 'Restore' : 'Remove'}
                          </button>
                        )
                      },
                    },
                  ]}
                  rows={allListings}
                />
              )}

              {/* ————— Disputes ————— */}
              {section === 'Disputes' &&
                (disputes.length === 0 ? (
                  <EmptyState eyebrow="All clear" title="No disputes" copy="The rack is at peace." />
                ) : (
                  <div className="space-y-4">
                    {disputes.map((d) => {
                      const raisedBy = users.find((u) => u.id === d.raisedById)
                      const against = users.find((u) => u.id === d.againstId)
                      const resolution = resolvedDisputes[d.id]
                      return (
                        <MaterialCard key={d.id} className={cn('p-6', resolution && 'opacity-60')}>
                          <div className="flex flex-wrap items-start gap-4">
                            <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full border', resolution ? 'border-gray-line text-gray-mid' : 'border-red/40 bg-red/10 text-red-light')}>
                              <ShieldAlert className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <p className="text-sm text-ivory">
                                  {raisedBy.name} <span className="text-gray-mid">vs</span> {against.name}
                                </p>
                                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-gray-mid">
                                  {d.id} · opened {new Date(d.openedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                                {resolution ? <Pill tone="dim">Resolved</Pill> : <Pill tone="solid">Open</Pill>}
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-gray-light">“{d.reason}”</p>
                              {resolution ? (
                                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid">
                                  Resolution: {resolution}
                                </p>
                              ) : (
                                <div className="mt-4 flex flex-wrap gap-3">
                                  <Button
                                    size="sm"
                                    icon={Check}
                                    onClick={() => {
                                      resolveDispute(d.id, `Upheld for ${raisedBy.name.split(' ')[0]} — swap reversed`)
                                      toast(`Dispute ${d.id} resolved for ${raisedBy.name.split(' ')[0]}.`, { type: 'success' })
                                    }}
                                  >
                                    Uphold for {raisedBy.name.split(' ')[0]}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    icon={Scale}
                                    onClick={() => {
                                      resolveDispute(d.id, 'Dismissed — listing accurate on inspection')
                                      toast(`Dispute ${d.id} dismissed.`, { type: 'success' })
                                    }}
                                  >
                                    Dismiss
                                  </Button>
                                  <Button size="sm" variant="ghost" to={`/swap/${d.requestId}`}>
                                    View swap
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </MaterialCard>
                      )
                    })}
                  </div>
                ))}
            </motion.div>

            <motion.p variants={fadeUp} className="mt-12 text-center font-mono text-[9px] uppercase tracking-eyebrow text-gray-mid">
              Moderation actions persist locally · wired to the Express admin API on deploy —{' '}
              <Link to="/dev/components" className="text-red-light hover:text-ivory">
                design system
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
