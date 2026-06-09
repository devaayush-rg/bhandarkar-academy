import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

/**
 * ProtectedRoute — wraps routes that require an authenticated Supabase session.
 * Unauthenticated users are redirected to /admin (login page).
 * Renders nothing (null) while the session check is in progress.
 */
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Subscribe to auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still loading — render nothing to avoid flash
  if (session === undefined) return null

  // No session — redirect to admin login
  if (!session) return <Navigate to="/admin" replace />

  return children
}

export default ProtectedRoute
