import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEvent } from '../hooks/useEvent'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { attendeeService } from '../services/attendeeService'
import { eventService } from '../services/eventService'
import { formatEventDate, formatAgeRange } from '../utils/dateHelpers'
import AttendeeList from '../components/events/AttendeeList'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { show } = useToast()
  const { event, attendees, isAttending, loading, error, refetch } = useEvent(id)
  const [actioning, setActioning] = useState(false)

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>
  if (error || !event) return <p className="text-center py-12 text-muted">Event not found.</p>

  const isCreator = event.creator_id === user?.id
  const isFull = event.max_attendees && event.attendee_count >= event.max_attendees && !isAttending

  const handleJoin = async () => {
    setActioning(true)
    try {
      if (isAttending) {
        await attendeeService.leaveEvent(id)
        show('You left the event', 'info')
      } else {
        await attendeeService.joinEvent(id)
        show("You're going! 🎉", 'success')
      }
      await refetch()
    } catch {
      show('Something went wrong', 'error')
    } finally {
      setActioning(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this event?')) return
    setActioning(true)
    try {
      await eventService.cancelEvent(id)
      show('Event cancelled', 'info')
      navigate('/')
    } catch {
      show('Could not cancel event', 'error')
      setActioning(false)
    }
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name)}`

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="text-sm text-muted hover:text-app-text mb-4 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="font-display text-2xl font-bold text-app-text leading-snug">{event.title}</h1>

      <div className="flex flex-wrap gap-2 mt-3">
        <Badge>{formatAgeRange(event.min_age_months, event.max_age_months)}</Badge>
        {event.attendee_count != null && (
          <Badge color="gray">{event.attendee_count}{event.max_attendees ? `/${event.max_attendees}` : ''} going</Badge>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-app-text">
        <div className="flex items-start gap-2">
          <span>📅</span>
          <span>{formatEventDate(event.starts_at)}</span>
        </div>
        <div className="flex items-start gap-2">
          <span>📍</span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{event.location_name}</a>
        </div>
      </div>

      {event.description && (
        <p className="mt-4 text-sm text-app-text leading-relaxed">{event.description}</p>
      )}

      {!isCreator && (
        <Button
          onClick={handleJoin}
          variant={isAttending ? 'secondary' : 'primary'}
          disabled={actioning || (isFull && !isAttending)}
          className="w-full mt-6"
          size="lg"
        >
          {actioning ? <Spinner size="sm" /> : isAttending ? 'Leave event' : isFull ? 'Event full' : 'Join this playdate'}
        </Button>
      )}

      {isCreator && (
        <Button onClick={handleCancel} variant="danger" disabled={actioning} className="w-full mt-6" size="lg">
          {actioning ? <Spinner size="sm" /> : 'Cancel event'}
        </Button>
      )}

      <div className="mt-8">
        <h2 className="font-semibold text-app-text mb-3">Who's coming</h2>
        <AttendeeList attendees={attendees} />
      </div>
    </div>
  )
}
