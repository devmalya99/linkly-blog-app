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

export function createPost(payload) {
  return apiRequest('/posts', {
    method: 'POST',
    body: payload,
  })
}

export function getPosts(params = {}) {
  return apiRequest(withQuery('/posts', params), {
    method: 'GET',
    auth: false,
  })
}

export function getRecentPosts(params = {}) {
  return apiRequest(withQuery('/posts/recent', params), {
    method: 'GET',
    auth: false,
  })
}

export function getRecommendedPosts(id) {
  return apiRequest(`/posts/${id}/recommended`, {
    method: 'GET',
    auth: false,
  })
}

export function getMyPosts(params = {}) {
  return apiRequest(withQuery('/posts/me', params), {
    method: 'GET',
  })
}

export function getPostById(id) {
  return apiRequest(`/posts/${id}`, {
    method: 'GET',
  })
}

export function getPostBySlug(slug) {
  return apiRequest(`/posts/slug/${encodeURIComponent(slug)}`, {
    method: 'GET',
  })
}

export function getSharedPost(id) {
  return apiRequest(`/share/posts/${id}`, {
    method: 'GET',
    auth: false,
  })
}

export function updatePost(id, payload) {
  return apiRequest(`/posts/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deletePost(id) {
  return apiRequest(`/posts/${id}`, {
    method: 'DELETE',
  })
}
