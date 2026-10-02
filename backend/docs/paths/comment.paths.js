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
    schema: { type: 'integer', minimum: 1, maximum: 50, default: 5 },
  },
]

const postIdParam = {
  name: 'postId',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
    pattern: '^[a-fA-F\\d]{24}$',
  },
  description: 'MongoDB ObjectId of the post',
}

const commentIdParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
    pattern: '^[a-fA-F\\d]{24}$',
  },
  description: 'MongoDB ObjectId of the comment',
}

export const commentPaths = {
  '/posts/{postId}/comments': {
    get: {
      tags: ['Comments'],
      summary: 'List comments on a post',
      description:
        'Returns paginated comments for a non-deleted post. Requires authentication. Soft-deleted posts return 404; existing comments remain in the database.',
      security: bearerSecurity,
      parameters: [postIdParam, ...paginationParameters],
      responses: {
        200: {
          description: 'Comments fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentListResponse' },
            },
          },
        },
        401: {
          description: 'Authentication required',
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
      },
    },
    post: {
      tags: ['Comments'],
      summary: 'Create a comment',
      description:
        'Adds a comment to a published, non-deleted post. Draft and soft-deleted posts cannot receive new comments. Max length is 3000 characters.',
      security: bearerSecurity,
      parameters: [postIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCommentRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Comment created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentResponse' },
            },
          },
        },
        400: {
          description: 'Post is not published',
          ...errorContent,
        },
        401: {
          description: 'Authentication required',
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
  },
  '/comments/{id}': {
    delete: {
      tags: ['Comments'],
      summary: 'Hard-delete a comment',
      description:
        'Permanently removes a comment. Allowed for the comment author, the post author, or an admin.',
      security: bearerSecurity,
      parameters: [commentIdParam],
      responses: {
        200: {
          description: 'Comment deleted',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MessageResponse' },
            },
          },
        },
        401: {
          description: 'Authentication required',
          ...errorContent,
        },
        403: {
          description: 'Not allowed to delete this comment',
          ...errorContent,
        },
        404: {
          description: 'Comment or post not found',
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
