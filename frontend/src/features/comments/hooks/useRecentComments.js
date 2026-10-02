import { useQuery } from '@tanstack/react-query'
import { recentCommentsQueryOptions } from '../queries'

const DEFAULT_LIMIT = 5

function toRecentData(response) {
  const payload = response?.data
  return {
    comments: Array.isArray(payload?.items) ? payload.items : [],
    total: typeof payload?.total === 'number' ? payload.total : 0,
    newCount: typeof payload?.newCount === 'number' ? payload.newCount : 0,
  }
}

export function useRecentComments(limit = DEFAULT_LIMIT) {
  const query = useQuery({
    ...recentCommentsQueryOptions({ limit }),
    select: toRecentData,
  })

  return {
    comments: query.data?.comments ?? [],
    total: query.data?.total ?? 0,
    newCount: query.data?.newCount ?? 0,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load recent comments.' : ''),
    reload: () => query.refetch(),
  }
}
