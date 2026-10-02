import { HTTP_STATUS } from '../constants/errors.js'
import { env } from '../config/env.js'

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  let statusCode = error.statusCode || HTTP_STATUS.INTERNAL
  let message = error.message || 'Internal server error'
  let errors = error.errors

  if (error.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST
    message = 'Invalid identifier'
  }

  if (error.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT
    message = 'A record with that value already exists'
  }

  if (statusCode === HTTP_STATUS.INTERNAL && env.NODE_ENV === 'production') {
    message = 'Internal server error'
    errors = undefined
  }

  const body = {
    success: false,
    message,
  }

  if (errors) {
    body.errors = errors
  }

  return res.status(statusCode).json(body)
}
