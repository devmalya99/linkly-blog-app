import { Select, SelectItem } from '@ninna-ui/forms'
import { Button } from '../../../components/common/Button'
import {
  ADMIN_DELETED_FILTER,
  ADMIN_DELETED_FILTER_LABELS,
  ADMIN_STATUS_FILTER,
} from '../constants/admin.constants'

const STATUS_TABS = [
  { id: ADMIN_STATUS_FILTER.ALL, label: 'All' },
  { id: ADMIN_STATUS_FILTER.PUBLISHED, label: 'Published' },
  { id: ADMIN_STATUS_FILTER.DRAFT, label: 'Drafts' },
]

export function AdminPostsToolbar({
  status,
  onStatusChange,
  author,
  onAuthorChange,
  authors,
  deleted,
  onDeletedChange,
}) {
  return (
    <div className="mb-6 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
      <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-surface-container p-1">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.id

          return (
            <Button
              appearance={isActive ? 'segmentActive' : 'segment'}
              aria-pressed={isActive}
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              type="button"
            >
              {tab.label}
            </Button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-white px-3.5 py-1.5 shadow-sm">
          <span className="font-meta-sm text-meta-sm text-text-muted" id="admin-author-filter-label">
            Author:
          </span>
          <Select
            aria-labelledby="admin-author-filter-label"
            className="min-w-[10rem] border-0 bg-transparent p-0 shadow-none"
            onValueChange={onAuthorChange}
            size="sm"
            value={author || 'all'}
            variant="flushed"
          >
            <SelectItem value="all">All authors</SelectItem>
            {authors.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-white px-3.5 py-1.5 shadow-sm">
          <span className="font-meta-sm text-meta-sm text-text-muted" id="admin-deleted-filter-label">
            Visibility:
          </span>
          <Select
            aria-labelledby="admin-deleted-filter-label"
            className="min-w-[9rem] border-0 bg-transparent p-0 shadow-none"
            onValueChange={onDeletedChange}
            size="sm"
            value={deleted}
            variant="flushed"
          >
            {Object.values(ADMIN_DELETED_FILTER).map((option) => (
              <SelectItem key={option} value={option}>
                {ADMIN_DELETED_FILTER_LABELS[option]}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
