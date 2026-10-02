import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { writeRateLimiter } from '../middleware/rateLimiter.js'
import { coverImageUpload, handleMulterError } from '../middleware/upload.js'
import * as uploadController from '../controllers/upload.controller.js'

const router = Router()

router.post(
  '/cover',
  authenticate,
  writeRateLimiter,
  (req, res, next) => {
    coverImageUpload(req, res, (error) => handleMulterError(error, req, res, next))
  },
  uploadController.uploadCoverImage,
)

export default router
