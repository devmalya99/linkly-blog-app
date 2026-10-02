import { clearAuthSession, getAccessToken, setAuthSession } from '../../features/auth/utils/authCookies'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

let refreshPromise = null

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function parseBody(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return null
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })

      const body = await parseBody(response)

      if (!response.ok) {
        clearAuthSession()
        return null
      }

      const accessToken = body?.data?.accessToken
      const user = body?.data?.user

      if (!accessToken) {
        clearAuthSession()
        return null
      }

      setAuthSession({ accessToken, user })
      return { accessToken, user }
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {}, auth = true, skipRefresh = false } = options

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  if (body !== undefined && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAccessToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  if (response.status === 401 && auth && !skipRefresh) {
    const refreshed = await refreshAccessToken()

    if (refreshed?.accessToken) {
      return apiRequest(path, { ...options, skipRefresh: true })
    }
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    throw new ApiError(payload?.message || 'Request failed', {
      status: response.status,
      data: payload,
    })
  }

  return payload
}

export { refreshAccessToken }
