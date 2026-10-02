import { z } from 'zod'
import { FOLLOW_LIMITS } from '../constants/follows.js'
import { emptyBody, emptyParams, emptyQuery, objectId } from './common.validator.js'

export const followUserParamsSchema = z.object({
  body: emptyBody,
  params: z.object({ userId: objectId }).strict(),
  query: emptyQuery,
})

export const listMyFollowsSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: emptyQuery,
})

export const followSuggestionsSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: z
    .object({
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(FOLLOW_LIMITS.SUGGESTIONS_MAX)
        .default(FOLLOW_LIMITS.SUGGESTIONS_DEFAULT),
    })
    .strict(),
})
