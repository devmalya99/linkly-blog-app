import { Navigate } from 'react-router-dom'
import { ADMIN_ROLE } from '../features/admin'
import { useAuth } from '../features/auth'
import { ROUTES } from '../utils/constants'

export function RequireAdmin({ children }) {
  const { user, isAuthenticated, isBootstrapping } = useAuth()

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

  if (user?.role !== ADMIN_ROLE) {
    return <Navigate replace to={ROUTES.DASHBOARD} />
  }

  return children
}
