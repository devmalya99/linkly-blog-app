import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js'
import { writeRateLimiter } from '../middleware/rateLimiter.js'
import { validate } from '../middleware/validate.js'
import {
  createPostSchema,
  listPostsSchema,
  postIdSchema,
  postSlugSchema,
  recentPostsSchema,
  updatePostSchema,
} from '../validators/post.validator.js'
import { createCommentSchema, listCommentsSchema } from '../validators/comment.validator.js'
import * as postController from '../controllers/post.controller.js'
import * as commentController from '../controllers/comment.controller.js'

const router = Router()

router.get('/', validate(listPostsSchema), postController.getPosts)
router.get('/recent', validate(recentPostsSchema), postController.getRecentPosts)
router.get('/me', authenticate, validate(listPostsSchema), postController.getMyPosts)
router.get('/slug/:slug', optionalAuthenticate, validate(postSlugSchema), postController.getPostBySlug)
router.get('/:id/recommended', validate(postIdSchema), postController.getRecommendedPosts)
router.get('/:id', optionalAuthenticate, validate(postIdSchema), postController.getPostById)
router.post('/', authenticate, writeRateLimiter, validate(createPostSchema), postController.createPost)
router.patch('/:id', authenticate, writeRateLimiter, validate(updatePostSchema), postController.updatePost)
router.delete('/:id', authenticate, writeRateLimiter, validate(postIdSchema), postController.deletePost)

router.get(
  '/:postId/comments',
  authenticate,
  validate(listCommentsSchema),
  commentController.getComments,
)
router.post(
  '/:postId/comments',
  authenticate,
  writeRateLimiter,
  validate(createCommentSchema),
  commentController.createComment,
)

export default router
