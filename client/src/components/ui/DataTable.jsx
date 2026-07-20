import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../lib/utils'

// Generic sortable table for the admin panel.
// columns: [{ key, header, sortable, accessor?(row), render?(row), className }]
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  initialSort = null,
  emptyLabel = 'Nothing here yet.',
  onRowClick,
  className,
}) {
  const [sort, setSort] = useState(initialSort)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    const accessor = col?.accessor ?? ((row) => row[sort.key])
    return [...rows].sort((a, b) => {
      const va = accessor(a)
      const vb = accessor(b)
      const cmp =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb))
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, sort, columns])

  const toggleSort = (key) =>
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )

  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-white/10 bg-charcoal shadow-material', className)}>
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-line">
            {columns.map((col) => (
              <th key={col.key} className={cn('px-5 py-4 font-normal', col.className)}>
                {col.sortable ? (
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid transition-colors duration-200 hover:text-ivory"
                  >
                    {col.header}
                    {sort?.key === col.key ? (
                      sort.dir === 'asc' ? (
                        <ChevronUp className="h-3 w-3 text-red-light" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-red-light" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
                    {col.header}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-gray-mid">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-gray-line/40 transition-colors duration-200 last:border-0 hover:bg-white/[0.03]',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-5 py-4 text-gray-light', col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
