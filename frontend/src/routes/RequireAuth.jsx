import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { ROUTES } from '../utils/constants'

export function RequireAuth({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-warm font-body-md text-body-md text-text-muted">
        Loading…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to={ROUTES.LOGIN} />
  }

  return children
}
