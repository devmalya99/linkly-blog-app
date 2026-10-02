import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { ROUTES } from '../../../utils/constants'
import { DashboardHeader } from '../components/DashboardHeader'
import { DashboardSidebar } from '../components/DashboardSidebar'
import { DashboardStats } from '../components/DashboardStats'
import {
  RecentCommentsPanel,
  RecentPostsPanel,
  WeeklyReadershipPanel,
} from '../components/DashboardPanels'

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const firstName = (user?.name || 'Debmalya').split(' ')[0]
  const [greeting] = useState(() => greetingForHour(new Date().getHours()))

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
                    Editorial Overview
                  </span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-success" />
                </div>
                <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-text-primary">
                  {greeting}, {firstName}.
                </h1>
                <p className="font-body-md text-body-md text-text-muted">
                  Here&apos;s what&apos;s happening with your blog today.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-white px-4 py-2.5 font-label-md text-label-md text-text-primary transition-colors hover:bg-surface-container-low"
                  onClick={() => navigate(ROUTES.MY_POSTS)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-text-muted">library_books</span>
                  All Posts
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-surface-tint"
                  onClick={() => navigate(ROUTES.CREATE_POST)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Create Post
                </button>
              </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
              <div className="flex flex-col gap-6 xl:col-span-3">
                <RecentPostsPanel />
                <WeeklyReadershipPanel />
              </div>
              <div className="flex flex-col gap-6 xl:col-span-2">
                <RecentCommentsPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
