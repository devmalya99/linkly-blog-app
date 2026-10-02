import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PublicFooter } from '../../../components/layout/PublicFooter'
import { PublicHeader } from '../../../components/layout/PublicHeader'
import { CommentsSection } from '../../comments'
import { useAuth } from '../../auth'
import { ROUTES } from '../../../utils/constants'
import { DeletePostConfirmModal } from '../components/DeletePostConfirmModal'
import { PostDetailActions } from '../components/PostDetailActions'
import { PostReadingArticle } from '../components/PostReadingArticle'
import { RecommendedPosts } from '../components/RecommendedPosts'
import { SharePostLink } from '../components/SharePostLink'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { useDeletePost } from '../hooks/useDeletePost'
import { useDeletePostConfirmation } from '../hooks/useDeletePostConfirmation'
import { usePost } from '../hooks/usePost'
import { buildShareUrl } from '../utils/postShare'

export function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { post, isLoading, error } = usePost(id)
  const { deletePost } = useDeletePost()
  const { requestDelete, modalProps } = useDeletePostConfirmation(deletePost, {
    onSuccess: () => navigate(ROUTES.MY_POSTS, { replace: true }),
  })
  const { copyState, copy } = useCopyToClipboard()
  const [shareOpen, setShareOpen] = useState(false)

  const isOwner =
    isAuthenticated &&
    post?.author &&
    typeof post.author === 'object' &&
    String(post.author.id) === String(user?.id)

  async function handleCopyShareUrl() {
    if (!post?.id) return
    try {
      await copy(buildShareUrl(post.id))
    } catch {
      window.alert('Unable to copy the link.')
    }
  }

  return (
    <div className="relative min-h-screen bg-background-warm text-text-primary antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(91,91,214,0.07),_transparent_55%)]"
      />
      <PublicHeader />
      <main className="relative mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Link
          className="mb-8 inline-flex items-center gap-1 font-label-md text-label-md text-text-muted transition-colors hover:text-text-primary"
          to={isOwner ? ROUTES.MY_POSTS : ROUTES.PUBLIC_POSTS}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          {isOwner ? 'Back to my posts' : 'Back to posts'}
        </Link>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-28 rounded bg-surface-container" />
            <div className="h-10 w-3/4 rounded bg-surface-container" />
            <div className="h-4 w-48 rounded bg-surface-container" />
            <div className="mt-8 h-32 rounded bg-surface-container-low" />
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-border-subtle bg-surface-white px-6 py-10 text-center">
            <p className="font-title-md text-title-md text-text-primary">Unable to open this post</p>
            <p className="mt-2 font-body-sm text-body-sm text-text-muted">{error}</p>
            <Link
              className="mt-6 inline-flex items-center gap-1 font-label-md text-label-md text-primary-container hover:text-surface-tint"
              to={ROUTES.PUBLIC_POSTS}
            >
              Browse posts
            </Link>
          </div>
        ) : null}

        {post ? (
          <>
            <PostReadingArticle
              actions={
                <PostDetailActions
                  copyState={copyState}
                  isOwner={isOwner}
                  onCopyShareUrl={handleCopyShareUrl}
                  onDelete={() => requestDelete(post)}
                  onShare={() => setShareOpen(true)}
                  postId={post.id}
                />
              }
              post={post}
              showStatus
            />
            {isOwner ? (
              <>
                <SharePostLink onClose={() => setShareOpen(false)} open={shareOpen} post={post} />
                <DeletePostConfirmModal {...modalProps} />
              </>
            ) : null}
            <CommentsSection post={post} />
            <RecommendedPosts postId={post.id} />
          </>
        ) : null}
      </main>
      <PublicFooter />
    </div>
  )
}
