import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { ROUTES } from '../../../utils/constants'
import { AuthorsToFollow } from '../components/AuthorsToFollow'
import { FeedPagination } from '../components/FeedPagination'
import { FeedPostList } from '../components/FeedPostList'
import { FeedTabs } from '../components/FeedTabs'
import { FEED_COPY, FEED_PAGE_SIZE } from '../constants/feedContent'
import { useAuthorSuggestionsView } from '../hooks/useAuthorSuggestions'
import { useFeed } from '../hooks/useFeed'
import {
  buildFeedSearchParams,
  emptyMessageForTab,
  parseFeedSearchParams,
} from '../utils/feedView'

export function Feed() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tab, category, page } = useMemo(
    () => parseFeedSearchParams(searchParams),
    [searchParams],
  )

  const { posts, pagination, isLoading, error } = useFeed({ tab, category, page })
  const suggestions = useAuthorSuggestionsView(3)

  const total = pagination?.total ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const from = total === 0 ? 0 : (page - 1) * FEED_PAGE_SIZE + 1
  const to = Math.min(page * FEED_PAGE_SIZE, total)

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function updateParams(next) {
    setSearchParams(buildFeedSearchParams(next), { replace: false })
  }

  function handleSelectTab(item) {
    updateParams({
      tab: item.tab,
      category: item.category || '',
      page: 1,
    })
  }

  function handlePageChange(nextPage) {
    updateParams({ tab, category, page: nextPage })
  }

  async function handleFollow(userId) {
    try {
      await suggestions.follow(userId)
    } catch {
      // error surfaced via suggestions.error
    }
  }

  async function handleUnfollow(userId) {
    try {
      await suggestions.unfollow(userId)
    } catch {
      // error surfaced via suggestions.error
    }
  }

  return (
    <div className="min-h-screen bg-background-warm font-body-md text-body-md text-text-primary antialiased">
      <DashboardHeader onLogout={handleLogout} />
      <DashboardSidebar onLogout={handleLogout} />

      <div className="pl-0 md:pl-64">
        <main className="min-h-screen bg-background-warm pt-16">
          <div className="mx-auto max-w-6xl p-8 lg:p-12">
            <div className="mb-8">
              <p className="font-label-tag text-label-tag font-semibold tracking-wider text-primary-container uppercase">
                Feed
              </p>
              <h1 className="mt-1 font-headline-md text-headline-md font-bold tracking-tight text-text-primary">
                {FEED_COPY.title}
              </h1>
              <p className="mt-2 font-body-md text-body-md text-text-muted">{FEED_COPY.subtitle}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <section className="min-w-0">
                <FeedTabs activeCategory={category} activeTab={tab} onSelectTab={handleSelectTab} />

                <div className="mt-6">
                  {isLoading ? <p className="text-text-muted">{FEED_COPY.loading}</p> : null}
                  {error ? (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-status-error" role="alert">
                      {error}
                    </p>
                  ) : null}

                  {!isLoading && !error && posts.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border-subtle bg-surface-white px-4 py-8 text-center text-sm text-text-muted">
                      {emptyMessageForTab(tab, FEED_COPY)}
                    </p>
                  ) : null}

                  {!isLoading && !error && posts.length > 0 ? <FeedPostList posts={posts} /> : null}

                  {!isLoading && !error ? (
                    <FeedPagination
                      from={from}
                      onPageChange={handlePageChange}
                      page={page}
                      to={to}
                      total={total}
                      totalPages={totalPages}
                    />
                  ) : null}
                </div>
              </section>

              <div className="lg:sticky lg:top-24 lg:self-start">
                <AuthorsToFollow
                  authors={suggestions.authors}
                  error={suggestions.error}
                  followedIds={suggestions.followedIds}
                  isLoading={suggestions.isLoading}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  pendingUserId={suggestions.pendingUserId}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
