import { z } from 'zod'
import { emptyBody, emptyParams, emptyQuery, emptyRequestSchema } from './common.validator.js'

const email = z.string().trim().email()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number')
  .regex(/[^A-Za-z0-9]/, 'Password must include a special character')

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(80),
      email,
      password: passwordSchema,
    })
    .strict(),
  params: emptyParams,
  query: emptyQuery,
})

export const loginSchema = z.object({
  body: z
    .object({
      email,
      password: z.string().min(1),
    })
    .strict(),
  params: emptyParams,
  query: emptyQuery,
})

export const logoutSchema = emptyRequestSchema
export const refreshSchema = emptyRequestSchema
export const authMeSchema = emptyRequestSchema
