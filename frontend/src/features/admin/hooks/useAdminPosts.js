import { useQuery } from '@tanstack/react-query'
import { adminPostsQueryOptions } from '../queries'

function toListData(response) {
  return {
    posts: Array.isArray(response?.data) ? response.data : [],
    pagination: response?.pagination || null,
  }
}

export function useAdminPosts(params = {}, options = {}) {
  const query = useQuery({
    ...adminPostsQueryOptions(params),
    select: toListData,
    enabled: options.enabled !== false,
  })

  return {
    posts: query.data?.posts ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load posts.' : ''),
    reload: () => query.refetch(),
  }
}
