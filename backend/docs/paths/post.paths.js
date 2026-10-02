import { POST_CATEGORIES, POST_LIMITS, POST_STATUS } from '../../src/constants/posts.js'

const errorContent = {
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
}

const bearerSecurity = [{ BearerAuth: [] }]

const paginationParameters = [
  {
    name: 'page',
    in: 'query',
    schema: { type: 'integer', minimum: 1, default: 1 },
  },
  {
    name: 'limit',
    in: 'query',
    schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
  },
]

const categoryParameter = {
  name: 'category',
  in: 'query',
  schema: { type: 'string', enum: POST_CATEGORIES },
  description: 'Filter by category',
}

const postIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
    pattern: '^[a-fA-F\\d]{24}$',
  },
  description: 'MongoDB ObjectId of the post',
}

export const postPaths = {
  '/posts': {
    get: {
      tags: ['Posts'],
      summary: 'List published posts',
      description:
        'Returns paginated published posts that are not soft-deleted (`isDeleted: false`). Drafts and soft-deleted posts are excluded.',
      parameters: [...paginationParameters, categoryParameter],
      responses: {
        200: {
          description: 'Published posts fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostListResponse' },
            },
          },
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
      },
    },
    post: {
      tags: ['Posts'],
      summary: 'Create a post',
      description:
        'Creates a post owned by the authenticated user. Defaults to draft unless `status` is set to published.',
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePostRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Post created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostResponse' },
            },
          },
        },
        401: {
          description: 'Missing or invalid access token',
          ...errorContent,
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
        429: {
          description: 'Write rate limit exceeded',
          ...errorContent,
        },
      },
    },
  },
  '/posts/recent': {
    get: {
      tags: ['Posts'],
      summary: 'List recent published posts',
      description:
        'Returns the most recently published posts that are not soft-deleted. Sorted by `publishedAt` descending.',
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: POST_LIMITS.RECENT_MAX,
            default: POST_LIMITS.RECENT_DEFAULT,
          },
        },
      ],
      responses: {
        200: {
          description: 'Recent posts fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecentPostsResponse' },
            },
          },
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
      },
    },
  },
  '/posts/me': {
    get: {
      tags: ['Posts'],
      summary: 'List my posts',
      description:
        'Returns paginated posts owned by the authenticated user. Soft-deleted posts (`isDeleted: true`) are excluded. Includes drafts unless filtered by status.',
      security: bearerSecurity,
      parameters: [
        ...paginationParameters,
        categoryParameter,
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: Object.values(POST_STATUS) },
          description: 'Filter by draft or published',
        },
      ],
      responses: {
        200: {
          description: 'Author posts fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostListResponse' },
            },
          },
        },
        401: {
          description: 'Missing or invalid access token',
          ...errorContent,
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
      },
    },
  },
  '/posts/slug/{slug}': {
    get: {
      tags: ['Posts'],
      summary: 'Get a post by slug',
      description:
        'Returns a non-deleted post by its current slug. Published posts are readable without auth. Drafts are only visible to the owner or an admin. Soft-deleted posts and retired (replaced) slugs return 404. For public share links (including drafts), use `GET /share/posts/{id}` instead.',
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string', minLength: 1 },
        },
      ],
      responses: {
        200: {
          description: 'Post fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostResponse' },
            },
          },
        },
        404: {
          description: 'Post not found, soft-deleted, slug replaced, or draft hidden from caller',
          ...errorContent,
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
      },
    },
  },
  '/posts/{id}/recommended': {
    get: {
      tags: ['Posts'],
      summary: 'Get recommended posts for a post',
      description:
        'Returns up to 5 published, non-deleted posts related to the source post (by id).\n\n' +
        'Fill order: (1) same category with overlapping tags, (2) same category, ' +
        '(3) title substring match in title or content, (4) random published posts. ' +
        'The source post is always excluded. The source itself may be a draft; recommendations are still published-only.',
      parameters: [postIdParameter],
      responses: {
        200: {
          description: 'Recommended posts fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecentPostsResponse' },
            },
          },
        },
        404: {
          description: 'Source post not found or soft-deleted',
          ...errorContent,
        },
        422: {
          description: 'Invalid id (must be a 24-character MongoDB ObjectId)',
          ...errorContent,
        },
      },
    },
  },
  '/posts/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get a post by id',
      description:
        'Fetches a single non-deleted post by MongoDB ObjectId.\n\n' +
        '- **Published** posts are public (no auth required — works in incognito).\n' +
        '- **Draft** posts are only returned for the owner or an admin (send Bearer token).\n' +
        '- Soft-deleted posts return `404`.\n\n' +
        'Optional Bearer auth: omit the header for anonymous access, or send a valid access token to view your own drafts.',
      security: [{}, { BearerAuth: [] }],
      parameters: [postIdParameter],
      responses: {
        200: {
          description: 'Post fetched successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostResponse' },
              example: {
                success: true,
                message: 'Post fetched successfully',
                data: {
                  id: '66f1a2b3c4d5e6f7a8b9c0d1',
                  title: 'First Blog',
                  slug: 'first-blog',
                  content: '<p>HI this is my first blog.</p>',
                  excerpt: '',
                  category: 'Design Systems',
                  tags: ['React', 'Design Systems', 'TypeScript'],
                  status: 'published',
                  author: {
                    id: '66f1a2b3c4d5e6f7a8b9c0d2',
                    name: 'Debmalya Mazumdar',
                    email: 'debmalya@example.com',
                    role: 'user',
                    avatar: '',
                  },
                  publishedAt: '2026-10-02T06:00:00.000Z',
                  createdAt: '2026-10-02T05:55:00.000Z',
                  updatedAt: '2026-10-02T06:00:00.000Z',
                },
              },
            },
          },
        },
        401: {
          description: 'Bearer token was sent but is invalid or expired',
          ...errorContent,
        },
        404: {
          description: 'Post not found, soft-deleted, or draft hidden from the caller',
          ...errorContent,
        },
        422: {
          description: 'Invalid id (must be a 24-character MongoDB ObjectId)',
          ...errorContent,
        },
      },
    },
    patch: {
      tags: ['Posts'],
      summary: 'Update a post',
      description:
        'Updates a non-deleted post. Only the owner or an admin can update. Soft-deleted posts cannot be updated.',
      security: bearerSecurity,
      parameters: [postIdParameter],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePostRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Post updated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostResponse' },
            },
          },
        },
        401: {
          description: 'Missing or invalid access token',
          ...errorContent,
        },
        403: {
          description: 'Not the owner or admin',
          ...errorContent,
        },
        404: {
          description: 'Post not found or soft-deleted',
          ...errorContent,
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
        429: {
          description: 'Write rate limit exceeded',
          ...errorContent,
        },
      },
    },
    delete: {
      tags: ['Posts'],
      summary: 'Soft-delete a post',
      description:
        'Marks the post as deleted by setting `isDeleted: true` and `deletedAt`. The document remains in the database and is excluded from all list/get endpoints. Only the owner or an admin can soft-delete.',
      security: bearerSecurity,
      parameters: [postIdParameter],
      responses: {
        200: {
          description: 'Post soft-deleted',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MessageResponse' },
            },
          },
        },
        401: {
          description: 'Missing or invalid access token',
          ...errorContent,
        },
        403: {
          description: 'Not the owner or admin',
          ...errorContent,
        },
        404: {
          description: 'Post not found or already soft-deleted',
          ...errorContent,
        },
        422: {
          description: 'Validation failed',
          ...errorContent,
        },
        429: {
          description: 'Write rate limit exceeded',
          ...errorContent,
        },
      },
    },
  },
}
