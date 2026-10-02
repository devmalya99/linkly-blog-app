import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { COMMENT_LIMITS } from '../constants/commentsContent'
import {
  commentsQueryOptions,
  createCommentMutationOptions,
  deleteCommentMutationOptions,
} from '../queries'

export function useComments(postId, { enabled = true, limit = COMMENT_LIMITS.PAGE_SIZE } = {}) {
  const queryClient = useQueryClient()
  const canFetch = Boolean(enabled && postId)
  const pageScope = `${postId ?? ''}:${enabled}:${limit}`

  const [pageState, setPageState] = useState({ scope: pageScope, page: 1 })
  const page = pageState.scope === pageScope ? pageState.page : 1

  function setPage(nextPage) {
    setPageState({ scope: pageScope, page: nextPage })
  }

  const query = useQuery({
    ...commentsQueryOptions(postId, { page, limit }),
    enabled: canFetch,
    select: (response) => ({
      comments: Array.isArray(response?.data) ? response.data : [],
      pagination: response?.pagination || null,
    }),
  })

  const createMutation = useMutation(createCommentMutationOptions(queryClient))
  const deleteMutation = useMutation(deleteCommentMutationOptions(queryClient))

  async function addComment(content) {
    if (!postId) return null
    const response = await createMutation.mutateAsync({ postId, content })
    setPage(1)
    return response.data
  }

  async function removeComment(commentId) {
    await deleteMutation.mutateAsync(commentId)

    const totalAfter = Math.max(0, (query.data?.pagination?.total ?? 1) - 1)
    const totalPagesAfter = Math.max(1, Math.ceil(totalAfter / limit))
    const nextPage = Math.min(page, totalPagesAfter)

    if (nextPage !== page) {
      setPage(nextPage)
    }
  }

  return {
    comments: query.data?.comments ?? [],
    pagination: query.data?.pagination ?? null,
    page,
    setPage,
    isLoading: canFetch && query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load comments.' : ''),
    isSubmitting: createMutation.isPending,
    submitError: createMutation.error?.message || '',
    addComment,
    removeComment,
    reload: () => query.refetch(),
  }
}
