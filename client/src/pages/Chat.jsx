import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowLeftRight, Check, Send } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ImageFrame from '../components/ui/ImageFrame'
import { Input } from '../components/ui/fields'
import { toast } from '../components/ui/Toast'
import ChatBubble, { TypingIndicator } from '../components/chat/ChatBubble'
import StatusChip from '../components/swap/StatusChip'
import { useSwapStore } from '../store/swapStore'
import { resolveRequest, formatClock } from '../lib/requests'
import { cn, formatRupees } from '../lib/utils'

// Canned counterpart replies — swapped for Socket.io / live polling in step 6.
const REPLIES = [
  'Let me check the sizing chart and get back to you tonight.',
  'Works for me. Which metro gate suits you?',
  'Can you send one more photo of the care label?',
  'Deal on my side — hit accept whenever you are ready.',
]

function ConversationRow({ convo, active, onClick }) {
  const last = convo.messages[convo.messages.length - 1]
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-3 border-b border-gray-line/40 px-4 py-4 text-left transition-colors duration-200',
        active ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]',
      )}
    >
      <Avatar name={convo.counterpart.name} size="md" online={convo.status === 'Negotiating'} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('truncate text-sm', active ? 'text-ivory' : 'text-gray-light')}>
            {convo.counterpart.name}
          </p>
          <span className="shrink-0 font-mono text-[9px] text-gray-mid">
            {last?.time || ''}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-mid">
          {last ? (last.from === 'me' ? `You: ${last.text}` : last.text) : 'No messages yet'}
        </p>
        <div className="mt-1.5">
          <StatusChip status={convo.status} className="px-2 py-0.5 text-[8px]" />
        </div>
      </div>
    </button>
  )
}

export default function Chat() {
  const [params, setParams] = useSearchParams()
  const requests = useSwapStore((s) => s.requests)
  const addMessage = useSwapStore((s) => s.addMessage)
  const updateStatus = useSwapStore((s) => s.updateRequestStatus)

  const conversations = requests
    .map(resolveRequest)
    .filter((r) => r.offered && r.requested && r.status !== 'Declined')

  const requestedId = params.get('request')
  const active = conversations.find((c) => c.id === requestedId) ?? null
  const showListOnMobile = !requestedId

  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const threadRef = useRef(null)
  const replyTimer = useRef(null)

  useEffect(() => () => clearTimeout(replyTimer.current), [])

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight })
  }, [active?.messages.length, typing])

  const openConversation = (id) => setParams({ request: id })

  const send = (e) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || !active) return
    addMessage(active.id, { id: `m-${Date.now()}`, from: 'me', text, time: formatClock() })
    setDraft('')
    if (active.status === 'Requested') updateStatus(active.id, 'Negotiating')
    setTyping(true)
    const replyIndex = active.messages.length % REPLIES.length
    replyTimer.current = setTimeout(() => {
      setTyping(false)
      addMessage(active.id, {
        id: `m-${Date.now() + 1}`,
        from: 'them',
        text: REPLIES[replyIndex],
        time: formatClock(),
      })
    }, 1800)
  }

  const confirmAgreement = () => {
    updateStatus(active.id, 'Accepted')
    addMessage(active.id, {
      id: `m-${Date.now()}`,
      from: 'system',
      text: `Agreement confirmed — ${active.mine.itemId} ⇄ ${active.theirs.itemId} locked at ${formatRupees(active.mine.swapValue)} ⇄ ${formatRupees(active.theirs.swapValue)}.`,
      time: '',
    })
    toast('Agreement confirmed. Arrange the hand-over in chat.', { type: 'success' })
  }

  if (conversations.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-40">
          <EmptyState
            eyebrow="The parlour"
            title="No negotiations yet"
            copy="Send a swap request from any listing and the conversation opens here."
            actionLabel="Browse the rack"
            onAction={() => (window.location.href = '/browse')}
          />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-0 pt-16 sm:px-6 lg:px-8">
        <div className="grid h-[calc(100vh-4rem)] grid-cols-1 overflow-hidden border-gray-line/60 bg-black sm:h-[calc(100vh-6rem)] sm:rounded-2xl sm:border sm:shadow-material lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <aside
            className={cn(
              'flex-col overflow-y-auto border-r border-gray-line/60 bg-black-deep',
              showListOnMobile ? 'flex' : 'hidden lg:flex',
            )}
          >
            <div className="border-b border-gray-line/60 px-4 py-4">
              <p className="text-eyebrow text-[10px] text-gray-mid">The parlour</p>
              <h1 className="mt-1 font-display text-2xl text-ivory">Negotiations</h1>
            </div>
            {conversations.map((convo) => (
              <ConversationRow
                key={convo.id}
                convo={convo}
                active={convo.id === active?.id}
                onClick={() => openConversation(convo.id)}
              />
            ))}
          </aside>

          {/* Thread */}
          <section className={cn('flex-col', active && !showListOnMobile ? 'flex' : 'hidden lg:flex')}>
            {active ? (
              <>
                {/* Pinned swap summary */}
                <div className="border-b border-gray-line/60 bg-charcoal/60 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setParams({})}
                      className="rounded-full p-1.5 text-gray-mid hover:bg-white/5 hover:text-ivory lg:hidden"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="flex shrink-0 -space-x-2">
                      {[active.mine, active.theirs].map((item) => (
                        <span key={item.id} className="h-10 w-10 overflow-hidden rounded-lg border border-gray-line">
                          <ImageFrame src={item.image} alt={item.title} category={item.category} />
                        </span>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ivory">
                        {active.mine.itemId} ⇄ {active.theirs.itemId} · {active.counterpart.name}
                      </p>
                      <p className="font-mono text-[10px] text-gray-mid">
                        ~{formatRupees(active.mine.swapValue)} ⇄ ~{formatRupees(active.theirs.swapValue)}
                      </p>
                    </div>
                    <StatusChip status={active.status} className="hidden sm:inline-flex" />
                    {(active.status === 'Requested' || active.status === 'Negotiating') && (
                      <Button size="sm" icon={Check} onClick={confirmAgreement} data-testid="confirm-agreement">
                        Confirm
                      </Button>
                    )}
                    <Link
                      to={`/swap/${active.id}`}
                      className="hidden rounded-full border border-gray-line p-2 text-gray-mid transition-colors duration-200 hover:border-red hover:text-red-light sm:block"
                      aria-label="Open swap summary"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Messages */}
                <div ref={threadRef} className="grain relative flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
                  {active.messages.map((m) =>
                    m.from === 'system' ? (
                      <p
                        key={m.id}
                        className="mx-auto max-w-md text-center font-mono text-[10px] uppercase tracking-[0.12em] text-gray-mid"
                      >
                        — {m.text} —
                      </p>
                    ) : (
                      <ChatBubble key={m.id} text={m.text} time={m.time} mine={m.from === 'me'} />
                    ),
                  )}
                  {typing && <TypingIndicator />}
                  {active.messages.length === 0 && !typing && (
                    <p className="pt-10 text-center text-sm text-gray-mid">
                      Open the negotiation — say hello to {active.counterpart.name.split(' ')[0]}.
                    </p>
                  )}
                </div>

                {/* Composer */}
                <form onSubmit={send} className="flex items-center gap-3 border-t border-gray-line/60 px-4 py-4">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Message ${active.counterpart.name.split(' ')[0]}…`}
                    aria-label="Message"
                    className="flex-1"
                  />
                  <Button type="submit" icon={Send} disabled={!draft.trim()} aria-label="Send message">
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-10">
                <p className="font-mono text-xs uppercase tracking-eyebrow text-gray-mid">
                  Select a negotiation
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
