export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  NOT_IMPLEMENTED: 501,
  INTERNAL: 500,
}

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL, errors) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = true
  }
}
