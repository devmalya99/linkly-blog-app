import { z } from 'zod'
import { COMMENT_LIMITS } from '../constants/comments.js'
import { emptyBody, emptyParams, emptyQuery, objectId, commentPaginationQuery } from './common.validator.js'

const commentContent = z
  .string()
  .trim()
  .min(1, 'Comment cannot be empty')
  .max(COMMENT_LIMITS.CONTENT_MAX, `Comment cannot exceed ${COMMENT_LIMITS.CONTENT_MAX} characters`)

export const createCommentSchema = z.object({
  body: z
    .object({
      content: commentContent,
    })
    .strict(),
  params: z.object({ postId: objectId }).strict(),
  query: emptyQuery,
})

export const listCommentsSchema = z.object({
  body: emptyBody,
  params: z.object({ postId: objectId }).strict(),
  query: commentPaginationQuery,
})

export const recentCommentsSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: z
    .object({
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(COMMENT_LIMITS.RECENT_MAX)
        .default(COMMENT_LIMITS.RECENT_DEFAULT),
    })
    .strict(),
})

export const updateCommentSchema = z.object({
  body: z
    .object({
      content: commentContent,
    })
    .strict(),
  params: z.object({ id: objectId }).strict(),
  query: emptyQuery,
})

export const commentIdSchema = z.object({
  body: emptyBody,
  params: z.object({ id: objectId }).strict(),
  query: emptyQuery,
})
