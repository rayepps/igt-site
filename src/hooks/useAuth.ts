import { useState, useEffect } from 'react'
import storage from 'src/local-storage'

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)

  const loadToken = (): string | null => {
    const tokenInStorage = storage.token.get()
    if (!tokenInStorage) return null
    setToken(tokenInStorage)
    return tokenInStorage
  }

  const logout = () => {
    storage.token.clear()
    setToken(null)
  }

  useEffect(() => {
    loadToken()
  }, [])

  console.log('token: ', token)

  return {
    token,
    isAuthenticated: !!token,
    refresh: loadToken,
    logout
  }
}
