import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../../../utils/constants'

export function AuthCallback() {
  const navigate = useNavigate()
  const { completeOAuthLogin } = useAuth()
  const [message, setMessage] = useState('Finishing Google sign-in…')

  useEffect(() => {
    let cancelled = false

    async function finish() {
      try {
        const session = await completeOAuthLogin()

        if (cancelled) return

        if (!session?.accessToken) {
          navigate(`${ROUTES.LOGIN}?error=google_auth_failed`, { replace: true })
          return
        }

        navigate(ROUTES.DASHBOARD, { replace: true })
      } catch {
        if (!cancelled) {
          setMessage('Google sign-in failed. Redirecting…')
          navigate(`${ROUTES.LOGIN}?error=google_auth_failed`, { replace: true })
        }
      }
    }

    finish()

    return () => {
      cancelled = true
    }
  }, [completeOAuthLogin, navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-warm px-4 font-body-md text-body-md text-text-primary">
      <p className="rounded-lg border border-border-subtle bg-surface-white px-5 py-4 shadow-sm">
        {message}
      </p>
    </main>
  )
}
