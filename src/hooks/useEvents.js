import { useState, useEffect, useCallback } from 'react'
import { eventService } from '../services/eventService'
import { LEEDS_CENTER } from '../utils/constants'

export function useEvents(position = LEEDS_CENTER) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await eventService.getEvents(position)
      setEvents(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [position.lat, position.lng])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  return { events, loading, error, refetch: fetchEvents }
}
