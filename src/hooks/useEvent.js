import { useState, useEffect, useCallback } from 'react'
import { eventService } from '../services/eventService'
import { attendeeService } from '../services/attendeeService'

export function useEvent(id) {
  const [event, setEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [isAttending, setIsAttending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvent = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [ev, atts, attending] = await Promise.all([
        eventService.getEventById(id),
        attendeeService.getAttendees(id),
        attendeeService.isAttending(id),
      ])
      setEvent(ev)
      setAttendees(atts)
      setIsAttending(attending)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchEvent() }, [fetchEvent])

  return { event, attendees, isAttending, loading, error, refetch: fetchEvent }
}
