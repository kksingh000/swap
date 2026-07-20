# Prompt for Claude Code

Copy everything in the code block below into Claude Code to start Day 1.

```
I'm building "Swap" — a Clothing Exchange & Swap Marketplace web app. Full context below. Read all of it before writing any code.

=== PROJECT OVERVIEW ===
A platform where users list clothes they no longer wear and swap them directly with other users — no money changes hands. Core loop: list an item → browse others' items → send a swap request → negotiate via chat → confirm and exchange. Includes a swap-value calculator (estimates fairness based on brand/condition/category) and location-based matching. This is a portfolio/academic project that will be evaluated on a live deployed link, so it needs to be fully functional, not a mockup.

=== HARD REQUIREMENTS (non-negotiable) ===
- 6-8 interconnected pages, minimum: Login/Register, Browse Listings, Item Detail, Swap Request/Negotiation, Chat, User Dashboard, Admin Panel, plus a Landing page = 8 pages
- Swap request and negotiation chat must actually function (real state changes, not decorative UI)
- Realistic seed data only — real-sounding brands, sizes, conditions, cities. No Lorem Ipsum, no "Item 1 / Item 2" placeholders.
- Real authentication (JWT), with proper validation on all forms
- Fully mobile-responsive (test at 375px)
- Must be deployable to a live URL (frontend: Vercel, backend: Render)

=== SCOPE ===
In scope: registration/login, clothing listings (CRUD), swap requests, negotiation chat, swap value calculator, location-based matching (simple city/radius filter — no real geolocation API needed), admin panel (manage users/listings, resolve disputes, view analytics).
Explicitly OUT of scope — do not build these: online payments, AI recommendations, AR try-on, native mobile app, courier/shipping API integration (can be a stub field only).

=== DESIGN DIRECTION — READ CAREFULLY ===
This must NOT look like a generic resale marketplace (Poshmark, Depop) or a generic corporate/SaaS template (flat cards, default shadows, stock photography, Tailwind default blue). Those were explicitly studied and rejected as references — too flat, too cluttered, too generic. The target aesthetic is 3D, dark, editorial, and luxurious — think a high-fashion boutique/atelier, not a flea-market app.

Color palette — black / white / red / gray ONLY. No navy, no gold, no green, no default Tailwind blue/purple:
- Black `#0A0A0A` (primary background), deep black `#050505`, charcoal `#161616` (elevated surfaces)
- Red `#A6192E` (oxblood/crimson) as the SINGLE accent color — used for CTAs, hover states, active states, glows. Red-light `#D33F52` for hover, red-deep `#6E1120` for pressed/shadow tint. Do not add a second accent color for "success" states — vary using red intensity + white/gray instead.
- White `#FFFFFF` and warm ivory `#F5F3EF` for light sections/contrast text
- Grays: light `#D8D6D2`, mid `#8A8A85`, dark `#2B2B2B`, hairline border `#333333`

Typography: 'Fraunces' (serif, Google Font) for display/hero headings, 'Outfit' (sans, Google Font) for body/UI, 'JetBrains Mono' for item IDs / swap values / admin data (gives an "appraisal" feel). Use generous letter-spacing uppercase eyebrow labels (`tracking-[0.2em] uppercase text-xs`) above section headings — this is a key luxury signal, use it throughout.

Depth system — this is the core visual differentiator, apply it everywhere:
- Every elevated card/surface gets TWO shadows layered together: a large soft ambient shadow + a tight contact shadow, plus a 1px inset top edge-light to sell a "material catching light" feel. Example: `shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6),0_2px_10px_-2px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]`
- Every card representing a clothing listing gets 3D tilt-on-hover (mouse-reactive perspective/rotateX/rotateY, ~8deg max, spring-damped return) — use `react-parallax-tilt` or a custom hook. On hover, add a thin red edge-glow border, not a color fill.
- Blurred low-opacity gradient "blob" shapes (deep red + charcoal) floating slowly behind hero/section content
- A subtle grain/noise texture overlay (2-3% opacity) on dark sections for a premium print feel
- Generous whitespace: `py-24`/`py-32` section padding — cramped = cheap, spacious = luxury
- Mix sharp-cornered (`rounded-none`) editorial image frames with rounded UI chrome (`rounded-2xl` cards, `rounded-full` pills) deliberately, not uniformly rounded everything

