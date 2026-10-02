import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ROUTES } from '../../../utils/constants'
import { ADMIN_SIDEBAR_NAV, SIDEBAR_NAV } from '../constants/dashboardContent'

function isNavActive(pathname, to) {
  if (to === ROUTES.MY_POSTS) {
    return pathname.startsWith(ROUTES.MY_POSTS)
  }
  if (to === ROUTES.ADMIN_USERS) {
    return pathname.startsWith(ROUTES.ADMIN_USERS)
  }
  if (to === ROUTES.ADMIN_POSTS) {
    return pathname.startsWith(ROUTES.ADMIN_POSTS)
  }
  return pathname === to
}

export function DashboardSidebar({ onLogout }) {
  const { user } = useAuth()
  const location = useLocation()
  const displayName = user?.name || 'Debmalya Mazumdar'
  const isAdmin = user?.role === 'admin'
  const roleLabel = isAdmin ? 'Admin' : 'Author'

  return (
    <aside className="fixed top-16 bottom-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-border-subtle bg-surface-white md:flex">
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-1">
          <span className="px-3 py-1 font-label-tag text-label-tag font-semibold tracking-wider text-text-muted uppercase">
            Editorial Studio
          </span>
          <nav className="mt-2 flex flex-col gap-1.5">
            {SIDEBAR_NAV.map((item) => {
              const isActive = isNavActive(location.pathname, item.to)

              return (
                <Link
                  className={
                    isActive
                      ? 'flex items-center gap-3 rounded-lg bg-primary-container px-3.5 py-2.5 font-medium text-on-primary shadow-sm'
                      : 'flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-label-md text-label-md text-text-muted transition-colors hover:bg-surface-container-low hover:text-text-primary'
                  }
                  key={item.id}
                  to={item.to}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {isAdmin ? (
          <div className="flex flex-col gap-1">
            <span className="px-3 py-1 font-label-tag text-label-tag font-semibold tracking-wider text-text-muted uppercase">
              Administration
            </span>
            <nav className="mt-2 flex flex-col gap-1.5">
              {ADMIN_SIDEBAR_NAV.map((item) => {
                const isActive = isNavActive(location.pathname, item.to)

                return (
                  <Link
                    className={
                      isActive
                        ? 'flex items-center gap-3 rounded-lg bg-primary-container px-3.5 py-2.5 font-medium text-on-primary shadow-sm'
                        : 'flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-label-md text-label-md text-text-muted transition-colors hover:bg-surface-container-low hover:text-text-primary'
                    }
                    key={item.id}
                    to={item.to}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border-subtle bg-background-warm/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container font-label-md text-label-md font-semibold text-text-primary">
              {displayName
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-label-md text-label-md font-medium text-text-primary">
                {displayName}
              </span>
              <span className="truncate font-meta-sm text-meta-sm text-text-muted">{roleLabel}</span>
            </div>
          </div>
          <button
            aria-label="Logout"
            className="flex items-center justify-center rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-white hover:text-status-error"
            onClick={onLogout}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
