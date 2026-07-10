import { useState } from 'react'
import { profileService } from '../../services/profileService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import KidsAgeInput from './KidsAgeInput'

export default function ProfileForm({ profile, onSaved }) {
  const { user } = useAuth()
  const { show } = useToast()
  const [form, setForm] = useState({
    display_name: profile?.display_name ?? '',
    bio: profile?.bio ?? '',
    kids_ages: profile?.kids_ages ?? [],
  })
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const saved = await profileService.upsertProfile(user.id, form)
      show('Profile saved!', 'success')
      onSaved?.(saved)
    } catch {
      show('Could not save profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <Input label="Display name" value={form.display_name} onChange={set('display_name')} required minLength={2} maxLength={60} />
      <Textarea label="About you" value={form.bio} onChange={set('bio')} rows={3} maxLength={400} placeholder="Tell other parents a bit about yourself..." />
      <KidsAgeInput value={form.kids_ages} onChange={(ages) => setForm((f) => ({ ...f, kids_ages: ages }))} />
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
    </form>
  )
}
