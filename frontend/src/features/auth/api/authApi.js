import { apiRequest, refreshAccessToken } from '../../../services/api/client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function registerUser({ name, email, password }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    auth: false,
    body: { name, email, password },
  })
}

export function loginUser({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  })
}

export function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST',
    skipRefresh: true,
  })
}

export function fetchCurrentUser() {
  return apiRequest('/auth/me')
}

export function refreshSession() {
  return refreshAccessToken()
}

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`
}
