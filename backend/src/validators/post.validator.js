import { z } from 'zod'
import { POST_CATEGORIES, POST_LIMITS, POST_STATUS } from '../constants/posts.js'
import { emptyBody, emptyParams, emptyQuery, objectId, paginationQuery } from './common.validator.js'

const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(POST_LIMITS.TAG_MAX_LENGTH)
  .transform((value) => value.replace(/\s+/g, ' '))

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(POST_LIMITS.SLUG_MAX)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens')

function assertUniqueTags(tags, ctx) {
  if (!tags) return

  const uniqueTags = new Set(tags.map((tag) => tag.toLowerCase()))
  if (uniqueTags.size !== tags.length) {
    ctx.addIssue({
      code: 'custom',
      path: ['tags'],
      message: 'Tags must be unique',
    })
  }
}

export { paginationQuery }

const coverImageSchema = z
  .union([z.string().url().max(500), z.null()])
  .optional()

const createPostBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(POST_LIMITS.TITLE_MAX),
    content: z.string().default(''),
    category: z.enum(POST_CATEGORIES, { message: 'Invalid category' }),
    tags: z.array(tagSchema).max(POST_LIMITS.TAGS_MAX).default([]),
    excerpt: z.string().trim().max(POST_LIMITS.EXCERPT_MAX).optional().default(''),
    slug: slugSchema.optional(),
    status: z.enum(Object.values(POST_STATUS)).default(POST_STATUS.DRAFT),
    coverImage: coverImageSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status === POST_STATUS.PUBLISHED && !data.content.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['content'],
        message: 'Content is required to publish a post',
      })
    }

    assertUniqueTags(data.tags, ctx)
  })

export const createPostSchema = z.object({
  body: createPostBodySchema,
  params: emptyParams,
  query: emptyQuery,
})

export const updatePostSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).max(POST_LIMITS.TITLE_MAX).optional(),
      content: z.string().optional(),
      category: z.enum(POST_CATEGORIES).optional(),
      tags: z.array(tagSchema).max(POST_LIMITS.TAGS_MAX).optional(),
      excerpt: z.string().trim().max(POST_LIMITS.EXCERPT_MAX).optional(),
      slug: slugSchema.optional(),
      status: z.enum(Object.values(POST_STATUS)).optional(),
      coverImage: coverImageSchema,
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    })
    .superRefine((data, ctx) => {
      if (data.status === POST_STATUS.PUBLISHED && data.content !== undefined && !data.content.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['content'],
          message: 'Content is required to publish a post',
        })
      }

      assertUniqueTags(data.tags, ctx)
    }),
  params: z.object({ id: objectId }).strict(),
  query: emptyQuery,
})

export const listPostsSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: paginationQuery.extend({
    category: z.enum(POST_CATEGORIES).optional(),
    status: z.enum(Object.values(POST_STATUS)).optional(),
  }),
})

export const recentPostsSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: z
    .object({
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(POST_LIMITS.RECENT_MAX)
        .default(POST_LIMITS.RECENT_DEFAULT),
    })
    .strict(),
})

export const postIdSchema = z.object({
  body: emptyBody,
  params: z.object({ id: objectId }).strict(),
  query: emptyQuery,
})

export const postSlugSchema = z.object({
  body: emptyBody,
  params: z.object({ slug: z.string().trim().min(1) }).strict(),
  query: emptyQuery,
})
