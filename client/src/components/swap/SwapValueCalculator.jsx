import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import MaterialCard from '../ui/MaterialCard'
import Eyebrow from '../ui/Eyebrow'
import { Field, Select } from '../ui/fields'
import { EASE_OUT } from '../../lib/motion'
import {
  CATEGORIES,
  CONDITIONS,
  BRAND_TIER_LABELS,
  brandTier,
  estimateValue,
} from '../../lib/swapValue'
import { formatRupees } from '../../lib/utils'

// Interactive appraisal widget: category × brand tier × condition → animated
// rupee output. Prefilled from the listing so users see how it was valued.
export default function SwapValueCalculator({ listing, className }) {
  const [category, setCategory] = useState(listing?.category ?? 'Denim')
  const [tier, setTier] = useState(listing ? brandTier(listing.brand) : 'mid')
  const [condition, setCondition] = useState(listing?.condition ?? 'Gently used')

  const value = estimateValue({ category, tier, condition })
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)
  displayRef.current = display

  useEffect(() => {
    const controls = animate(displayRef.current, value, {
      duration: 0.7,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value])

  return (
    <MaterialCard className={className}>
      <div className="p-7">
        <Eyebrow>Swap value calculator</Eyebrow>
        <h3 className="font-display text-2xl text-ivory">How we appraise a piece</h3>

        <div className="mt-6 space-y-4">
          <Field label="Category" htmlFor="calc-category">
            <Select id="calc-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Brand tier" htmlFor="calc-tier">
            <Select id="calc-tier" value={tier} onChange={(e) => setTier(e.target.value)}>
              {Object.entries(BRAND_TIER_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Condition" htmlFor="calc-condition">
            <Select id="calc-condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-7 flex items-end justify-between border-t border-gray-line/60 pt-6">
          <div>
            <p className="text-eyebrow mb-1 text-[10px] text-gray-mid">Estimated swap value</p>
            <p data-testid="calc-output" className="font-mono text-4xl text-ivory">
              ~{formatRupees(display)}
            </p>
          </div>
          <p className="max-w-32 text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-gray-mid">
            base × tier × condition
          </p>
        </div>
      </div>
    </MaterialCard>
  )
}
