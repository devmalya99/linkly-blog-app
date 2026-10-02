import { apiRequest } from '../../../services/api/client'

function withQuery(path, params = {}) {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }

  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export function getComments(postId, params = {}) {
  return apiRequest(withQuery(`/posts/${postId}/comments`, params), {
    method: 'GET',
  })
}

export function getRecentComments(params = {}) {
  return apiRequest(withQuery('/comments/recent', params), {
    method: 'GET',
  })
}

export function createComment(postId, content) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    body: { content },
  })
}

export function updateComment(commentId, content) {
  return apiRequest(`/comments/${commentId}`, {
    method: 'PATCH',
    body: { content },
  })
}

export function deleteComment(commentId) {
  return apiRequest(`/comments/${commentId}`, {
    method: 'DELETE',
  })
}
