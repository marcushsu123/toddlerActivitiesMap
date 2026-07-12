import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { notificationService } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'

export default function NotificationBell({ className = '' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [count, setCount] = useState(0)

  const refresh = () => {
    notificationService.getUnreadCount().then(setCount)
  }

  useEffect(() => {
    if (!user) return
    refresh()

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${user.id}` },
        () => refresh()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  return (
    <button
      onClick={() => navigate('/notifications')}
      className={`relative flex items-center justify-center ${className}`}
      aria-label={count > 0 ? `${count} unread notifications` : 'Notifications'}
    >
      <span className="text-xl leading-none">🔔</span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface" />
      )}
    </button>
  )
}
