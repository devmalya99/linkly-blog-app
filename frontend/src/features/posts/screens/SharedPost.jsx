import { Link, useParams } from 'react-router-dom'
import { PublicFooter } from '../../../components/layout/PublicFooter'
import { PublicHeader } from '../../../components/layout/PublicHeader'
import { ROUTES } from '../../../utils/constants'
import { PostReadingArticle } from '../components/PostReadingArticle'
import { useSharedPost } from '../hooks/useSharedPost'

export function SharedPost() {
  const { id } = useParams()
  const { post, isLoading, error } = useSharedPost(id)

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
          to={ROUTES.HOME}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to Inkly
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
              to={ROUTES.HOME}
            >
              Go to Inkly
            </Link>
          </div>
        ) : null}

        {post ? (
          <PostReadingArticle
            post={post}
            statusNote={post.publishedAt ? null : 'Shared draft'}
          />
        ) : null}
      </main>
      <PublicFooter />
    </div>
  )
}
