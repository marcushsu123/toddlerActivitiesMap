import { useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LEEDS_CENTER } from '../../utils/constants'
import { geocodingService } from '../../services/geocodingService'
import Input from '../ui/Input'
import Spinner from '../ui/Spinner'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

export default function LocationPicker({ onLocationSelect }) {
  const [marker, setMarker] = useState(null)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState([])
  const debounceRef = useRef(null)

  const pick = useCallback(async (lat, lng) => {
    setMarker({ lat, lng })
    const name = await geocodingService.reverseGeocode(lat, lng)
    onLocationSelect({ lat, lng, locationName: name })
  }, [onLocationSelect])

  const handleSearchChange = (e) => {
    const q = e.target.value
    setSearch(q)
    clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const r = await geocodingService.forwardGeocode(q)
        setResults(r.slice(0, 4))
      } finally {
        setSearching(false)
      }
    }, 1000)
  }

  const selectResult = (r) => {
    setSearch(r.display_name)
    setResults([])
    pick(Number(r.lat), Number(r.lon))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          label="Search location"
          placeholder="e.g. Roundhay Park"
          value={search}
          onChange={handleSearchChange}
        />
        {searching && <div className="absolute right-3 top-9"><Spinner size="sm" /></div>}
        {results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => selectResult(r)}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-ground border-b border-border last:border-0"
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-muted">Or tap on the map to drop a pin</p>
      <div className="h-56 rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={[LEEDS_CENTER.lat, LEEDS_CENTER.lng]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={pick} />
          {marker && <Marker position={[marker.lat, marker.lng]} />}
        </MapContainer>
      </div>
      {marker && <p className="text-xs text-accent font-medium">Pin dropped ✓</p>}
    </div>
  )
}
