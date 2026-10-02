import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminUserMutationOptions } from '../queries'

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()
  const mutation = useMutation(updateAdminUserMutationOptions(queryClient))

  return {
    updateUser: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}
