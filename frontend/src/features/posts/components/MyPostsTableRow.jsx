import { useNavigate } from 'react-router-dom'
import { DropdownMenu } from '@ninna-ui/overlays'
import { IconButton } from '@ninna-ui/primitives'
import { Link } from '../../../components/common/Link'
import { editPostPath, postDetailPath } from '../../../utils/constants'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { formatPostDate, statusLabel } from '../utils/postFormat'
import { buildShareUrl } from '../utils/postShare'
import { categoryPillClass, statusBadgeClass } from '../utils/myPostsView'
import { CoverImage } from './CoverImage'

export function MyPostsTableRow({ post, onDelete }) {
  const navigate = useNavigate()
  const { copy } = useCopyToClipboard()
  const badge = statusBadgeClass(post.status)
  const detailPath = postDetailPath(post)

  async function handleCopyShare() {
    try {
      await copy(buildShareUrl(post.id))
    } catch {
      window.alert('Unable to copy the share link.')
    }
  }

  return (
    <div className="relative z-0 grid grid-cols-1 items-center gap-3 px-6 py-4 transition-colors hover:bg-surface-container-low/50 md:grid-cols-12 md:gap-0">
      <div className="col-span-6 flex items-center gap-3 pr-4 lg:col-span-5">
        <CoverImage alt="" rounded="rounded-md" size="thumb" src={post.coverImage} />
        <div className="min-w-0 flex flex-col gap-1">
          <Link
            className="line-clamp-1 font-title-md text-title-md text-text-primary transition-colors hover:text-primary-container"
            to={detailPath}
          >
            {post.title}
          </Link>
          <p className="line-clamp-1 font-body-sm text-body-sm text-text-muted">
            {post.excerpt || 'No excerpt yet.'}
          </p>
        </div>
      </div>

      <div className="col-span-2 flex items-center">
        <span
          className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-label-tag text-label-tag font-semibold tracking-wider uppercase ${categoryPillClass(post.category)}`}
        >
          {post.category}
        </span>
      </div>

      <div className="col-span-2 flex items-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-tag text-label-tag font-medium ${badge.wrap}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {statusLabel(post.status)}
        </span>
      </div>

      <div className="col-span-1 font-meta-sm text-meta-sm text-text-muted lg:col-span-2">
        {formatPostDate(post.updatedAt || post.publishedAt || post.createdAt)}
      </div>

      <div className="col-span-1 flex items-center justify-end gap-2">
        <Link
          className="rounded-md px-2.5 py-1 font-label-md text-label-md text-text-primary transition-colors hover:bg-surface-container"
          to={editPostPath(post.id)}
        >
          Edit
        </Link>

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
              className="font-label-md text-label-md text-text-primary"
              onSelect={() => navigate(detailPath)}
            >
              View
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="font-label-md text-label-md text-text-primary"
              onSelect={handleCopyShare}
            >
              Copy share link
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="font-label-md text-label-md"
              destructive
              onSelect={() => onDelete(post)}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  )
}
