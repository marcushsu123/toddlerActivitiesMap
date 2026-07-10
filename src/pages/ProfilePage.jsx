import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/authService'
import { profileService } from '../services/profileService'
import ProfileForm from '../components/profile/ProfileForm'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function ProfilePage() {
  const { user } = useAuth()
  const { show } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    profileService.getProfile(user.id)
      .then(setProfile)
      .catch(() => show('Could not load profile', 'error'))
      .finally(() => setLoading(false))
  }, [user])

  const signOut = async () => {
    await authService.signOut()
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-app-text mb-6">Your profile</h1>
      <ProfileForm profile={profile} onSaved={setProfile} />
      <div className="mt-8 pt-6 border-t border-border">
        <Button variant="ghost" onClick={signOut} className="w-full text-muted">Sign out</Button>
      </div>
    </div>
  )
}
