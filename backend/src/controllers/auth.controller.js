import { env } from '../config/env.js'
import { HTTP_STATUS } from '../constants/errors.js'
import { authService } from '../services/auth.service.js'
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from '../utils/cookies.js'
import { sendSuccess } from '../utils/response.js'

function frontendRedirect(path, params = {}) {
  const url = new URL(path, env.FRONTEND_URL)

  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

function requestIp(req) {
  return req.ip || req.socket?.remoteAddress
}

export async function register(req, res, next) {
  try {
    const data = await authService.register(req.validated.body, { ipAddress: requestIp(req) })
    sendSuccess(res, data, 'Registered successfully', HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const data = await authService.login(req.validated.body, { ipAddress: requestIp(req) })
    setRefreshCookie(res, data.refreshToken)
    sendSuccess(
      res,
      {
        accessToken: data.accessToken,
        user: data.user,
      },
      'Logged in successfully',
    )
  } catch (error) {
    next(error)
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(
      {
        user: req.user,
        refreshToken: readRefreshCookie(req),
      },
      { ipAddress: requestIp(req) },
    )
    clearRefreshCookie(res)
    sendSuccess(res, null, 'Logged out successfully')
  } catch (error) {
    next(error)
  }
}

export async function refresh(req, res, next) {
  try {
    const data = await authService.refresh(readRefreshCookie(req))
    sendSuccess(res, data, 'Access token refreshed')
  } catch (error) {
    next(error)
  }
}

export async function me(req, res, next) {
  try {
    const data = await authService.getCurrentUser(req.user)
    sendSuccess(res, data, 'Current user fetched successfully')
  } catch (error) {
    next(error)
  }
}

//📌 Convert the google fetched profile into a user object and login the user.
export async function googleCallback(req, res) {
  try {
    const data = await authService.handleGoogleLogin(req.user, { ipAddress: requestIp(req) })
    setRefreshCookie(res, data.refreshToken)
    return res.redirect(frontendRedirect('/auth/callback'))
  } catch {
    return res.redirect(frontendRedirect('/login', { error: 'google_auth_failed' }))
  }
}

export async function facebookCallback(req, res, next) {
  try {
    const data = await authService.handleFacebookLogin(req.user)
    sendSuccess(res, data, 'Facebook login successful')
  } catch (error) {
    next(error)
  }
}
