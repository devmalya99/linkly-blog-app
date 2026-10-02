import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAdminPostMutationOptions } from '../queries'

export function useDeleteAdminPost() {
  const queryClient = useQueryClient()
  const mutation = useMutation(deleteAdminPostMutationOptions(queryClient))

  return {
    deletePost: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}
