import { Button } from '../../../components/common/Button'

export function CommentsPagination({ page, totalPages, total, onPageChange }) {
  if (!total || totalPages <= 1) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <span className="font-meta-sm text-meta-sm text-text-muted">
        Page {page} of {totalPages} · {total} comments
      </span>
      <div className="flex items-center gap-2">
        <Button
          appearance="pagination"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          Previous
        </Button>
        <Button
          appearance="pagination"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
