import { AdminUsersTableRow } from './AdminUsersTableRow'

export function AdminUsersTable({
  users,
  isLoading,
  error,
  currentUserId,
  onOpen,
  onChangeRole,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-10 shadow-sm">
        <p className="font-body-md text-body-md text-text-muted">Loading users…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-6 shadow-sm" role="alert">
        <p className="font-body-sm text-body-sm text-status-error">{error}</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-10 text-center shadow-sm">
        <p className="font-body-md text-body-md text-text-muted">No users match these filters.</p>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-xl bg-surface-white shadow-sm">
      <div className="hidden grid-cols-12 rounded-t-xl bg-surface-container-low px-6 py-3.5 font-label-tag text-label-tag tracking-wider text-text-muted uppercase md:grid">
        <div className="col-span-3">User</div>
        <div className="col-span-3">Email</div>
        <div className="col-span-1">Role</div>
        <div className="col-span-1">Posts</div>
        <div className="col-span-2">Joined</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="relative z-0 flex flex-col overflow-visible">
        {users.map((user) => (
          <AdminUsersTableRow
            currentUserId={currentUserId}
            key={user.id}
            onChangeRole={onChangeRole}
            onDelete={onDelete}
            onOpen={onOpen}
            user={user}
          />
        ))}
      </div>
    </div>
  )
}
