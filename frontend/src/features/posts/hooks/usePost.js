import { useQuery } from '@tanstack/react-query'
import { postByIdQueryOptions } from '../queries'

export function usePost(id) {
  const query = useQuery({
    ...postByIdQueryOptions(id),
    select: (response) => response?.data ?? null,
  })

  return {
    post: query.data ?? null,
    isLoading: Boolean(id) && query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load post.' : ''),
  }
}
