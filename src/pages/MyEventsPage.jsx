import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { attendeeService } from '../services/attendeeService'
import { feedbackService } from '../services/feedbackService'
import { formatEventDate } from '../utils/dateHelpers'
import FeedbackForm from '../components/events/FeedbackForm'
import Spinner from '../components/ui/Spinner'

function UpcomingRow({ event }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="flex gap-3 py-3 border-b border-border last:border-0 cursor-pointer hover:opacity-75 transition-opacity"
    >
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-app-text text-sm truncate">{event.title}</p>
        <p className="text-xs text-muted mt-0.5">{formatEventDate(event.starts_at)}</p>
        <p className="text-xs text-muted truncate">{event.location_name}</p>
      </div>
    </div>
  )
}

export default function MyEventsPage() {
  const { user } = useAuth()
  const { show } = useToast()
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [feedbackMap, setFeedbackMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const { upcoming: up, past: pa } = await attendeeService.getAttendedEvents()
        setUpcoming(up)
        setPast(pa)
        const pairs = await Promise.all(
          pa.map(ev => feedbackService.getMyFeedback(ev.id).then(fb => [ev.id, fb]))
        )
        setFeedbackMap(Object.fromEntries(pairs))
      } catch {
        show('Could not load your events', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleFeedbackSaved = (eventId, feedback) => {
    setFeedbackMap(prev => ({ ...prev, [eventId]: feedback }))
    setExpanded(null)
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-app-text mb-6">My events</h1>

      <section className="mb-8">
        <h2 className="font-semibold text-app-text mb-3">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">No upcoming events — go join one!</p>
        ) : (
          <div className="bg-surface rounded-2xl border border-border px-4">
            {upcoming.map(ev => <UpcomingRow key={ev.id} event={ev} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-app-text mb-3">Past events</h2>
        {past.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🌿</p>
            <p className="font-medium text-app-text mb-1">Nothing here yet</p>
            <p className="text-sm text-muted">Once a playdate you attended has passed, it'll show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {past.map(event => {
              const feedback = feedbackMap[event.id]
              const isOpen = expanded === event.id
              return (
                <div key={event.id} className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold text-app-text leading-snug">{event.title}</h3>
                    <p className="text-xs text-muted mt-1">📅 {formatEventDate(event.starts_at)}</p>
                    {event.location_name && (
                      <p className="text-xs text-muted mt-0.5">📍 {event.location_name}</p>
                    )}
                    {feedback && !isOpen && (
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex gap-0.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-lg leading-none ${s <= feedback.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                        {feedback.comment && (
                          <p className="text-xs text-muted line-clamp-2 leading-relaxed">{feedback.comment}</p>
                        )}
                      </div>
                    )}
                    {feedback?.photo_urls?.length > 0 && !isOpen && (
                      <div className="mt-2 flex gap-1.5 overflow-x-auto">
                        {feedback.photo_urls.slice(0, 3).map(url => (
                          <img key={url} src={url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-border" />
                        ))}
                        {feedback.photo_urls.length > 3 && (
                          <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-ground border border-border flex items-center justify-center text-xs font-medium text-muted">
                            +{feedback.photo_urls.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => setExpanded(isOpen ? null : event.id)}
                      className="mt-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                    >
                      {isOpen ? 'Cancel' : feedback ? 'Edit feedback' : '+ Leave feedback'}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="border-t border-border px-4 py-4 bg-ground/40">
                      <FeedbackForm eventId={event.id} existing={feedback} onSaved={fb => handleFeedbackSaved(event.id, fb)} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
