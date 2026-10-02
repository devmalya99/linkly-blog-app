import { useState } from 'react'
import { Button } from '../../../components/common/Button'
import { COMMENT_COPY, COMMENT_LIMITS } from '../constants/commentsContent'

export function CommentForm({ onSubmit, isSubmitting, error }) {
  const [content, setContent] = useState('')
  const remaining = COMMENT_LIMITS.CONTENT_MAX - content.length
  const trimmed = content.trim()
  const canSubmit = trimmed.length > 0 && content.length <= COMMENT_LIMITS.CONTENT_MAX && !isSubmitting

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return

    try {
      await onSubmit(trimmed)
      setContent('')
    } catch {
      // Parent surfaces submitError
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="comment-content">
        Comment
      </label>
      <textarea
        className="min-h-28 w-full resize-y rounded-lg border border-border-subtle bg-surface-white px-4 py-3 font-body-sm text-body-sm text-text-primary outline-none transition-shadow placeholder:text-text-muted focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
        id="comment-content"
        maxLength={COMMENT_LIMITS.CONTENT_MAX}
        onChange={(event) => setContent(event.target.value)}
        placeholder={COMMENT_COPY.PLACEHOLDER}
        value={content}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`font-meta-sm text-meta-sm ${remaining < 100 ? 'text-status-error' : 'text-text-muted'}`}
        >
          {content.length}/{COMMENT_LIMITS.CONTENT_MAX}
        </span>
        <Button appearance="compact" disabled={!canSubmit} type="submit">
          {isSubmitting ? COMMENT_COPY.SUBMITTING : COMMENT_COPY.SUBMIT}
        </Button>
      </div>
      {error ? (
        <p className="font-body-sm text-body-sm text-status-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
