import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAdminUserMutationOptions } from '../queries'

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()
  const mutation = useMutation(deleteAdminUserMutationOptions(queryClient))

  return {
    deleteUser: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}
