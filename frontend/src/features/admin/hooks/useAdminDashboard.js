import { useQuery } from '@tanstack/react-query'
import { adminDashboardQueryOptions } from '../queries'

function toDashboard(response) {
  return response?.data ?? null
}

export function useAdminDashboard() {
  const query = useQuery({
    ...adminDashboardQueryOptions(),
    select: toDashboard,
  })

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load admin dashboard.' : ''),
    reload: () => query.refetch(),
  }
}
