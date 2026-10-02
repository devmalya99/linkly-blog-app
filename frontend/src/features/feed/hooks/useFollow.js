import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  authorSuggestionsQueryOptions,
  followAuthorMutationOptions,
  myFollowsQueryOptions,
  unfollowAuthorMutationOptions,
} from '../queries'

function toUsers(response) {
  return Array.isArray(response?.data) ? response.data : []
}

export function useMyFollows() {
  const query = useQuery({
    ...myFollowsQueryOptions(),
    select: toUsers,
  })

  const followedIds = new Set((query.data ?? []).map((user) => user.id))

  return {
    follows: query.data ?? [],
    followedIds,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load follows.' : ''),
  }
}

export function useAuthorSuggestions(limit = 3) {
  const query = useQuery({
    ...authorSuggestionsQueryOptions({ limit }),
    select: toUsers,
  })

  return {
    authors: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load suggestions.' : ''),
  }
}

export function useFollowActions() {
  const queryClient = useQueryClient()
  const followMutation = useMutation(followAuthorMutationOptions(queryClient))
  const unfollowMutation = useMutation(unfollowAuthorMutationOptions(queryClient))

  return {
    follow: (userId) => followMutation.mutateAsync(userId),
    unfollow: (userId) => unfollowMutation.mutateAsync(userId),
    isPending: followMutation.isPending || unfollowMutation.isPending,
    pendingUserId:
      followMutation.isPending
        ? followMutation.variables
        : unfollowMutation.isPending
          ? unfollowMutation.variables
          : null,
    error:
      followMutation.error?.message ||
      unfollowMutation.error?.message ||
      (followMutation.isError || unfollowMutation.isError ? 'Unable to update follow.' : ''),
  }
}
