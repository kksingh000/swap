// Realistic seed data. This mirrors the shape the Express API will return in
// build step 6, so pages built against it swap over without refactoring.

import { estimateValue } from '../lib/swapValue'

// Photography: hotlinked Unsplash CDN images, one per listing/category.
// null falls back to the editorial gradient placeholder in <ImageFrame>.
const P = '?w=900&q=80&auto=format&fit=crop'
const IMAGES = {
  'l-01': `https://images.unsplash.com/photo-1611312449408-fcece27cdbb7${P}`,
  'l-02': `https://images.unsplash.com/photo-1539533113208-f6df8cc8b543${P}`,
  'l-03': `https://images.unsplash.com/photo-1600269452121-4f2416e55c28${P}`,
  'l-04': `https://images.unsplash.com/photo-1727835523545-70ee992b5763${P}`,
  'l-05': `https://images.unsplash.com/photo-1688685567139-70841b903f18${P}`,
  'l-06': `https://images.unsplash.com/photo-1618786177957-29d9b6b26d8a${P}`,
  'l-07': `https://images.unsplash.com/photo-1744833341427-6f2b4eac91ff${P}`,
  'l-08': `https://images.unsplash.com/photo-1718220130188-428c7dc27fd2${P}`,
  'l-09': `https://images.unsplash.com/photo-1636529109797-0749811c4916${P}`,
  'l-10': `https://images.unsplash.com/photo-1656284518334-710b60cd63a0${P}`,
  'l-11': `https://images.unsplash.com/photo-1670080589800-6416c8ce8a14${P}`,
  'l-12': `https://images.unsplash.com/photo-1725387072845-7431bbc453bc${P}`,
  'l-13': `https://images.unsplash.com/photo-1551028719-00167b16eac5${P}`,
  'l-14': `https://images.unsplash.com/photo-1745313452052-0e4e341f326c${P}`,
  'l-15': `https://images.unsplash.com/photo-1695918428487-7934244c19ac${P}`,
  'l-16': `https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6${P}`,
  'l-17': `https://images.unsplash.com/photo-1740711152088-88a009e877bb${P}`,
  'l-18': `https://images.unsplash.com/photo-1602293589930-45aad59ba3ab${P}`,
  'l-19': `https://images.unsplash.com/photo-1496747611176-843222e1e57c${P}`,
  'l-20': `https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2${P}`,
  'l-21': `https://images.unsplash.com/photo-1610901157620-340856d0a50f${P}`,
  'l-22': `https://images.unsplash.com/photo-1533659828870-95ee305cee3e${P}`,
  'l-23': `https://images.unsplash.com/photo-1618998300304-66165e377760${P}`,
  'l-24': `https://images.unsplash.com/photo-1768983953826-231e8ef0b6dc${P}`,
  'l-25': `https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec${P}`,
  'l-26': `https://images.unsplash.com/photo-1597983073750-16f5ded1321f${P}`,
  'cat-Outerwear': `https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7${P}`,
  'cat-Denim': `https://images.unsplash.com/photo-1637069585336-827b298fe84a${P}`,
  'cat-Dresses': `https://images.unsplash.com/photo-1532453288672-3a27e9be9efd${P}`,
  'cat-Knitwear': `https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0${P}`,
  'cat-Footwear': `https://images.unsplash.com/photo-1772909849803-e1c298df3fd9${P}`,
  'cat-Ethnic': `https://images.unsplash.com/photo-1717585679395-bbe39b5fb6bc${P}`,
}

export const users = [
  {
    id: 'u-01',
    name: 'Ananya Sharma',
    city: 'New Delhi',
    rating: 4.9,
    swapsCompleted: 23,
    joinedAt: '2025-03-14',
  },
  {
    id: 'u-02',
    name: 'Rohan Mehta',
    city: 'Mumbai',
    rating: 4.7,
    swapsCompleted: 17,
    joinedAt: '2025-05-02',
  },
  {
    id: 'u-03',
    name: 'Priya Nair',
    city: 'Bengaluru',
    rating: 5.0,
    swapsCompleted: 31,
    joinedAt: '2025-01-20',
  },
  {
    id: 'u-04',
    name: 'Arjun Malhotra',
    city: 'Gurugram',
    rating: 4.5,
    swapsCompleted: 9,
    joinedAt: '2025-08-11',
  },
  {
    id: 'u-05',
    name: 'Sana Qureshi',
    city: 'Jaipur',
    rating: 4.8,
    swapsCompleted: 14,
    joinedAt: '2025-06-30',
  },
  {
    id: 'u-06',
    name: 'Vikram Iyer',
    city: 'Noida',
    rating: 4.6,
    swapsCompleted: 12,
    joinedAt: '2025-04-18',
  },
]

