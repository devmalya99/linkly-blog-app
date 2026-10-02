import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { writeRateLimiter } from '../middleware/rateLimiter.js'
import { validate } from '../middleware/validate.js'
import { getProfileSchema, updateUserSchema } from '../validators/user.validator.js'
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.get('/me', authenticate, validate(getProfileSchema), userController.getProfile)
router.patch(
  '/me',
  authenticate,
  writeRateLimiter,
  validate(updateUserSchema),
  userController.updateProfile,
)

export default router
