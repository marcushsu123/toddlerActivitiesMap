import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <p className="text-5xl mb-4">🌿</p>
      <h1 className="font-display text-2xl font-bold text-app-text mb-2">Page not found</h1>
      <p className="text-muted text-sm mb-6">Looks like you've wandered off the path.</p>
      <Link to="/" className="text-accent font-medium hover:underline">Back to the map</Link>
    </div>
  )
}
