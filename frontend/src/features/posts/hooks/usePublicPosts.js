import { useQuery } from '@tanstack/react-query'
import { publicPostsQueryOptions } from '../queries'

function toListData(response) {
  return {
    posts: Array.isArray(response?.data) ? response.data : [],
    pagination: response?.pagination || null,
  }
}

export function usePublicPosts(params = {}) {
  const query = useQuery({
    ...publicPostsQueryOptions(params),
    select: toListData,
  })

  return {
    posts: query.data?.posts ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load posts.' : ''),
  }
}
