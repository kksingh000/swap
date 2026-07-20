# 7-Day Build Plan

Honest framing first: a fully polished, 3D, animation-rich, 8-page app with a real Node/Express + MongoDB backend, auth, and real-time chat is realistically **8–10 focused days** solo, not 7 — you said "a week or somewhat more," so this plan targets 7 core days + 2 buffer days explicitly reserved for polish/backend hardening. Don't compress the buffer away; that's where refinement actually happens.

Each day assumes ~5-7 focused hours. Frontend is built against realistic mock data first, then wired to the real backend — this keeps every day's visual output demoable even before the backend exists.

---

## Day 1 — Foundation & Design System
**Goal:** every future day is just assembling components that already exist and already look right.

- Scaffold Vite + React 18 + Tailwind + React Router
- Install: Framer Motion, react-parallax-tilt, Lucide React, Zustand, Recharts (admin, later)
- Load fonts (Fraunces, Outfit, JetBrains Mono), set Tailwind theme tokens (navy/gold/emerald, shadows)
- Build atomic components: `Navbar`, `Footer`, `Button`, `GlassCard`, `Modal`, `Toast`, `Avatar`, `StatCounter`
- Build `useTilt` hook / wire up `react-parallax-tilt` pattern
- Build gradient-mesh-blob background component
- Deploy empty skeleton to Vercel immediately (so every day after this has a live URL to check on real devices)
- **Refinement checkpoint:** open the design-system components at 375px and 1440px, confirm shadows/glow/tilt all feel right before moving on — this is the day mistakes are cheapest to fix

## Day 2 — Landing Page (full polish)
- Hero: headline, subcopy, CTAs, 3D floating garment visual (CSS 3D transform layered clothing/hanger shapes), parallax on mouse move
- "How it works" 3-step with scroll-reveal stagger
- Featured swaps carousel using `ListingCard` (build `ListingCard` here, reused everywhere after)
- Impact stats row with `StatCounter`
- Category tiles with tilt
- Testimonial strip, final CTA band
- Full responsive pass (375 / 768 / 1440)
- **Refinement checkpoint:** this page is the first impression — do a full pass with fresh eyes at the end of the day, not just "does it work"

## Day 3 — Auth + Browse Listings
- Login/Register split-screen page, inline validation, tab toggle animation
- Browse Listings: filter drawer (category/size/brand/condition/location radius), sort control
- Listing grid using `ListingCard`, "Near you" strip
- Empty state, pagination/infinite scroll
- Realistic seed data: write 20-30 real-sounding listings (brand, size, condition, city) — no placeholders, per PRD rule
- **Refinement checkpoint:** filters must actually filter the mock data correctly before end of day

## Day 4 — Item Detail + Signature 3D Component
- Item Detail page: gallery/lightbox, meta, owner mini-profile
- `SwapValueCalculator`: inputs → animated estimated value
- **`BalanceScale3D`** — the signature differentiator, build and polish this fully today, don't rush it. Spring physics tilt, level-snap glow state
- Send Swap Request modal flow
- **Refinement checkpoint:** this is the "wow" component — test it with several value-delta scenarios (huge imbalance, near-perfect match) to make sure the animation reads correctly in all cases

## Day 5 — Swap Request Flow + Chat + Dashboard
- Swap Request/Negotiation Summary page: side-by-side comparison, compact `BalanceScale3D`, `StatusStepper`, accept/reject/counter actions
- Chat page UI: conversation list, message thread, bubbles, typing indicator, pinned swap summary, confirm-agreement action (frontend only today — mock messages)
- User Dashboard: profile header, impact stat cards, tabs (Listings/Incoming/Outgoing/History), `Timeline` for swap history, new-listing uploader modal
- **Refinement checkpoint:** click through the entire user journey front to back (browse → detail → request → chat → confirm → dashboard) on mock data — note every rough edge for tomorrow

## Day 6 — Backend + Admin Panel + Real Wiring
- Node.js + Express API: auth (JWT), listings CRUD, swap requests CRUD, chat (Socket.io), MongoDB schemas matching the PRD data requirements
- Wire frontend to real API, replace mock data incrementally (keep mocks as fallback/seed script)
- Admin Panel: `DataTable` for users/listings, dispute queue, Recharts analytics tied to real KPIs (listings count, swaps completed, engagement, conversion rate, active users)
- Deploy backend to Render
- **Refinement checkpoint:** every write action (create listing, send request, send message) must actually persist and reload correctly — this is where "looks done" and "is done" diverge

## Day 7 — QA, Responsive, Deploy
- Full cross-device pass (mobile/tablet/desktop) on every page
- Accessibility pass: focus states, contrast, alt text, keyboard nav through forms/modals
- Performance pass: Lighthouse, image optimization, lazy-load below-fold sections
- Fix every rough edge logged on Day 5-6
- Final seed data pass — realistic, varied, no duplicates
- Final deploy: frontend → Vercel, backend → Render, confirm live link end-to-end
- Assemble final PRD deliverable doc (this vault already has it — just needs a "final" export pass)

---

## Buffer Days 8-9 (recommended, not optional if quality matters)
- Day 8: micro-interaction polish pass across *every* component (this always takes longer than expected — budget a full day for it, not an hour)
- Day 9: real-time chat hardening (Socket.io edge cases), location-radius matching polish, dispute-resolution admin flow polish, final bug bash

## Risk Flags (be honest with yourself about these)
- **Real-time chat** (Socket.io) is the single most likely thing to eat unplanned time — if Day 6 runs long, ship chat with polling/refresh instead of full sockets for the deadline, upgrade after
- **Location-based matching**: PRD only requires "suggestions," not a real map/geolocation API — a simple city/radius filter on stored location strings is enough for Phase 1, don't over-build this
- **Courier integration** is explicitly out of scope for Phase 1 per PRD — don't let it creep in
- If Day 1 runs long (it's the highest-leverage day), it's fine to bleed into Day 2 morning — everything downstream is faster because of it

## Daily Discipline
- End every day with a live Vercel preview check on an actual phone, not just desktop dev tools
- Never move to the next day's components until today's have the two-layer shadow + tilt/motion treatment applied — "functional but flat" components are technical debt that's expensive to retrofit on Day 7
