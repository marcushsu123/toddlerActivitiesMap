import { Suspense, lazy, useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useEvents } from '../hooks/useEvents'
import EventList from '../components/events/EventList'
import Spinner from '../components/ui/Spinner'

const EventsMap = lazy(() => import('../components/map/EventsMap'))

export default function EventsPage() {
  const { position } = useGeolocation()
  const { events, loading, error } = useEvents(position)
  const [view, setView] = useState('map')

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] md:h-[calc(100vh-57px)]">
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border shrink-0">
        <span className="font-display text-lg font-bold text-accent md:hidden">Little Meet</span>
        <div className="flex bg-ground rounded-xl p-0.5 gap-0.5 ml-auto">
          {['map', 'list'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${view === v ? 'bg-surface text-accent shadow-sm' : 'text-muted hover:text-app-text'}`}
            >
              {v === 'map' ? '🗺️ Map' : '📋 List'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 ${view === 'map' ? 'block' : 'hidden'}`}>
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>}>
            <EventsMap events={events} center={position} />
          </Suspense>
        </div>

        <div className={`absolute inset-0 overflow-y-auto ${view === 'list' ? 'block' : 'hidden'}`}>
          <EventList events={events} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}
