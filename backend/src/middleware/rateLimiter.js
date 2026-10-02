import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'
import { HTTP_STATUS } from '../constants/errors.js'

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000

function skipInTest() {
  return env.NODE_ENV === 'test'
}

function rateLimitHandler(req, res) {
  res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
    success: false,
    message: 'Too many requests. Please try again later.',
  })
}

function createRateLimiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipInTest,
    handler: rateLimitHandler,
  })
}

/** Broad protection across all /api traffic. */
export const apiRateLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 300,
})

/** Stricter limits for auth endpoints (brute-force / credential stuffing). */
export const authRateLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 20,
})

/** Limits create/update/delete bursts that can overwhelm the DB. */
export const writeRateLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 60,
})
