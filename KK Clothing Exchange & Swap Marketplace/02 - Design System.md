# Design System — Clothing Exchange & Swap Marketplace

> **Updated:** palette pivoted from navy/gold to black/white/red/gray per direction — "completely different from the references, 3D, super classy and luxurious." This overrides KK's default navy/gold system for this project specifically. Depth/motion mechanics below are unchanged from the original spec.

## Color Palette

```css
/* Primary */
--color-black:      #0A0A0A;   /* backgrounds, hero, nav — rich black, not pure #000 */
--color-black-deep: #050505;   /* darkest layer, behind gradient blobs */
--color-charcoal:   #161616;   /* elevated dark surfaces (cards on black bg) */

/* Accent */
--color-red:        #A6192E;   /* oxblood/crimson — CTAs, highlights, the ONLY color accent */
--color-red-light:  #D33F52;   /* hover states, glow */
--color-red-deep:   #6E1120;   /* pressed states, deep shadow tint */

/* Neutrals */
--color-white:      #FFFFFF;
--color-ivory:       #F5F3EF;  /* warm off-white for light sections — reads luxury, not clinical */
--color-gray-light:  #D8D6D2;
--color-gray-mid:    #8A8A85;
--color-gray-dark:   #2B2B2B;
--color-gray-line:   #333333;  /* hairline borders on dark backgrounds */
```

**Usage rule:** black dominates backgrounds (this is a dark-luxury site, not a bright one). White/ivory is used for contrast sections and body text on dark. Red is the *only* accent color in the entire site — CTAs, active states, the swap-value/balance-scale glow, hover underlines. Because there's only one accent, it must never be diluted with a second "success green" or "warning yellow" — use red intensity/opacity and white/gray instead for state variation. This restraint is what makes it read luxury instead of busy.

## Typography
```css
font-family: 'Fraunces', serif;         /* display/hero headings — high-contrast serif, editorial */
font-family: 'Outfit', sans-serif;      /* body, UI, labels */
font-family: 'JetBrains Mono', monospace; /* item IDs, swap values, admin tables — gives a "verified/appraisal" feel */
```

Luxury cue: headings set in Fraunces should lean on generous letter-spacing on eyebrow/label text (`tracking-[0.2em] uppercase text-xs`) — this single typographic move is doing a lot of the "classy" work; use it on section labels, nav links, and badges throughout.

Scale: `text-xs` (0.75rem) through `text-6xl` (3.75rem)/`text-7xl` (4.5rem) for hero, standard Tailwind steps.

## Depth System

Every elevated surface uses **two shadows**: a soft ambient shadow (large blur, low opacity, "floating") and a tight contact shadow (small blur, higher opacity, "grounded"). On black backgrounds this reads as a subtle lighter-black halo rather than a dark shadow — think material catching light, not paper casting a shadow.

```css
--shadow-ambient: 0 24px 70px -20px rgba(0,0,0,0.6);
--shadow-contact: 0 2px 10px -2px rgba(0,0,0,0.5);
--shadow-red-glow: 0 0 28px 0 rgba(166,25,46,0.4);
--edge-light: inset 0 1px 0 0 rgba(255,255,255,0.06); /* thin top highlight, sells the 3D material feel */
```

```jsx
// Elevated glass/material card — base pattern for listing cards, dashboard stats, chat panel
<div className="bg-charcoal border border-white/10 rounded-2xl p-6
  shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6),0_2px_10px_-2px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]
  hover:border-red/50 hover:shadow-[0_0_28px_0_rgba(166,25,46,0.4)]
  transition-all duration-300">
  {/* content */}
</div>
```

**3D tilt-on-hover** (listing/product cards, category tiles): `react-parallax-tilt` or custom `useTilt` hook — mouse-reactive `perspective` + `rotateX/rotateY`, max tilt ~8deg, spring-damped return. On hover, add a thin red edge-glow (not a color fill) to keep the palette restrained.

**Gradient mesh backgrounds**: large blurred radial blobs in deep red and charcoal-gray at low opacity (8-12%) behind hero/section content, slow float loop (8-12s). No white/bright blobs — keep it moody.

