import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { getFeedSchema } from '../validators/feed.validator.js'
import * as feedController from '../controllers/feed.controller.js'

const router = Router()

router.use(authenticate)

router.get('/', validate(getFeedSchema), feedController.getFeed)

export default router
