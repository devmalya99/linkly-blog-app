import { commonSchemas } from './schemas/common.schema.js'
import { authSchemas } from './schemas/auth.schema.js'
import { userSchemas } from './schemas/user.schema.js'
import { postSchemas } from './schemas/post.schema.js'
import { commentSchemas } from './schemas/comment.schema.js'
import { authPaths } from './paths/auth.paths.js'
import { userPaths } from './paths/user.paths.js'
import { postPaths } from './paths/post.paths.js'
import { commentPaths } from './paths/comment.paths.js'
import { adminPaths } from './paths/admin.paths.js'
import { sharePaths } from './paths/share.paths.js'

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Inkly API',
    version: '1.0.0',
    description: 'Classic MERN blog REST API for Inkly.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Versioned API',
    },
  ],
  tags: [
    { name: 'Authentication' },
    { name: 'Users' },
    { name: 'Posts' },
    { name: 'Share' },
    { name: 'Comments' },
    { name: 'Admin' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...commonSchemas,
      ...authSchemas,
      ...userSchemas,
      ...postSchemas,
      ...commentSchemas,
    },
  },
  paths: {
    ...authPaths,
    ...userPaths,
    ...postPaths,
    ...sharePaths,
    ...commentPaths,
    ...adminPaths,
  },
}
