import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function SignupPage() {
  const { show } = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await authService.signUp(form.email, form.password, form.name)
    setLoading(false)
    if (error) {
      show(error.message, 'error')
    } else {
      setDone(true)
    }
  }

  if (done) return (
    <div className="text-center">
      <p className="text-2xl mb-2">📬</p>
      <h2 className="font-display text-xl font-bold text-app-text mb-2">Check your email</h2>
      <p className="text-sm text-muted">We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold text-app-text">Join Little Meet</h2>
      <Input label="Your name" type="text" value={form.name} onChange={set('name')} required minLength={2} placeholder="What should other parents call you?" />
      <Input label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
      <Input label="Password" type="password" value={form.password} onChange={set('password')} required minLength={6} autoComplete="new-password" />
      <Button type="submit" disabled={loading} className="w-full mt-1">
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
      </p>
    </form>
  )
}
