// Swap-value calculator — the single source of truth for item valuation.
// Used by the seed data, SwapValuePill, the calculator widget, and BalanceScale3D.
// Values are indicative rupee estimates; no money changes hands on the platform.

const CATEGORY_BASE = {
  Outerwear: 2400,
  Footwear: 2100,
  Ethnic: 1900,
  Dresses: 1700,
  Denim: 1500,
  Knitwear: 1400,
  Shirts: 1100,
  Tees: 650,
  Accessories: 550,
}

const BRAND_TIERS = {
  luxury: 1.85,
  premium: 1.4,
  mid: 1.1,
  value: 0.85,
}

const BRAND_MAP = {
  'Tommy Hilfiger': 'luxury',
  'Ralph Lauren': 'luxury',
  Coach: 'luxury',
  "Levi's": 'premium',
  Nike: 'premium',
  Adidas: 'premium',
  'New Balance': 'premium',
  Raymond: 'premium',
  Zara: 'mid',
  Mango: 'mid',
  Uniqlo: 'mid',
  FabIndia: 'mid',
  Biba: 'mid',
  'W for Woman': 'mid',
  'Allen Solly': 'mid',
  'H&M': 'value',
  'Jack & Jones': 'value',
  'Forever 21': 'value',
}

const CONDITION_FACTOR = {
  'New with tags': 1,
  'Like new': 0.85,
  'Gently used': 0.68,
  'Well loved': 0.48,
}

export const CATEGORIES = Object.keys(CATEGORY_BASE)
export const CONDITIONS = Object.keys(CONDITION_FACTOR)
export const BRAND_TIER_LABELS = {
  luxury: 'Luxury / designer',
  premium: 'Premium label',
  mid: 'High-street',
  value: 'Fast fashion',
}

export function brandTier(brand) {
  return BRAND_MAP[brand] ?? 'mid'
}

export function estimateValue({ category, brand, condition, tier }) {
  const base = CATEGORY_BASE[category] ?? 1200
  const tierFactor = BRAND_TIERS[tier ?? brandTier(brand)]
  const conditionFactor = CONDITION_FACTOR[condition] ?? 0.68
  return Math.round((base * tierFactor * conditionFactor) / 50) * 50
}

// A swap is "fair" when the lower value is at least 85% of the higher one.
export const FAIR_THRESHOLD = 0.85

export function fairness(valueA, valueB) {
  const ratio = Math.min(valueA, valueB) / Math.max(valueA, valueB)
  const delta = Math.abs(valueA - valueB)
  if (ratio >= FAIR_THRESHOLD) return { ratio, delta, verdict: 'fair', label: 'Fair swap' }
  if (ratio >= 0.65) return { ratio, delta, verdict: 'close', label: 'Slightly uneven' }
  return { ratio, delta, verdict: 'uneven', label: 'Uneven trade' }
}
