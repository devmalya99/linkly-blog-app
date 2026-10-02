import { useState } from 'react'
import { Button } from '../../../components/common/Button'
import { COMMENT_COPY, COMMENT_LIMITS } from '../constants/commentsContent'
import { formatCommentDate, getAuthorInitials } from '../utils/commentPermissions'

export function CommentItem({ comment, canDelete, canEdit, onDelete, onEdit }) {
  const authorName = comment.author?.name || 'Unknown'
  const initials = getAuthorInitials(authorName)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(comment.content)
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState('')

  const trimmed = draft.trim()
  const canSave =
    trimmed.length > 0 &&
    draft.length <= COMMENT_LIMITS.CONTENT_MAX &&
    trimmed !== comment.content &&
    !isSaving

  function startEditing() {
    setDraft(comment.content)
    setEditError('')
    setIsEditing(true)
  }

  function cancelEditing() {
    setDraft(comment.content)
    setEditError('')
    setIsEditing(false)
  }

  async function handleDelete() {
    const confirmed = window.confirm(COMMENT_COPY.DELETE_CONFIRM)
    if (!confirmed) return
    await onDelete(comment.id)
  }

  async function handleSave() {
    if (!canSave) return

    setIsSaving(true)
    setEditError('')

    try {
      await onEdit(comment.id, trimmed)
      setIsEditing(false)
    } catch (err) {
      setEditError(err.message || COMMENT_COPY.EDIT_ERROR)
    } finally {
      setIsSaving(false)
    }
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

          {isEditing ? (
            <div className="mt-2 space-y-3">
              <label className="sr-only" htmlFor={`comment-edit-${comment.id}`}>
                Edit comment
              </label>
              <textarea
                className="min-h-24 w-full resize-y rounded-lg border border-border-subtle bg-surface-white px-3 py-2 font-body-sm text-body-sm text-text-primary outline-none transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                id={`comment-edit-${comment.id}`}
                maxLength={COMMENT_LIMITS.CONTENT_MAX}
                onChange={(event) => setDraft(event.target.value)}
                value={draft}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button appearance="compact" disabled={!canSave} onClick={handleSave} type="button">
                  {isSaving ? COMMENT_COPY.SAVING : COMMENT_COPY.SAVE}
                </Button>
                <Button appearance="text" disabled={isSaving} onClick={cancelEditing} type="button">
                  {COMMENT_COPY.CANCEL}
                </Button>
              </div>
              {editError ? (
                <p className="font-body-sm text-body-sm text-status-error" role="alert">
                  {editError}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-wrap font-body-sm text-body-sm leading-relaxed text-text-primary">
              {comment.content}
            </p>
          )}

          {!isEditing && (canEdit || canDelete) ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {canEdit ? (
                <Button appearance="text" onClick={startEditing} type="button">
                  {COMMENT_COPY.EDIT}
                </Button>
              ) : null}
              {canDelete ? (
                <Button
                  appearance="text"
                  className="text-status-error hover:text-status-error"
                  onClick={handleDelete}
                  type="button"
                >
                  Delete
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}
