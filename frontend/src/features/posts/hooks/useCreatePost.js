import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPostMutationOptions } from '../queries'

export function useCreatePost() {
  const queryClient = useQueryClient()
  const mutation = useMutation(createPostMutationOptions(queryClient))

  return {
    createPost: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}
