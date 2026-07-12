import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/authService'
import { profileService } from '../services/profileService'
import { attendeeService } from '../services/attendeeService'
import { formatEventDate } from '../utils/dateHelpers'
import ProfileForm from '../components/profile/ProfileForm'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

function EventRow({ event }) {
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

export default function ProfilePage() {
  const { user } = useAuth()
  const { show } = useToast()
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      profileService.getProfile(user.id),
      attendeeService.getAttendedEvents(),
    ])
      .then(([p, e]) => { setProfile(p); setEvents(e) })
      .catch(() => show('Could not load profile', 'error'))
      .finally(() => setLoading(false))
  }, [user])

  const signOut = async () => { await authService.signOut() }

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-app-text mb-6">Your profile</h1>
      <ProfileForm profile={profile} onSaved={setProfile} />

      <div className="mt-8">
        <h2 className="font-semibold text-app-text mb-3">Upcoming events</h2>
        {events.upcoming.length === 0 ? (
          <p className="text-sm text-muted">No upcoming events — go join one!</p>
        ) : (
          <div className="bg-surface rounded-2xl border border-border px-4">
            {events.upcoming.map(ev => <EventRow key={ev.id} event={ev} />)}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-app-text mb-3">Past events</h2>
        {events.past.length === 0 ? (
          <p className="text-sm text-muted">No past events yet.</p>
        ) : (
          <div className="bg-surface rounded-2xl border border-border px-4">
            {events.past.map(ev => <EventRow key={ev.id} event={ev} />)}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Button variant="ghost" onClick={signOut} className="w-full text-muted">Sign out</Button>
      </div>
    </div>
  )
}
