import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { verifyAccessToken } from '../utils/jwt.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED))
  }

  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length))
    req.user = {
      id: payload.sub,
      role: payload.role,
    }
    return next()
  } catch {
    return next(new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED))
  }
}
