import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { ROUTES, adminUserPath } from '../../../utils/constants'
import { AdminPostsPagination } from '../components/AdminPostsPagination'
import { AdminUsersTable } from '../components/AdminUsersTable'
import { AdminUsersToolbar } from '../components/AdminUsersToolbar'
import { ADMIN_ROLE } from '../constants/admin.constants'
import { useAdminUsersView } from '../hooks/useAdminUsersView'
import { useDeleteAdminUser } from '../hooks/useDeleteAdminUser'
import { useUpdateAdminUser } from '../hooks/useUpdateAdminUser'

export function AdminUsers() {
  const navigate = useNavigate()
  const { user: currentUser, logout } = useAuth()
  const { updateUser } = useUpdateAdminUser()
  const { deleteUser } = useDeleteAdminUser()
  const {
    users,
    search,
    role,
    sort,
    page,
    totalPages,
    from,
    to,
    total,
    isLoading,
    error,
    updateSearch,
    updateRole,
    updateSort,
    updatePage,
  } = useAdminUsersView()

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function handleOpen(user) {
    navigate(adminUserPath(user.id))
  }

  async function handleChangeRole(user, nextRole) {
    const label = nextRole === ADMIN_ROLE ? 'admin' : 'user'
    const confirmed = window.confirm(`Change ${user.name}'s role to ${label}?`)
    if (!confirmed) return

    try {
      await updateUser({ id: user.id, body: { role: nextRole } })
    } catch (err) {
      window.alert(err.message || 'Unable to update role.')
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Delete ${user.name}'s account? Their posts will be soft-deleted. This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await deleteUser(user.id)
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
            <div className="flex w-full flex-col">
              <div className="flex flex-col justify-between gap-4 pb-8 md:flex-row md:items-end">
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-headline-md text-headline-md font-semibold tracking-tight text-text-primary">
                    Manage Users
                  </h1>
                  <p className="font-body-md text-body-md text-text-muted">
                    Search, filter, and manage roles for everyone on the platform.
                  </p>
                </div>
              </div>

              <AdminUsersToolbar
                onRoleChange={updateRole}
                onSearchChange={updateSearch}
                onSortChange={updateSort}
                role={role}
                search={search}
                sort={sort}
              />

              <AdminUsersTable
                currentUserId={currentUser?.id}
                error={error}
                isLoading={isLoading}
                onChangeRole={handleChangeRole}
                onDelete={handleDelete}
                onOpen={handleOpen}
                users={users}
              />

              <AdminPostsPagination
                from={from}
                itemLabel="users"
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
    </div>
  )
}
