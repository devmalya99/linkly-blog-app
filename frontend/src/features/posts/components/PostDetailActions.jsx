import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { editPostPath } from '../../../utils/constants'

export function PostDetailActions({
  isOwner,
  postId,
  copyState,
  onDelete,
  onShare,
  onCopyShareUrl,
}) {
  if (isOwner) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-container px-3.5 font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-surface-tint"
          to={editPostPath(postId)}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            edit
          </span>
          Edit
        </Link>
        <Button
          appearance="secondary"
          className="h-9 gap-1.5 px-3.5"
          leftIcon={
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              share
            </span>
          }
          onClick={onShare}
          type="button"
        >
          Share
        </Button>
        <Button
          appearance="ghost"
          className="h-9 px-3 text-status-error hover:bg-red-50 hover:text-status-error"
          leftIcon={
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              delete
            </span>
          }
          onClick={onDelete}
          type="button"
        >
          Delete
        </Button>
      </div>
    )
  }

  return (
    <Button
      appearance="secondary"
      className="h-9 gap-1.5 px-3.5"
      leftIcon={
        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
          {copyState === 'copied' ? 'check' : 'link'}
        </span>
      }
      onClick={onCopyShareUrl}
      type="button"
    >
      {copyState === 'copied' ? 'Copied' : 'Copy link'}
    </Button>
  )
}
