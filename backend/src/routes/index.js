import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import postRoutes from './post.routes.js'
import commentRoutes from './comment.routes.js'
import adminRoutes from './admin.routes.js'
import shareRoutes from './share.routes.js'
import uploadRoutes from './upload.routes.js'
import { sendSuccess } from '../utils/response.js'

const router = Router()

router.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok' }, 'API is running')
})

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/admin', adminRoutes)
router.use('/share', shareRoutes)
router.use('/uploads', uploadRoutes)

export default router