**Marble/grain texture (optional, high-impact):** a very subtle noise/grain overlay (2-3% opacity) across dark sections reads as premium print/editorial rather than flat digital — cheap to add, worth it for the "luxurious" brief.

## Spacing & Layout
- Max content width: `1280px`, `px-6`/`px-8` padding
- Section padding: `py-24`/`py-32` (generous whitespace is a luxury signal — don't cram)
- Card gap: `gap-6`/`gap-8`
- Border radius: `rounded-2xl` for cards, `rounded-full` for pills/badges — but also use **sharp-cornered** (`rounded-none`) variants for editorial/fashion-plate style image frames, mixed deliberately with rounded UI elements for contrast

## Component Patterns

**Buttons**
```jsx
// Primary CTA
<button className="bg-red text-white font-semibold px-8 py-3.5 rounded-full
  hover:bg-red-light hover:shadow-[0_0_28px_0_rgba(166,25,46,0.45)] hover:scale-[1.02]
  transition-all duration-200">
  Send Swap Request
</button>

// Ghost/outline — on black bg
<button className="border border-white/30 text-white px-8 py-3.5 rounded-full
  hover:border-red hover:text-red transition-all duration-200">
  Browse Listings
</button>
```

**Swap value pill** (unique to this project — mono font sells "appraisal" feel)
```jsx
<span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/15
  text-white text-sm font-mono px-3 py-1 rounded-full">
  ~₹1,200 <span className="text-red-light">swap value</span>
</span>
```

**Section headings**
```jsx
<p className="font-outfit text-xs tracking-[0.2em] uppercase text-red-light mb-3">How It Works</p>
<h2 className="font-fraunces text-4xl md:text-5xl font-bold text-white mb-4">Section Title</h2>
<p className="text-gray-mid text-lg max-w-2xl">Supporting description text.</p>
```

**Nav** — sticky, `backdrop-blur-md`, `bg-black/80`, hairline bottom border (`border-b border-white/10`), logo left, links right with red underline-on-hover (grows from center), mobile hamburger → full-screen slide-in drawer on black.

## Motion Principles
- **Scroll reveal:** every section wrapped in Framer Motion `whileInView` (fade + 24px slide-up), staggered children (`staggerChildren: 0.08`)
- **Magnetic CTAs:** primary buttons shift slightly toward cursor within a small radius
- **Page transitions:** Framer Motion `AnimatePresence` cross-fade + slight scale on route change
- **Micro-interactions:** every hover/focus state uses `transition-all duration-200`/`duration-300`, never instant snap
- **Count-up stats:** animate numeric stats from 0 on scroll-into-view, mono font for the digits

## Stack Defaults
- **Framework:** Vite + React 18
- **Styling:** Tailwind CSS v3
- **Animation:** Framer Motion (+ `react-parallax-tilt` for card tilt)
- **3D hero element:** CSS 3D transforms first choice; Spline/Three.js embed only if buffer time allows
- **Icons:** Lucide React
- **Charts (admin panel):** Recharts, restyled to black/white/red (no default chart colors)
- **Fonts:** Google Fonts (`Fraunces`, `Outfit`, `JetBrains Mono`) via `index.html`
- **State:** useState/useReducer local, Zustand for global (auth, active swap negotiation)
- **Routing:** React Router v6
- **Backend:** Node.js + Express, MongoDB
- **Deployment:** frontend → Vercel (kksingh000), backend → Render

## Rules
1. Black/white/red/gray only — no navy, no gold, no green, no default Tailwind blue/purple. Red is the single accent; do not introduce a second accent color for "success" states — use red + white/gray only.
2. Every elevated surface gets the two-layer shadow + top edge-light, not a flat `shadow-md`.
3. Every card/tile representing a clothing item gets tilt-on-hover — non-negotiable signature interaction.
4. Generous whitespace (`py-24`+ sections) — cramped layouts read cheap, not luxury.
5. No Lorem Ipsum — realistic clothing/brand/user data only.
6. Mobile-first, every component verified at 375px width.
7. Mix sharp-cornered editorial image frames with rounded UI chrome deliberately — don't round everything uniformly.
