import { queryOptions } from '@tanstack/react-query'
import { getFeed } from '../api/feedApi'
import { getAuthorSuggestions, getMyFollows } from '../api/followApi'
import { feedKeys, followKeys } from './feedKeys'

export function feedQueryOptions(params = {}) {
  return queryOptions({
    queryKey: feedKeys.list(params),
    queryFn: () => getFeed(params),
  })
}

export function myFollowsQueryOptions() {
  return queryOptions({
    queryKey: followKeys.me(),
    queryFn: () => getMyFollows(),
  })
}

export function authorSuggestionsQueryOptions(params = {}) {
  return queryOptions({
    queryKey: followKeys.suggestions(params),
    queryFn: () => getAuthorSuggestions(params),
  })
}
