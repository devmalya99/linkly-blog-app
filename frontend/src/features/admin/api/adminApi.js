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

export function getAdminDashboard() {
  return apiRequest('/admin/dashboard', {
    method: 'GET',
  })
}

export function getAdminPosts(params = {}) {
  return apiRequest(withQuery('/admin/posts', params), {
    method: 'GET',
  })
}

export function deleteAdminPost(id) {
  return apiRequest(`/admin/posts/${id}`, {
    method: 'DELETE',
  })
}

export function getAdminUsers(params = {}) {
  return apiRequest(withQuery('/admin/users', params), {
    method: 'GET',
  })
}

export function getAdminUser(id) {
  return apiRequest(`/admin/users/${id}`, {
    method: 'GET',
  })
}

export function updateAdminUser(id, body) {
  return apiRequest(`/admin/users/${id}`, {
    method: 'PATCH',
    body,
  })
}

export function deleteAdminUser(id) {
  return apiRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  })
}
