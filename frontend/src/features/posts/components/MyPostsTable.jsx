import { Link } from '../../../components/common/Link'
import { ROUTES } from '../../../utils/constants'
import { MyPostsTableRow } from './MyPostsTableRow'

export function MyPostsTable({ posts, isLoading, error, onDelete }) {
  if (isLoading) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-10 shadow-sm">
        <p className="font-body-md text-body-md text-text-muted">Loading your posts…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-6 shadow-sm" role="alert">
        <p className="font-body-sm text-body-sm text-status-error">{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-10 text-center shadow-sm">
        <p className="font-body-md text-body-md text-text-muted">No posts match this view.</p>
        <Link
          className="mt-3 inline-block font-label-md text-label-md text-primary-container"
          color="primary"
          to={ROUTES.CREATE_POST}
          underline="hover"
        >
          Write your first post
        </Link>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-xl bg-surface-white shadow-sm">
      <div className="hidden grid-cols-12 rounded-t-xl bg-surface-container-low px-6 py-3.5 font-label-tag text-label-tag tracking-wider text-text-muted uppercase md:grid">
        <div className="col-span-6 lg:col-span-5">Post Title</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 lg:col-span-2">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      <div className="relative z-0 flex flex-col overflow-visible">
        {posts.map((post) => (
          <MyPostsTableRow key={post.id} onDelete={onDelete} post={post} />
        ))}
      </div>
    </div>
  )
}
