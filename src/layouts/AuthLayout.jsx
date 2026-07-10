import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-ground">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-accent">Little Meet</h1>
        <p className="text-muted text-sm mt-1">Leeds playdates for parents & kids</p>
      </div>
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-sm border border-border p-6">
        <Outlet />
      </div>
    </div>
  )
}
