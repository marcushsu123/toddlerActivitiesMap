import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import { LEEDS_CENTER, DEFAULT_ZOOM } from '../../utils/constants'

// Fix Leaflet's broken default icon resolution in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

function createEventIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:#4A7C59;
      color:white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      width:32px;height:32px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      border:2px solid white;
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  })
}

export default function EventsMap({ events, center = LEEDS_CENTER }) {
  const navigate = useNavigate()
  const icon = createEventIcon()

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[Number(event.lat), Number(event.lng)]}
          icon={icon}
        >
          <Popup>
            <div style={{ minWidth: '160px' }}>
              <p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>{event.title}</p>
              <p style={{ fontSize: '12px', color: '#6B7566', marginTop: '4px' }}>{event.location_name}</p>
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: '#4A7C59', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                View details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
