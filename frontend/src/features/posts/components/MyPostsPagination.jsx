import { Pagination } from '@ninna-ui/navigation'

export function MyPostsPagination({ page, totalPages, from, to, total, onPageChange }) {
  if (total === 0) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
      <span className="font-meta-sm text-meta-sm text-text-muted">
        Showing <span className="font-medium text-text-primary">{from}</span> to{' '}
        <span className="font-medium text-text-primary">{to}</span> of{' '}
        <span className="font-medium text-text-primary">{total}</span> posts
      </span>

      <Pagination aria-label="My posts pagination" className="mx-0 w-auto justify-end" size="sm">
        <Pagination.Content className="gap-1.5">
          <Pagination.Item>
            <Pagination.Previous
              className="rounded-md px-3 py-1.5 font-label-md text-label-md text-text-muted hover:bg-surface-white hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            />
          </Pagination.Item>

          {pages.map((pageNumber) => (
            <Pagination.Item key={pageNumber}>
              <Pagination.Link
                className={
                  pageNumber === page
                    ? 'h-8 w-8 rounded-md bg-primary-container font-label-md text-label-md text-on-primary shadow-xs'
                    : 'h-8 w-8 rounded-md bg-surface-white font-label-md text-label-md text-text-primary hover:bg-surface-container-low'
                }
                isActive={pageNumber === page}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Link>
            </Pagination.Item>
          ))}

          <Pagination.Item>
            <Pagination.Next
              className="rounded-md px-3 py-1.5 font-label-md text-label-md text-text-muted hover:bg-surface-white hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  )
}
