import { Outlet, NavLink } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-surface border-b border-border">
        <span className="font-display text-xl font-bold text-accent">Little Meet</span>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-app-text'}`}>Map</NavLink>
          <NavLink to="/create" className={({ isActive }) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-app-text'}`}>Create event</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-app-text'}`}>Profile</NavLink>
        </nav>
      </header>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-30">
        {[
          { to: '/', label: 'Map', icon: '🗺️', end: true },
          { to: '/create', label: 'Create', icon: '＋', end: true },
          { to: '/profile', label: 'Profile', icon: '👤', end: true },
        ].map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${isActive ? 'text-accent' : 'text-muted'}`
            }
          >
            <span className="text-lg leading-none mb-0.5">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
