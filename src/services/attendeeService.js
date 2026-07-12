import { supabase } from '../lib/supabaseClient'

export const attendeeService = {
  async getAttendees(eventId) {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('profile_id, joined_at, profiles(*)')
      .eq('event_id', eventId)
    if (error) throw error
    return data ?? []
  },

  async joinEvent(eventId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase
      .from('event_attendees')
      .insert({ event_id: eventId, profile_id: user.id })
    if (error) {
      if (error.code === '23505') return { alreadyJoined: true }
      throw error
    }
    return { alreadyJoined: false }
  },

  async leaveEvent(eventId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId)
      .eq('profile_id', user.id)
    if (error) throw error
  },

  async isAttending(eventId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    const { data } = await supabase
      .from('event_attendees')
      .select('profile_id')
      .eq('event_id', eventId)
      .eq('profile_id', user.id)
      .maybeSingle()
    return !!data
  },

  async getAttendedEvents() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const [attendingRes, createdRes] = await Promise.all([
      supabase.from('event_attendees').select('events(*)').eq('profile_id', user.id),
      supabase.from('events').select('*').eq('creator_id', user.id),
    ])
    if (attendingRes.error) throw attendingRes.error
    if (createdRes.error) throw createdRes.error

    const seen = new Set()
    const all = [
      ...(attendingRes.data ?? []).map(r => r.events).filter(Boolean),
      ...(createdRes.data ?? []),
    ].filter(ev => {
      if (!ev?.id || seen.has(ev.id)) return false
      seen.add(ev.id)
      return true
    })

    const now = new Date().toISOString()
    const upcoming = all
      .filter(ev => ev.starts_at >= now)
      .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
    const past = all
      .filter(ev => ev.starts_at < now)
      .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at))
    return { upcoming, past }
  },
}
