import { createHash, randomBytes } from 'node:crypto'
import { env } from '../config/env.js'

export const REFRESH_COOKIE_NAME = 'refreshToken'

export function parseDurationToMs(value) {
  const match = /^(\d+)([smhd])$/.exec(String(value).trim())

  if (!match) {
    throw new Error(`Unsupported duration format: ${value}`)
  }

  const amount = Number(match[1])
  const unit = match[2]

  // 📌 The multipliers object converts a duration string like 7d or 15m into milliseconds.
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  return amount * multipliers[unit]
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

export function createOpaqueToken() {
  return randomBytes(48).toString('base64url')
}

// 📌 Sets the refresh cookie options.
export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
  }
}

export function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions())
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
  })
}

export function readRefreshCookie(req) {
  return req.cookies?.[REFRESH_COOKIE_NAME]
}