const rawListings = [
  {
    id: 'l-01',
    itemId: 'SW-1042',
    title: 'Trucker Jacket, Washed Indigo',
    brand: "Levi's",
    category: 'Denim',
    size: 'M',
    condition: 'Gently used',
    city: 'New Delhi',
    ownerId: 'u-01',
    description:
      'Classic Type III trucker in a mid-indigo wash. Worn maybe a dozen winter-market evenings; no fraying, buttons intact.',
    listedAt: '2026-07-02',
  },
  {
    id: 'l-02',
    itemId: 'SW-1087',
    title: 'Wool-Blend Double-Breasted Overcoat',
    brand: 'Zara',
    category: 'Outerwear',
    size: 'L',
    condition: 'Like new',
    city: 'Mumbai',
    ownerId: 'u-02',
    description:
      'Charcoal overcoat from the 2025 winter drop. Worn twice to office dinners — too warm for Mumbai, someone in the north should have it.',
    listedAt: '2026-07-08',
  },
  {
    id: 'l-03',
    itemId: 'SW-1120',
    title: "Air Force 1 '07, Triple White",
    brand: 'Nike',
    category: 'Footwear',
    size: 'UK 9',
    condition: 'Gently used',
    city: 'Bengaluru',
    ownerId: 'u-03',
    description:
      'Cleaned and re-laced. Light creasing on the toe box, soles at 85%. Comes with the original box.',
    listedAt: '2026-07-11',
  },
  {
    id: 'l-04',
    itemId: 'SW-1156',
    title: 'Hand Block-Print Cotton Kurta',
    brand: 'FabIndia',
    category: 'Ethnic',
    size: 'S',
    condition: 'Like new',
    city: 'Jaipur',
    ownerId: 'u-05',
    description:
      'Sanganeri block print in madder red on off-white. Bought for a wedding week, worn once over a lehenga skirt.',
    listedAt: '2026-07-05',
  },
  {
    id: 'l-05',
    itemId: 'SW-1198',
    title: 'Ribbed Merino Turtleneck',
    brand: 'H&M',
    category: 'Knitwear',
    size: 'M',
    condition: 'New with tags',
    city: 'Pune',
    ownerId: 'u-04',
    description:
      'Black ribbed knit, tags still on. Gift from a cousin who forgot I already own three black turtlenecks.',
    listedAt: '2026-07-13',
  },
  {
    id: 'l-06',
    itemId: 'SW-1203',
    title: 'Slim-Fit Oxford Shirt, Sky Stripe',
    brand: 'Tommy Hilfiger',
    category: 'Shirts',
    size: 'L',
    condition: 'Gently used',
    city: 'Gurugram',
    ownerId: 'u-04',
    description:
      'Blue-and-white stripe oxford, flag embroidery at the chest. Pressed and ready; collar shows no wear.',
    listedAt: '2026-06-28',
  },
  {
    id: 'l-07',
    itemId: 'SW-1244',
    title: 'Chanderi Anarkali Set with Dupatta',
    brand: 'Biba',
    category: 'Ethnic',
    size: 'M',
    condition: 'Like new',
    city: 'Lucknow',
    ownerId: 'u-05',
    description:
      'Deep maroon chanderi with gold-thread border, matching churidar and dupatta. Worn once for Diwali 2025.',
    listedAt: '2026-07-01',
  },
  {
    id: 'l-08',
    itemId: 'SW-1261',
    title: 'Samba OG, Black Gum Sole',
    brand: 'Adidas',
    category: 'Footwear',
    size: 'UK 8',
    condition: 'Well loved',
    city: 'Hyderabad',
    ownerId: 'u-02',
    description:
      'The pair that went everywhere. Suede toe is scuffed but the gum sole has life left. Priced honestly.',
    listedAt: '2026-06-20',
  },
  {
    id: 'l-09',
    itemId: 'SW-1290',
    title: 'Ultra Light Down Vest, Olive-Grey',
    brand: 'Uniqlo',
    category: 'Outerwear',
    size: 'M',
    condition: 'Gently used',
    city: 'Noida',
    ownerId: 'u-06',
    description:
      'Packs into its own pouch. Perfect Delhi-winter layering piece; zip runs smooth, no down leakage.',
    listedAt: '2026-07-10',
  },
  {
    id: 'l-10',
    itemId: 'SW-1315',
    title: 'Satin Slip Dress, Midnight',
    brand: 'Mango',
    category: 'Dresses',
    size: 'S',
    condition: 'Like new',
    city: 'Mumbai',
    ownerId: 'u-03',
    description: 'Bias-cut satin slip in true black. Cocktail-length, worn to one reception.',
    listedAt: '2026-07-09',
  },
  {
    id: 'l-11',
    itemId: 'SW-1348',
    title: 'Merino V-Neck Sweater, Camel',
    brand: 'Raymond',
    category: 'Knitwear',
    size: 'XL',
    condition: 'Gently used',
    city: 'Chandigarh',
    ownerId: 'u-06',
    description:
      'Fine-gauge merino from the Made-to-Measure store. Elbows show no thinning; dry-cleaned before listing.',
    listedAt: '2026-06-25',
  },
  {
    id: 'l-12',
    itemId: 'SW-1372',
    title: 'Slim Jeans, Raw Selvedge',
    brand: 'Jack & Jones',
    category: 'Denim',
    size: '32',
    condition: 'Gently used',
    city: 'New Delhi',
    ownerId: 'u-01',
    description:
      'Dark raw denim just starting to fade at the knees. Hemmed to a 30-inch inseam — check your measurement.',
    listedAt: '2026-07-14',
  },
  {
    id: 'l-13',
    itemId: 'SW-1391',
    title: 'Faux-Leather Biker Jacket',
    brand: 'Zara',
    category: 'Outerwear',
    size: 'M',
    condition: 'Gently used',
    city: 'Pune',
    ownerId: 'u-03',
    description:
      'Asymmetric zip, quilted shoulders. The leather-look has held up with zero peeling; hardware all works.',
    listedAt: '2026-07-06',
  },
  {
    id: 'l-14',
    itemId: 'SW-1404',
    title: 'Chikankari Straight Kurta, White',
    brand: 'W for Woman',
    category: 'Ethnic',
    size: 'L',
    condition: 'Like new',
    city: 'Lucknow',
    ownerId: 'u-05',
    description:
      'Hand-embroidered Lucknowi chikankari on soft mul cotton. Worn once for a family lunch; freshly laundered.',
    listedAt: '2026-07-12',
  },
  {
    id: 'l-15',
    itemId: 'SW-1419',
    title: 'Dri-FIT Running Tee, Graphite',
    brand: 'Nike',
    category: 'Tees',
    size: 'M',
    condition: 'Gently used',
    city: 'Bengaluru',
    ownerId: 'u-03',
    description:
      'Breathable knit, no pilling or odour retention. Retired only because I sized up.',
    listedAt: '2026-07-03',
  },
  {
    id: 'l-16',
    itemId: 'SW-1433',
    title: 'Pebbled Leather Shoulder Bag, Tan',
    brand: 'Coach',
    category: 'Accessories',
    size: 'One size',
    condition: 'Like new',
    city: 'Mumbai',
    ownerId: 'u-02',
    description:
      'Genuine pebbled leather with brass hardware. Kept in its dust bag; corners are clean, strap unmarked.',
    listedAt: '2026-07-07',
  },
  {
    id: 'l-17',
    itemId: 'SW-1450',
    title: 'Linen-Blend Resort Shirt, Sand',
    brand: 'H&M',
    category: 'Shirts',
    size: 'M',
    condition: 'Like new',
    city: 'Goa',
    ownerId: 'u-04',
    description:
      'Relaxed camp collar, coconut-shell buttons. Bought for one beach wedding, worn exactly once.',
    listedAt: '2026-07-04',
  },
  {
    id: 'l-18',
    itemId: 'SW-1467',
    title: 'Ultra Stretch Skinny Jeans, Ink',
    brand: 'Uniqlo',
    category: 'Denim',
    size: '30',
    condition: 'Like new',
    city: 'Noida',
    ownerId: 'u-06',
    description:
      'Deep ink-blue with real stretch recovery — no bagging at the knees. Worn a handful of times.',
    listedAt: '2026-07-13',
  },
  {
    id: 'l-19',
    itemId: 'SW-1478',
    title: 'Floral Wrap Dress, Terracotta',
    brand: 'Forever 21',
    category: 'Dresses',
    size: 'S',
    condition: 'Gently used',
    city: 'Jaipur',
    ownerId: 'u-05',
    description:
      'True wrap silhouette with a ditsy floral print. Hem re-stitched professionally after a heel incident.',
    listedAt: '2026-06-29',
  },
  {
    id: 'l-20',
    itemId: 'SW-1495',
    title: '574 Core, Grey Suede',
    brand: 'New Balance',
    category: 'Footwear',
    size: 'UK 10',
    condition: 'Gently used',
    city: 'Chandigarh',
    ownerId: 'u-06',
    description:
      'The everyday grey 574. Suede brushed clean, ENCAP midsole still supportive. Insoles replaced with fresh ones.',
    listedAt: '2026-07-08',
  },
  {
    id: 'l-21',
    itemId: 'SW-1512',
    title: 'Cable-Knit Cotton Sweater, Cream',
    brand: 'Ralph Lauren',
    category: 'Knitwear',
    size: 'L',
    condition: 'Like new',
    city: 'Gurugram',
    ownerId: 'u-04',
    description:
      'The iconic Aran cable in heavyweight cotton, pony intact. Stored folded with cedar blocks; zero pulls.',
    listedAt: '2026-07-11',
  },
  {
    id: 'l-22',
    itemId: 'SW-1529',
    title: 'Pleated Satin Midi Skirt, Slate',
    brand: 'Mango',
    category: 'Dresses',
    size: 'S',
    condition: 'New with tags',
    city: 'Mumbai',
    ownerId: 'u-03',
    description:
      'Knife pleats, elastic back waist, midi length. Tags attached — an online order I never returned in time.',
    listedAt: '2026-07-15',
  },
  {
    id: 'l-23',
    itemId: 'SW-1536',
    title: 'Silk-Blend Nehru Jacket, Charcoal',
    brand: 'FabIndia',
    category: 'Ethnic',
    size: 'M',
    condition: 'Like new',
    city: 'New Delhi',
    ownerId: 'u-01',
    description:
      'Subtle sheen, mandarin collar, horn buttons. Worn over a white kurta at two receptions — that is all.',
    listedAt: '2026-07-09',
  },
  {
    id: 'l-24',
    itemId: 'SW-1541',
    title: 'Firebird Track Jacket, Black',
    brand: 'Adidas',
    category: 'Outerwear',
    size: 'S',
    condition: 'Gently used',
    city: 'Hyderabad',
    ownerId: 'u-02',
    description:
      'The classic three-stripe Firebird in black. Cuffs tight, zip original, embroidery sharp.',
    listedAt: '2026-06-26',
  },
  {
    id: 'l-25',
    itemId: 'SW-1558',
    title: '501 Original, Stonewash',
    brand: "Levi's",
    category: 'Denim',
    size: '34',
    condition: 'Well loved',
    city: 'Mumbai',
    ownerId: 'u-02',
    description:
      'Broken in exactly how a 501 should be. Honest wear at the pockets, no rips, button-fly complete.',
    listedAt: '2026-06-22',
  },
  {
    id: 'l-26',
    itemId: 'SW-1570',
    title: 'Cotton Palazzo Set, Indigo Dabu',
    brand: 'Biba',
    category: 'Ethnic',
    size: 'L',
    condition: 'Gently used',
    city: 'Lucknow',
    ownerId: 'u-05',
    description:
      'Dabu hand-block print, kurta plus palazzo. Colour still deep after gentle washes; drawstring intact.',
    listedAt: '2026-07-02',
  },
  // ——— Kids ———
  {
    id: 'l-27',
    itemId: 'SW-1583',
    title: 'Denim Dungarees, Washed Blue',
    brand: 'GAP',
    category: 'Denim',
    size: '4-5Y',
    condition: 'Like new',
    city: 'New Delhi',
    ownerId: 'u-01',
    description:
      'Adjustable-strap dungarees my nephew outgrew in a season. Knees unmarked, brass clasps work smoothly.',
    listedAt: '2026-07-14',
  },
  {
    id: 'l-28',
    itemId: 'SW-1591',
    title: 'Printed Cotton Frock, Cherry',
    brand: 'Zara',
    category: 'Dresses',
    size: '3-4Y',
    condition: 'Gently used',
    city: 'Mumbai',
    ownerId: 'u-03',
    description:
      'Tiered cotton frock with a ditsy cherry print. Worn to a couple of birthday parties; colour still bright.',
    listedAt: '2026-07-12',
  },
  {
    id: 'l-29',
    itemId: 'SW-1604',
    title: 'Hooded Puffer Jacket, Rust',
    brand: 'H&M',
    category: 'Outerwear',
    size: '6-7Y',
    condition: 'Like new',
    city: 'Noida',
    ownerId: 'u-06',
    description:
      'Lightweight puffer with a fleece-lined hood. One mild winter of use; zip and toggles all intact.',
    listedAt: '2026-07-15',
  },
  {
    id: 'l-30',
    itemId: 'SW-1612',
    title: 'Light-Up Trainers, White',
    brand: 'Adidas',
    category: 'Footwear',
    size: 'UK 11K',
    condition: 'Gently used',
    city: 'Bengaluru',
    ownerId: 'u-03',
    description:
      'The LEDs still flash on every step — batteries are sealed for years. Soles clean, velcro grips firmly.',
    listedAt: '2026-07-13',
  },
]

