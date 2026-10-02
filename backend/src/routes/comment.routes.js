import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { writeRateLimiter } from '../middleware/rateLimiter.js'
import { validate } from '../middleware/validate.js'
import {
  commentIdSchema,
  recentCommentsSchema,
  updateCommentSchema,
} from '../validators/comment.validator.js'
import * as commentController from '../controllers/comment.controller.js'

const router = Router()

router.get(
  '/recent',
  authenticate,
  validate(recentCommentsSchema),
  commentController.getRecentComments,
)
router.patch(
  '/:id',
  authenticate,
  writeRateLimiter,
  validate(updateCommentSchema),
  commentController.updateComment,
)
router.delete(
  '/:id',
  authenticate,
  writeRateLimiter,
  validate(commentIdSchema),
  commentController.deleteComment,
)

export default router
