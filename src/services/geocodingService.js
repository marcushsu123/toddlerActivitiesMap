const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const HEADERS = {
  'User-Agent': 'toddlerActivitiesMap/1.0',
  'Accept-Language': 'en-GB',
}

export const geocodingService = {
  async forwardGeocode(query) {
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query + ', Leeds, UK')}&format=json&limit=5`
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) throw new Error('Geocoding failed')
    return res.json()
  },

  async reverseGeocode(lat, lng) {
    const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json`
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) throw new Error('Reverse geocoding failed')
    const data = await res.json()
    return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  },
}
