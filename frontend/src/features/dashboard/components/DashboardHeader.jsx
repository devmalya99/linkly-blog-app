import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { useAuth } from '../../auth'
import { ROUTES } from '../../../utils/constants'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'IN'
}

export function DashboardHeader({ onLogout }) {
  const { user } = useAuth()
  const displayName = user?.name || 'Debmalya Mazumdar'
  const email = user?.email || 'debmalya@inkly.com'

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-border-subtle bg-surface-white">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <Link className="flex items-center gap-2.5" to={ROUTES.DASHBOARD}>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-text-primary text-on-primary">
            <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
              <path d="M2 2.5h6.5L11 5v6.5H2v-9Z" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8.5 2.5V5H11" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="font-title-md text-title-md font-semibold tracking-tight text-text-primary">
            Inkly
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l border-border-subtle pl-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/10 font-label-md text-label-md font-semibold text-primary-container">
              {user?.avatar ? (
                <img alt="" className="h-9 w-9 rounded-full object-cover" src={user.avatar} />
              ) : (
                getInitials(displayName)
              )}
            </span>
            <div className="hidden flex-col text-left md:flex">
              <span className="font-label-md text-label-md leading-tight font-medium text-text-primary">
                {displayName}
              </span>
              <span className="font-meta-sm text-meta-sm leading-tight text-text-muted">{email}</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-text-muted">keyboard_arrow_down</span>
          </div>

          <Button
            appearance="text"
            className="ml-2 text-text-muted hover:text-status-error"
            onClick={onLogout}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
