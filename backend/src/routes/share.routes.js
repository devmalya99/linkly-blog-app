import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import { postIdSchema } from '../validators/post.validator.js'
import * as shareController from '../controllers/share.controller.js'

const router = Router()

router.get('/posts/:id', validate(postIdSchema), shareController.getSharedPost)

export default router
