import { DropdownMenu } from '@ninna-ui/overlays'
import { IconButton } from '@ninna-ui/primitives'
import { Link } from '../../../components/common/Link'
import { postDetailPath } from '../../../utils/constants'
import { adminStatusBadgeClass, adminStatusLabel, formatAdminDate } from '../utils/adminFormat'

export function AdminPostsTableRow({ post, onDelete }) {
  const badge = adminStatusBadgeClass(post.status, post.isDeleted)
  const detailPath = postDetailPath(post)
  const canDelete = !post.isDeleted

  return (
    <div className="relative z-0 grid grid-cols-1 items-center gap-3 px-6 py-4 transition-colors hover:bg-surface-container-low/50 md:grid-cols-12 md:gap-0">
      <div className="col-span-5 flex flex-col gap-1 pr-4 lg:col-span-4">
        {post.isDeleted ? (
          <span className="line-clamp-1 font-title-md text-title-md text-text-muted">{post.title}</span>
        ) : (
          <Link
            className="line-clamp-1 font-title-md text-title-md text-text-primary transition-colors hover:text-primary-container"
            to={detailPath}
          >
            {post.title}
          </Link>
        )}
        <p className="line-clamp-1 font-body-sm text-body-sm text-text-muted">
          {post.excerpt || 'No excerpt yet.'}
        </p>
      </div>

      <div className="col-span-2 flex items-center">
        <span className="truncate font-meta-sm text-meta-sm text-text-muted">
          {post.author?.name || 'Unknown'}
        </span>
      </div>

      <div className="col-span-2 flex items-center">
        <span className="inline-flex items-center rounded-md bg-surface-container-high px-2.5 py-0.5 font-label-tag text-label-tag font-semibold tracking-wider text-text-primary uppercase">
          {post.category}
        </span>
      </div>

      <div className="col-span-2 flex items-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-tag text-label-tag font-medium ${badge.wrap}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {adminStatusLabel(post.status, post.isDeleted)}
        </span>
      </div>

      <div className="col-span-1 flex items-center justify-between gap-2 md:justify-end">
        <span className="font-meta-sm text-meta-sm text-text-muted md:hidden">
          {formatAdminDate(post.createdAt)}
        </span>
        {canDelete ? (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton
                aria-label="More actions"
                className="text-text-muted hover:bg-surface-container hover:text-text-primary before:hidden"
                color="neutral"
                icon={<span className="material-symbols-outlined text-[18px]">more_horiz</span>}
                radius="md"
                size="sm"
                variant="ghost"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="z-50 min-w-[140px] border-border-subtle bg-surface-white">
              <DropdownMenu.Item
                className="font-label-md text-label-md"
                destructive
                onSelect={() => onDelete(post)}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        ) : (
          <span className="font-meta-sm text-meta-sm text-text-muted">—</span>
        )}
      </div>
    </div>
  )
}
