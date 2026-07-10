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
    const { error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId)
      .eq('profile_id', user.id)
    if (error) throw error
  },

  async isAttending(eventId) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('event_attendees')
      .select('profile_id')
      .eq('event_id', eventId)
      .eq('profile_id', user.id)
      .maybeSingle()
    return !!data
  },
}
