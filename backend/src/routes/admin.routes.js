import { Router } from 'express'
import { ROLES } from '../constants/roles.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import {
  adminDashboardSchema,
  adminListPostsSchema,
  adminListSchema,
  adminListUsersSchema,
} from '../validators/admin.validator.js'
import { postIdSchema, updatePostSchema } from '../validators/post.validator.js'
import { commentIdSchema, updateCommentSchema } from '../validators/comment.validator.js'
import { adminUpdateUserSchema, userIdParamsSchema } from '../validators/user.validator.js'
import * as adminController from '../controllers/admin.controller.js'

const router = Router()

router.use(authenticate, authorize(ROLES.ADMIN))

router.get('/dashboard', validate(adminDashboardSchema), adminController.getDashboard)

router.get('/users', validate(adminListUsersSchema), adminController.listUsers)
router.get('/users/:id', validate(userIdParamsSchema), adminController.getUser)
router.patch('/users/:id', validate(adminUpdateUserSchema), adminController.updateUser)
router.delete('/users/:id', validate(userIdParamsSchema), adminController.deleteUser)

router.get('/posts', validate(adminListPostsSchema), adminController.listPosts)
router.patch('/posts/:id', validate(updatePostSchema), adminController.updatePost)
router.delete('/posts/:id', validate(postIdSchema), adminController.deletePost)

router.get('/comments', validate(adminListSchema), adminController.listComments)
router.patch('/comments/:id', validate(updateCommentSchema), adminController.updateComment)
router.delete('/comments/:id', validate(commentIdSchema), adminController.deleteComment)

export default router
