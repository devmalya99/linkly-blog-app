export function sendSuccess(res, data, message, statusCode = 200, pagination) {
  const body = {
    success: true,
    message,
    data,
  }

  if (pagination) {
    body.pagination = pagination
  }

  return res.status(statusCode).json(body)
}
