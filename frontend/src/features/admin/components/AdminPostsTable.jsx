import { AdminPostsTableRow } from './AdminPostsTableRow'

export function AdminPostsTable({ posts, isLoading, error, onDelete }) {
  if (isLoading) {
    return (
      <div className="mb-6 overflow-hidden rounded-xl bg-surface-white px-6 py-10 shadow-sm">
        <p className="font-body-md text-body-md text-text-muted">Loading platform posts…</p>
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
        <p className="font-body-md text-body-md text-text-muted">No posts match these filters.</p>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-xl bg-surface-white shadow-sm">
      <div className="hidden grid-cols-12 rounded-t-xl bg-surface-container-low px-6 py-3.5 font-label-tag text-label-tag tracking-wider text-text-muted uppercase md:grid">
        <div className="col-span-4">Post Title</div>
        <div className="col-span-2">Author</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="relative z-0 flex flex-col overflow-visible">
        {posts.map((post) => (
          <AdminPostsTableRow key={post.id} onDelete={onDelete} post={post} />
        ))}
      </div>
    </div>
  )
}
