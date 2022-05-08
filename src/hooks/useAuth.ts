import * as t from 'src/types'
import { useState, useEffect } from 'react'
import storage from 'src/local-storage'

export const useAuth = () => {
  const [state, setState] = useState<{
    idToken: string
    user: t.User
   } | null>(null)

  const loadToken = (): {
    idToken: string
    user: t.User
   } | null => {
    const stored = storage.auth.get()
    if (!stored) return null
    setState(stored)
    return stored
  }

  const logout = () => {
    storage.auth.clear()
    setState(null)
  }

  useEffect(() => {
    loadToken()
  }, [])

  return {
    token: state?.idToken,
    user: state?.user,
    isAuthenticated: !!state,
    refresh: loadToken,
    logout
  }
}
