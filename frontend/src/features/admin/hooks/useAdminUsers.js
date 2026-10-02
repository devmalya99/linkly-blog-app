import { useQuery } from '@tanstack/react-query'
import { adminUsersQueryOptions } from '../queries'

function toUsers(response) {
  return Array.isArray(response?.data) ? response.data : []
}

/** Lightweight author list for dropdowns (id + name). */
export function useAdminUsers(params = { page: 1, limit: 50 }) {
  const query = useQuery({
    ...adminUsersQueryOptions(params),
    select: toUsers,
  })

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load authors.' : ''),
  }
}
