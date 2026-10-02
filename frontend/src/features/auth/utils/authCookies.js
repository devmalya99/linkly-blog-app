import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  USER_COOKIE,
  USER_COOKIE_MAX_AGE_SECONDS,
} from '../constants/auth.constants'

function isSecureContext() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:'
}

function buildCookie(name, value, maxAgeSeconds) {
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ]

  if (isSecureContext()) {
    parts.push('Secure')
  }

  return parts.join('; ')
}

function readCookie(name) {
  if (typeof document === 'undefined') return null

  const prefix = `${encodeURIComponent(name)}=`
  const match = document.cookie.split('; ').find((row) => row.startsWith(prefix))

  if (!match) return null

  return decodeURIComponent(match.slice(prefix.length))
}

function clearCookie(name) {
  const parts = [`${encodeURIComponent(name)}=`, 'Path=/', 'SameSite=Lax', 'Max-Age=0']

  if (isSecureContext()) {
    parts.push('Secure')
  }

  document.cookie = parts.join('; ')
}

export function getAccessToken() {
  return readCookie(ACCESS_TOKEN_COOKIE)
}

export function getStoredUser() {
  const raw = readCookie(USER_COOKIE)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    clearCookie(USER_COOKIE)
    return null
  }
}

export function setAuthSession({ accessToken, user }) {
  if (accessToken) {
    document.cookie = buildCookie(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_TOKEN_MAX_AGE_SECONDS)
  }

  if (user) {
    document.cookie = buildCookie(USER_COOKIE, JSON.stringify(user), USER_COOKIE_MAX_AGE_SECONDS)
  }
}

export function clearAuthSession() {
  clearCookie(ACCESS_TOKEN_COOKIE)
  clearCookie(USER_COOKIE)
}
