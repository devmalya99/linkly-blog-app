import { Button } from '../../../components/common/Button'
import { ADMIN_ROLE, USER_ROLE } from '../constants/admin.constants'
import { adminRoleBadgeClass, adminRoleLabel, formatAdminDate } from '../utils/adminFormat'

function UserAvatar({ user }) {
  if (user.avatar) {
    return <img alt="" className="h-14 w-14 rounded-full object-cover" src={user.avatar} />
  }

  const initial = (user.name || '?').charAt(0).toUpperCase()
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high font-headline-md text-headline-md text-text-primary">
      {initial}
    </span>
  )
}

export function AdminUserDetailHeader({
  user,
  isSelf,
  onChangeRole,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  const nextRole = user.role === ADMIN_ROLE ? USER_ROLE : ADMIN_ROLE
  const roleActionLabel = nextRole === ADMIN_ROLE ? 'Make admin' : 'Make user'

  return (
    <div className="mb-8 flex flex-col justify-between gap-6 rounded-xl bg-surface-white p-6 shadow-sm md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} />
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-headline-md text-headline-md font-semibold tracking-tight text-text-primary">
              {user.name}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 font-label-tag text-label-tag font-medium ${adminRoleBadgeClass(user.role)}`}
            >
              {adminRoleLabel(user.role)}
            </span>
          </div>
          <p className="font-body-md text-body-md text-text-muted">{user.email}</p>
          <p className="font-meta-sm text-meta-sm text-text-muted">
            Joined {formatAdminDate(user.createdAt)} · {user.postCount ?? 0} posts
          </p>
        </div>
      </div>

      {!isSelf ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            appearance="secondary"
            disabled={isUpdating || isDeleting}
            onClick={() => onChangeRole(nextRole)}
            type="button"
          >
            {roleActionLabel}
          </Button>
          <Button
            appearance="ghost"
            className="h-11 px-4 text-status-error hover:bg-red-50 hover:text-status-error"
            disabled={isUpdating || isDeleting}
            onClick={onDelete}
            type="button"
          >
            Delete account
          </Button>
        </div>
      ) : (
        <p className="font-meta-sm text-meta-sm text-text-muted">This is your account.</p>
      )}
    </div>
  )
}
