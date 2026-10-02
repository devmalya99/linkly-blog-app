import { createComment, deleteComment } from '../api/commentsApi'
import { commentsKeys } from './commentsKeys'

export function createCommentMutationOptions(queryClient) {
  return {
    mutationFn: ({ postId, content }) => createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() })
    },
  }
}

export function deleteCommentMutationOptions(queryClient) {
  return {
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() })
    },
  }
}
