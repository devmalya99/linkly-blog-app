import { Input, InputAddon, Select, SelectItem } from '@ninna-ui/forms'
import {
  ADMIN_USER_ROLE_FILTER,
  ADMIN_USER_ROLE_FILTER_LABELS,
  ADMIN_USER_SORT,
  ADMIN_USER_SORT_LABELS,
} from '../constants/admin.constants'

export function AdminUsersToolbar({ search, onSearchChange, role, onRoleChange, sort, onSortChange }) {
  return (
    <div className="mb-6 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex max-w-md flex-1 items-center gap-3">
        <div className="flex w-full">
          <InputAddon
            className="rounded-l-lg border-0 bg-surface-white px-3 text-text-muted shadow-sm"
            placement="start"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </InputAddon>
          <Input
            aria-label="Search users"
            className="flex-1 rounded-l-none rounded-r-lg border-0 bg-surface-white py-2.5 font-body-sm text-body-sm text-text-primary shadow-sm placeholder:text-text-muted"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or email..."
            type="search"
            value={search}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-white px-3.5 py-1.5 shadow-sm">
          <span className="font-meta-sm text-meta-sm text-text-muted" id="admin-role-filter-label">
            Role:
          </span>
          <Select
            aria-labelledby="admin-role-filter-label"
            className="min-w-[8rem] border-0 bg-transparent p-0 shadow-none"
            onValueChange={onRoleChange}
            size="sm"
            value={role}
            variant="flushed"
          >
            {Object.values(ADMIN_USER_ROLE_FILTER).map((option) => (
              <SelectItem key={option} value={option}>
                {ADMIN_USER_ROLE_FILTER_LABELS[option]}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-white px-3.5 py-1.5 shadow-sm">
          <span className="font-meta-sm text-meta-sm text-text-muted" id="admin-user-sort-label">
            Sort:
          </span>
          <Select
            aria-labelledby="admin-user-sort-label"
            className="min-w-[10rem] border-0 bg-transparent p-0 shadow-none"
            onValueChange={onSortChange}
            size="sm"
            value={sort || ADMIN_USER_SORT.JOINED_NEWEST}
            variant="flushed"
          >
            {Object.values(ADMIN_USER_SORT).map((option) => (
              <SelectItem key={option} value={option}>
                {ADMIN_USER_SORT_LABELS[option]}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