// Department (Men / Women / Kids) per listing — drives the shop sections,
// nav, and the Browse department filter. Assigned by garment + fit, not price.
const DEPARTMENT = {
  'l-01': 'Men', 'l-02': 'Men', 'l-03': 'Men', 'l-04': 'Women', 'l-05': 'Women',
  'l-06': 'Men', 'l-07': 'Women', 'l-08': 'Men', 'l-09': 'Men', 'l-10': 'Women',
  'l-11': 'Men', 'l-12': 'Men', 'l-13': 'Women', 'l-14': 'Women', 'l-15': 'Women',
  'l-16': 'Women', 'l-17': 'Men', 'l-18': 'Men', 'l-19': 'Women', 'l-20': 'Men',
  'l-21': 'Men', 'l-22': 'Women', 'l-23': 'Men', 'l-24': 'Men', 'l-25': 'Men',
  'l-26': 'Women', 'l-27': 'Kids', 'l-28': 'Kids', 'l-29': 'Kids', 'l-30': 'Kids',
}

export const listings = rawListings.map((l) => ({
  ...l,
  image: IMAGES[l.id] ?? null,
  department: DEPARTMENT[l.id] ?? 'Women',
  swapValue: estimateValue(l),
  status: 'available',
}))

const byId = (id) => listings.find((l) => l.id === id)

