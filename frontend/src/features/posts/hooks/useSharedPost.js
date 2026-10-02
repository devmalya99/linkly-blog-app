import { useQuery } from '@tanstack/react-query'
import { sharedPostQueryOptions } from '../queries'

export function useSharedPost(id) {
  const query = useQuery({
    ...sharedPostQueryOptions(id),
    select: (response) => response?.data ?? null,
  })

  return {
    post: query.data ?? null,
    isLoading: Boolean(id) && query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load shared post.' : ''),
  }
}
