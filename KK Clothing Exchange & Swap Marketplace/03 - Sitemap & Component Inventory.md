# Sitemap & Component Inventory

PRD requires 6–8 interconnected pages. Using 8 to cover every functional module cleanly.

## Pages

1. **Landing / Home** — marketing entry point, not gated
2. **Login / Register** — auth (shared page, tab toggle)
3. **Browse Listings** — filterable clothing grid + location matching
4. **Item Detail** — single listing, swap value calculator, send request
5. **Swap Request / Negotiation Summary** — side-by-side comparison, propose/counter
6. **Chat** — real-time negotiation messaging tied to a swap request
7. **User Dashboard** — profile, my listings, requests, swap history, impact stats
8. **Admin Panel** — user/listing management, disputes, analytics

---

## 1. Landing / Home
- Sticky blurred navbar
- Hero: headline + subcopy + primary/ghost CTA + 3D floating garment/hanger visual + gradient mesh blobs
- "How it works" 3-step (List → Match → Swap), glass cards, scroll-reveal stagger
- Featured swaps carousel (3D tilt cards)
- Impact stats row (count-up: listings, swaps completed, kg textile waste diverted)
- Category tiles (tilt-on-hover, per PRD clothing types)
- Testimonial/community strip
- Final CTA band
- Footer

## 2. Login / Register
- Split-screen layout: form left, animated illustration/gradient right
- Tab toggle (Login / Register) with sliding indicator
- Form validation (inline, real-time)
- Social proof strip or trust badges (optional)

## 3. Browse Listings
- Filter sidebar/drawer: category, size, brand, condition, location radius
- Sort control (newest, closest, swap value)
- Listing grid: 3D tilt cards — image, title, brand, size, condition badge, swap-value pill, "swap available" status dot
- Location-based suggestions strip ("Near you")
- Empty state (no matches) with illustration
- Pagination or infinite scroll
- Map/location toggle view (Phase 1: simple radius filter is enough; full map is stretch)

## 4. Item Detail
- Image gallery with lightbox
- Item meta: type, brand, size, condition, location, owner mini-profile (avatar, rating, swap count)
- **Swap Value Calculator** widget: inputs (brand tier, condition, category) → animated estimated value output
- **3D balance-scale comparison**: user picks one of their own listings to offer → scale visually balances/tilts based on value delta (signature component)
- "Send Swap Request" primary CTA → opens request modal
- Related/similar listings strip

## 5. Swap Request / Negotiation Summary
- Two-item side-by-side comparison cards (offered vs requested)
- Value delta indicator (reuses balance-scale component, smaller variant)
- Status stepper: Requested → Negotiating → Accepted → Shipped/Exchanged → Completed
- Accept / Reject / Counter-offer actions
- Link into Chat for that request

## 6. Chat
- Conversation list sidebar (per active swap negotiation)
- Message thread: bubbles, timestamps, typing indicator
- Swap summary card pinned in sidebar (both items, current status)
- "Confirm Swap Agreement" action inside chat
- Real-time via WebSockets (Socket.io) — see build plan Day 6 for backend wiring

## 7. User Dashboard
- Profile header: avatar, name, location, member since, swap rating
- Impact stat cards (items swapped, textile waste saved — emerald accent)
- Tabs: My Listings / Incoming Requests / Outgoing Requests / Swap History
- My Listings: grid with edit/remove/status toggle
- Swap History: timeline component, most recent first
- Quick "New Listing" CTA (drag-drop image uploader modal)

## 8. Admin Panel
- Sidebar nav (Users, Listings, Disputes, Analytics)
- Data tables: sortable/filterable, row actions (remove listing, suspend user, resolve dispute)
- Analytics: charts (Recharts) for listings over time, swap conversion rate, active users — mirrors PRD KPIs directly
- Dispute queue with resolution workflow

---

## Shared / Atomic Component Library

Build these once in Day 1, reuse everywhere:

| Component | Notes |
|---|---|
| `Navbar` | sticky, blurred, mobile drawer |
| `Footer` | link columns + social |
| `Button` (primary / ghost / icon) | glow + magnetic hover |
| `GlassCard` | base two-layer-shadow card |
| `ListingCard` | 3D tilt, image, badges, value pill |
| `CategoryTile` | tilt + full-bleed image + overlay |
| `FilterChip` / `FilterDrawer` | category/size/location filters |
| `SwapValueCalculator` | interactive input → animated output |
| `BalanceScale3D` | signature swap-fairness visual |
| `StatusStepper` | swap lifecycle progress |
| `ChatBubble` / `TypingIndicator` | messaging primitives |
| `Avatar` + `RatingBadge` | user identity |
| `StatCounter` | animated count-up |
| `Modal` / `Dialog` | confirm swap, new listing |
| `Toast` | notifications |
| `EmptyState` | no listings / no messages |
| `ImageUploader` | drag-drop, multi-preview |
| `DataTable` | admin, sortable/filterable |
| `Timeline` | swap history |

## Signature Component Deep-Dive: BalanceScale3D
The differentiator component — appears on Item Detail (large) and Swap Request Summary (compact).
- CSS 3D transform (rotateZ on a beam element) + two hanging "pan" elements
- Tilts proportionally to the value delta between the two items being compared
- Snaps to level (with a subtle gold glow + emerald checkmark) when values are within a "fair" threshold
- Framer Motion spring physics for the tilt, not linear easing — needs to feel physical/weighted