const countByDept = (name) => listings.filter((l) => l.department === name).length

// Top-level shop entry points. Counts are live from the catalogue; the padded
// figures nod to the wider (unseeded) inventory the way category counts do.
export const departments = [
  {
    name: 'Women',
    tagline: 'Dresses, ethnic, knitwear & the pieces you reach for.',
    count: countByDept('Women'),
    image: IMAGES['cat-Dresses'],
  },
  {
    name: 'Men',
    tagline: 'Denim, outerwear, sneakers & sharp everyday tailoring.',
    count: countByDept('Men'),
    image: IMAGES['cat-Denim'],
  },
  {
    name: 'Kids',
    tagline: 'Outgrown in a season, ready for their next little life.',
    count: countByDept('Kids'),
    image: IMAGES['cat-Knitwear'],
  },
]

export const DEPARTMENTS = departments.map((d) => d.name)

export const categories = [
  { name: 'Outerwear', count: 34, image: IMAGES['cat-Outerwear'] },
  { name: 'Denim', count: 51, image: IMAGES['cat-Denim'] },
  { name: 'Dresses', count: 42, image: IMAGES['cat-Dresses'] },
  { name: 'Knitwear', count: 27, image: IMAGES['cat-Knitwear'] },
  { name: 'Footwear', count: 63, image: IMAGES['cat-Footwear'] },
  { name: 'Ethnic', count: 38, image: IMAGES['cat-Ethnic'] },
]

