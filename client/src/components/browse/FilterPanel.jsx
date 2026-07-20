import FilterChip from '../ui/FilterChip'
import Eyebrow from '../ui/Eyebrow'
import { Select } from '../ui/fields'

function Group({ label, children }) {
  return (
    <div className="border-b border-gray-line/50 py-6 first:pt-4 last:border-0">
      <Eyebrow tone="gray" className="mb-4">
        {label}
      </Eyebrow>
      {children}
    </div>
  )
}

// The filter controls, shared between the desktop sidebar and mobile drawer.
// All state lives in the URL (Browse owns it) — this is a controlled panel.
export default function FilterPanel({ facets, selected, onToggle, onSet, onClearAll, activeCount }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-ivory">Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-light transition-colors duration-200 hover:text-ivory"
          >
            Clear all · {activeCount}
          </button>
        )}
      </div>

      <Group label="Category">
        <div className="flex flex-wrap gap-2">
          {facets.categories.map(([name, count]) => (
            <FilterChip
              key={name}
              active={selected.categories.includes(name)}
              count={count}
              onClick={() => onToggle('category', name)}
            >
              {name}
            </FilterChip>
          ))}
        </div>
      </Group>

      <Group label="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => (
            <FilterChip
              key={size}
              active={selected.sizes.includes(size)}
              onClick={() => onToggle('size', size)}
            >
              {size}
            </FilterChip>
          ))}
        </div>
      </Group>

      <Group label="Condition">
        <div className="flex flex-wrap gap-2">
          {facets.conditions.map((condition) => (
            <FilterChip
              key={condition}
              active={selected.conditions.includes(condition)}
              onClick={() => onToggle('condition', condition)}
            >
              {condition}
            </FilterChip>
          ))}
        </div>
      </Group>

      <Group label="Brand">
        <div className="flex flex-wrap gap-2">
          {facets.brands.map(([name, count]) => (
            <FilterChip
              key={name}
              active={selected.brands.includes(name)}
              count={count}
              onClick={() => onToggle('brand', name)}
            >
              {name}
            </FilterChip>
          ))}
        </div>
      </Group>

      <Group label="Location">
        <div className="space-y-3">
          <Select value={selected.city} onChange={(e) => onSet('city', e.target.value)} aria-label="City">
            <option value="">All cities</option>
            {facets.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
          <Select
            value={selected.radius}
            onChange={(e) => onSet('radius', e.target.value)}
            disabled={!selected.city}
            className="disabled:opacity-40"
            aria-label="Distance radius"
          >
            <option value="">Any distance</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
          </Select>
          {!selected.city && (
            <p className="text-xs text-gray-mid">Pick a city to filter by distance.</p>
          )}
        </div>
      </Group>
    </div>
  )
}
