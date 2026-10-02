import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { DeletePostConfirmModal, useDeletePostConfirmation } from '../../posts'
import { ROUTES } from '../../../utils/constants'
import { AdminPostsPagination } from '../components/AdminPostsPagination'
import { AdminPostsTable } from '../components/AdminPostsTable'
import { AdminPostsToolbar } from '../components/AdminPostsToolbar'
import { useAdminPostsView } from '../hooks/useAdminPostsView'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { useDeleteAdminPost } from '../hooks/useDeleteAdminPost'

export function AdminPosts() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { deletePost } = useDeleteAdminPost()
  const { requestDelete, modalProps } = useDeletePostConfirmation(deletePost)
  const { users } = useAdminUsers({ page: 1, limit: 50 })
  const {
    posts,
    status,
    author,
    deleted,
    page,
    totalPages,
    from,
    to,
    total,
    isLoading,
    error,
    updateStatus,
    updateAuthor,
    updateDeleted,
    updatePage,
  } = useAdminPostsView()

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function handleAuthorChange(value) {
    updateAuthor(value === 'all' ? '' : value)
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
                    All Posts
                  </h1>
                  <p className="font-body-md text-body-md text-text-muted">
                    Review and moderate every article on the platform.
                  </p>
                </div>
              </div>

              <AdminPostsToolbar
                author={author}
                authors={users}
                deleted={deleted}
                onAuthorChange={handleAuthorChange}
                onDeletedChange={updateDeleted}
                onStatusChange={updateStatus}
                status={status}
              />

              <AdminPostsTable
                error={error}
                isLoading={isLoading}
                onDelete={requestDelete}
                posts={posts}
              />

              <AdminPostsPagination
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
