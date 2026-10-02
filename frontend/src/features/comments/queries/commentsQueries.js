import { queryOptions } from '@tanstack/react-query'
import { getComments } from '../api/commentsApi'
import { commentsKeys } from './commentsKeys'

export function commentsQueryOptions(postId, params = {}) {
  return queryOptions({
    queryKey: commentsKeys.list(postId, params),
    queryFn: () => getComments(postId, params),
    enabled: Boolean(postId),
  })
}
