import { useQuery } from '@tanstack/react-query'
import { myPostsQueryOptions } from '../queries'

function toListData(response) {
  return {
    posts: Array.isArray(response?.data) ? response.data : [],
    pagination: response?.pagination || null,
  }
}

export function useMyPosts(params = {}) {
  const query = useQuery({
    ...myPostsQueryOptions(params),
    select: toListData,
  })

  return {
    posts: query.data?.posts ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load your posts.' : ''),
    reload: () => query.refetch(),
  }
}
