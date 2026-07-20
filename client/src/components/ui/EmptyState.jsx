import { SearchX } from 'lucide-react'
import Button from './Button'
import Eyebrow from './Eyebrow'

export default function EmptyState({
  icon: Icon = SearchX,
  eyebrow = 'No matches',
  title,
  copy,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-line bg-black/40 px-8 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-red/30 bg-red/10">
        <Icon className="h-7 w-7 text-red-light" strokeWidth={1.5} />
      </span>
      <Eyebrow className="mb-0 mt-6">{eyebrow}</Eyebrow>
      <h3 className="mt-2 font-display text-2xl text-ivory">{title}</h3>
      {copy && <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-mid">{copy}</p>}
      {actionLabel && (
        <Button variant="outline" className="mt-7" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
