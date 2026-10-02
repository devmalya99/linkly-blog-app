import { useMemo, useState } from 'react'
import {
  MY_POSTS_PAGE_SIZE,
  MY_POSTS_SORT,
  MY_POSTS_STATUS_FILTER,
} from '../constants/myPostsContent'
import {
  countByStatus,
  filterMyPosts,
  paginateMyPosts,
  sortMyPosts,
} from '../utils/myPostsView'
import { useMyPosts } from './useMyPosts'

export function useMyPostsView() {
  const { posts, isLoading, error, reload } = useMyPosts({ page: 1, limit: 50 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(MY_POSTS_STATUS_FILTER.ALL)
  const [sort, setSort] = useState(MY_POSTS_SORT.NEWEST)
  const [page, setPage] = useState(1)

  const counts = useMemo(() => countByStatus(posts), [posts])

  const filtered = useMemo(
    () => filterMyPosts(posts, { status, search }),
    [posts, status, search],
  )

  const sorted = useMemo(() => sortMyPosts(filtered, sort), [filtered, sort])

  const pagination = useMemo(
    () => paginateMyPosts(sorted, page, MY_POSTS_PAGE_SIZE),
    [sorted, page],
  )

  function updateSearch(value) {
    setSearch(value)
    setPage(1)
  }

  function updateStatus(value) {
    setStatus(value)
    setPage(1)
  }

  function updateSort(value) {
    setSort(value)
    setPage(1)
  }

  function updatePage(nextPage) {
    setPage(nextPage)
  }

  return {
    posts: pagination.items,
    counts,
    search,
    status,
    sort,
    page: pagination.page,
    totalPages: pagination.totalPages,
    from: pagination.from,
    to: pagination.to,
    total: pagination.total,
    isLoading,
    error,
    reload,
    updateSearch,
    updateStatus,
    updateSort,
    updatePage,
  }
}
