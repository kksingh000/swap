import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import Eyebrow from '../components/ui/Eyebrow'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import { Select } from '../components/ui/fields'
import ListingCard from '../components/listing/ListingCard'
import FilterPanel from '../components/browse/FilterPanel'
import FilterDrawer from '../components/browse/FilterDrawer'
import { fadeUp, stagger } from '../lib/motion'
import { listings } from '../data/seed'

const PAGE_SIZE = 8

const SIZE_ORDER = [
  'S', 'M', 'L', 'XL', '30', '32', '34', 'UK 8', 'UK 9', 'UK 10', 'One size',
  '3-4Y', '4-5Y', '6-7Y', 'UK 11K',
]
const DEPARTMENT_ORDER = ['Women', 'Men', 'Kids']
const CONDITION_ORDER = ['New with tags', 'Like new', 'Gently used', 'Well loved']

const SORTS = [
  { value: 'new', label: 'Newest first' },
  { value: 'closest', label: 'Closest first' },
  { value: 'value-desc', label: 'Value: high to low' },
  { value: 'value-asc', label: 'Value: low to high' },
]

// Stable pseudo-distance (km) per listing — stands in for real geolocation,
// which is explicitly out of scope. Same-city listings land within 1–24 km.
function pseudoDistance(listing) {
  return ([...listing.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 24) + 1
}

function countBy(items, key) {
  const map = new Map()
  for (const item of items) map.set(item[key], (map.get(item[key]) ?? 0) + 1)
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const getList = (key) => params.get(key)?.split(',').filter(Boolean) ?? []
  const selected = {
    departments: getList('department'),
    categories: getList('category'),
    sizes: getList('size'),
    conditions: getList('condition'),
    brands: getList('brand'),
    city: params.get('city') ?? '',
    radius: params.get('radius') ?? '',
    q: params.get('q') ?? '',
    sort: params.get('sort') ?? 'new',
    page: Math.max(1, Number(params.get('page') ?? 1) || 1),
  }

  const activeCount =
    selected.departments.length +
    selected.categories.length +
    selected.sizes.length +
    selected.conditions.length +
    selected.brands.length +
    (selected.city ? 1 : 0) +
    (selected.radius ? 1 : 0) +
    (selected.q ? 1 : 0)

  const update = (patch) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
        next.delete(key)
      } else {
        next.set(key, Array.isArray(value) ? value.join(',') : String(value))
      }
    }
    if (!('page' in patch)) next.delete('page') // filter changes reset pagination
    setParams(next)
  }

  const toggle = (key, value) => {
    const current = getList(key)
    update({
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    })
  }

  const clearAll = () => setParams(new URLSearchParams())

  const facets = useMemo(
    () => ({
      departments: countBy(listings, 'department').sort(
        (a, b) => DEPARTMENT_ORDER.indexOf(a[0]) - DEPARTMENT_ORDER.indexOf(b[0]),
      ),
      categories: countBy(listings, 'category'),
      brands: countBy(listings, 'brand'),
      sizes: [...new Set(listings.map((l) => l.size))].sort(
        (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b),
      ),
      conditions: [...new Set(listings.map((l) => l.condition))].sort(
        (a, b) => CONDITION_ORDER.indexOf(a) - CONDITION_ORDER.indexOf(b),
      ),
      cities: [...new Set(listings.map((l) => l.city))].sort(),
    }),
    [],
  )

  const query = selected.q.trim().toLowerCase()
  const matchesQuery = (l) =>
    !query ||
    [l.title, l.brand, l.category, l.department, l.city, l.description]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query))

  const filtered = useMemo(() => {
    let result = listings.filter(
      (l) =>
        (selected.departments.length === 0 || selected.departments.includes(l.department)) &&
        (selected.categories.length === 0 || selected.categories.includes(l.category)) &&
        (selected.sizes.length === 0 || selected.sizes.includes(l.size)) &&
        (selected.conditions.length === 0 || selected.conditions.includes(l.condition)) &&
        (selected.brands.length === 0 || selected.brands.includes(l.brand)) &&
        (!selected.city || l.city === selected.city) &&
        (!selected.city || !selected.radius || pseudoDistance(l) <= Number(selected.radius)) &&
        matchesQuery(l),
    )
    switch (selected.sort) {
      case 'value-desc':
        result = [...result].sort((a, b) => b.swapValue - a.swapValue)
        break
      case 'value-asc':
        result = [...result].sort((a, b) => a.swapValue - b.swapValue)
        break
      case 'closest':
        result = [...result].sort((a, b) => pseudoDistance(a) - pseudoDistance(b))
        break
      default:
        result = [...result].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt))
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(selected.page, totalPages)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const panelProps = {
    facets,
    selected,
    activeCount,
    onToggle: toggle,
    onSet: (key, value) => update({ [key]: value }),
    onClearAll: clearAll,
  }

  return (
    <PageTransition>
      <div className="grain relative">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <Eyebrow>The rack</Eyebrow>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-4xl text-ivory md:text-5xl">
              Browse every listing
            </motion.h1>
          </motion.div>

          <div className="mt-10 flex gap-10">
            {/* Desktop sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <FilterPanel {...panelProps} />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              {/* Search */}
              <div className="relative mb-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-mid" />
                <input
                  type="search"
                  value={selected.q}
                  onChange={(e) => update({ q: e.target.value })}
                  placeholder="Search brand, piece, city…"
                  aria-label="Search listings"
                  className="w-full rounded-xl border border-gray-line bg-black/60 py-3 pl-11 pr-11 text-sm text-ivory placeholder:text-gray-mid transition-all duration-200 focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red-light/70 [&::-webkit-search-cancel-button]:hidden"
                />
                {selected.q && (
                  <button
                    onClick={() => update({ q: '' })}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-mid transition-colors duration-200 hover:bg-white/5 hover:text-ivory"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-line/50 pb-5">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={SlidersHorizontal}
                    className="lg:hidden"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Filters
                    {activeCount > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red font-mono text-[10px] text-ivory">
                        {activeCount}
                      </span>
                    )}
                  </Button>
                  <p
                    data-testid="result-count"
                    className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray-mid"
                  >
                    {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                    {selected.city && ` · ${selected.city}`}
                    {totalPages > 1 && ` · page ${page}/${totalPages}`}
                  </p>
                </div>
                <div className="w-48">
                  <Select
                    value={selected.sort}
                    onChange={(e) => update({ sort: e.target.value })}
                    aria-label="Sort listings"
                    className="py-2.5 text-xs"
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Results */}
              {pageItems.length === 0 ? (
                <div className="mt-8">
                  <EmptyState
                    title="Nothing on the rack matches"
                    copy="Loosen a filter or two — new pieces are listed every day, and the right trade tends to appear when you least expect it."
                    actionLabel="Clear all filters"
                    onAction={clearAll}
                  />
                </div>
              ) : (
                <motion.div
                  key={params.toString()}
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {pageItems.map((listing) => (
                    <motion.div key={listing.id} variants={fadeUp}>
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => update({ page: p })}
                className="mt-14"
              />
            </div>
          </div>
        </div>
      </div>

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <FilterPanel {...panelProps} />
      </FilterDrawer>
    </PageTransition>
  )
}
