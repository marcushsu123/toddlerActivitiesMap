import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await authService.signIn(form.email, form.password)
    setLoading(false)
    if (error) {
      show(error.message, 'error')
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold text-app-text">Welcome back</h2>
      <Input label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
      <Input label="Password" type="password" value={form.password} onChange={set('password')} required autoComplete="current-password" />
      <Button type="submit" disabled={loading} className="w-full mt-1">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-muted">
        No account?{' '}
        <Link to="/signup" className="text-accent font-medium hover:underline">Sign up</Link>
      </p>
    </form>
  )
}
