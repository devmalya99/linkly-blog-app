import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { ROUTES } from '../../../utils/constants'
import { AdminDistribution } from '../components/AdminDistribution'
import { AdminRecentPosts } from '../components/AdminRecentPosts'
import { AdminStats } from '../components/AdminStats'
import { useAdminDashboard } from '../hooks/useAdminDashboard'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { dashboard, isLoading, error } = useAdminDashboard()

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background-warm font-body-md text-body-md text-text-primary antialiased">
      <DashboardHeader onLogout={handleLogout} />
      <DashboardSidebar onLogout={handleLogout} />

      <div className="pl-0 md:pl-64">
        <main className="min-h-screen bg-background-warm pt-16">
          <div className="mx-auto max-w-6xl p-6 lg:p-12">
            <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-label-tag text-label-tag font-semibold tracking-wider text-primary-container uppercase">
                    Platform Overview
                  </span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-success" />
                </div>
                <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-text-primary">
                  Admin Dashboard
                </h1>
                <p className="font-body-md text-body-md text-text-muted">
                  Monitor users, content health, and the latest posts across Inkly.
                </p>
              </div>

              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-white px-4 py-2.5 font-label-md text-label-md text-text-primary transition-colors hover:bg-surface-container-low"
                onClick={() => navigate(ROUTES.ADMIN_POSTS)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-text-muted">library_books</span>
                All Posts
              </button>
            </div>

            {isLoading ? (
              <p className="font-body-md text-body-md text-text-muted">Loading admin metrics…</p>
            ) : null}

            {error ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 font-body-sm text-body-sm text-status-error" role="alert">
                {error}
              </p>
            ) : null}

            {!isLoading && !error && dashboard ? (
              <>
                <AdminStats counts={dashboard.counts} contentRatio={dashboard.contentRatio} />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                  <div className="flex flex-col gap-6 xl:col-span-3">
                    <AdminRecentPosts posts={dashboard.recentPosts} />
                  </div>
                  <div className="flex flex-col gap-6 xl:col-span-2">
                    <AdminDistribution distribution={dashboard.distribution} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
