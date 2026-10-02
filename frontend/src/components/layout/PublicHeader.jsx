import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'
import { useAuth } from '../../features/auth'
import { ROUTES } from '../../utils/constants'

const NAV = [
  { label: 'Discover', to: ROUTES.FEED },
  { label: 'Posts', to: ROUTES.PUBLIC_POSTS },
]

export function PublicHeader() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, isBootstrapping } = useAuth()

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-6 px-6">
        <Link className="flex items-center gap-2.5" to={ROUTES.HOME}>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-text-primary text-on-primary">
            <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
              <path d="M2 2.5h6.5L11 5v6.5H2v-9Z" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8.5 2.5V5H11" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-text-primary">Inkly</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) =>
            item.to ? (
              <Link
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
                key={item.label}
                to={item.to}
              >
                {item.label}
              </Link>
            ) : (
              <a
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {isBootstrapping ? null : isAuthenticated ? (
            <>
              <span className="hidden max-w-[140px] truncate text-sm text-text-muted sm:inline">
                {user?.name}
              </span>
              <Button appearance="secondary" className="h-9 px-3" onClick={() => navigate(ROUTES.DASHBOARD)}>
                Dashboard
              </Button>
              <Button appearance="secondary" className="h-9 px-3" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link className="hidden text-sm text-text-muted hover:text-text-primary sm:inline" to={ROUTES.LOGIN}>
                Log in
              </Link>
              <Button appearance="compact" onClick={() => navigate(ROUTES.REGISTER)}>
                Start Writing
              </Button>
            </>
          )}
          {isAuthenticated && user?.avatar ? (
            <Button appearance="profile" aria-label="Account">
              <img alt="" className="h-8 w-8 rounded-full object-cover" src={user.avatar} />
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
