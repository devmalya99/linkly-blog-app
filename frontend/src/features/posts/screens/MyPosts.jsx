import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { Link } from '../../../components/common/Link'
import { ROUTES } from '../../../utils/constants'
import { DeletePostConfirmModal } from '../components/DeletePostConfirmModal'
import { MyPostsPagination } from '../components/MyPostsPagination'
import { MyPostsTable } from '../components/MyPostsTable'
import { MyPostsToolbar } from '../components/MyPostsToolbar'
import { useDeletePost } from '../hooks/useDeletePost'
import { useDeletePostConfirmation } from '../hooks/useDeletePostConfirmation'
import { useMyPostsView } from '../hooks/useMyPostsView'

export function MyPosts() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { deletePost } = useDeletePost()
  const { requestDelete, modalProps } = useDeletePostConfirmation(deletePost)
  const {
    posts,
    counts,
    search,
    status,
    sort,
    page,
    totalPages,
    from,
    to,
    total,
    isLoading,
    error,
    updateSearch,
    updateStatus,
    updateSort,
    updatePage,
  } = useMyPostsView()

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
          <div className="mx-auto max-w-6xl p-8 lg:p-12">
            <div className="flex w-full flex-col">
              <div className="flex flex-col justify-between gap-4 pb-8 md:flex-row md:items-end">
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-headline-md text-headline-md font-semibold tracking-tight text-text-primary">
                    My Posts
                  </h1>
                  <p className="font-body-md text-body-md text-text-muted">
                    Create, organize and manage everything you&apos;ve published on Inkly.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition-colors duration-150 hover:bg-surface-tint hover:no-underline"
                    to={ROUTES.CREATE_POST}
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      add
                    </span>
                    Create Post
                  </Link>
                </div>
              </div>

              <MyPostsToolbar
                counts={counts}
                onSearchChange={updateSearch}
                onSortChange={updateSort}
                onStatusChange={updateStatus}
                search={search}
                sort={sort}
                status={status}
              />

              <MyPostsTable
                error={error}
                isLoading={isLoading}
                onDelete={requestDelete}
                posts={posts}
              />

              <MyPostsPagination
                from={from}
                onPageChange={updatePage}
                page={page}
                to={to}
                total={total}
                totalPages={totalPages}
              />
            </div>
          </div>
        </main>
      </div>

      <DeletePostConfirmModal {...modalProps} />
    </div>
  )
}
