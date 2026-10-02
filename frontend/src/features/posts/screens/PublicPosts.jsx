import { Link } from 'react-router-dom'
import { PublicFooter } from '../../../components/layout/PublicFooter'
import { PublicHeader } from '../../../components/layout/PublicHeader'
import { postDetailPath } from '../../../utils/constants'
import { CoverImage } from '../components/CoverImage'
import { usePublicPosts } from '../hooks/usePublicPosts'
import { formatPostDate } from '../utils/postFormat'

export function PublicPosts() {
  const { posts, pagination, isLoading, error } = usePublicPosts({ page: 1, limit: 12 })

  return (
    <div className="min-h-screen bg-background-warm text-text-primary antialiased">
      <PublicHeader />
      <main className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="mb-10">
          <p className="font-label-tag text-label-tag font-semibold tracking-wider text-primary-container uppercase">
            Stories
          </p>
          <h1 className="mt-1 font-headline-md text-headline-md font-bold tracking-tight text-text-primary">
            All posts
          </h1>
          <p className="mt-2 font-body-md text-body-md text-text-muted">
            Published writing from the Inkly community.
          </p>
        </div>

        {isLoading ? <p className="text-text-muted">Loading posts…</p> : null}
        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-status-error" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && posts.length === 0 ? (
          <p className="text-text-muted">No published posts yet.</p>
        ) : null}

        {posts.length > 0 ? (
          <ul className="divide-y divide-border-subtle border-y border-border-subtle">
            {posts.map((post) => (
              <li className="py-6" key={post.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <Link className="shrink-0" to={postDetailPath(post)}>
                    <CoverImage alt="" rounded="rounded-md" size="card" src={post.coverImage} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-2xl">
                        <p className="font-label-tag text-label-tag font-semibold tracking-[0.12em] text-text-muted uppercase">
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {pagination ? (
          <p className="mt-6 font-meta-sm text-meta-sm text-text-muted">
            Showing {posts.length} of {pagination.total} posts
          </p>
        ) : null}
      </main>
      <PublicFooter />
    </div>
  )
}
