# Swap — Clothing Exchange & Swap Marketplace

A dark, editorial, 3D-luxury marketplace where users list clothes they no longer wear and
swap them directly — no money changes hands. Portfolio/academic project.

**Live:** https://swap-atelier.vercel.app · Design-system QA page: [/dev/components](https://swap-atelier.vercel.app/dev/components)

## Structure

- `client/` — Vite + React 18 + Tailwind v3 frontend → deployed to **Vercel**
- `server/` — Express + MongoDB (Mongoose) + JWT API → deploys to **Render** (blueprint included)
- `KK Clothing Exchange & Swap Marketplace/` — PRD, design system, and build-plan docs

## Run locally

```bash
# Frontend (http://localhost:5173)
cd client && npm install && npm run dev

# Backend (http://localhost:5000) — no MongoDB install needed:
# without MONGODB_URI it starts an in-memory MongoDB and seeds itself
cd server && npm install && npm start
```

Seeded API accounts: `admin@swap.in / admin123` (admin) · `ananya@swap.in / password123` (and the
other five members). Frontend runs on rich mock data until `VITE_API_URL` is set (see below).

## API

`/api/auth` (register · login · me) — bcrypt + JWT (7d) ·
`/api/listings` (filtered/paginated CRUD, server-side valuation) ·
`/api/swaps` (create, lifecycle transitions with server-enforced legal moves, messages) ·
`/api/admin` (stats, users/suspend, listings, dispute queue). 24-case end-to-end test suite passes.

## Deploy the backend (one-time setup)

Full step-by-step with exact env vars, gotchas, and verification: **[DEPLOYMENT.md](DEPLOYMENT.md)**. In short:

1. Create a free MongoDB Atlas M0 cluster → copy the connection string.
2. On Render: **New → Blueprint**, point at this repo (`server/render.yaml`), set `MONGODB_URI`.
3. On Vercel (swap-atelier project): add env `VITE_API_URL=https://<your-render-url>` and redeploy.
   Auth switches from mock sessions to real JWT automatically.

## Design system (summary)

- Palette: black `#0A0A0A` / charcoal `#161616` / red `#A6192E` (single accent) / ivory & grays — nothing else
- Type: Fraunces (display) · Outfit (UI) · JetBrains Mono (values/IDs)
- Depth: two-layer shadows + edge-light everywhere; 3D tilt on all clothing cards; spring-physics
  BalanceScale3D; grain + gradient blobs on dark sections
- Full spec: `KK Clothing Exchange & Swap Marketplace/02 - Design System.md`

## Build progress

- [x] Step 1 — scaffold, theme tokens, shared component library (20+ primitives)
- [x] Step 2 — landing page (3D parallax hero, featured swaps, ivory CTA band) + 26-listing catalogue
- [x] Step 3 — auth (split-screen, validation) + browse (URL-driven filters, sort, radius, pagination)
- [x] Step 4 — item detail + BalanceScale3D + swap value calculator + send-request flow
- [x] Step 5 — negotiation lifecycle + chat (typing, replies, confirm agreement) + dashboard
- [x] Step 6 — Express/MongoDB/JWT API (24/24 tests) + admin panel (analytics, moderation, disputes)
- [x] Step 7 — responsive (375px) / a11y / perf pass (admin code-split, lazy images, OG tags)
- [ ] Post-launch — connect Atlas + Render (5-minute setup above), then flip `VITE_API_URL`
