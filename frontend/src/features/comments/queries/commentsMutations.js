import { createComment, deleteComment, updateComment } from '../api/commentsApi'
import { commentsKeys } from './commentsKeys'

export function createCommentMutationOptions(queryClient) {
  return {
    mutationFn: ({ postId, content }) => createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.all })
    },
  }
}

export function updateCommentMutationOptions(queryClient) {
  return {
    mutationFn: ({ commentId, content }) => updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.all })
    },
  }
}

export function deleteCommentMutationOptions(queryClient) {
  return {
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.all })
    },
  }
}
