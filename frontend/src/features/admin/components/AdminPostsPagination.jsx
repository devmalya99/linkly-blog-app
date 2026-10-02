import { Pagination } from '@ninna-ui/navigation'

export function AdminPostsPagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPageChange,
  itemLabel = 'posts',
}) {
  if (total === 0) return null

  const maxVisiblePages = 7
  let pages = []

  if (totalPages <= maxVisiblePages) {
    pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  } else {
    const start = Math.max(1, Math.min(page - 2, totalPages - (maxVisiblePages - 1)))
    const end = Math.min(totalPages, start + maxVisiblePages - 1)
    pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
      <span className="font-meta-sm text-meta-sm text-text-muted">
        Showing <span className="font-medium text-text-primary">{from}</span> to{' '}
        <span className="font-medium text-text-primary">{to}</span> of{' '}
        <span className="font-medium text-text-primary">{total}</span> {itemLabel}
      </span>

      <Pagination aria-label={`Admin ${itemLabel} pagination`} className="mx-0 w-auto justify-end" size="sm">
        <Pagination.Content className="gap-1.5">
          <Pagination.Item>
            <Pagination.Previous
              className="rounded-md px-3 py-1.5 font-label-md text-label-md text-text-muted hover:bg-surface-white hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            />
          </Pagination.Item>

          {pages[0] > 1 ? (
            <>
              <Pagination.Item>
                <Pagination.Link
                  className="h-8 w-8 rounded-md bg-surface-white font-label-md text-label-md text-text-primary hover:bg-surface-container-low"
                  onClick={() => onPageChange(1)}
                >
                  1
                </Pagination.Link>
              </Pagination.Item>
              {pages[0] > 2 ? (
                <Pagination.Item>
                  <span className="px-1 font-meta-sm text-meta-sm text-text-muted">…</span>
                </Pagination.Item>
              ) : null}
            </>
          ) : null}

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

          {pages[pages.length - 1] < totalPages ? (
            <>
              {pages[pages.length - 1] < totalPages - 1 ? (
                <Pagination.Item>
                  <span className="px-1 font-meta-sm text-meta-sm text-text-muted">…</span>
                </Pagination.Item>
              ) : null}
              <Pagination.Item>
                <Pagination.Link
                  className="h-8 w-8 rounded-md bg-surface-white font-label-md text-label-md text-text-primary hover:bg-surface-container-low"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Pagination.Link>
              </Pagination.Item>
            </>
          ) : null}

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
