import { useNavigate } from 'react-router-dom'
import { formatEventDay, formatEventMonth, formatAgeRange } from '../../utils/dateHelpers'
import { languageFlag } from '../../utils/constants'
import Badge from '../ui/Badge'

export default function EventCard({ event }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="bg-surface rounded-2xl p-4 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow flex gap-4"
    >
      <div className="flex-shrink-0 w-14 text-center" style={{ transform: 'rotate(-1.5deg)' }}>
        <span className="block font-display text-4xl font-bold leading-none text-accent">
          {formatEventDay(event.starts_at)}
        </span>
        <span className="block text-xs font-medium uppercase tracking-widest text-muted mt-1">
          {formatEventMonth(event.starts_at)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-app-text leading-snug truncate">
          {event.language && event.language !== 'en' && (
            <span className="mr-1.5">{languageFlag(event.language)}</span>
          )}
          {event.title}
        </h3>
        <p className="text-xs text-muted mt-0.5 truncate">{event.location_name}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge>{formatAgeRange(event.min_age_months, event.max_age_months)}</Badge>
          {event.attendee_count != null && (
            <span className="text-xs text-muted">{event.attendee_count} going</span>
          )}
          {event.max_attendees && (
            <span className="text-xs text-muted">/ {event.max_attendees} max</span>
          )}
        </div>
      </div>
    </div>
  )
}
