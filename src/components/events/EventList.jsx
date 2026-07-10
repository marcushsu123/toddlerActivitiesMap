import EventCard from './EventCard'
import Spinner from '../ui/Spinner'

export default function EventList({ events, loading, error }) {
  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (error) return <p className="text-center text-muted py-12">Could not load events. Try again.</p>
  if (!events.length) return (
    <div className="text-center py-12">
      <p className="font-display text-2xl text-accent mb-2">No playdates yet!</p>
      <p className="text-muted text-sm">Be the first to create one nearby.</p>
    </div>
  )
  return (
    <div className="flex flex-col gap-3 p-4">
      {events.map((e) => <EventCard key={e.id} event={e} />)}
    </div>
  )
}
