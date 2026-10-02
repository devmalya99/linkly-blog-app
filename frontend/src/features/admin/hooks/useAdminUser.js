import { useQuery } from '@tanstack/react-query'
import { adminUserQueryOptions } from '../queries'

function toUser(response) {
  return response?.data ?? null
}

export function useAdminUser(id) {
  const query = useQuery({
    ...adminUserQueryOptions(id),
    select: toUser,
  })

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load user.' : ''),
    reload: () => query.refetch(),
  }
}
