import { supabase } from '../lib/supabaseClient'
import { toPostGISPoint } from '../utils/geoHelpers'
import { LEEDS_CENTER, NEARBY_RADIUS_KM } from '../utils/constants'

export const eventService = {
  async getEvents({ lat = LEEDS_CENTER.lat, lng = LEEDS_CENTER.lng, radiusKm = NEARBY_RADIUS_KM } = {}) {
    const { data, error } = await supabase.rpc('events_nearby', {
      user_lat: lat,
      user_lng: lng,
      radius_m: radiusKm * 1000,
    })
    if (error) throw error
    return data ?? []
  },

  async getEventById(id) {
    const { data, error } = await supabase
      .from('events_with_counts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createEvent({ title, description, languages, imageUrl, lat, lng, locationName, startsAt, endsAt, minAgeMonths, maxAgeMonths, maxAttendees }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('events')
      .insert({
        creator_id: user.id,
        title,
        description,
        languages,
        image_url: imageUrl ?? null,
        location: toPostGISPoint(lat, lng),
        location_name: locationName,
        starts_at: startsAt,
        ends_at: endsAt || null,
        min_age_months: minAgeMonths,
        max_age_months: maxAgeMonths,
        max_attendees: maxAttendees || null,
      })
      .select()
      .single()
    if (error) throw error

    await supabase.from('event_attendees').insert({ event_id: data.id, profile_id: user.id })

    return data
  },

  async cancelEvent(id) {
    const { error } = await supabase
      .from('events')
      .update({ is_cancelled: true })
      .eq('id', id)
    if (error) throw error
  },
}
