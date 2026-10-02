import { Button } from '../../../components/common/Button'
import { COMMENT_COPY } from '../constants/commentsContent'
import { formatCommentDate, getAuthorInitials } from '../utils/commentPermissions'

export function CommentItem({ comment, canDelete, onDelete }) {
  const authorName = comment.author?.name || 'Unknown'
  const initials = getAuthorInitials(authorName)

  async function handleDelete() {
    const confirmed = window.confirm(COMMENT_COPY.DELETE_CONFIRM)
    if (!confirmed) return
    await onDelete(comment.id)
  }

  return (
    <li className="border-b border-border-subtle py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container/10 font-label-md text-label-md text-primary-container"
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-label-md text-label-md text-text-primary">{authorName}</span>
            <time className="font-meta-sm text-meta-sm text-text-muted" dateTime={comment.createdAt}>
              {formatCommentDate(comment.createdAt)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap font-body-sm text-body-sm leading-relaxed text-text-primary">
            {comment.content}
          </p>
          {canDelete ? (
            <Button
              appearance="text"
              className="mt-2 text-status-error hover:text-status-error"
              onClick={handleDelete}
              type="button"
            >
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  )
}
