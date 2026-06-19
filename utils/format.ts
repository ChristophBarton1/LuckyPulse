// Number / value formatting helpers. Kept out of templates so display logic is testable.

const POINTS_FMT = new Intl.NumberFormat('en-US')
const COMPACT_FMT = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** Virtual-point formatting, e.g. 12560 -> "12,560". */
export function formatPoints(value: number): string {
  return POINTS_FMT.format(Math.round(value))
}

/** Compact large counts, e.g. 8890 -> "8.9K", 1200000 -> "1.2M". */
export function formatCompact(value: number): string {
  return COMPACT_FMT.format(value)
}

/** Percent with fixed precision, e.g. 63 -> "63.0%". */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

/** Signed delta for trend chips, e.g. 12.5 -> "+12.5%", -3 -> "-3.0%". */
export function formatDelta(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}
