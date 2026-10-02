import { z } from 'zod'
import { POST_STATUS } from '../constants/posts.js'
import { ROLES } from '../constants/roles.js'
import {
  emptyBody,
  emptyParams,
  emptyRequestSchema,
  objectId,
  paginationQuery,
  paginationRequestSchema,
} from './common.validator.js'

export const ADMIN_USER_SORT = {
  JOINED_NEWEST: 'joinedNewest',
  JOINED_OLDEST: 'joinedOldest',
}

export const adminDashboardSchema = emptyRequestSchema
export const adminListSchema = paginationRequestSchema

const deletedQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined
    return value === 'true'
  })

export const adminListUsersSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: paginationQuery
    .extend({
      search: z.string().trim().max(120).optional(),
      role: z.enum([ROLES.USER, ROLES.ADMIN]).optional(),
      sort: z
        .enum([ADMIN_USER_SORT.JOINED_NEWEST, ADMIN_USER_SORT.JOINED_OLDEST])
        .default(ADMIN_USER_SORT.JOINED_NEWEST),
    })
    .strict(),
})

export const adminListPostsSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: paginationQuery
    .extend({
      status: z.enum(Object.values(POST_STATUS)).optional(),
      author: objectId.optional(),
      deleted: deletedQuery,
    })
    .strict(),
})
