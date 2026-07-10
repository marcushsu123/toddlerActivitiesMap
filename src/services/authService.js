import { supabase } from '../lib/supabaseClient'

export const authService = {
  async signUp(email, password, displayName) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
  },

  async signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    return supabase.auth.signOut()
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  onAuthStateChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
    return data.subscription.unsubscribe
  },
}
