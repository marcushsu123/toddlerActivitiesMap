import { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { useToast } from '../context/ToastContext'
import { LANGUAGES } from '../utils/constants'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

const LocationPicker = lazy(() => import('../components/map/LocationPicker'))

const STEPS = ['Details', 'Location', 'Date & Settings']

export default function CreateEventPage() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    language: 'en',
    lat: null,
    lng: null,
    locationName: '',
    startsAt: '',
    endsAt: '',
    minAgeMonths: 0,
    maxAgeMonths: 84,
    maxAttendees: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const canAdvance = () => {
    if (step === 0) return form.title.trim().length >= 3
    if (step === 1) return form.lat !== null && form.lng !== null
    return form.startsAt !== ''
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const event = await eventService.createEvent({
        ...form,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees, 10) : null,
        minAgeMonths: parseInt(form.minAgeMonths, 10),
        maxAgeMonths: parseInt(form.maxAgeMonths, 10),
      })
      show('Playdate created! 🎉', 'success')
      navigate(`/events/${event.id}`)
    } catch {
      show('Could not create event. Try again.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-app-text mb-1">Create a playdate</h1>

      <div className="flex gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <Input
              label="Title"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Morning play at Roundhay Park"
              required
              minLength={3}
              maxLength={100}
            />
            <Textarea
              label="Description (optional)"
              value={form.description}
              onChange={set('description')}
              rows={4}
              maxLength={1000}
              placeholder="Tell parents what to expect — activities, what to bring, etc."
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-app-text">Language spoken</label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setVal('language', l.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                      form.language === l.code
                        ? 'border-accent bg-accent/10 text-accent font-medium'
                        : 'border-border bg-surface text-app-text hover:border-accent/50'
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="truncate">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
            <LocationPicker onLocationSelect={({ lat, lng, locationName }) => {
              setVal('lat', lat)
              setVal('lng', lng)
              setVal('locationName', locationName)
            }} />
            {form.locationName && (
              <p className="text-sm text-app-text"><strong>Selected:</strong> {form.locationName}</p>
            )}
          </Suspense>
        )}

        {step === 2 && (
          <>
            <Input
              label="Start date & time"
              type="datetime-local"
              value={form.startsAt}
              onChange={set('startsAt')}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
            <Input
              label="End time (optional)"
              type="datetime-local"
              value={form.endsAt}
              onChange={set('endsAt')}
              min={form.startsAt}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-app-text">Min kid age</label>
              <input type="range" min="0" max="84" step="6" value={form.minAgeMonths} onChange={set('minAgeMonths')} className="accent-accent" />
              <div className="flex justify-between text-xs text-muted">
                <span>0 months</span>
                <span className="font-medium text-app-text">{form.minAgeMonths < 12 ? `${form.minAgeMonths}m` : `${Math.floor(form.minAgeMonths / 12)}y`}</span>
                <span>7 years</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-app-text">Max kid age</label>
              <input type="range" min="0" max="84" step="6" value={form.maxAgeMonths} onChange={set('maxAgeMonths')} className="accent-accent" />
              <div className="flex justify-between text-xs text-muted">
                <span>0 months</span>
                <span className="font-medium text-app-text">{form.maxAgeMonths < 12 ? `${form.maxAgeMonths}m` : `${Math.floor(form.maxAgeMonths / 12)}y`}</span>
                <span>7 years</span>
              </div>
            </div>
            <Input
              label="Max attendees (optional)"
              type="number"
              min="2"
              max="100"
              value={form.maxAttendees}
              onChange={set('maxAttendees')}
              placeholder="Leave blank for unlimited"
            />
          </>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">Back</Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()} className="flex-1">Next</Button>
        ) : (
          <Button onClick={submit} disabled={submitting || !canAdvance()} className="flex-1">
            {submitting ? <Spinner size="sm" /> : 'Create playdate'}
          </Button>
        )}
      </div>
    </div>
  )
}
