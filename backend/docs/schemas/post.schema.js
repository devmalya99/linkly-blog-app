import { POST_CATEGORIES, POST_LIMITS, POST_STATUS } from '../../src/constants/posts.js'

const postStatusEnum = Object.values(POST_STATUS)

export const postSchemas = {
  PostStatus: {
    type: 'string',
    enum: postStatusEnum,
    example: POST_STATUS.DRAFT,
  },
  PostCategory: {
    type: 'string',
    enum: POST_CATEGORIES,
    example: 'Engineering',
  },
  Post: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
      title: { type: 'string', maxLength: POST_LIMITS.TITLE_MAX, example: 'Building soft deletes' },
      slug: {
        type: 'string',
        maxLength: POST_LIMITS.SLUG_MAX,
        example: 'building-soft-deletes',
      },
      content: { type: 'string', example: '<p>Post body</p>' },
      excerpt: {
        type: 'string',
        maxLength: POST_LIMITS.EXCERPT_MAX,
        example: 'A short summary of the post.',
      },
      category: { $ref: '#/components/schemas/PostCategory' },
      tags: {
        type: 'array',
        maxItems: POST_LIMITS.TAGS_MAX,
        items: { type: 'string', maxLength: POST_LIMITS.TAG_MAX_LENGTH },
        example: ['React', 'MongoDB'],
      },
      status: { $ref: '#/components/schemas/PostStatus' },
      author: { $ref: '#/components/schemas/PublicUser' },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-10-02T06:00:00.000Z',
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreatePostRequest: {
    type: 'object',
    required: ['title', 'category'],
    additionalProperties: false,
    properties: {
      title: { type: 'string', minLength: 1, maxLength: POST_LIMITS.TITLE_MAX },
      content: {
        type: 'string',
        description: 'Required (non-empty) when status is published.',
        default: '',
      },
      category: { $ref: '#/components/schemas/PostCategory' },
      tags: {
        type: 'array',
        maxItems: POST_LIMITS.TAGS_MAX,
        items: { type: 'string', minLength: 1, maxLength: POST_LIMITS.TAG_MAX_LENGTH },
        default: [],
      },
      excerpt: { type: 'string', maxLength: POST_LIMITS.EXCERPT_MAX, default: '' },
      slug: {
        type: 'string',
        maxLength: POST_LIMITS.SLUG_MAX,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        description: 'Optional. Auto-generated from title when omitted.',
      },
      status: {
        allOf: [{ $ref: '#/components/schemas/PostStatus' }],
        default: POST_STATUS.DRAFT,
      },
    },
  },
  UpdatePostRequest: {
    type: 'object',
    additionalProperties: false,
    description: 'At least one field is required.',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: POST_LIMITS.TITLE_MAX },
      content: {
        type: 'string',
        description: 'When publishing, content must be non-empty.',
      },
      category: { $ref: '#/components/schemas/PostCategory' },
      tags: {
        type: 'array',
        maxItems: POST_LIMITS.TAGS_MAX,
        items: { type: 'string', minLength: 1, maxLength: POST_LIMITS.TAG_MAX_LENGTH },
      },
      excerpt: { type: 'string', maxLength: POST_LIMITS.EXCERPT_MAX },
      slug: {
        type: 'string',
        maxLength: POST_LIMITS.SLUG_MAX,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        description:
          'Replaces the existing slug. The previous slug stops resolving immediately.',
      },
      status: { $ref: '#/components/schemas/PostStatus' },
    },
  },
  PostResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: { $ref: '#/components/schemas/Post' },
    },
  },
  PostListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Post' },
      },
      pagination: { $ref: '#/components/schemas/Pagination' },
    },
  },
  RecentPostsResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Post' },
      },
    },
  },
  SharedPost: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
      title: { type: 'string', example: 'First Blog' },
      content: { type: 'string', example: '<p>Post body</p>' },
      category: { $ref: '#/components/schemas/PostCategory' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['React', 'Design Systems'],
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: null,
      },
      author: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Debmalya Mazumdar' },
        },
      },
    },
  },
  SharedPostResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Shared post fetched successfully' },
      data: { $ref: '#/components/schemas/SharedPost' },
    },
  },
}
