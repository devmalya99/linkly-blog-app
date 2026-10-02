import { Link } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import { adminStatusLabel, formatAdminDate } from '../utils/adminFormat'

export function AdminRecentPosts({ posts = [] }) {
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
          to={ROUTES.ADMIN_POSTS}
        >
          View all
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="px-5 py-6 font-body-sm text-body-sm text-text-muted">No posts on the platform yet.</p>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {posts.map((post) => (
            <li className="flex items-start justify-between gap-4 px-5 py-4" key={post.id}>
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    post.isDeleted
                      ? 'bg-status-error'
                      : post.status === 'published'
                        ? 'bg-status-success'
                        : 'bg-status-warning'
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate font-label-md text-label-md font-medium text-text-primary">
                    {post.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 font-meta-sm text-meta-sm text-text-muted">
                    <span>{adminStatusLabel(post.status, post.isDeleted)}</span>
                    <span>·</span>
                    <span>{formatAdminDate(post.createdAt)}</span>
                    {post.author?.name ? (
                      <>
                        <span>·</span>
                        <span>{post.author.name}</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
