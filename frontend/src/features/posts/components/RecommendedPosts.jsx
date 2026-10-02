import { Link } from 'react-router-dom'
import { postDetailPath } from '../../../utils/constants'
import { useRecommendedPosts } from '../hooks/useRecommendedPosts'
import { formatPostDate } from '../utils/postFormat'
import { CoverImage } from './CoverImage'

export function RecommendedPosts({ postId }) {
  const { posts, isLoading, error } = useRecommendedPosts(postId)

  if (!postId) return null
  if (!isLoading && !error && posts.length === 0) return null

  return (
    <section className="mt-12 border-t border-border-subtle pt-10" aria-labelledby="recommended-posts-heading">
      <h2
        className="font-title-md text-title-md font-semibold tracking-tight text-text-primary"
        id="recommended-posts-heading"
      >
        Recommended posts
      </h2>
      <p className="mt-1 font-body-sm text-body-sm text-text-muted">More to read from related stories.</p>

      {isLoading ? <p className="mt-6 font-body-sm text-body-sm text-text-muted">Loading recommendations…</p> : null}
      {error ? (
        <p className="mt-6 font-body-sm text-body-sm text-status-error" role="alert">
          {error}
        </p>
      ) : null}

      {posts.length > 0 ? (
        <ul className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
          {posts.map((post) => (
            <li className="py-5" key={post.id}>
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
    </section>
  )
}
