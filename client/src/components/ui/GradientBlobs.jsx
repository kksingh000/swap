import { cn } from '../../lib/utils'

// Slow-drifting blurred blobs (deep red + charcoal) behind hero/section
// content. Low opacity, moody — never bright.
export default function GradientBlobs({ className }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -left-24 -top-32 h-[34rem] w-[34rem] animate-blob-drift rounded-full bg-red-deep/25 blur-[120px]" />
      <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] animate-blob-drift-slow rounded-full bg-red/15 blur-[140px]" />
      <div
        className="absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] animate-blob-drift rounded-full bg-gray-dark/40 blur-[120px]"
        style={{ animationDelay: '-9s' }}
      />
    </div>
  )
}
