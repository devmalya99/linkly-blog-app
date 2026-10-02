import { Link } from 'react-router-dom'
import { postDetailPath } from '../../../utils/constants'
import { CoverImage, formatPostDate } from '../../posts'

export function FeedPostCard({ post }) {
  return (
    <li className="py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Link className="shrink-0" to={postDetailPath(post)}>
          <CoverImage alt="" rounded="rounded-md" size="card" src={post.coverImage} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-label-tag text-label-tag font-semibold tracking-[0.12em] text-text-muted uppercase">
            {post.category}
            <span className="font-normal tracking-normal">
              {' '}
              · {formatPostDate(post.publishedAt || post.createdAt)}
            </span>
            {typeof post.commentCount === 'number' ? (
              <span className="font-normal tracking-normal"> · {post.commentCount} comments</span>
            ) : null}
          </p>
          <Link
            className="mt-1.5 block text-lg font-semibold leading-snug text-text-primary hover:text-primary-container"
            to={postDetailPath(post)}
          >
            {post.title}
          </Link>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">{post.excerpt}</p>
          ) : null}
          <p className="mt-3 text-sm text-text-primary">{post.author?.name || 'Inkly author'}</p>
        </div>
      </div>
    </li>
  )
}
