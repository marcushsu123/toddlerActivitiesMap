import { supabase } from '../lib/supabaseClient'

export const storageService = {
  async uploadEventImage(file) {
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('event-images')
      .upload(path, file, { contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from('event-images').getPublicUrl(path)
    return data.publicUrl
  },
}
