import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { writeRateLimiter } from '../middleware/rateLimiter.js'
import { validate } from '../middleware/validate.js'
import {
  followSuggestionsSchema,
  followUserParamsSchema,
  listMyFollowsSchema,
} from '../validators/follow.validator.js'
import * as followController from '../controllers/follow.controller.js'

const router = Router()

router.use(authenticate)

router.get('/me', validate(listMyFollowsSchema), followController.listMyFollows)
router.get('/suggestions', validate(followSuggestionsSchema), followController.getSuggestions)
router.post(
  '/:userId',
  writeRateLimiter,
  validate(followUserParamsSchema),
  followController.followUser,
)
router.delete(
  '/:userId',
  writeRateLimiter,
  validate(followUserParamsSchema),
  followController.unfollowUser,
)

export default router
