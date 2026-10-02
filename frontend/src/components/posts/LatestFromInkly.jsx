import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { ROUTES, postDetailPath } from '../../utils/constants'
import { formatPostDate, useRecentPosts } from '../../features/posts'

export function LatestFromInkly() {
  const { posts, isLoading, error } = useRecentPosts(5)

  return (
    <section className="bg-surface-white" id="latest">
      <div className="mx-auto max-w-[1120px] px-6 py-8 pb-16">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">Latest from Inkly</h2>
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-container hover:underline"
            to={ROUTES.PUBLIC_POSTS}
          >
            View all stories
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {isLoading ? <p className="py-6 text-sm text-text-muted">Loading latest posts…</p> : null}
        {error ? <p className="py-6 text-sm text-status-error">{error}</p> : null}
        {!isLoading && !error && posts.length === 0 ? (
          <p className="py-6 text-sm text-text-muted">No published posts yet.</p>
        ) : null}

        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li className="border-b border-border-subtle py-5" key={post.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">
                      {post.category}
                      <span className="font-normal tracking-normal">
                        {' '}
                        · {formatPostDate(post.publishedAt || post.createdAt)}
                      </span>
                    </p>
                    <Link
                      className="mt-1.5 block text-base font-semibold text-text-primary hover:text-primary-container"
                      to={postDetailPath(post)}
                    >
                      {post.title}
                    </Link>
                    {post.excerpt ? (
                      <p className="mt-1 text-sm leading-6 text-text-muted">{post.excerpt}</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-sm text-text-primary">{post.author?.name || 'Inkly author'}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {!isLoading && posts.length === 0 && !error ? (
          <div className="pt-2">
            <Button appearance="text" onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse featured stories
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
