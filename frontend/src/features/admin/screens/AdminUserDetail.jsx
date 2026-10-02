import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { DeletePostConfirmModal, useDeletePostConfirmation } from '../../posts'
import { ROUTES } from '../../../utils/constants'
import { AdminPostsPagination } from '../components/AdminPostsPagination'
import { AdminPostsTable } from '../components/AdminPostsTable'
import { AdminUserDetailHeader } from '../components/AdminUserDetailHeader'
import { AdminUserPostsTabs } from '../components/AdminUserPostsTabs'
import { ADMIN_ROLE } from '../constants/admin.constants'
import { useAdminUser } from '../hooks/useAdminUser'
import { useAdminUserPostsView } from '../hooks/useAdminUserPostsView'
import { useDeleteAdminPost } from '../hooks/useDeleteAdminPost'
import { useDeleteAdminUser } from '../hooks/useDeleteAdminUser'
import { useUpdateAdminUser } from '../hooks/useUpdateAdminUser'

export function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser, logout } = useAuth()
  const { user, isLoading, error } = useAdminUser(id)
  const { updateUser, isUpdating } = useUpdateAdminUser()
  const { deleteUser, isDeleting } = useDeleteAdminUser()
  const { deletePost } = useDeleteAdminPost()
  const { requestDelete, modalProps } = useDeletePostConfirmation(deletePost)
  const {
    posts,
    tab,
    page,
    totalPages,
    from,
    to,
    total,
    isLoading: postsLoading,
    error: postsError,
    updateTab,
    updatePage,
  } = useAdminUserPostsView(id)

  const isSelf = Boolean(currentUser?.id && id && String(currentUser.id) === String(id))

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  async function handleChangeRole(nextRole) {
    if (!user) return
    const label = nextRole === ADMIN_ROLE ? 'admin' : 'user'
    const confirmed = window.confirm(`Change ${user.name}'s role to ${label}?`)
    if (!confirmed) return

    try {
      await updateUser({ id: user.id, body: { role: nextRole } })
    } catch (err) {
      window.alert(err.message || 'Unable to update role.')
    }
  }

  async function handleDeleteAccount() {
    if (!user) return
    const confirmed = window.confirm(
      `Delete ${user.name}'s account? Their posts will be soft-deleted. This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await deleteUser(user.id)
      navigate(ROUTES.ADMIN_USERS, { replace: true })
    } catch (err) {
      window.alert(err.message || 'Unable to delete user.')
    }
  }

  return (
    <div className="min-h-screen bg-background-warm font-body-md text-body-md text-text-primary antialiased">
      <DashboardHeader onLogout={handleLogout} />
      <DashboardSidebar onLogout={handleLogout} />

      <div className="pl-0 md:pl-64">
        <main className="min-h-screen bg-background-warm pt-16">
          <div className="mx-auto max-w-6xl p-8 lg:p-12">
            <div className="mb-6">
              <Link
                className="inline-flex items-center gap-1 font-label-md text-label-md text-text-muted transition-colors hover:text-text-primary"
                to={ROUTES.ADMIN_USERS}
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to users
              </Link>
            </div>

            {isLoading ? (
              <div className="rounded-xl bg-surface-white px-6 py-10 shadow-sm">
                <p className="font-body-md text-body-md text-text-muted">Loading user…</p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl bg-surface-white px-6 py-6 shadow-sm" role="alert">
                <p className="font-body-sm text-body-sm text-status-error">{error}</p>
              </div>
            ) : null}

            {user ? (
              <>
                <AdminUserDetailHeader
                  isDeleting={isDeleting}
                  isSelf={isSelf}
                  isUpdating={isUpdating}
                  onChangeRole={handleChangeRole}
                  onDelete={handleDeleteAccount}
                  user={user}
                />

                <div className="flex flex-col gap-1.5 pb-6">
                  <h2 className="font-title-md text-title-md font-semibold text-text-primary">Posts</h2>
                  <p className="font-body-sm text-body-sm text-text-muted">
                    Review and moderate this author’s content.
                  </p>
                </div>

                <AdminUserPostsTabs onTabChange={updateTab} tab={tab} />

                <AdminPostsTable
                  error={postsError}
                  isLoading={postsLoading}
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
              </>
            ) : null}
          </div>
        </main>
      </div>

      <DeletePostConfirmModal {...modalProps} />
    </div>
  )
}
