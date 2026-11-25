import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Falha ao obter sessão:', error.message)
      setSession(data?.session ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
    {children}
  </AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
