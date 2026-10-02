import { z } from 'zod'
import { FEED_LIMITS, FEED_SEED_MAX_LENGTH, FEED_TABS } from '../constants/feed.js'
import { POST_CATEGORIES } from '../constants/posts.js'
import { emptyBody, emptyParams } from './common.validator.js'

const feedPaginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(FEED_LIMITS.LIST_MAX)
    .default(FEED_LIMITS.LIST_DEFAULT),
})

export const getFeedSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: feedPaginationQuery
    .extend({
      tab: z.enum(Object.values(FEED_TABS)).default(FEED_TABS.FOR_YOU),
      category: z.enum(POST_CATEGORIES).optional(),
      seed: z.string().trim().min(1).max(FEED_SEED_MAX_LENGTH).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      if (data.tab === FEED_TABS.CATEGORY && !data.category) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Category is required for the category tab',
          path: ['category'],
        })
      }

      if (data.tab === FEED_TABS.FOR_YOU && !data.seed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seed is required for the for-you tab',
          path: ['seed'],
        })
      }
    }),
})
