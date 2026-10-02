import { AppError, HTTP_STATUS } from '../constants/errors.js'

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', HTTP_STATUS.FORBIDDEN))
    }

    return next()
  }
}
