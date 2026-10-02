import { useEffect, useMemo, useState } from 'react'
import {
  ADMIN_DELETED_FILTER,
  ADMIN_POSTS_PAGE_SIZE,
  ADMIN_STATUS_FILTER,
} from '../constants/admin.constants'
import { buildAdminPostsParams } from '../utils/adminFormat'
import { useAdminPosts } from './useAdminPosts'

export function useAdminPostsView() {
  const [status, setStatus] = useState(ADMIN_STATUS_FILTER.ALL)
  const [author, setAuthor] = useState('')
  const [deleted, setDeleted] = useState(ADMIN_DELETED_FILTER.ACTIVE)
  const [page, setPage] = useState(1)

  const params = useMemo(
    () =>
      buildAdminPostsParams({
        page,
        limit: ADMIN_POSTS_PAGE_SIZE,
        status,
        author,
        deleted,
      }),
    [page, status, author, deleted],
  )

  const { posts, pagination, isLoading, error, reload } = useAdminPosts(params)

  const total = pagination?.total ?? 0
  const pageSize = pagination?.limit ?? ADMIN_POSTS_PAGE_SIZE
  const currentPage = pagination?.page ?? page
  const totalPages = Math.max(1, pagination?.totalPages ?? Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  useEffect(() => {
    if (isLoading) return

    if (total === 0 && page !== 1) {
      setPage(1)
      return
    }

    if (total > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [isLoading, total, page, totalPages])

  function updateStatus(value) {
    setStatus(value)
    setPage(1)
  }

  function updateAuthor(value) {
    setAuthor(value)
    setPage(1)
  }

  function updateDeleted(value) {
    setDeleted(value)
    setPage(1)
  }

  function updatePage(nextPage) {
    const safePage = Math.min(Math.max(1, nextPage), totalPages)
    setPage(safePage)
  }

  return {
    posts,
    status,
    author,
    deleted,
    page: currentPage,
    totalPages,
    from,
    to,
    total,
    isLoading,
    error,
    reload,
    updateStatus,
    updateAuthor,
    updateDeleted,
    updatePage,
  }
}
