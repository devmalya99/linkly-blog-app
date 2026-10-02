import { z } from 'zod'
import { COMMENT_LIMITS } from '../constants/comments.js'

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier')

export const emptyBody = z.object({}).strict().optional().default({})
export const emptyParams = z.object({}).strict().optional().default({})
export const emptyQuery = z.object({}).strict().optional().default({})

/** Request envelope with no body/params/query fields allowed. */
export const emptyRequestSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: emptyQuery,
})

export const paginationQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict()

/** Comment list defaults to 5 per page (posts keep the shared default of 10). */
export const commentPaginationQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(COMMENT_LIMITS.LIST_MAX)
      .default(COMMENT_LIMITS.LIST_DEFAULT),
  })
  .strict()

export const paginationRequestSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: paginationQuery,
})
