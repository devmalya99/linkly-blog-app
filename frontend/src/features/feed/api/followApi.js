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

export function getMyFollows() {
  return apiRequest('/follows/me', {
    method: 'GET',
  })
}

export function getAuthorSuggestions(params = {}) {
  return apiRequest(withQuery('/follows/suggestions', params), {
    method: 'GET',
  })
}

export function followAuthor(userId) {
  return apiRequest(`/follows/${userId}`, {
    method: 'POST',
  })
}

export function unfollowAuthor(userId) {
  return apiRequest(`/follows/${userId}`, {
    method: 'DELETE',
  })
}
