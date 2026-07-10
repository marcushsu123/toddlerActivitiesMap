import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from './Spinner'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
