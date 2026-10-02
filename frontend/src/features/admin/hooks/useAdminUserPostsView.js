import { useEffect, useMemo, useState } from 'react'
import {
  ADMIN_POSTS_PAGE_SIZE,
  ADMIN_USER_POSTS_TAB,
} from '../constants/admin.constants'
import { buildAdminUserPostsParams } from '../utils/adminFormat'
import { useAdminPosts } from './useAdminPosts'

export function useAdminUserPostsView(userId) {
  const [tab, setTab] = useState(ADMIN_USER_POSTS_TAB.ALL)
  const [page, setPage] = useState(1)

  const params = useMemo(
    () =>
      buildAdminUserPostsParams({
        page,
        limit: ADMIN_POSTS_PAGE_SIZE,
        author: userId,
        tab,
      }),
    [page, userId, tab],
  )

  const enabled = Boolean(userId)
  const { posts, pagination, isLoading, error, reload } = useAdminPosts(params, { enabled })

  const total = pagination?.total ?? 0
  const pageSize = pagination?.limit ?? ADMIN_POSTS_PAGE_SIZE
  const currentPage = pagination?.page ?? page
  const totalPages = Math.max(1, pagination?.totalPages ?? Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  useEffect(() => {
    setPage(1)
  }, [userId])

  useEffect(() => {
    if (isLoading || !enabled) return

    if (total === 0 && page !== 1) {
      setPage(1)
      return
    }

    if (total > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [isLoading, total, page, totalPages, enabled])

  function updateTab(value) {
    setTab(value)
    setPage(1)
  }

  function updatePage(nextPage) {
    const safePage = Math.min(Math.max(1, nextPage), totalPages)
    setPage(safePage)
  }

  return {
    posts: enabled ? posts : [],
    tab,
    page: currentPage,
    totalPages,
    from,
    to,
    total: enabled ? total : 0,
    isLoading: enabled ? isLoading : false,
    error: enabled ? error : '',
    reload,
    updateTab,
    updatePage,
  }
}
