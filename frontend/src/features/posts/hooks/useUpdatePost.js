import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePostMutationOptions } from '../queries'

export function useUpdatePost() {
  const queryClient = useQueryClient()
  const mutation = useMutation(updatePostMutationOptions(queryClient))

  return {
    updatePost: (id, payload) => mutation.mutateAsync({ id, payload }),
    isSubmitting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}
