import { useAuthorSuggestions, useFollowActions, useMyFollows } from './useFollow'

export function useAuthorSuggestionsView(limit = 3) {
  const suggestions = useAuthorSuggestions(limit)
  const { followedIds } = useMyFollows()
  const actions = useFollowActions()

  return {
    authors: suggestions.authors,
    followedIds,
    isLoading: suggestions.isLoading,
    error: suggestions.error || actions.error,
    isPending: actions.isPending,
    pendingUserId: actions.pendingUserId,
    follow: actions.follow,
    unfollow: actions.unfollow,
  }
}
