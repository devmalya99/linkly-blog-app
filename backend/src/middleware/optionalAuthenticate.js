import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { verifyAccessToken } from '../utils/jwt.js'

/** Sets req.user when a valid bearer token is present; never blocks anonymous access. */
export function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return next()
  }

  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length))
    req.user = {
      id: payload.sub,
      role: payload.role,
    }
  } catch {
    return next(new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED))
  }

  return next()
}
