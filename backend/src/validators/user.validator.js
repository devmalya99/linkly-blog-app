import { z } from 'zod'
import { ROLES } from '../constants/roles.js'
import { emptyBody, emptyParams, emptyQuery, emptyRequestSchema, objectId } from './common.validator.js'

export const getProfileSchema = emptyRequestSchema

export const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(80).optional(),
      avatar: z.string().trim().url().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
  params: emptyParams,
  query: emptyQuery,
})

export const adminUpdateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(80).optional(),
      role: z.enum([ROLES.USER, ROLES.ADMIN]).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required',
    }),
  params: z.object({ id: objectId }).strict(),
  query: emptyQuery,
})

export const userIdParamsSchema = z.object({
  body: emptyBody,
  params: z.object({ id: objectId }).strict(),
  query: emptyQuery,
})
