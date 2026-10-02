import { AppError, HTTP_STATUS } from '../constants/errors.js'

export function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND))
}