Signature "wow" component — build this properly, it's the differentiator: a 3D balance-scale visualization for the swap value comparison. Two items sit on either side of a beam; the beam tilts in 3D based on the value delta between them (Framer Motion spring physics, not linear easing — it needs to feel physically weighted), and snaps level with a red glow when the values are within a fair threshold. Appears large on the Item Detail page and compact on the Swap Request Summary page.

Motion principles: Framer Motion `whileInView` scroll-reveal (fade + slide-up) on every section with staggered children; magnetic CTA buttons (slight shift toward cursor); `AnimatePresence` cross-fade page transitions; animated count-up on all numeric stats; every hover/focus transition uses `duration-200`/`duration-300`, never instant.

=== TECH STACK ===
- Frontend: Vite + React 18 + React Router v6 + Tailwind CSS v3
- Animation: Framer Motion + react-parallax-tilt
- Icons: Lucide React
- State: useState/useReducer local, Zustand for global (auth session, active swap negotiation)
- Charts (admin analytics): Recharts, restyled to black/white/red — no default chart colors
- Backend: Node.js + Express, JWT auth, MongoDB (Mongoose)
- Real-time chat: Socket.io (if this runs long, ship with polling/refresh first, upgrade to full sockets after core pages work)
- Deployment: frontend to Vercel, backend to Render

=== PAGES & KEY COMPONENTS ===
1. Landing — hero with 3D floating garment/hanger visual (CSS 3D transforms, parallax on mouse move) + gradient blobs, "how it works" 3-step, featured swaps carousel, animated impact stats, category tiles (tilt), testimonial strip, final CTA
2. Login/Register — split-screen, tab toggle, inline validation
3. Browse Listings — filter drawer (category/size/brand/condition/location radius), sort, 3D tilt listing cards (image, brand, size, condition badge, swap-value pill), empty state, pagination
4. Item Detail — image gallery/lightbox, owner mini-profile, swap value calculator (animated output), the 3D balance-scale component, send-request modal
5. Swap Request/Negotiation Summary — side-by-side item comparison, compact balance-scale, status stepper (Requested → Negotiating → Accepted → Exchanged → Completed), accept/reject/counter
6. Chat — conversation list, message thread with typing indicator, pinned swap summary, confirm-agreement action
7. User Dashboard — profile header, impact stats, tabs (My Listings / Incoming / Outgoing / History), swap history timeline, new-listing uploader (drag-drop, multi-image)
8. Admin Panel — sortable/filterable data tables (users, listings), dispute queue, analytics charts matching KPIs (listings count, swaps completed, engagement rate, conversion rate, active users)

Build a shared component library first (Navbar, Footer, Button, GlassCard/MaterialCard, ListingCard, CategoryTile, FilterChip, Modal, Toast, Avatar, StatCounter, StatusStepper, ChatBubble, DataTable, Timeline, ImageUploader) so every page after the first reuses polished primitives instead of one-off styling.

=== BUILD APPROACH ===
1. Scaffold the project, install dependencies, set up Tailwind theme tokens (exact colors/fonts/shadows above), build the shared component library and deploy an empty skeleton to Vercel first so there's a live URL to check on a real phone throughout.
2. Build pages against realistic mock/seed data first (write 20-30 real-sounding listings) so every page is visually complete and demoable before the backend exists.
3. Then build the Express + MongoDB API and wire it in, replacing mocks incrementally.
4. Finish with a full responsive/accessibility/performance pass and deploy both frontend and backend live.

Work through this in order: (1) design system + shared components, (2) Landing page fully polished, (3) Auth + Browse Listings, (4) Item Detail + balance-scale component, (5) Swap Request flow + Chat + Dashboard, (6) backend + Admin Panel + real data wiring, (7) QA/responsive/deploy. Don't move on from a component until it has the two-layer shadow + tilt/motion treatment applied — "functional but flat" is expensive to fix later.

Start with step 1: project scaffold, Tailwind theme setup, and the shared component library. Show me the plan for the file/folder structure before writing a large volume of code.
```