export const impactStats = [
  { label: 'Pieces relisted', value: 12480, suffix: '' },
  { label: 'Swaps sealed', value: 4260, suffix: '' },
  { label: 'Kg textile diverted', value: 18700, suffix: '' },
  { label: 'Cities active', value: 38, suffix: '' },
]

// Completed exchanges shown in the landing carousel — pairs chosen so the
// calculator actually reads them as fair (this is demo data with integrity).
export const featuredSwaps = [
  { id: 'fs-01', a: byId('l-01'), b: byId('l-08'), date: '12 Jul 2026' },
  { id: 'fs-02', a: byId('l-03'), b: byId('l-24'), date: '05 Jul 2026' },
  { id: 'fs-03', a: byId('l-21'), b: byId('l-02'), date: '28 Jun 2026' },
  { id: 'fs-04', a: byId('l-07'), b: byId('l-04'), date: '21 Jun 2026' },
]

export const testimonials = [
  {
    id: 't-01',
    name: 'Ananya Sharma',
    city: 'New Delhi',
    swaps: 23,
    quote:
      'I traded a coat I had not touched in two winters for the exact denim jacket I had been hunting for months. Nothing about it felt like a compromise.',
  },
  {
    id: 't-02',
    name: 'Vikram Iyer',
    city: 'Noida',
    swaps: 12,
    quote:
      'The value scale kills the awkward haggling. You see the numbers, someone adds a sweetener, and the deal closes itself.',
  },
  {
    id: 't-03',
    name: 'Priya Nair',
    city: 'Bengaluru',
    swaps: 31,
    quote:
      'Thirty-one swaps in. My wardrobe rotates every season now and my bank balance never notices a thing.',
  },
]

