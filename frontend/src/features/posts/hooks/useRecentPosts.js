import { useQuery } from '@tanstack/react-query'
import { recentPostsQueryOptions } from '../queries'

export function useRecentPosts(limit = 5) {
  const query = useQuery({
    ...recentPostsQueryOptions(limit),
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
  })

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load recent posts.' : ''),
  }
}
