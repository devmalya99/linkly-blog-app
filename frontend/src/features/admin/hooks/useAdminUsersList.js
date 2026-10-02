import { useQuery } from '@tanstack/react-query'
import { adminUsersQueryOptions } from '../queries'

function toListData(response) {
  return {
    users: Array.isArray(response?.data) ? response.data : [],
    pagination: response?.pagination || null,
  }
}

export function useAdminUsersList(params = {}) {
  const query = useQuery({
    ...adminUsersQueryOptions(params),
    select: toListData,
  })

  return {
    users: query.data?.users ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load users.' : ''),
    reload: () => query.refetch(),
  }
}
