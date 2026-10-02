import { Router } from 'express'
import { authRateLimiter } from '../middleware/rateLimiter.js'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import {
  authMeSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from '../validators/auth.validator.js'
import * as authController from '../controllers/auth.controller.js'
import { facebookAuth, facebookCallback, googleAuth, googleCallback } from '../config/passport.js'

const router = Router()

router.post('/register', authRateLimiter, validate(registerSchema), authController.register)
router.post('/login', authRateLimiter, validate(loginSchema), authController.login)
router.post('/logout', authenticate, validate(logoutSchema), authController.logout)
router.post('/refresh', authRateLimiter, validate(refreshSchema), authController.refresh)
router.get('/me', authenticate, validate(authMeSchema), authController.me)

router.get('/google', authRateLimiter, googleAuth)
router.get('/google/callback', googleCallback, authController.googleCallback)
router.get('/facebook', authRateLimiter, facebookAuth)
router.get('/facebook/callback', facebookCallback, authController.facebookCallback)

export default router
