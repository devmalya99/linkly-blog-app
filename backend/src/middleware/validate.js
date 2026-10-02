import { AppError, HTTP_STATUS } from '../constants/errors.js'

/**
 * Validates req.body / req.params / req.query with a Zod schema.
 * On success, attaches the parsed payload to req.validated for controllers to use.
 */
export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
    })

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.slice(1).join('.') || issue.path.join('.') || 'request',
        message: issue.message,
      }))

      return next(new AppError('Validation failed', HTTP_STATUS.UNPROCESSABLE, errors))
    }

    req.validated = parsed.data
    return next()
  }
}
