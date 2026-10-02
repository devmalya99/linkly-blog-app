import { Link } from 'react-router-dom'
import { ROUTES, editPostPath } from '../../../utils/constants'
import { formatPostDate, statusLabel, useMyPosts } from '../../posts'
import {
  RECENT_COMMENTS,
  WEEKLY_READERS,
} from '../constants/dashboardContent'

export function RecentPostsPanel() {
  const { posts, isLoading, error } = useMyPosts({ page: 1, limit: 5 })

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-title-md text-title-md text-text-primary">Recent Posts</h2>
          <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-tag text-label-tag text-text-muted">
            {posts.length} items
          </span>
        </div>
        <Link
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary-container hover:underline"
          to={ROUTES.MY_POSTS}
        >
          View all
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {isLoading ? (
        <p className="px-5 py-6 font-body-sm text-body-sm text-text-muted">Loading posts…</p>
      ) : null}

      {error ? (
        <p className="px-5 py-6 font-body-sm text-body-sm text-status-error">{error}</p>
      ) : null}

      {!isLoading && !error && posts.length === 0 ? (
        <p className="px-5 py-6 font-body-sm text-body-sm text-text-muted">No posts yet. Start a draft.</p>
      ) : null}

      {posts.length > 0 ? (
        <ul className="divide-y divide-border-subtle">
          {posts.map((post) => (
            <li className="flex items-start justify-between gap-4 px-5 py-4" key={post.id}>
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    post.status === 'published' ? 'bg-status-success' : 'bg-status-warning'
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate font-label-md text-label-md font-medium text-text-primary">
                    {post.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 font-meta-sm text-meta-sm text-text-muted">
                    <span>{statusLabel(post.status)}</span>
                    <span>·</span>
                    <span>{formatPostDate(post.updatedAt)}</span>
                    <span>·</span>
                    <span>{post.category}</span>
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex shrink-0 items-center gap-1 font-label-md text-label-md text-text-muted hover:text-primary-container"
                to={editPostPath(post.id)}
              >
                Edit
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3">
        <span className="inline-flex items-center gap-1.5 font-meta-sm text-meta-sm text-text-muted">
          <span className="material-symbols-outlined text-[16px] text-status-success">cloud_done</span>
          Synced with Inkly
        </span>
        <Link className="font-label-md text-label-md text-primary-container hover:underline" to={ROUTES.CREATE_POST}>
          Start blank draft
        </Link>
      </div>
    </section>
  )
}

export function WeeklyReadershipPanel() {
  const max = Math.max(...WEEKLY_READERS.bars)

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-primary-container">trending_up</span>
        <h2 className="font-title-md text-title-md text-text-primary">Weekly Readership</h2>
      </div>
      <p className="font-headline-sm text-headline-sm font-bold text-text-primary">
        {WEEKLY_READERS.visitors}{' '}
        <span className="font-body-sm text-body-sm font-normal text-text-muted">Unique Visitors</span>
      </p>
      <p className="mt-1 font-meta-sm text-meta-sm text-status-success">
        ↑ {WEEKLY_READERS.growth} compared to last week
      </p>
      <div className="mt-6 flex h-28 items-end gap-2">
        {WEEKLY_READERS.bars.map((value, index) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={`${value}-${index}`}>
            <div
              className="w-full rounded-md bg-primary-container/80"
              style={{ height: `${(value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export function RecentCommentsPanel() {
  return (
    <section className="rounded-xl border border-border-subtle bg-surface-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-title-md text-title-md text-text-primary">Recent Comments</h2>
          <span className="rounded-full bg-primary-container/10 px-2 py-0.5 font-label-tag text-label-tag text-primary-container">
            3 new
          </span>
        </div>
        <button aria-label="Filter comments" className="text-text-muted hover:text-text-primary" type="button">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      </div>

      <ul className="divide-y divide-border-subtle">
        {RECENT_COMMENTS.map((comment) => (
          <li className="px-5 py-4" key={comment.id}>
            <p className="font-body-sm text-body-sm text-text-primary">“{comment.quote}”</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container font-label-tag text-label-tag font-semibold text-text-primary">
                {comment.initials}
              </span>
              <span className="font-label-md text-label-md text-text-primary">{comment.author}</span>
              <span className="font-meta-sm text-meta-sm text-text-muted">{comment.time}</span>
            </div>
            <p className="mt-2 inline-flex items-center gap-1 font-meta-sm text-meta-sm text-text-muted">
              <span className="material-symbols-outlined text-[14px]">subdirectory_arrow_right</span>
              on {comment.post}
            </p>
          </li>
        ))}
      </ul>

      <div className="border-t border-border-subtle px-5 py-3">
        <button className="font-label-md text-label-md text-primary-container hover:underline" type="button">
          Moderate all 142 comments
        </button>
      </div>
    </section>
  )
}
