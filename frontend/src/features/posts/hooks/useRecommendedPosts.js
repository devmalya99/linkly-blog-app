import { useQuery } from '@tanstack/react-query'
import { recommendedPostsQueryOptions } from '../queries'

export function useRecommendedPosts(postId) {
  const query = useQuery({
    ...recommendedPostsQueryOptions(postId),
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
  })

  return {
    posts: query.data ?? [],
    isLoading: Boolean(postId) && query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load recommendations.' : ''),
  }
}
