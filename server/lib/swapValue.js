// Server-side mirror of the client calculator — the single valuation formula
// applied at listing creation so stored values can't be spoofed.

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

const BRAND_TIERS = { luxury: 1.85, premium: 1.4, mid: 1.1, value: 0.85 }

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

export function estimateValue({ category, brand, condition }) {
  const base = CATEGORY_BASE[category] ?? 1200
  const tier = BRAND_TIERS[BRAND_MAP[brand] ?? 'mid']
  const cond = CONDITION_FACTOR[condition] ?? 0.68
  return Math.round((base * tier * cond) / 50) * 50
}
