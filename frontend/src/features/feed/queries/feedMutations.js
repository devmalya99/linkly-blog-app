import { followAuthor, unfollowAuthor } from '../api/followApi'
import { feedKeys, followKeys } from './feedKeys'

export function followAuthorMutationOptions(queryClient) {
  return {
    mutationFn: (userId) => followAuthor(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
      queryClient.invalidateQueries({ queryKey: feedKeys.all })
    },
  }
}

export function unfollowAuthorMutationOptions(queryClient) {
  return {
    mutationFn: (userId) => unfollowAuthor(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
      queryClient.invalidateQueries({ queryKey: feedKeys.all })
    },
  }
}
