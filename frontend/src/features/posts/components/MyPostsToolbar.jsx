import { Input, InputAddon, Select, SelectItem } from '@ninna-ui/forms'
import { Button } from '../../../components/common/Button'
import { MY_POSTS_SORT, MY_POSTS_SORT_LABELS, MY_POSTS_STATUS_FILTER } from '../constants/myPostsContent'

const FILTER_TABS = [
  { id: MY_POSTS_STATUS_FILTER.ALL, label: 'All', countKey: 'all' },
  { id: MY_POSTS_STATUS_FILTER.PUBLISHED, label: 'Published', countKey: 'published' },
  { id: MY_POSTS_STATUS_FILTER.DRAFT, label: 'Drafts', countKey: 'draft' },
]

export function MyPostsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
  sort,
  onSortChange,
}) {
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
            aria-label="Search your posts"
            className="flex-1 rounded-l-none rounded-r-lg border-0 bg-surface-white py-2.5 font-body-sm text-body-sm text-text-primary shadow-sm placeholder:text-text-muted"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your posts by title or keyword..."
            type="search"
            value={search}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
        <div className="inline-flex items-center gap-1 rounded-lg bg-surface-container p-1">
          {FILTER_TABS.map((tab) => {
            const isActive = status === tab.id
            const count = counts[tab.countKey] ?? 0

            return (
              <Button
                appearance={isActive ? 'segmentActive' : 'segment'}
                aria-pressed={isActive}
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                type="button"
              >
                {tab.label} ({count})
              </Button>
            )
          })}
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-surface-white px-3.5 py-1.5 shadow-sm">
          <span className="font-meta-sm text-meta-sm text-text-muted" id="my-posts-sort-label">
            Sort by:
          </span>
          <Select
            aria-labelledby="my-posts-sort-label"
            className="min-w-[8.5rem] border-0 bg-transparent p-0 shadow-none"
            onValueChange={onSortChange}
            size="sm"
            value={sort}
            variant="flushed"
          >
            {Object.values(MY_POSTS_SORT).map((option) => (
              <SelectItem key={option} value={option}>
                {MY_POSTS_SORT_LABELS[option]}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
