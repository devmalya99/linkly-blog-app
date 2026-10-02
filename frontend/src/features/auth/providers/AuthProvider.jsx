import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAccessToken, getStoredUser, clearAuthSession, setAuthSession } from '../utils/authCookies'
import { refreshSession } from '../api/authApi'
import {
  authKeys,
  currentUserQueryOptions,
  loginMutationOptions,
  logoutMutationOptions,
  registerMutationOptions,
} from '../queries'
import { AuthContext } from './authContext'

function applySessionState(session, setAccessToken, setUser) {
  if (!session?.accessToken) {
    clearAuthSession()
    setAccessToken(null)
    setUser(null)
    return
  }

  setAuthSession({
    accessToken: session.accessToken,
    user: session.user,
  })
  setAccessToken(session.accessToken)
  setUser(session.user ?? getStoredUser())
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(() => getStoredUser())
  const [accessToken, setAccessToken] = useState(() => getAccessToken())
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const applySession = useCallback((session) => {
    applySessionState(session, setAccessToken, setUser)
  }, [])

  const clearSession = useCallback(() => {
    applySessionState(null, setAccessToken, setUser)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const token = getAccessToken()
      const storedUser = getStoredUser()

      if (token && storedUser) {
        try {
          const response = await queryClient.fetchQuery(currentUserQueryOptions())
          if (!cancelled) {
            applySession({
              accessToken: getAccessToken(),
              user: response.data,
            })
          }
          return
        } catch {
          // Access token likely expired — try refresh below.
        }
      }

      // Only hit refresh when we previously had a session (user cookie).
      // HttpOnly refresh cookie cannot be read from JS.
      if (!storedUser && !token) {
        if (!cancelled) clearSession()
        return
      }

      const refreshed = await refreshSession()

      if (!cancelled) {
        applySession(refreshed?.accessToken ? refreshed : null)
        if (!refreshed?.accessToken) {
          queryClient.removeQueries({ queryKey: authKeys.all })
        }
      }
    }

    bootstrap().finally(() => {
      if (!cancelled) setIsBootstrapping(false)
    })

    return () => {
      cancelled = true
    }
  }, [applySession, clearSession, queryClient])

  const registerMutation = useMutation(registerMutationOptions())
  const loginMutation = useMutation(loginMutationOptions(queryClient, applySession))
  const logoutMutation = useMutation(logoutMutationOptions(queryClient, clearSession))

  const register = useCallback((payload) => registerMutation.mutateAsync(payload), [registerMutation])

  const login = useCallback((payload) => loginMutation.mutateAsync(payload), [loginMutation])

  const completeOAuthLogin = useCallback(async () => {
    const session = await refreshSession()
    applySession(session?.accessToken ? session : null)

    if (session?.accessToken) {
      try {
        await queryClient.fetchQuery(currentUserQueryOptions())
      } catch {
        // Session cookies are set; /me is best-effort after OAuth refresh.
      }
    } else {
      queryClient.removeQueries({ queryKey: authKeys.all })
    }

    return session
  }, [applySession, queryClient])

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await logoutMutation.mutateAsync()
      } else {
        clearSession()
        queryClient.removeQueries({ queryKey: authKeys.all })
      }
    } catch {
      clearSession()
      queryClient.removeQueries({ queryKey: authKeys.all })
    }
  }, [clearSession, logoutMutation, queryClient])

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isBootstrapping,
    register,
    login,
    completeOAuthLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
