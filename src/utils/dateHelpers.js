import { format, isToday, isTomorrow, formatDistanceToNow } from 'date-fns'

export function formatEventDate(dateStr) {
  const d = new Date(dateStr)
  if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`
  if (isTomorrow(d)) return `Tomorrow, ${format(d, 'h:mm a')}`
  return format(d, 'EEE d MMM, h:mm a')
}

export function formatEventDay(dateStr) {
  return format(new Date(dateStr), 'd')
}

export function formatEventMonth(dateStr) {
  return format(new Date(dateStr), 'MMM')
}

export function formatRelative(dateStr) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function formatAgeRange(minMonths, maxMonths) {
  const fmt = (m) => m < 12 ? `${m}m` : `${Math.floor(m / 12)}y`
  return `${fmt(minMonths)}–${fmt(maxMonths)}`
}
