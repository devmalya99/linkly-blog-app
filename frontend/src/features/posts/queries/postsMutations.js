import { createPost, deletePost, updatePost } from '../api/postsApi'
import { postsKeys } from './postsKeys'

const ADMIN_QUERY_ROOT = ['admin']

export function createPostMutationOptions(queryClient) {
  return {
    mutationFn: (payload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_ROOT })
    },
  }
}

export function updatePostMutationOptions(queryClient) {
  return {
    mutationFn: ({ id, payload }) => updatePost(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
      queryClient.invalidateQueries({ queryKey: postsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_ROOT })
    },
  }
}

export function deletePostMutationOptions(queryClient) {
  return {
    mutationFn: (id) => deletePost(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.all })
      queryClient.removeQueries({ queryKey: postsKeys.detail(id) })
      queryClient.removeQueries({ queryKey: postsKeys.shared(id) })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_ROOT })
    },
  }
}
