# Design References & Direction

Analysis of the reference screenshots uploaded (retjg.com / The Jay Group, Poshmark, Depop). Goal: understand what these sites do structurally, then deliberately build something that does **not** look like any of them.

> Note: the screenshots were pasted inline in chat, not uploaded as files, so the raw images couldn't be copied into this vault. This note captures the full visual/structural analysis instead — everything needed for design decisions is below.

---

## 1. The Jay Group (retjg.com) — reverse logistics / re-commerce B2B site

**What it is:** corporate logistics company site, not a consumer marketplace, but relevant because it's in the same "returns/re-commerce" category.

**Structural patterns observed:**
- Hero: full-width warehouse photo, dark overlay, centered logo lockup, green rounded-rect border framing the image
- Green (~#2E9E5B) + white palette, condensed bold headline typeface
- "Problem statement" style rows: light-gray pill rows with a circular checkmark icon + one-line text — very scannable
- 3-column "Core Capabilities" cards: icon + heading + paragraph, white cards on off-white background, minimal shadow
- Split "Trusted by" section: bullet checklist on one side, photo on the other, in a soft white card with drop shadow
- History/timeline section with flag imagery

**Verdict — flat and generic.** No depth, no gradients, no motion, stock photography, template-grade shadows. It reads as corporate boilerplate. **Avoid this entirely as a look.** The one thing worth reusing structurally is the icon-row / checklist pattern for scannable copy — but it needs a completely different visual treatment (glass, depth, motion) to not look like a Wix template.

---

## 2. Poshmark

**What it is:** consumer resale marketplace, dense e-commerce grid.

**Structural patterns observed:**
- Left sidebar brand-logo grid, hero carousel, "Suggested for You" product grid
- Small product cards: photo, heart/wishlist icon, title, price + strikethrough original price, size tag
- "Posh Shows" live-stream promo tiles, "Today's Trends" tag cloud
- Dense, utilitarian, small type, a lot of competing modules on one screen

**Verdict — cluttered and utilitarian.** Optimized for inventory volume, not visual delight. No hierarchy of attention — everything shouts at once. Nothing here worth visually borrowing; only the *functional* idea of a filterable grid with price/size/condition badges is relevant (we swap "price" for "estimated swap value").

---

## 3. Depop

**What it is:** consumer resale marketplace, youth/streetwear positioning.

**Structural patterns observed:**
- Bold black/white palette, big confident sans-serif headline ("Buy preloved. Wear it your way")
- Buy/Sell toggle pill, trust-signal row (Buy safely / 49M+ items / 500K+ new listings/day) with small icons
- Split hero: text + tilted overlapping photo collage
- Category tiles with full-bleed photo + text overlay (Womenswear / Menswear / Kids / Everything)

**Verdict — the best of the three, but still flat.** Good restraint, good hierarchy, confident type. But it's still static images with zero depth — no shadows beyond default, no glass, no motion, no 3D. This is the closest "structural" reference (trust badges, category tiles, bold hero) but the *execution* needs to be pushed into a completely different visual tier.

---

## Design Direction — what we're actually building

**Positioning:** premium, editorial, sustainability-forward marketplace — not a bargain-bin resale grid. Think "boutique swap concierge" rather than "flea market app."

**The one rule:** nothing on this site should look like a stock Tailwind template or a generic SaaS landing page. Every section needs at least one deliberate depth/motion/3D touch.

### What we take from the references (structure only)
- Checklist/icon rows (Jay Group) → reimagined as glassmorphic scroll-reveal rows
- Trust-signal stat badges (Depop) → animated count-up stat cards
- Category tiles (Depop) → 3D tilt-on-hover tiles with parallax image
- Filterable product grid (Poshmark) → 3D tilt swap-listing cards with floating value badge

### What we explicitly reject
- Flat drop-shadow cards with no depth system
- Dense multi-module screens competing for attention (Poshmark's clutter)
- Generic stock warehouse/corporate photography as hero (Jay Group)
- Static, un-animated hero sections
- Default Tailwind blue/purple or plain white/gray palette

### Signature visual identity (the "wow" factor)
1. **3D balance-scale visualization** for the swap value calculator/comparison — a literal tilting scale animation that balances as two items' estimated values approach parity. This ties the *concept* (fair swap) directly to the *visual identity* (3D), and nothing else in the reverse-logistics/resale space does this.
2. **Floating garment / hanger 3D element** in the hero (CSS 3D transforms or a lightweight Spline/Three.js embed) with parallax on scroll/mouse-move.
3. **Glassmorphic tilt cards** throughout (listings, dashboard stats, chat) — `backdrop-blur`, soft ambient shadow + tight contact shadow, subtle border glow on hover, slight 3D tilt following cursor (react-parallax-tilt or a small custom hook).
4. **Scroll-reveal choreography** — staggered fade/slide-up on every section via Framer Motion `whileInView`, not just a global fade.
5. **Gold-glow micro-interactions** — buttons/badges get a soft gold glow + scale on hover/focus, never a flat color swap.

Full palette/typography/motion tokens are defined in `02 - Design System.md`.
