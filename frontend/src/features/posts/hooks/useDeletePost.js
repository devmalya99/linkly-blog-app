import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePostMutationOptions } from '../queries'

export function useDeletePost() {
  const queryClient = useQueryClient()
  const mutation = useMutation(deletePostMutationOptions(queryClient))

  return {
    deletePost: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}
