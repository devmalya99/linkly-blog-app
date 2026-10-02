import { DropdownMenu } from '@ninna-ui/overlays'
import { IconButton } from '@ninna-ui/primitives'
import { ADMIN_ROLE, USER_ROLE } from '../constants/admin.constants'
import { adminRoleBadgeClass, adminRoleLabel, formatAdminDate } from '../utils/adminFormat'

function UserAvatar({ user }) {
  if (user.avatar) {
    return (
      <img
        alt=""
        className="h-9 w-9 rounded-full object-cover"
        src={user.avatar}
      />
    )
  }

  const initial = (user.name || '?').charAt(0).toUpperCase()
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high font-label-md text-label-md text-text-primary">
      {initial}
    </span>
  )
}

export function AdminUsersTableRow({ user, currentUserId, onOpen, onChangeRole, onDelete }) {
  const isSelf = String(user.id) === String(currentUserId)
  const nextRole = user.role === ADMIN_ROLE ? USER_ROLE : ADMIN_ROLE
  const roleActionLabel = nextRole === ADMIN_ROLE ? 'Make admin' : 'Make user'

  return (
    <div
      className="relative z-0 grid cursor-pointer grid-cols-1 items-center gap-3 px-6 py-4 transition-colors hover:bg-surface-container-low/50 md:grid-cols-12 md:gap-0"
      onClick={() => onOpen(user)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(user)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="col-span-3 flex items-center gap-3 pr-4">
        <UserAvatar user={user} />
        <span className="line-clamp-1 font-title-md text-title-md text-text-primary">{user.name}</span>
      </div>

      <div className="col-span-3 flex items-center">
        <span className="truncate font-meta-sm text-meta-sm text-text-muted">{user.email}</span>
      </div>

      <div className="col-span-1 flex items-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-label-tag text-label-tag font-medium ${adminRoleBadgeClass(user.role)}`}
        >
          {adminRoleLabel(user.role)}
        </span>
      </div>

      <div className="col-span-1 flex items-center">
        <span className="font-meta-sm text-meta-sm text-text-muted">{user.postCount ?? 0}</span>
      </div>

      <div className="col-span-2 flex items-center">
        <span className="font-meta-sm text-meta-sm text-text-muted">{formatAdminDate(user.createdAt)}</span>
      </div>

      <div
        className="col-span-2 flex items-center justify-end"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {isSelf ? (
          <span className="font-meta-sm text-meta-sm text-text-muted">You</span>
        ) : (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton
                aria-label={`Actions for ${user.name}`}
                className="text-text-muted hover:bg-surface-container hover:text-text-primary before:hidden"
                color="neutral"
                icon={<span className="material-symbols-outlined text-[18px]">more_horiz</span>}
                radius="md"
                size="sm"
                variant="ghost"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="z-50 min-w-[160px] border-border-subtle bg-surface-white">
              <DropdownMenu.Item
                className="font-label-md text-label-md"
                onSelect={() => onChangeRole(user, nextRole)}
              >
                {roleActionLabel}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="font-label-md text-label-md"
                destructive
                onSelect={() => onDelete(user)}
              >
                Delete account
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