// Admin panel data — open disputes and the platform growth series the
// analytics charts draw from (mirrors what /api/admin/stats returns in step 6).
export const disputes = [
  {
    id: 'dp-01',
    requestId: 'sr-demo-01',
    raisedById: 'u-02',
    againstId: 'u-01',
    reason: 'Jacket has a shoulder-seam pull that was not visible in the listing photos.',
    openedAt: '2026-07-14',
  },
  {
    id: 'dp-02',
    requestId: 'sr-demo-03',
    raisedById: 'u-06',
    againstId: 'u-01',
    reason: 'No-show at the agreed metro exchange point, twice in one week.',
    openedAt: '2026-07-10',
  },
  {
    id: 'dp-03',
    requestId: 'sr-demo-02',
    raisedById: 'u-03',
    againstId: 'u-05',
    reason: 'Size listed as M but the care label reads S.',
    openedAt: '2026-07-17',
  },
]

export const analyticsSeries = [
  { month: 'Feb', listings: 6, swaps: 1 },
  { month: 'Mar', listings: 9, swaps: 3 },
  { month: 'Apr', listings: 12, swaps: 5 },
  { month: 'May', listings: 16, swaps: 7 },
  { month: 'Jun', listings: 22, swaps: 11 },
  { month: 'Jul', listings: 26, swaps: 14 },
]

export const sampleMessages = [
  {
    id: 'm-01',
    from: 'u-02',
    text: 'Hey! Would you take the Samba OGs for your trucker jacket? Both gently worn.',
    time: '10:42',
  },
  {
    id: 'm-02',
    from: 'u-01',
    text: 'Tempting — but the values are a bit apart. Add the H&M beanie you listed and we have a deal.',
    time: '10:45',
  },
  {
    id: 'm-03',
    from: 'u-02',
    text: 'Deal. Sending the updated offer now.',
    time: '10:47',
  },
]

export const sampleTimeline = [
  {
    date: '12 Jul 2026',
    title: 'Swap completed — SW-1042 ⇄ SW-1261',
    description: 'Exchanged at the Hauz Khas metro swap point.',
  },
  {
    date: '04 Jul 2026',
    title: 'Agreement confirmed in chat',
    description: 'Both parties locked the offer at ₹1,430 ⇄ ₹1,410.',
  },
  {
    date: '28 Jun 2026',
    title: 'Counter-offer sent',
    description: 'Rohan added a knit beanie to balance the scale.',
  },
  {
    date: '26 Jun 2026',
    title: 'Swap requested',
    description: 'Rohan offered Samba OG against the Levi’s trucker.',
  },
]

