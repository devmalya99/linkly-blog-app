import { useEffect, useMemo, useState } from 'react'
import {
  ADMIN_USERS_PAGE_SIZE,
  ADMIN_USER_ROLE_FILTER,
  ADMIN_USER_SORT,
} from '../constants/admin.constants'
import { buildAdminUsersParams } from '../utils/adminFormat'
import { useAdminUsersList } from './useAdminUsersList'

export function useAdminUsersView() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState(ADMIN_USER_ROLE_FILTER.ALL)
  const [sort, setSort] = useState(ADMIN_USER_SORT.JOINED_NEWEST)
  const [page, setPage] = useState(1)

  const params = useMemo(
    () =>
      buildAdminUsersParams({
        page,
        limit: ADMIN_USERS_PAGE_SIZE,
        search,
        role,
        sort,
      }),
    [page, search, role, sort],
  )

  const { users, pagination, isLoading, error, reload } = useAdminUsersList(params)

  const total = pagination?.total ?? 0
  const pageSize = pagination?.limit ?? ADMIN_USERS_PAGE_SIZE
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

  function updateSearch(value) {
    setSearch(value)
    setPage(1)
  }

  function updateRole(value) {
    setRole(value)
    setPage(1)
  }

  function updateSort(value) {
    setSort(value)
    setPage(1)
  }

  function updatePage(nextPage) {
    const safePage = Math.min(Math.max(1, nextPage), totalPages)
    setPage(safePage)
  }

  return {
    users,
    search,
    role,
    sort,
    page: currentPage,
    totalPages,
    from,
    to,
    total,
    isLoading,
    error,
    reload,
    updateSearch,
    updateRole,
    updateSort,
    updatePage,
  }
}
