import { COMMENT_LIMITS } from '../../src/constants/comments.js'

export const commentSchemas = {
  Comment: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
      content: {
        type: 'string',
        maxLength: COMMENT_LIMITS.CONTENT_MAX,
        example: 'Thoughtful take — thanks for writing this.',
      },
      post: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d2' },
      author: { $ref: '#/components/schemas/PublicUser' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateCommentRequest: {
    type: 'object',
    required: ['content'],
    additionalProperties: false,
    properties: {
      content: {
        type: 'string',
        minLength: 1,
        maxLength: COMMENT_LIMITS.CONTENT_MAX,
      },
    },
  },
  CommentResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: { $ref: '#/components/schemas/Comment' },
    },
  },
  CommentListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Comment' },
      },
      pagination: { $ref: '#/components/schemas/Pagination' },
    },
  },
}