// Post-swap reviews, keyed by the reviewed user's id. Surfaced on the owner
// mini-profile (Item Detail) and appended to via the review store after a swap.
export const reviewsSeed = {
  'u-01': [
    {
      id: 'rv-01',
      byId: 'u-02',
      byName: 'Rohan Mehta',
      rating: 5,
      text: 'The trucker jacket was exactly as described — even threw in the beanie to balance the scale. Smooth exchange at the metro.',
      date: '2026-07-13',
    },
    {
      id: 'rv-02',
      byId: 'u-06',
      byName: 'Vikram Iyer',
      rating: 5,
      text: 'Punctual, honest about a tiny scuff I would never have noticed. This is how swapping should feel.',
      date: '2026-06-29',
    },
    {
      id: 'rv-03',
      byId: 'u-03',
      byName: 'Priya Nair',
      rating: 4,
      text: 'Lovely Nehru jacket, well cared for. Took a day to confirm the meeting point but worth the wait.',
      date: '2026-06-18',
    },
  ],
  'u-02': [
    {
      id: 'rv-04',
      byId: 'u-01',
      byName: 'Ananya Sharma',
      rating: 5,
      text: 'The Sambas had honest wear and Rohan said so upfront. No surprises, quick reply, easy trade.',
      date: '2026-07-16',
    },
    {
      id: 'rv-05',
      byId: 'u-05',
      byName: 'Sana Qureshi',
      rating: 4,
      text: 'Good communicator. The overcoat was a touch warmer than I expected but that is on me, not the listing.',
      date: '2026-06-24',
    },
  ],
  'u-03': [
    {
      id: 'rv-06',
      byId: 'u-04',
      byName: 'Arjun Malhotra',
      rating: 5,
      text: 'Thirty-plus swaps and it shows — Priya packs pieces immaculately and turns up on time. Gold standard.',
      date: '2026-07-08',
    },
    {
      id: 'rv-07',
      byId: 'u-02',
      byName: 'Rohan Mehta',
      rating: 5,
      text: 'The biker jacket looked better in person. Zero haggling drama, the scale did the talking.',
      date: '2026-06-30',
    },
  ],
  'u-04': [
    {
      id: 'rv-08',
      byId: 'u-03',
      byName: 'Priya Nair',
      rating: 4,
      text: 'The Ralph Lauren cable knit was spotless. Quick to agree, just a little slow to pick a meeting spot.',
      date: '2026-07-11',
    },
  ],
  'u-05': [
    {
      id: 'rv-09',
      byId: 'u-01',
      byName: 'Ananya Sharma',
      rating: 5,
      text: 'The Anarkali set was freshly laundered and pressed. Sana clearly loves her clothes — and it shows.',
      date: '2026-07-02',
    },
  ],
  'u-06': [
    {
      id: 'rv-10',
      byId: 'u-01',
      byName: 'Ananya Sharma',
      rating: 5,
      text: 'Merino sweater exactly as pictured. Vikram is a reliable, no-nonsense swapper. Would trade again.',
      date: '2026-06-28',
    },
  ],
}

// Starter notifications for the demo persona (Ananya). The store merges these
// with anything the current session generates (requests, accepts, reviews).
export const notificationsSeed = [
  {
    id: 'nt-01',
    type: 'request',
    text: 'Rohan Mehta wants to swap his Samba OG for your Levi’s trucker.',
    to: '/swap/sr-demo-01',
    createdAt: '2026-07-16T10:41:00.000Z',
    read: false,
  },
  {
    id: 'nt-02',
    type: 'message',
    text: 'New message from Rohan: “Deal. Sending the updated offer now.”',
    to: '/chat?request=sr-demo-01',
    createdAt: '2026-07-16T10:47:00.000Z',
    read: false,
  },
  {
    id: 'nt-03',
    type: 'review',
    text: 'Vikram Iyer left you a 5★ review after your swap.',
    to: '/dashboard',
    createdAt: '2026-06-29T14:12:00.000Z',
    read: true,
  },
  {
    id: 'nt-04',
    type: 'status',
    text: 'Your swap SW-1536 ⇄ SW-1348 was marked completed.',
    to: '/swap/sr-demo-03',
    createdAt: '2026-06-28T18:30:00.000Z',
    read: true,
  },
]
