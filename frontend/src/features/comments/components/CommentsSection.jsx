import { useAuth } from '../../auth'
import { COMMENT_COPY } from '../constants/commentsContent'
import { useComments } from '../hooks/useComments'
import { canDeleteComment } from '../utils/commentPermissions'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'
import { CommentsPagination } from './CommentsPagination'
import { CommentsSignInPrompt } from './CommentsSignInPrompt'

export function CommentsSection({ post }) {
  const { user, isAuthenticated } = useAuth()
  const isPublished = post?.status === 'published'
  const enabled = Boolean(isAuthenticated && isPublished && post?.id)

  const {
    comments,
    pagination,
    page,
    setPage,
    isLoading,
    error,
    isSubmitting,
    submitError,
    addComment,
    removeComment,
  } = useComments(post?.id, { enabled })

  if (!isAuthenticated) {
    return (
      <section className="mt-14 border-t border-border-subtle pt-10" aria-labelledby="comments-heading">
        <h2 className="font-title-md text-title-md text-text-primary" id="comments-heading">
          {COMMENT_COPY.TITLE}
        </h2>
        <div className="mt-6">
          <CommentsSignInPrompt />
        </div>
      </section>
    )
  }

  if (!isPublished) {
    return (
      <section className="mt-14 border-t border-border-subtle pt-10" aria-labelledby="comments-heading">
        <h2 className="font-title-md text-title-md text-text-primary" id="comments-heading">
          {COMMENT_COPY.TITLE}
        </h2>
        <p className="mt-4 font-body-sm text-body-sm text-text-muted">{COMMENT_COPY.DRAFT_NOTE}</p>
      </section>
    )
  }

  async function handleDelete(commentId) {
    try {
      await removeComment(commentId)
    } catch (err) {
      window.alert(err.message || COMMENT_COPY.DELETE_ERROR)
    }
  }

  return (
    <section className="mt-14 border-t border-border-subtle pt-10" aria-labelledby="comments-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-title-md text-title-md text-text-primary" id="comments-heading">
          {COMMENT_COPY.TITLE}
        </h2>
        {pagination?.total != null ? (
          <span className="font-meta-sm text-meta-sm text-text-muted">{pagination.total} total</span>
        ) : null}
      </div>

      <div className="mt-6">
        <CommentForm error={submitError} isSubmitting={isSubmitting} onSubmit={addComment} />
      </div>

      <div className="mt-8">
        {isLoading ? <p className="font-body-sm text-body-sm text-text-muted">{COMMENT_COPY.LOADING}</p> : null}
        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 font-body-sm text-body-sm text-status-error" role="alert">
            {error}
          </p>
        ) : null}
        {!isLoading && !error && comments.length === 0 ? (
          <p className="font-body-sm text-body-sm text-text-muted">{COMMENT_COPY.EMPTY}</p>
        ) : null}
        {!isLoading && comments.length > 0 ? (
          <ul className="divide-y-0">
            {comments.map((comment) => (
              <CommentItem
                canDelete={canDeleteComment(user, comment, post)}
                comment={comment}
                key={comment.id}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        ) : null}
        <CommentsPagination
          onPageChange={setPage}
          page={page}
          total={pagination?.total ?? 0}
          totalPages={pagination?.totalPages ?? 1}
        />
      </div>
    </section>
  )
}
