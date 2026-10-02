import { queryOptions } from '@tanstack/react-query'
import { getComments, getRecentComments } from '../api/commentsApi'
import { commentsKeys } from './commentsKeys'

export function commentsQueryOptions(postId, params = {}) {
  return queryOptions({
    queryKey: commentsKeys.list(postId, params),
    queryFn: () => getComments(postId, params),
    enabled: Boolean(postId),
  })
}

export function recentCommentsQueryOptions(params = {}) {
  return queryOptions({
    queryKey: commentsKeys.recent(params),
    queryFn: () => getRecentComments(params),
  })
}
