import { useState } from 'react'
import { DELETE_POST_COPY } from '../constants/deletePostContent'

export function useDeletePostConfirmation(deletePost, { onSuccess } = {}) {
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  function requestDelete(nextPost) {
    setError('')
    setPost(nextPost)
  }

  function close() {
    if (isDeleting) return
    setPost(null)
    setError('')
  }

  async function confirm() {
    if (!post) return

    setIsDeleting(true)
    setError('')

    try {
      await deletePost(post.id)
      const deleted = post
      setPost(null)
      onSuccess?.(deleted)
    } catch (err) {
      setError(err.message || DELETE_POST_COPY.ERROR_FALLBACK)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    requestDelete,
    modalProps: {
      open: Boolean(post),
      post,
      onClose: close,
      onConfirm: confirm,
      isDeleting,
      error,
    },
  }
}
