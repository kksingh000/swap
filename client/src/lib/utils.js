import clsx from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatRupees(value) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const steps = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ]
  for (const [span, label] of steps) {
    if (seconds >= span) return `${Math.floor(seconds / span)}${label} ago`
  }
  return 'just now'
}
